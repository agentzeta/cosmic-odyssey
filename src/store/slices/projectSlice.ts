import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GameRequirements, ProjectState } from '../../types';
import { projectApi } from '../../api/projectApi';
import { questManager, Quest } from '../../integrations/questFlow';

export const createProject = createAsyncThunk(
  'project/create',
  async (requirements: GameRequirements) => {
    try {
      const response = await projectApi.createProject(requirements);
      
      // Create a game creation quest
      const gameQuest = questManager.createQuest(
        `Create ${requirements.basicInfo.title}`,
        requirements.basicInfo.description
      );
      
      // Add tasks to the quest
      const designTask = gameQuest.addTask('Game Design', { 
        requirements: requirements.gameplay 
      });
      const narrativeTask = gameQuest.addTask('Narrative Design', { 
        requirements: { ...requirements.basicInfo, ...requirements.gameplay } 
      });
      const visualTask = gameQuest.addTask('Visual Design', { 
        requirements: requirements.visual 
      });
      const audioTask = gameQuest.addTask('Audio Design', { 
        requirements: requirements.audio 
      });
      const codeTask = gameQuest.addTask('Code Generation', { 
        requirements: requirements.technical 
      });
      const testingTask = gameQuest.addTask('Game Testing');
      
      // Set up dependencies
      gameQuest.addDependency(narrativeTask.id, designTask.id);
      gameQuest.addDependency(visualTask.id, designTask.id);
      gameQuest.addDependency(audioTask.id, designTask.id);
      gameQuest.addDependency(codeTask.id, designTask.id);
      gameQuest.addDependency(codeTask.id, visualTask.id);
      gameQuest.addDependency(codeTask.id, audioTask.id);
      gameQuest.addDependency(testingTask.id, codeTask.id);
      
      // Activate the quest
      gameQuest.status = 'active';
      
      return {
        ...response.data,
        questId: gameQuest.id
      };
    } catch (error) {
      throw error;
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'project/updateStatus',
  async (projectId: string) => {
    const response = await projectApi.getProjectStatus(projectId);
    return response.data;
  }
);

const initialState: ProjectState = {
  currentProject: null,
  projects: [],
  loading: false,
  error: null,
  projectStatus: {},
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.projectStatus[action.payload.projectId] = action.payload.status;
      });
  },
});

export const { setCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer; 