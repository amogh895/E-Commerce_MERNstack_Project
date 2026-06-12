import pkg from "node-nlp";
import { trainingData } from "../data/trainingData.js";
import fs from "fs";
import path from "path";

const { NlpManager } = pkg;
const MODEL_FILE = path.resolve("./model.nlp");
const manager = new NlpManager({ languages: ["en"], forceNER: true });

// Train NLP model on startup to ensure training data updates are always loaded
export const initNLP = async () => {
  console.log("Training/re-training NLP model on startup...");
  await trainNLP();
};

export const trainNLP = async () => {
  // Add training utterances for each intent
  Object.keys(trainingData).forEach((intent) => {
    trainingData[intent].forEach((utterance) => {
      manager.addDocument("en", utterance, intent);
    });
  });

  console.log("Training NLP manager...");
  await manager.train();
  await manager.save(MODEL_FILE);
  console.log(`NLP model trained and saved to ${MODEL_FILE}`);
};

export const classifyMessage = async (message) => {
  const result = await manager.process("en", message);
  return {
    intent: result.intent || null,
    score: result.score || 0
  };
};
