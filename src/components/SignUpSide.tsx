import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { AuthContext } from './auth/AuthProvider';
import { makeCredentialOptions, parseCredentialCreattionOptions, registerNewCredential } from '../utils/register';
import { enqueueSnackbar } from 'notistack';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignUpSide() {
  const ctx = React.useContext(AuthContext)

  async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // send to server for registering
    const user = { displayName: data.get('name')?.toString(), username: data.get('username')?.toString() }


    const credentialCreationOptions = await makeCredentialOptions(user)
    if (!credentialCreationOptions) {
      return
    }

    let newCredential;
    try {
      newCredential = await navigator.credentials.create({
        publicKey: parseCredentialCreattionOptions(credentialCreationOptions)
      });
    } catch (e) {
      var msg = "Could not create credentials in browser. Probably because the username is already registered with your authenticator. Please change username or authenticator."
      console.error(msg, e);
      //showErrorAlert(msg, e);
      enqueueSnackbar("Could not create credentials in browser.", { variant: 'error' })
    }

    const token = await registerNewCredential(newCredential as PublicKeyCredential);
    if (token !== undefined && token !== null && token.length > 0) {
      enqueueSnackbar(`Public-Key-Credential created.`, { variant: 'success' })
      ctx.handleSignIn(token)
    }
  }

  return (
    <>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        lg={9}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} lg={3} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleRegisterSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              name="name"
              label="Display Name"
              type="text"
              id="name"
              autoComplete="name"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </>
  );
}