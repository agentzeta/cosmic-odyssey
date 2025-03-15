import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TechnologyState } from '../../types/technology';
import { nearAI } from '../../integrations/nearAI';
import { questManager } from '../../integrations/questFlow';
import { phalaNetwork } from '../../integrations/phalaNetwork';
import { nillionCompute } from '../../integrations/nillion';
import { cdpAgentKit } from '../../integrations/cdpAgentKit';
import { neverminedAccess } from '../../integrations/nevermined';
import { mizuMonitor } from '../../integrations/mizu';
import { xTracer } from '../../integrations/xTrace';
import { pondStorage } from '../../integrations/pond';
import { webglEngine } from '../../engine/webglEngine';

export const initializeAgentTechnologies = createAsyncThunk(
  'technology/initialize',
  async (projectId: string | undefined) => {
    if (!projectId) {
      throw new Error('Project ID is required to initialize technologies');
    }

    const results: Record<string, any> = {};

    try {
      // Initialize NEAR AI
      results.nearAI = await nearAI.processDescription('Initialize NEAR AI for project ' + projectId);
    } catch (error) {
      results.nearAI = { error: error.message };
    }

    try {
      // Initialize QuestFlow
      const quest = questManager.createQuest(`Project ${projectId}`);
      results.questFlow = { questId: quest.id };
    } catch (error) {
      results.questFlow = { error: error.message };
    }

    try {
      // Initialize Phala Network
      results.phalaNetwork = await phalaNetwork.setupAgentChannels([
        'gameDesigner',
        'narrativeDesigner',
        'visualArtist',
        'audioDesigner',
        'programmer',
        'qualityAssurance'
      ]);
    } catch (error) {
      results.phalaNetwork = { error: error.message };
    }

    try {
      // Initialize Nillion
      results.nillion = await nillionCompute.createComputeNode();
    } catch (error) {
      results.nillion = { error: error.message };
    }

    try {
      // Initialize CDP Agent Kit
      const gameDesigner = await cdpAgentKit.createAgent('gameDesigner');
      const narrativeDesigner = await cdpAgentKit.createAgent('narrativeDesigner');
      const visualArtist = await cdpAgentKit.createAgent('visualArtist');
      const audioDesigner = await cdpAgentKit.createAgent('audioDesigner');
      const programmer = await cdpAgentKit.createAgent('programmer');
      const qualityAssurance = await cdpAgentKit.createAgent('qualityAssurance');
      
      results.cdpAgentKit = {
        agents: [
          gameDesigner.id,
          narrativeDesigner.id,
          visualArtist.id,
          audioDesigner.id,
          programmer.id,
          qualityAssurance.id
        ]
      };
    } catch (error) {
      results.cdpAgentKit = { error: error.message };
    }

    try {
      // Initialize Nevermined
      results.nevermined = await neverminedAccess.registerAsset(
        { projectId },
        { name: `Project ${projectId}`, type: 'game_project' }
      );
    } catch (error) {
      results.nevermined = { error: error.message };
    }

    // Mizu and X-Trace are already initialized in the component

    try {
      // Initialize Pond Storage
      results.pondStorage = { initialized: true };
    } catch (error) {
      results.pondStorage = { error: error.message };
    }

    return results;
  }
);

export const refreshTechnologyStatus = createAsyncThunk(
  'technology/refresh',
  async (_, { getState }) => {
    const state = getState() as { technology: TechnologyState };
    const currentStatus = state.technology.status;
    
    // Simulate checking status of each technology
    const results: Record<string, any> = {};
    
    for (const [tech, status] of Object.entries(currentStatus)) {
      // In a real app, you would make actual API calls to check status
      // For now, we'll just simulate progress updates
      results[tech] = {
        status: status.status,
        progress: Math.min(100, status.progress + Math.floor(Math.random() * 20))
      };
      
      // If progress reaches 100, mark as connected
      if (results[tech].progress >= 100) {
        results[tech].status = 'connected';
        results[tech].progress = 100;
      }
    }
    
    return results;
  }
);

const initialState: TechnologyState = {
  status: {
    nearAI: { status: 'initializing', progress: 0 },
    questFlow: { status: 'initializing', progress: 0 },
    phalaNetwork: { status: 'initializing', progress: 0 },
    nillion: { status: 'initializing', progress: 0 },
    cdpAgentKit: { status: 'initializing', progress: 0 },
    nevermined: { status: 'initializing', progress: 0 },
    mizu: { status: 'initializing', progress: 0 },
    xTrace: { status: 'initializing', progress: 0 },
    pondStorage: { status: 'initializing', progress: 0 },
    webglEngine: { status: 'initializing', progress: 0 }
  },
  initialized: false,
  error: null
};

const technologySlice = createSlice({
  name: 'technology',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeAgentTechnologies.pending, (state) => {
        state.initialized = false;
        state.error = null;
        
        // Set all technologies to initializing with some initial progress
        Object.keys(state.status).forEach(tech => {
          state.status[tech] = { status: 'initializing', progress: 10 };
        });
      })
      .addCase(initializeAgentTechnologies.fulfilled, (state, action) => {
        state.initialized = true;
        
        // Update status based on initialization results
        Object.entries(action.payload).forEach(([tech, result]) => {
          if (result.error) {
            state.status[tech] = { status: 'error', progress: 0, error: result.error };
          } else {
            state.status[tech] = { status: 'connected', progress: 100 };
          }
        });
        
        // Set default progress for technologies not explicitly initialized
        Object.keys(state.status).forEach(tech => {
          if (!action.payload[tech]) {
            state.status[tech] = { status: 'initializing', progress: 50 };
          }
        });
      })
      .addCase(initializeAgentTechnologies.rejected, (state, action) => {
        state.initialized = false;
        state.error = action.error.message || 'Failed to initialize technologies';
        
        // Mark all as error
        Object.keys(state.status).forEach(tech => {
          state.status[tech] = { status: 'error', progress: 0 };
        });
      })
      .addCase(refreshTechnologyStatus.fulfilled, (state, action) => {
        // Update status for each technology
        Object.entries(action.payload).forEach(([tech, status]) => {
          state.status[tech] = status;
        });
      });
  }
});

export default technologySlice.reducer; 