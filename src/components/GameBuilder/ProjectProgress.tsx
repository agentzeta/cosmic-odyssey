import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Code,
  Brush,
  MusicNote,
  Gamepad,
  Book,
  BugReport,
  Storage,
  Security,
  Analytics,
  CloudUpload,
  Visibility,
  Download,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { RootState } from '../../store';
import ArtifactPreview from './ArtifactPreview';
import { xTracer } from '../../integrations/xTrace';
import { mizuMonitor } from '../../integrations/mizu';
import { pondStorage } from '../../integrations/pond';
import { neverminedAccess } from '../../integrations/nevermined';

const GlowingPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
    boxShadow: '0 0 20px 2px rgba(99, 102, 241, 0.5)',
  },
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    fontWeight: 600,
  },
  '& .MuiStepLabel-iconContainer': {
    '& .MuiStepIcon-root.Mui-active': {
      color: theme.palette.primary.main,
      filter: 'drop-shadow(0 0 5px rgba(99, 102, 241, 0.7))',
    },
    '& .MuiStepIcon-root.Mui-completed': {
      color: theme.palette.success.main,
      filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.7))',
    },
  },
}));

const ArtifactCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  },
}));

const ProjectProgress: React.FC = () => {
  const dispatch = useDispatch();
  const currentProject = useSelector((state: RootState) => state.project.currentProject);
  const projectStatus = useSelector(
    (state: RootState) => state.project.projectStatus[currentProject?.id]
  );
  const technologies = useSelector((state: RootState) => state.technology);
  
  const [logsOpen, setLogsOpen] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const [artifactDialogOpen, setArtifactDialogOpen] = useState(false);

  const handleViewLogs = () => {
    mizuMonitor.logEvent('view_logs_clicked', { projectId: currentProject?.id });
    setLogsOpen(true);
  };

  const handleSecureStorage = async (artifactType: string) => {
    try {
      const spanId = xTracer.startSpan('secure_storage_operation');
      xTracer.addEvent(spanId, 'start_storage', { artifactType });
      
      mizuMonitor.logEvent('secure_storage_initiated', { 
        projectId: currentProject?.id,
        artifactType 
      });
      
      // Simulate storing in Pond
      setTimeout(() => {
        alert(`${artifactType} stored securely with Pond`);
        xTracer.endSpan(spanId);
      }, 1000);
    } catch (error) {
      console.error('Error with secure storage:', error);
    }
  };

  const handleSetAccessControl = async (artifactType: string) => {
    try {
      const spanId = xTracer.startSpan('access_control_operation');
      
      mizuMonitor.logEvent('access_control_initiated', { 
        projectId: currentProject?.id,
        artifactType 
      });
      
      // Simulate Nevermined access control
      setTimeout(() => {
        alert(`Access control set for ${artifactType} with Nevermined`);
        xTracer.endSpan(spanId);
      }, 1000);
    } catch (error) {
      console.error('Error with access control:', error);
    }
  };
  
  const handleViewArtifact = (artifactType: string) => {
    setSelectedArtifact(artifactType);
    setArtifactDialogOpen(true);
  };

  if (!currentProject || !projectStatus) {
    return (
      <GlowingPaper sx={{ p: 3 }}>
        <Typography>No project data available</Typography>
      </GlowingPaper>
    );
  }

  const phases = [
    {
      label: 'Requirements Gathering',
      description: 'Define game concept and technical requirements',
      artifacts: ['Game Design Document', 'Technical Specifications'],
      technologies: ['nearAI', 'questFlow'],
      icon: <Book color="primary" />,
      status: 'completed'
    },
    {
      label: 'Asset Creation',
      description: 'Create visual and audio assets for the game',
      artifacts: ['Character Designs', 'Environment Art', 'Sound Effects'],
      technologies: ['cdpAgentKit', 'pondStorage', 'phalaNetwork'],
      icon: <Brush color="primary" />,
      status: 'active'
    },
    {
      label: 'Game Development',
      description: 'Implement game mechanics and systems',
      artifacts: ['Game Code', 'Prototype'],
      technologies: ['nillion', 'webglEngine', 'xTrace'],
      icon: <Code color="primary" />,
      status: 'pending'
    },
    {
      label: 'Testing & Polishing',
      description: 'Quality assurance and final touches',
      artifacts: ['Test Reports', 'Final Build'],
      technologies: ['mizu', 'nevermined'],
      icon: <BugReport color="primary" />,
      status: 'pending'
    }
  ];

  return (
    <GlowingPaper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Project Progress</Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleViewLogs}
          startIcon={<Analytics />}
          sx={{ 
            borderRadius: '20px',
            '&:hover': {
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
            }
          }}
        >
          View Logs
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
</rewritten_file> 