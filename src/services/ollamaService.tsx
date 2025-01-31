import axios, { AxiosError } from 'axios';

export interface OllamaResponse {
  response: string;
  context: number[];
}

export interface OllamaError {
  error: string;
  code: number;
}

export class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'llama2') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generateComment(context: string): Promise<string> {
    try {
      const response = await axios.post<OllamaResponse>(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: this.buildPrompt(context),
        stream: false
      });

      return response.data.response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<OllamaError>;
        if (axiosError.response?.data) {
          throw new Error(`Ollama API error: ${axiosError.response.data.error}`);
        }
      }
      throw new Error('Failed to generate comment');
    }
  }

  private buildPrompt(context: string): string {
    return `You are a viewer watching a livestream. Based on this context from the stream: "${context}", 
    generate a single short, natural-sounding chat message (max 150 characters) that could be from a viewer. 
    Be varied in reaction types and writing styles. Don't use hashtags or emotes. 
    Only respond with the message itself, no additional text.`;
  }
}

export const ollamaService = new OllamaService();