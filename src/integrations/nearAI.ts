import axios from 'axios';

class NearAI {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = process.env.REACT_APP_NEAR_AI_API_KEY || '';
    this.baseUrl = 'https://api.near.ai/v1';
  }
  
  async processDescription(description: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/process`, 
        { description },
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error processing with NEAR AI:', error);
      throw error;
    }
  }
  
  async enhanceAgentDecision(agentType: string, context: any, options: any[]) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/decide`,
        { agentType, context, options },
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );
      return response.data.decision;
    } catch (error) {
      console.error('Error with NEAR AI decision:', error);
      throw error;
    }
  }
}

export const nearAI = new NearAI(); 