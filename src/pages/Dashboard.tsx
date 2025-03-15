import React, { useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import TechnologyStatus from '../components/GameBuilder/TechnologyStatus';
import ProjectProgress from '../components/GameBuilder/ProjectProgress';
import AgentDashboard from '../components/GameBuilder/AgentDashboard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchProject } from '../store/slices/projectSlice';
import { initializeAgentTechnologies } from '../store/slices/technologySlice';
import { mizuMonitor } from '../integrations/mizu';
import { xTracer } from '../integrations/xTrace';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject } = useSelector((state: RootState) => state.project);
  const technologies = useSelector((state: RootState) => state.technology);

  useEffect(() => {
    const initDashboard = async () => {
      const spanId = xTracer.startSpan('initialize_dashboard');
      
      try {
        // For demo purposes, we'll use a hardcoded project ID
        const projectId = 'demo-project-1';
        
        await mizuMonitor.startSession({ projectId });
        mizuMonitor.logEvent('dashboard_loaded', { projectId });
        
        await dispatch(fetchProject(projectId));
        await dispatch(initializeAgentTechnologies(projectId));
        
        xTracer.setTag(spanId, 'status', 'success');
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        xTracer.setTag(spanId, 'status', 'error');
        xTracer.setTag(spanId, 'error', error.message);
      } finally {
        xTracer.endSpan(spanId);
      }
    };
    
    initDashboard();
    
    return () => {
      mizuMonitor.endSession().catch(console.error);
    };
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        py: 4,
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 4
          }}
        >
          {currentProject?.name || 'Project Dashboard'}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TechnologyStatus technologies={technologies} />
          </Grid>
          
          <Grid item xs={12} lg={8}>
            <ProjectProgress />
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <AgentDashboard />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 