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
import { isConditionalMediationAvailable } from '../utils/helpers';
import { getAssertionOptions, parseAssertionOptions, parseAssertionResponse, postAssertedCredential } from '../utils/login';
import { useEffect, useState } from 'react';
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

export default function SignInSide() {
    // if the user don't want to use the conditional approach, we use this controller to abort the webauthn api call
    const [abortController, setAbortController] = useState<AbortController | undefined>()
    const [isOngoing, setIsOnGoing] = useState(false)
    const ctx = React.useContext(AuthContext)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (abortController)
            abortController.abort("Modal Flow is used");

        const data = new FormData(event.currentTarget);

        try {
            const username: string | undefined = data.get('username')?.toString()
            let requestOptions = await getAssertionOptions(username);

            if (!requestOptions) {
                return;
            }

            let credential;
            try {
                credential = await navigator.credentials.get({
                    publicKey: await parseAssertionOptions(requestOptions)
                });
            } catch (e) {
                enqueueSnackbar("Something went wrong while looking up your passkey", { variant: 'error' })
                return;
            }


            if (credential == null) {
                enqueueSnackbar("Could not find the credential on your device", { variant: 'error' })
                return;
            }

            const token = await postAssertedCredential(parseAssertionResponse(credential as PublicKeyCredential))
            if (!token) {
                enqueueSnackbar("Could not retrive a valid token", { variant: 'error' })
                return;
            }

            enqueueSnackbar("open sesame!", { variant: 'success' })
            ctx.handleSignIn(token)


        } catch (error) {
            console.error(error);
        }
    }

    const handleConditional = async () => {
        const isConditionalAvailable = await isConditionalMediationAvailable()
        if (!isConditionalAvailable) {
            return;
        }

        if (abortController) return

        const requestOptions = await getAssertionOptions()
        if (!requestOptions) {
            return
        }

        const controller = new AbortController()
        setAbortController(controller)
        // this is a blocking call: see webauthn spec
        let credential
        try {
            credential = await navigator.credentials.get({
                publicKey: await parseAssertionOptions(requestOptions),
                mediation: "conditional",
                signal: controller.signal
            });
        } finally {
            setAbortController(undefined)
        }

        if (credential == null) {
            enqueueSnackbar("Could not find the credential on your device", { variant: 'error' })
            return
        }

        const token = await postAssertedCredential(parseAssertionResponse(credential as PublicKeyCredential))
        if (!token) {
            enqueueSnackbar("Could not retrive a valid token", { variant: 'error' })
            return
        }

        enqueueSnackbar("open sesame!", { variant: 'success' })
        ctx.handleSignIn(token)
    }

    useEffect(() => {
        return () => {
            if (abortController)
                abortController.abort("component unmount")
        }
    }, [abortController])

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
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            name="username"
                            type="text"
                            id="username-field"
                            autoComplete="username webauthn"
                            autoFocus
                            onFocus={handleConditional}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign up"}
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