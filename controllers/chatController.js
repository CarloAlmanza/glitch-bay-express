import { ChatAnthropic } from "@langchain/anthropic";
import { createAgent } from "langchain"; // Nota: Se usi versioni recenti di LangChain, valuta createReactAgent o simili
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import identifyRequestTool from "../src/tools/agentTool.js";

const model = new ChatAnthropic({
  modelName: "claude-haiku-4-5-20251001",
  apiKey: process.env.CLAUDE_API_KEY,
  maxTokens: 4096,
});

// Definiamo le istruzioni di sistema per guidare il comportamento dell'agente sulla formattazione
const systemInstruction = new SystemMessage(
  `Sei un assistente virtuale per un e-commerce. Il tuo compito è aiutare l'utente a trovare i prodotti.
  
  Quando utilizzi lo strumento 'identify_request', riceverai una lista di prodotti dal database.
  Il tuo obiettivo è rispondere all'utente in formato JSON strutturato in questo modo, così che il frontend possa mostrare delle card:
  
  {
    "type": "cards",
    "text": "Ecco i prodotti che ho trovato per te:",
    "products": [ 
       // Inserisci qui l'array dei prodotti ricevuti dal tool, mantenendo le proprietà utili (id, nome, prezzo, immagine, ecc.)
    ]
  }

  Se invece la richiesta dell'utente è una normale conversazione (es. "Ciao!", "Grazie"), o se il tool non restituisce prodotti, rispondi con un JSON di questo tipo:
  {
    "type": "text",
    "text": "La tua risposta testuale qui."
  }

  <CRITICAL_RULE>
  NON avvolgere il JSON nei blocchi di codice markdown (NO \`\`\`json e NO \`\`\`).
  Inizia la tua risposta direttamente con la parentesi graffa aperta { e finisci con la parentesi graffa chiusa }.
  Non aggiungere nessun testo di introduzione o di conclusione. La tua risposta deve contenere SOLO ed ESCLUSIVAMENTE il codice JSON valido.
  </CRITICAL_RULE>`
);

const claudeAgent = createAgent({
    model,
    tools: [identifyRequestTool],
});

export async function chatHandler(req, res) {
  const { history } = req.body; 

  try {
    // Inseriamo l'istruzione di sistema all'inizio della cronologia dei messaggi
    const formattedMessages = [systemInstruction];

    history.forEach(msg => {
      if (msg.sender === "user") {
        formattedMessages.push(new HumanMessage(msg.text));
      } else {
        formattedMessages.push(new AIMessage(msg.text));
      }
    });

    const result = await claudeAgent.invoke({ messages: formattedMessages });
    const lastMessage = result.messages[result.messages.length - 1];
    
    // Proviamo a fare il parsing della risposta di Claude per assicurarci che sia JSON valido
    try {
      const jsonResponse = JSON.parse(lastMessage.content);
      res.json(jsonResponse);
    } catch (e) {
      // Fallback nel caso in cui l'agente non abbia seguito perfettamente il formato JSON
      res.json({ type: "text", text: lastMessage.content });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante l'elaborazione." });
  }
};