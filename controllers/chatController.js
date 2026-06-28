import { ChatAnthropic } from "@langchain/anthropic";
import { createAgent } from "langchain";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import identifyRequestTool from "../src/tools/agentTool.js";



const model = new ChatAnthropic({
  modelName: "claude-haiku-4-5-20251001",
  apiKey: process.env.CLAUDE_API_KEY,
  maxTokens: 4096,
});

const claudeAgent = createAgent({
    model,
    tools: [identifyRequestTool],
});


export async function chatHandler(req, res) {
  // Riceviamo la history temporanea direttamente dal Frontend
  const { history } = req.body; 

  try {
    // Convertiamo l'array di oggetti del frontend nel formato richiesto da LangChain
    const formattedMessages = history.map(msg => {
      if (msg.sender === "user") {
        return new HumanMessage(msg.text);
      } else {
        return new AIMessage(msg.text);
      }
    });

    // Invochiamo l'agente passandogli l'intera storia della sessione corrente
    const result = await claudeAgent.invoke({ messages: formattedMessages });

    // Prendiamo l'ultimo messaggio generato (la risposta di Claude)
    const lastMessage = result.messages[result.messages.length - 1];
    
    res.json({ text: lastMessage.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante l'elaborazione." });
  }
};