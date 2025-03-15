import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Pending,
  Info,
  Refresh,
  Settings,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { refreshTechnologyStatus } from '../../store/slices/technologySlice';
import { TechnologyState } from '../../types/technology';
import { styled } from '@mui/material/styles';

interface TechnologyStatusProps {
  technologies: TechnologyState;
}

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

const TechnologyCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
}));

const TechnologyStatus: React.FC<TechnologyStatusProps> = ({ technologies }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle color="success" sx={{ animation: 'pulse 2s infinite' }} />;
      case 'error':
        return <Error color="error" />;
      case 'initializing':
        return <Pending color="warning" sx={{ animation: 'spin 1.5s linear infinite' }} />;
      default:
        return <Pending color="disabled" />;
    }
  };

  const handleRefresh = () => {
    dispatch(refreshTechnologyStatus());
  };

  const handleOpenDetails = (tech: string) => {
    setSelectedTech(tech);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <GlowingPaper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Agent Technologies</Typography>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Button
          startIcon={<Refresh />}
          onClick={handleRefresh}
          size="small"
          variant="outlined"
          color="secondary"
          sx={{ 
            borderRadius: '20px',
            '&:hover': {
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
            }
          }}
        >
          Refresh Status
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={2}>
          {Object.entries(technologies.status).map(([tech, status]) => (
            <Grid item xs={12} sm={6} md={4} key={tech}>
              <TechnologyCard
                sx={{
                  backgroundColor: status.status === 'connected' 
                    ? 'rgba(16, 185, 129, 0.05)' 
                    : status.status === 'error'
                    ? 'rgba(239, 68, 68, 0.05)'
                    : 'transparent',
                }}
              >
                <Box sx={{ mr: 1.5 }}>{getStatusIcon(status.status)}</Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{tech}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={status.progress}
                      sx={{ 
                        flexGrow: 1, 
                        mr: 1,
                        '& .MuiLinearProgress-bar': {
                          background: status.status === 'connected'
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : status.status === 'error'
                            ? 'linear-gradient(90deg, #ef4444, #f87171)'
                            : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ minWidth: '36px', textAlign: 'right' }}>
                      {status.progress}%
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title="View Details">
                  <IconButton size="small" onClick={() => handleOpenDetails(tech)}>
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TechnologyCard>
            </Grid>
          ))}
        </Grid>
      </Collapse>

      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {selectedTech} Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedTech && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>Status Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Status: <Chip 
                    size="small" 
                    label={technologies.status[selectedTech]?.status} 
                    color={
                      technologies.status[selectedTech]?.status === 'connected' ? 'success' :
                      technologies.status[selectedTech]?.status === 'error' ? 'error' : 'warning'
                    }
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Progress: {technologies.status[selectedTech]?.progress}%
                </Typography>
                {technologies.status[selectedTech]?.error && (
                  <Typography variant="body2" color="error" gutterBottom>
                    Error: {technologies.status[selectedTech]?.error}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>Technology Description</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {getTechnologyDescription(selectedTech)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCloseDetails}
          >
            Configure
          </Button>
        </DialogActions>
      </Dialog>
    </GlowingPaper>
  );
};

// Helper function to get technology descriptions
function getTechnologyDescription(tech: string): string {
  const descriptions: Record<string, string> = {
    nearAI: "NEAR AI provides enhanced natural language processing and decision-making capabilities for agents, enabling them to better understand game requirements and make intelligent design choices.",
    questFlow: "QuestFlow manages structured task progression and dependencies, ensuring that game development follows a logical sequence with proper milestone tracking.",
    phalaNetwork: "Phala Network enables confidential computing and secure agent interactions, protecting sensitive game design data and intellectual property.",
    nillion: "Nillion provides decentralized computation capabilities, allowing for privacy-preserving operations across distributed agent networks.",
    cdpAgentKit: "CDP Agent Kit enhances agent capabilities with specialized skills for game development, including design, narrative, visual art, and programming expertise.",
    nevermined: "Nevermined manages decentralized access control and data sharing between agents, ensuring proper permissions for game assets and code.",
    mizu: "Mizu provides real-time monitoring and debugging of agent interactions, offering insights into the game development process.",
    xTrace: "X-Trace enables distributed tracing and performance optimization, helping identify bottlenecks in the game development pipeline.",
    pondStorage: "Pond offers decentralized storage for game assets and user data, ensuring availability and integrity of game resources.",
    webglEngine: "WebGL Engine is a browser-based game rendering system that allows games to run directly in web browsers without requiring additional software installation."
  };
  
  return descriptions[tech] || "No description available.";
}

export default TechnologyStatus; 