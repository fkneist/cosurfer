import{sendMessageToLLM}from"../services/ChatService";document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("options-form"),o=document.getElementById("groq-api-key");chrome.storage.sync.get(["groqApiKey"],(e=>{e.groqApiKey&&(o.value=e.groqApiKey)})),e.addEventListener("submit",(async e=>{e.preventDefault();const t=o.value;console.log({groqApiKey:t}),chrome.storage.sync.set({groqApiKey:t},(()=>{console.log("Groq API key saved")})),await sendMessageToLLM("test"),chrome.storage.sync.get(["groqApiKey"],(e=>{console.log("API Key retrieved: ",e.groqApiKey)}))}))}));