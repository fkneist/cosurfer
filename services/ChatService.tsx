import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";

// Function to get the API key from Chrome storage
const getApiKeyFromStorage = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["groqApiKey"], (result) => {
      if (result.groqApiKey) {
        resolve(result.groqApiKey);
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
      modelName: "llama3-70b-8192",
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
  try {
    const groqLLM = await initializeGroqLLM(maxTokens);
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
};
