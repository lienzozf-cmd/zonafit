import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import './flows/send-gmail-flow';

export const ai = genkit({
  plugins: [
    googleAI({
      gmail: {
        source: {
          emailAddress: 'me',
        },
        auth: ['gmail.send'],
      },
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
