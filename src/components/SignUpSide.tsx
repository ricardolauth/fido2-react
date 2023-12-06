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
import { makeCredentialOptions, parseAuthenticatorAttestationRawResponse, parseCredentialCreattionOptions, registerNewCredential } from '../utils/register';
import { enqueueSnackbar } from 'notistack';
import { DebugContext } from './DebugView';
import { useEffect } from 'react';

export default function SignUpSide() {
  const ctx = React.useContext(AuthContext)
  const debug = React.useContext(DebugContext)

  useEffect(() => {
    debug.setValue({ data: {}, name: 'fill out registration form and submit to begin debugging' })
  }, [])

  async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // send to server for registering
    const user = { displayName: data.get('name')?.toString(), username: data.get('username')?.toString() }


    if (debug.isDebug) {
      debug.setValue({ data: user, name: 'User' })
      await debug.waitUntilResume()
    }

    let credentialCreationOptions = await makeCredentialOptions(user)
    if (!credentialCreationOptions) {
      return
    }


    if (debug.isDebug) {
      debug.setValue({ data: credentialCreationOptions, name: 'credentialCreationOptions' })
      await debug.waitUntilResume()
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

    const parsedResponse = parseAuthenticatorAttestationRawResponse(newCredential as PublicKeyCredential)

    if (debug.isDebug) {
      debug.setValue({ data: parsedResponse, name: 'AuthenticatorAttestationResponse' })
      await debug.waitUntilResume()
    }

    debug.setValue({ data: {}, name: 'register a new credential to continue' })
    debug.setIsDebug(false)

    const token = await registerNewCredential(parsedResponse);
    if (token !== undefined && token !== null && token.length > 0) {
      enqueueSnackbar(`Public-Key-Credential created.`, { variant: 'success' })
      ctx.signIn(token)
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
                <Link href="/signin" variant="body2">
                  {"Have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <Link variant="body2" target='blank' href="https://github.com/ricardolauth">
                  {"github.com/ricardolauth"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </>
  );
}