import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Slider,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { AudioData } from '../../../types/requirements';

interface AudioRequirementsProps {
  data?: AudioData;
  onComplete: (data: AudioData) => void;
  onBack: () => void;
}

const MUSIC_GENRES = [
  'Orchestral',
  'Electronic',
  'Rock',
  'Jazz',
  'Ambient',
  'Folk',
  'Hip Hop',
  'Retro/Chiptune',
  'Mixed',
];

const AudioRequirements: React.FC<AudioRequirementsProps> = ({
  data,
  onComplete,
  onBack,
}) => {
  const { control, handleSubmit } = useForm<AudioData>({
    defaultValues: data || {
      musicStyle: '',
      adaptiveMusic: false,
      soundEffects: {
        quantity: 50,
        complexity: 'medium',
      },
      voiceActing: false,
      languages: [],
      customAudioNotes: '',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onComplete)}>
      <Typography variant="h6" gutterBottom>
        Music
      </Typography>
      
      <Controller
        name="musicStyle"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Music Style</InputLabel>
            <Select {...field} label="Music Style">
              {MUSIC_GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="adaptiveMusic"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label="Include adaptive/dynamic music system"
          />
        )}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Sound Effects
        </Typography>
        
        <Typography gutterBottom>
          Estimated Number of Sound Effects
        </Typography>
        <Controller
          name="soundEffects.quantity"
          control={control}
          render={({ field }) => (
            <Slider
              {...field}
              min={10}
              max={500}
              step={10}
              valueLabelDisplay="auto"
              marks={[
                { value: 10, label: '10' },
                { value: 250, label: '250' },
                { value: 500, label: '500' },
              ]}
            />
          )}
        />

        <Controller
          name="soundEffects.complexity"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>Sound Effect Complexity</InputLabel>
              <Select {...field} label="Sound Effect Complexity">
                <MenuItem value="simple">Simple</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="complex">Complex</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Voice Acting
        </Typography>
        
        <Controller
          name="voiceActing"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Include voice acting"
            />
          )}
        />

        <Controller
          name="languages"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" disabled={!control._getWatch('voiceActing')}>
              <InputLabel>Languages</InputLabel>
              <Select
                {...field}
                multiple
                label="Languages"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Controller
        name="customAudioNotes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Additional Audio Notes"
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        )}
      />

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

export default AudioRequirements; 