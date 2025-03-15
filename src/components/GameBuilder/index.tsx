import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Paper, Typography, Grid, CircularProgress } from '@mui/material';
import RequirementsForm from '../requirements/RequirementsForm';
import AgentDashboard from './AgentDashboard';
import ProjectProgress from './ProjectProgress';
import { RootState, AppDispatch } from '../../store';
import { updateProjectStatus, fetchProject } from '../../store/slices/projectSlice';
import { getAgentStatus } from '../../store/slices/agentSlice';
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
import TechnologyStatus from './TechnologyStatus';
import { initializeAgentTechnologies } from '../../store/slices/technologySlice';

const GameBuilder: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject, loading, error } = useSelector((state: RootState) => state.project);
  const technologies = useSelector((state: RootState) => state.technology);
  const agents = useSelector((state: RootState) => state.agents.agents);

  useEffect(() => {
    // Start monitoring session
    const initTechnologies = async () => {
      try {
        // Start X-Trace span for initialization
        const initSpan = xTracer.startSpan('initialize_technologies');
        
        // Start Mizu monitoring session
        await mizuMonitor.startSession({ 
          projectId: currentProject?.id,
          projectName: currentProject?.name
        });
        mizuMonitor.logEvent('project_loaded', { projectId: currentProject?.id });
        
        // Initialize agent technologies
        await dispatch(initializeAgentTechnologies(currentProject?.id));
        
        xTracer.endSpan(initSpan);
      } catch (error) {
        console.error('Failed to initialize technologies:', error);
      }
    };

    if (currentProject?.id) {
      dispatch(fetchProject(currentProject.id));
      initTechnologies();
    }

    return () => {
      // Clean up when component unmounts
      mizuMonitor.endSession().catch(err => {
        console.error('Error ending Mizu session:', err);
      });
    };
  }, [dispatch, currentProject?.id]);

  useEffect(() => {
    if (currentProject) {
      const statusInterval = setInterval(() => {
        dispatch(updateProjectStatus(currentProject.id));
        Object.keys(agents).forEach(agentId => {
          dispatch(getAgentStatus(agentId));
        });
      }, 5000);

      return () => clearInterval(statusInterval);
    }
  }, [currentProject, dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!currentProject) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography>No project selected. Please create or select a project.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          {currentProject.name}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TechnologyStatus technologies={technologies} />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <ProjectProgress />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <AgentDashboard />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default GameBuilder; 