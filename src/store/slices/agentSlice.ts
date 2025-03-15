import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AgentState, AgentTask } from '../../types/agents';
import { agentApi } from '../../api/agentApi';

export const assignTask = createAsyncThunk(
  'agents/assignTask',
  async (task: AgentTask) => {
    const response = await agentApi.assignTask(task);
    return response.data;
  }
);

export const getAgentStatus = createAsyncThunk(
  'agents/getStatus',
  async (agentId: string) => {
    const response = await agentApi.getAgentStatus(agentId);
    return response.data;
  }
);

const initialState: AgentState = {
  agents: {
    projectManager: { status: 'idle', tasks: [] },
    gameDesigner: { status: 'idle', tasks: [] },
    visualArtist: { status: 'idle', tasks: [] },
    narrativeDesigner: { status: 'idle', tasks: [] },
    soundDesigner: { status: 'idle', tasks: [] },
    codeGenerator: { status: 'idle', tasks: [] },
    qaTester: { status: 'idle', tasks: [] },
  },
  taskQueue: [],
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    updateAgentStatus: (state, action) => {
      const { agentId, status } = action.payload;
      state.agents[agentId].status = status;
    },
    addTaskToQueue: (state, action) => {
      state.taskQueue.push(action.payload);
    },
    removeTaskFromQueue: (state, action) => {
      state.taskQueue = state.taskQueue.filter(
        task => task.taskId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.loading = false;
        const { agentId, task } = action.payload;
        state.agents[agentId].tasks.push(task);
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAgentStatus.fulfilled, (state, action) => {
        const { agentId, status, tasks } = action.payload;
        state.agents[agentId] = { status, tasks };
      });
  },
});

export const { 
  updateAgentStatus, 
  addTaskToQueue, 
  removeTaskFromQueue 
} = agentSlice.actions;
export default agentSlice.reducer; 