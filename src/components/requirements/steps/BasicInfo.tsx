import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { BasicInfoData } from '../../../types/requirements';

interface BasicInfoProps {
  data?: BasicInfoData;
  onComplete: (data: BasicInfoData) => void;
}

const GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
  'Puzzle',
  'Platform',
  'Horror',
  'Educational'
];

const TARGET_AUDIENCES = [
  'Children',
  'Teenagers',
  'Young Adults',
  'Adults',
  'All Ages'
];

const BasicInfo: React.FC<BasicInfoProps> = ({ data, onComplete }) => {
  const { control, handleSubmit } = useForm<BasicInfoData>({
    defaultValues: data || {
      title: '',
      genre: '',
      targetAudience: '',
      description: ''
    }
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onComplete)}>
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title is required' }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Game Title"
            fullWidth
            margin="normal"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="genre"
        control={control}
        rules={{ required: 'Genre is required' }}
        render={({ field, fieldState }) => (
          <FormControl fullWidth margin="normal" error={!!fieldState.error}>
            <InputLabel>Genre</InputLabel>
            <Select {...field} label="Genre">
              {GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="targetAudience"
        control={control}
        rules={{ required: 'Target audience is required' }}
        render={({ field, fieldState }) => (
          <FormControl fullWidth margin="normal" error={!!fieldState.error}>
            <InputLabel>Target Audience</InputLabel>
            <Select {...field} label="Target Audience">
              {TARGET_AUDIENCES.map((audience) => (
                <MenuItem key={audience} value={audience}>
                  {audience}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{ required: 'Description is required' }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Game Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default BasicInfo; 