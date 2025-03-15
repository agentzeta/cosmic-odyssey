import React, { useState } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Paper,
  Typography 
} from '@mui/material';
import BasicInfo from './steps/BasicInfo';
import GameplayRequirements from './steps/GameplayRequirements';
import VisualRequirements from './steps/VisualRequirements';
import AudioRequirements from './steps/AudioRequirements';
import TechnicalRequirements from './steps/TechnicalRequirements';
import RequirementsSummary from './steps/RequirementsSummary';
import { useDispatch } from 'react-redux';
import { createProject } from '../../store/slices/projectSlice';
import { GameRequirements } from '../../types/requirements';

const steps = [
  'Basic Info',
  'Gameplay',
  'Visual Style',
  'Audio',
  'Technical',
  'Summary'
];

const RequirementsForm: React.FC = () => {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [requirements, setRequirements] = useState<Partial<GameRequirements>>({});

  const handleNext = (data: any) => {
    setRequirements(prev => ({ ...prev, ...data }));
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      await dispatch(createProject(requirements as GameRequirements));
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BasicInfo 
          data={requirements.basicInfo} 
          onComplete={handleNext} 
        />;
      case 1:
        return <GameplayRequirements 
          data={requirements.gameplay}
          onComplete={handleNext}
          onBack={handleBack}
        />;
      case 2:
        return <VisualRequirements 
          data={requirements.visual}
          onComplete={handleNext}
          onBack={handleBack}
        />;
      case 3:
        return <AudioRequirements 
          data={requirements.audio}
          onComplete={handleNext}
          onBack={handleBack}
        />;
      case 4:
        return <TechnicalRequirements 
          data={requirements.technical}
          onComplete={handleNext}
          onBack={handleBack}
        />;
      case 5:
        return <RequirementsSummary 
          requirements={requirements as GameRequirements}
          onSubmit={handleSubmit}
          onBack={handleBack}
        />;
      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Game Requirements
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>{renderStepContent(activeStep)}</Box>
    </Paper>
  );
};

export default RequirementsForm; 