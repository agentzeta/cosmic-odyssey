import React from 'react';
import { 
  Box, 
  Button, 
  Chip,
  TextField,
  Slider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { GameplayData } from '../../../types/requirements';

interface GameplayRequirementsProps {
  data?: GameplayData;
  onComplete: (data: GameplayData) => void;
  onBack: () => void;
}

const GameplayRequirements: React.FC<GameplayRequirementsProps> = ({
  data,
  onComplete,
  onBack
}) => {
  const { control, handleSubmit, watch } = useForm<GameplayData>({
    defaultValues: data || {
      mechanics: [],
      features: [],
      difficulty: 'medium',
      gameLength: 10
    }
  });

  const [newMechanic, setNewMechanic] = React.useState('');
  const [newFeature, setNewFeature] = React.useState('');
  const mechanics = watch('mechanics');
  const features = watch('features');

  const handleAddMechanic = () => {
    if (newMechanic.trim() && !mechanics.includes(newMechanic.trim())) {
      mechanics.push(newMechanic.trim());
      setNewMechanic('');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      features.push(newFeature.trim());
      setNewFeature('');
    }
  };

  const handleDeleteMechanic = (mechanic: string) => {
    const index = mechanics.indexOf(mechanic);
    if (index > -1) {
      mechanics.splice(index, 1);
    }
  };

  const handleDeleteFeature = (feature: string) => {
    const index = features.indexOf(feature);
    if (index > -1) {
      features.splice(index, 1);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onComplete)}>
      <Typography variant="h6" gutterBottom>
        Core Mechanics
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Add Mechanic"
          value={newMechanic}
          onChange={(e) => setNewMechanic(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddMechanic();
            }
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {mechanics.map((mechanic, index) => (
            <Chip
              key={index}
              label={mechanic}
              onDelete={() => handleDeleteMechanic(mechanic)}
            />
          ))}
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>
        Key Features
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Add Feature"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddFeature();
            }
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {features.map((feature, index) => (
            <Chip
              key={index}
              label={feature}
              onDelete={() => handleDeleteFeature(feature)}
            />
          ))}
        </Box>
      </Box>

      <Controller
        name="difficulty"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Difficulty</InputLabel>
            <Select {...field} label="Difficulty">
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
              <MenuItem value="adaptive">Adaptive</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>
          Estimated Game Length (hours)
        </Typography>
        <Controller
          name="gameLength"
          control={control}
          render={({ field }) => (
            <Slider
              {...field}
              min={1}
              max={100}
              valueLabelDisplay="auto"
              marks={[
                { value: 1, label: '1h' },
                { value: 25, label: '25h' },
                { value: 50, label: '50h' },
                { value: 100, label: '100h' },
              ]}
            />
          )}
        />
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default GameplayRequirements; 