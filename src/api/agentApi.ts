import axios from 'axios';
import { AgentTask } from '../types/agents';

const API_URL = process.env.REACT_APP_API_URL;

export const agentApi = {
  assignTask: async (task: AgentTask) => {
    return axios.post(`${API_URL}/agents/${task.assignedTo}/tasks`, task);
  },

  getAgentStatus: async (agentId: string) => {
    return axios.get(`${API_URL}/agents/${agentId}/status`);
  },

  getAgentTasks: async (agentId: string) => {
    return axios.get(`${API_URL}/agents/${agentId}/tasks`);
  },

  updateTaskStatus: async (agentId: string, taskId: string, status: string) => {
    return axios.patch(`${API_URL}/agents/${agentId}/tasks/${taskId}`, { status });
  },

  cancelTask: async (agentId: string, taskId: string) => {
    return axios.delete(`${API_URL}/agents/${agentId}/tasks/${taskId}`);
  }
}; 