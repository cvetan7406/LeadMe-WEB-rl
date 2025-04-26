
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import VuiBox from '../../../../components/VuiBox';
import VuiTypography from '../../../../components/VuiTypography';
import { TextField, Button } from '@mui/material';


export default function Subscribe() {
  const theme = useTheme();

  return (
    <VuiBox
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(4),
      }}    
    >
    <Grid container justifyContent="center" style={{ padding: '20px' }}>
        <Grid item xs={12} sm={6}>
          <VuiBox style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <VuiTypography variant="h5" color="white" gutterBottom>
              Subscribe to our Newsletter
            </VuiTypography>
            <form noValidate autoComplete="off">
              <TextField
                variant="outlined"
                placeholder="Enter your email"
                fullWidth
                margin="normal"
                InputProps={{
                  style: { backgroundColor: 'white', borderRadius: '5px' }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '10px' }}
              >
                Subscribe
              </Button>
            </form>
          </VuiBox>
        </Grid>
      </Grid>
    </VuiBox>
  );
}


