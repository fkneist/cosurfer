# Cosurfer

![Screenshot of Cosurfer browser extension](./docs/screenshot.png)

## Introduction

Cosurfer is a browser extension (currently only for [Chromium based browsers](<https://en.wikipedia.org/wiki/Chromium_(web_browser)#Browsers_based_on_Chromium>)), that lets you ask questions to the website in your current browser tab using [LLM](https://en.wikipedia.org/wiki/Large_language_model)s (currently only via [groq](https://groq.com/)). It can summarize long discussions for you for example.

## Installation

- Take the `dist` folder of this repository OR build it yourself
- Go to `chrome://extensions`
- Click "Load unpacked"
- Select the `dist` folder

## Setup

You can use Cosurfer with different LLM providers remote and local.

### groq

- Create an account at [groq](https://groq.com/)
- Generate an [API key](https://console.groq.com/keys)
- Open the Cosurfer settings by clicking the gear icon
- Insert the groq API key

### ollama

- Install [Ollama](https://ollama.com/), e.g. with `brew install ollama` on MacOS
- Start Ollama with `OLLAMA_ORIGINS=chrome-extension://* ollama serve`
- Insert Ollama address in Cosurfer settings, e.g. `http://localhost:11434`
- Insert Ollama model in Cosusrfer settigns, e.g. `llama3:8b`

## Tech Stack

- [Vite](https://github.com/vitejs/vite): build tool
- [React](https://github.com/facebook/react): frontend framework
- [LangChain.js](https://github.com/langchain-ai/langchainjs): LLM orchestration
- [daisyUI](https://daisyui.com/): styling
  - might migrate to https://github.com/daisyui/react-daisyui
- [heroicons](https://heroicons.com/): icons

## Limitations

- Currently the [innerText](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText) of the website's body element is sent to the LLM. If there is too much text for the rate limit (too many tokens), just the starting portion is sent to the LLM and the user is informed how many lines were processed.
  - Details on [groq API limits](https://console.groq.com/settings/limits) and [context window per model](https://console.groq.com/docs/models)
- There is no "memory" in the conversation yet, so the model doesn't "remember" the last question but treats every message like the first message of a conversation.
- Below you find a sample collection of URLs with estimated token counts of the content, useful for testing the limitations:

  | token count | url                                                        | Can cosurfer summarize it?         |
  | ----------- | ---------------------------------------------------------- | ---------------------------------- |
  | ca. 85      | https://example.org/                                       | Yes, completely                    |
  | ca. 11995   | https://en.wikipedia.org/wiki/Brick                        | Yes, completely                    |
  | ca. 16514   | https://en.wikipedia.org/wiki/Linux                        | Yes, completely                    |
  | ca. 25346   | https://news.ycombinator.com/item?id=31261533              | Yes, completely                    |
  | ca. 127584  | https://gutenberg.org/cache/epub/50572/pg50572-images.html | Partially, lines 1 to 5802 of 6655 |

## Development

- `npm install`
- `npm run build`
- `npm run watch`
