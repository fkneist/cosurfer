import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import llama3Tokenizer from "llama3-tokenizer-js";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Function to get the API key from Chrome storage
const getApiKeyFromStorage = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["apiKeys"], (result) => {
      if (result.apiKeys.groq) {
        resolve(result.apiKeys.groq);
      } else {
        reject(new Error("API key not found in storage"));
      }
    });
  });
};

// Initialize the GroqLLM with the fetched API key
const initializeGroqLLM = async (maxTokens: number) => {
  try {
    const apiKey = await getApiKeyFromStorage();
    return new ChatGroq({
      maxTokens: maxTokens,
      apiKey,
      modelName: "llama3-8b-8192",
    });
  } catch (error) {
    console.error("Error initializing GroqLLM:", error);
    throw new Error("Failed to initialize GroqLLM");
  }
};

// Function to send a message to LLM
export const sendMessageToLLM = async (
  message: string,
  maxTokens: number = 500
): Promise<string> => {
  const tokens = llama3Tokenizer.encode(message);
  console.log(`Token count of website text: ${tokens.length}`);

  const maxTokensInput = 7500;
  const groqLLM = await initializeGroqLLM(maxTokens);

  if (tokens.length > maxTokensInput) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 30000,
    });
    const docs = await textSplitter.createDocuments([message]);

    const chain = loadSummarizationChain(groqLLM, {
      type: "map_reduce",
      returnIntermediateSteps: true,
    });

    const indexEnd = 15;

    const res = await chain.invoke({
      input_documents: docs.slice(0, indexEnd),
    });

    let output = res.text;

    if (indexEnd < docs.length + 1) {
      // document does not fit into context window
      const linesUsed = docs[indexEnd].metadata.loc.lines.to;
      const linesTotal = docs[docs.length - 1].metadata.loc.lines.to;
      output += `\n\n[Used lines 1 to ${linesUsed} of ${linesTotal} of the document]`;
    }

    return output;
  } else {
    try {
      const promptTemplate = new PromptTemplate({
        template: "You are a helpful assistant. {message}",
        inputVariables: ["message"],
      });
      const chatChain = promptTemplate.pipe(groqLLM);
      const response = await chatChain.invoke({ message });
      return response.text; // Adjust based on the actual response structure from Groq
    } catch (error) {
      console.error("Error communicating with LLM:", error);
      throw new Error("Failed to get response from LLM");
    }
  }
};
