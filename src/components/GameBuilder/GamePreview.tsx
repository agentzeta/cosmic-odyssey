import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import { webglEngine } from '../../engine/webglEngine';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { mizuMonitor } from '../../integrations/mizu';
import { xTracer } from '../../integrations/xTrace';

interface GamePreviewProps {
  projectId: string;
}

const GamePreview: React.FC<GamePreviewProps> = ({ projectId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const technologies = useSelector((state: RootState) => state.technology);

  useEffect(() => {
    const initializeEngine = async () => {
      try {
        setIsLoading(true);
        
        const spanId = xTracer.startSpan('initialize_webgl_engine');
        mizuMonitor.logEvent('webgl_engine_init_started', { projectId });
        
        // Initialize the WebGL engine
        if (canvasRef.current) {
          const success = webglEngine.initialize(canvasRef.current.id);
          
          if (success) {
            // Load some basic assets
            await webglEngine.loadAsset(
              'defaultTexture',
              '/assets/default_texture.png',
              'texture'
            );
            
            setIsInitialized(true);
            mizuMonitor.logEvent('webgl_engine_initialized', { 
              projectId,
              success: true 
            });
          } else {
            mizuMonitor.logEvent('webgl_engine_initialized', { 
              projectId,
              success: false,
              error: 'Failed to initialize WebGL context'
            });
          }
        }
        
        xTracer.endSpan(spanId);
      } catch (error) {
        console.error('Error initializing WebGL engine:', error);
        mizuMonitor.logEvent('webgl_engine_error', { 
          projectId,
          error: error.message 
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!isInitialized && canvasRef.current) {
      initializeEngine();
    }

    return () => {
      // Clean up
      if (isRunning) {
        webglEngine.stop();
      }
    };
  }, [projectId, isInitialized, isRunning]);

  const handleStartStop = () => {
    if (isRunning) {
      webglEngine.stop();
      setIsRunning(false);
      mizuMonitor.logEvent('game_preview_stopped', { projectId });
    } else {
      webglEngine.start();
      setIsRunning(true);
      mizuMonitor.logEvent('game_preview_started', { projectId });
    }
  };

  const handleReset = () => {
    if (isRunning) {
      webglEngine.stop();
      setIsRunning(false);
    }
    
    setIsInitialized(false);
    mizuMonitor.logEvent('game_preview_reset', { projectId });
  };

  const engineStatus = technologies.status.webglEngine;
  const isEngineReady = engineStatus.status === 'connected';

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Game Preview
      </Typography>
      
      <Box sx={{ position: 'relative' }}>
        <canvas
          id={`game-canvas-${projectId}`}
          ref={canvasRef}
          style={{
            width: '100%',
            height: '300px',
            backgroundColor: '#000',
            display: 'block',
          }}
        />
        
        {(isLoading || !isEngineReady) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography color="white">
                {isLoading ? 'Initializing Engine...' : 'Engine not ready'}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={isRunning ? <Pause /> : <PlayArrow />}
          onClick={handleStartStop}
          disabled={!isInitialized || !isEngineReady}
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset
        </Button>
      </Box>
    </Paper>
  );
};

export default GamePreview; 