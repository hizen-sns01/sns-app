'use client';

import { env, pipeline } from '@xenova/transformers';

// Configure the environment to use the web worker
if (typeof window !== 'undefined') {
  env.useBrowserCache = true;
  env.useCustomModels = false;
}

let model: any = null;

export async function initializeModel() {
  if (typeof window === 'undefined') {
    return null; // Return null on server-side
  }

  if (!model) {
    try {
      // Initialize the model with web worker
      model = await pipeline('text-generation', 'Xenova/gemma-3b-it', {
        progress_callback: (progress: any) => {
          console.log(progress);
        }
      });
    } catch (error) {
      console.error('Error initializing model:', error);
      throw error;
    }
  }
  return model;
}

export async function generateGemmaResponse(prompt: string) {
  try {
    // Ensure model is initialized
    const generator = await initializeModel();

    // Generate response
    const result = await generator(prompt, {
      max_new_tokens: 128,
      temperature: 0.7,
      repetition_penalty: 1.1,
    });

    return result[0].generated_text.trim();
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
}