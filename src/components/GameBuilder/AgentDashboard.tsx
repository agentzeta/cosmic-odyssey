import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { Add, Security, Storage } from '@mui/icons-material';
import AgentCard from './AgentCard';
import TaskQueue from './TaskQueue';
import { RootState } from '../../store';
import { createTask } from '../../store/slices/agentSlice';
import { useAgentCoordination } from '../../hooks/useAgentCoordination';
import { cdpAgentKit } from '../../integrations/cdpAgentKit';
import { phalaNetwork } from '../../integrations/phalaNetwork';
import { nillionCompute } from '../../integrations/nillion';
import { xTracer } from '../../integrations/xTrace';
import { AgentType } from '../../types/agents';

const AgentDashboard: React.FC = () => {
  const agents = useSelector((state: RootState) => state.agents.agents);
  const taskQueue = useSelector((state: RootState) => state.agents.taskQueue);
  const loading = useSelector((state: RootState) => state.agents.loading);

  const agentOrder: AgentType[] = [
    'projectManager',
    'gameDesigner',
    'visualArtist',
    'narrativeDesigner',
    'soundDesigner',
    'codeGenerator',
    'qaTester'
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Agent Status Dashboard
      </Typography>
      
      <List>
        {agentOrder.map((agentId, index) => (
          <React.Fragment key={agentId}>
            <AgentCard
              agentId={agentId}
              status={agents[agentId].status}
              tasks={agents[agentId].tasks}
            />
            {index < agentOrder.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ mt: 3 }}>
        <TaskQueue tasks={taskQueue} />
      </Box>
    </Paper>
  );
};

export default AgentDashboard; 