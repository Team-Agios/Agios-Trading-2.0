// llamaService.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const LLAMA_API_URL = process.env.LLAMA_API_URL || '';

interface Message {
  role: string;
  content: string;
}

export const getChatbotResponse = async (message: string): Promise<string> => {
  if (!LLAMA_API_URL) {
    throw new Error('LLAMA_API_URL environment variable is not set');
  }

  try {
    const response = await axios.post(
      `${LLAMA_API_URL}/api/chat`,
      {
        model: 'llama3',
        messages: [{ role: 'user', content: message }],
      },
      {
        responseType: 'stream',
        timeout: 10000,
      }
    );

    let responseText = '';

    return new Promise<string>((resolve, reject) => {
      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString('utf8').split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          try {
            const parsedLine = JSON.parse(line);
            if (parsedLine.message?.role === 'assistant') {
              responseText += parsedLine.message.content + '\n\n';
            }
          } catch (err) {
            console.error('Error parsing stream line:', line, err);
          }
        }
      });

      response.data.on('end', () => resolve(responseText.trim()));
      response.data.on('error', reject);
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message, error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Failed to fetch chatbot response');
  }
};
