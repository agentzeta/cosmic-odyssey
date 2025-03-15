import axios from 'axios';
import { Artifact } from '../types/artifacts';

const API_URL = process.env.REACT_APP_API_URL;

export const artifactApi = {
  getArtifact: async (projectId: string, artifactType: string) => {
    return axios.get(`${API_URL}/projects/${projectId}/artifacts/${artifactType}`);
  },

  getAllArtifacts: async (projectId: string) => {
    return axios.get(`${API_URL}/projects/${projectId}/artifacts`);
  },

  createArtifact: async (projectId: string, artifact: Partial<Artifact>) => {
    return axios.post(`${API_URL}/projects/${projectId}/artifacts`, artifact);
  },

  updateArtifact: async (projectId: string, artifactId: string, updates: Partial<Artifact>) => {
    return axios.patch(`${API_URL}/projects/${projectId}/artifacts/${artifactId}`, updates);
  },

  deleteArtifact: async (projectId: string, artifactId: string) => {
    return axios.delete(`${API_URL}/projects/${projectId}/artifacts/${artifactId}`);
  },

  downloadArtifact: async (projectId: string, artifactId: string) => {
    return axios.get(`${API_URL}/projects/${projectId}/artifacts/${artifactId}/download`, {
      responseType: 'blob'
    });
  }
}; 