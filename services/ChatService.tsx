import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import llama3Tokenizer from "llama3-tokenizer-js";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOllama } from "@langchain/community/chat_models/ollama";

const getValueFromStorage = async (key: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (result) => {
      if (result[key]) {
        resolve(result[key]);
      } else {
        reject(new Error(`${key} not found in storage`));
      }
    });
  });
};

// Initialize the GroqLLM with the fetched API key
const initializeGroqLLM = async (maxTokens: number) => {
  try {
    const apiKeys = await getValueFromStorage("apiKeys");
    // @ts-ignore
    const apiKey = apiKeys.groq;
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

const sendMessageToGroq = async (message: string, maxTokens: number = 500) => {
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

      const chain = promptTemplate.pipe(groqLLM);
      const response = await chain.invoke({ message });

      // @ts-ignore
      return response.text; // Adjust based on the actual response structure from Groq
    } catch (error) {
      console.error("Error communicating with LLM:", error);
      throw new Error("Failed to get response from LLM");
    }
  }
};

const sendMessageToOllama = async (message: string) => {
  const tokens = llama3Tokenizer.encode(message);
  console.log(`Token count of website text: ${tokens.length}`);

  try {
    const promptTemplate = new PromptTemplate({
      template: "You are a helpful assistant. {message}",
      inputVariables: ["message"],
    });

    const models = await getValueFromStorage("model");
    // @ts-ignore
    const model = models.ollama;

    const address = (await getValueFromStorage("address")) as string;

    const ollamaModel = new ChatOllama({
      baseUrl: address || "",
      model,
    });

    // @ts-ignore
    const chain = promptTemplate.pipe(ollamaModel);

    const response = await chain.invoke({ message });

    return response.text; // Adjust based on the actual response structure from Groq
  } catch (error) {
    console.error("Error communicating with LLM:", error);
    throw new Error("Failed to get response from LLM");
  }
};

// Function to send a message to LLM
export const sendMessageToLLM = async (
  message: string,
  maxTokens: number = 500
): Promise<string | undefined> => {
  const provider = await getValueFromStorage("provider");
  console.log({ provider });

  if (provider === "groq") {
    return sendMessageToGroq(message, maxTokens);
  }

  if (provider === "ollama") {
    return sendMessageToOllama(message);
  }
};
