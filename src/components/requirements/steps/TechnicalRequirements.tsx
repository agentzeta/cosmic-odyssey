import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TechnicalData } from '../../../types/requirements';

interface TechnicalRequirementsProps {
  data?: TechnicalData;
  onComplete: (data: TechnicalData) => void;
  onBack: () => void;
}

const PLATFORMS = [
  'Windows',
  'macOS',
  'Linux',
  'iOS',
  'Android',
  'Web',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
];

const ENGINES = [
  'Unity',
  'Unreal Engine',
  'Godot',
  'Custom Engine',
  'Web Technologies',
];

const TechnicalRequirements: React.FC<TechnicalRequirementsProps> = ({
  data,
  onComplete,
  onBack,
}) => {
  const { control, handleSubmit, watch } = useForm<TechnicalData>({
    defaultValues: data || {
      platforms: [],
      engine: '',
      minimumRequirements: {
        cpu: '',
        gpu: '',
        ram: '',
        storage: '',
      },
      networkFeatures: {
        multiplayer: false,
        cloudSave: false,
        leaderboards: false,
      },
      accessibility: {
        colorblindMode: false,
        textToSpeech: false,
        customControls: false,
      },
      additionalFeatures: [],
    },
  });

  const [newFeature, setNewFeature] = React.useState('');
  const features = watch('additionalFeatures');

  const handleAddFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      features.push(newFeature.trim());
      setNewFeature('');
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
        Platforms & Engine
      </Typography>

      <Controller
        name="platforms"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Target Platforms</InputLabel>
            <Select
              {...field}
              multiple
              label="Target Platforms"
              renderValue={(selected: string[]) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {PLATFORMS.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="engine"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Game Engine</InputLabel>
            <Select {...field} label="Game Engine">
              {ENGINES.map((engine) => (
                <MenuItem key={engine} value={engine}>
                  {engine}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Minimum System Requirements
        </Typography>
        
        <Controller
          name="minimumRequirements.cpu"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="CPU Requirements"
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="minimumRequirements.gpu"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="GPU Requirements"
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="minimumRequirements.ram"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="RAM Requirements"
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="minimumRequirements.storage"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Storage Requirements"
              fullWidth
              margin="normal"
            />
          )}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Network Features
        </Typography>
        
        <Controller
          name="networkFeatures.multiplayer"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Multiplayer Support"
            />
          )}
        />

        <Controller
          name="networkFeatures.cloudSave"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Cloud Save"
            />
          )}
        />

        <Controller
          name="networkFeatures.leaderboards"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Leaderboards"
            />
          )}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Accessibility Features
        </Typography>
        
        <Controller
          name="accessibility.colorblindMode"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Colorblind Mode"
            />
          )}
        />

        <Controller
          name="accessibility.textToSpeech"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Text-to-Speech"
            />
          )}
        />

        <Controller
          name="accessibility.customControls"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Custom Controls"
            />
          )}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Additional Technical Features
        </Typography>
        
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

export default TechnicalRequirements; 