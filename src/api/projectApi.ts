import axios from 'axios';
import { GameRequirements } from '../types/requirements';

const API_URL = process.env.REACT_APP_API_URL;

export const projectApi = {
  createProject: async (requirements: GameRequirements) => {
    return axios.post(`${API_URL}/projects`, requirements);
  },

  getProject: async (projectId: string) => {
    return axios.get(`${API_URL}/projects/${projectId}`);
  },

  getProjectStatus: async (projectId: string) => {
    return axios.get(`${API_URL}/projects/${projectId}/status`);
  },

  updateProject: async (projectId: string, updates: Partial<GameRequirements>) => {
    return axios.patch(`${API_URL}/projects/${projectId}`, updates);
  },

  getAllProjects: async () => {
    return axios.get(`${API_URL}/projects`);
  },

  deleteProject: async (projectId: string) => {
    return axios.delete(`${API_URL}/projects/${projectId}`);
  }
}; 