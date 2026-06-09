import pkg from "node-nlp";
import { trainingData } from "../data/trainingData.js";
import fs from "fs";
import path from "path";

const { NlpManager } = pkg;
const MODEL_FILE = path.resolve("./model.nlp");
const manager = new NlpManager({ languages: ["en"], forceNER: true });

// Check if model file exists and load it, otherwise train it
export const initNLP = async () => {
  if (fs.existsSync(MODEL_FILE)) {
    console.log("Loading existing NLP model...");
    await manager.load(MODEL_FILE);
  } else {
    console.log("No NLP model found. Training a new model...");
    await trainNLP();
  }
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
