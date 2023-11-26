import { useEffect, useState } from "react"
import { ApiError, MeService, OpenAPI, User } from "../api"
import { enqueueSnackbar } from "notistack"
import { Box, Button, Card, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { AuthContext } from "./auth/AuthProvider"
import React from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from "react-router-dom"
import { makeCredentialOptions, parseCredentialCreattionOptions, registerNewCredential } from "../utils/register"

const Dashboard = () => {
    const [user, setUser] = useState<User | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const ctx = React.useContext(AuthContext)
    const navigate = useNavigate()

    const handleDeleteCredential = async (id: string) => {
        try {
            await MeService.deleteMyCredentialAsync(encodeURIComponent(id))
        } catch (e) {
            const error = e as ApiError
            enqueueSnackbar(error.message, { variant: 'error' })
            return
        }
        setUser({ ...user, credentials: user?.credentials?.filter(c => c.id !== id) })
    }

    const handleLogout = () => {
        ctx.logout()
        navigate("/signin")
    }

    async function handleAddPasskey() {
        // send to server for registering
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
            console.error(e)
            enqueueSnackbar("Could not create credentials in browser.", { variant: 'error' })
        }

        const token = await registerNewCredential(newCredential as PublicKeyCredential);
        if (token !== undefined && token !== null && token.length > 0) {
            enqueueSnackbar(`Public-Key-Credential created.`, { variant: 'success' })
            setIsLoading(true)
            OpenAPI.TOKEN = ctx.token ?? undefined
            MeService.meAsync()
                .then(res => setUser(res))
                .catch(e => {
                    const error = e as ApiError
                    enqueueSnackbar(error.message, { variant: 'error' })
                })

            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await MeService.deleteMeAsync()
        } catch (e) {
            const error = e as ApiError
            enqueueSnackbar(error.message, { variant: 'error' })
            return
        }

        ctx.logout()
        navigate('/signup')
    }


    useEffect(() => {
        setIsLoading(true)
        OpenAPI.TOKEN = ctx.token ?? undefined
        MeService.meAsync()
            .then(res => setUser(res))
            .catch(e => {
                const error = e as ApiError
                enqueueSnackbar(error.message, { variant: 'error' })
            })

        setIsLoading(false)
    }, [ctx.token])

    return (
        <>
            {!isLoading && user && (
                <Grid container flexDirection='column' justifyContent='space-evenly'>
                    <Grid container flexDirection='column' justifyContent='space-evenly' alignItems='flex-start' padding={4}>
                        <Grid item>
                            <Typography variant="h2">{`Hi, ${user.displayName}.`}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">{`We have saved these passkeys for your account ${user.username}:`}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item justifyContent='flex-start' alignSelf='center'>
                        <TableContainer component={Card} sx={{ width: 'fit-content' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Credential Id</TableCell>
                                        <TableCell align="left">Authenticator Attestation GUID (AAGUID)</TableCell>
                                        <TableCell align="left">Credential Type</TableCell>
                                        <TableCell align="left">Registration Date</TableCell>
                                        <TableCell align="left">Signature Counter</TableCell>
                                        <TableCell align="left">Public Key</TableCell>
                                        <TableCell align="left" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {user.credentials?.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">{
                                                <Box sx={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {row.id}
                                                </Box>}</TableCell>
                                            <TableCell align="left">{
                                                <Box sx={{ overflow: 'hidden', overflowWrap: 'anywhere' }}>
                                                    {row.aaGuid}
                                                </Box>
                                            }</TableCell>
                                            <TableCell align="left">{row.credType}</TableCell>
                                            <TableCell align="left">{(new Date(row.regDate!)).toDateString()}</TableCell>
                                            <TableCell align="right">{row.signatureCounter}</TableCell>
                                            <TableCell align="left">{
                                                <Box sx={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {row.publicKey}
                                                </Box>
                                            }</TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => handleDeleteCredential(row.id!)} color="error" disabled={user.credentials!.length === 1}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid container gap={2} justifyContent='flex-end' padding={2}>
                        <Grid item>
                            <Button startIcon={<DeleteIcon />} color="error" onClick={handleDeleteAccount}>
                                Account
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button startIcon={<VpnKeyIcon />} onClick={handleAddPasskey}>
                                Add Passkey
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button startIcon={<LogoutIcon />} onClick={handleLogout}>
                                Logout
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export default Dashboard