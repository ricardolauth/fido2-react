import { useEffect, useState } from "react"
import { ApiError, MeService, OpenAPI, User } from "../api"
import { enqueueSnackbar } from "notistack"
import { Box, CircularProgress, Divider, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { AuthContext } from "./auth/AuthProvider"
import React from "react"
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
    const [user, setUser] = useState<User | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const ctx = React.useContext(AuthContext)

    const handleDeleteCredential = async (id: string) => {
        try {
            await MeService.deleteMyCredentialAsync(id)
        } catch (e) {
            const error = e as ApiError
            enqueueSnackbar(error.message, { variant: 'error' })
            return
        }
        setUser({ ...user, credentials: user?.credentials?.filter(c => c.id !== id) })
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
            {isLoading && (
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>)}
            {!isLoading && user && (

                <Stack flexDirection='column' justifyContent='space-around' padding={8}>
                    <Typography variant="h3">{`Hallo, ${user.displayName}.`}</Typography>
                    <Stack flexDirection='column' justifyContent='space-evenly'>
                        <Typography variant="h5">{`Diese Passkeys sind für ${user.username} registriert:`}</Typography>
                        {/*<Stack flexDirection='row' justifyContent='space-evenly' width='100vw'>
                            <Typography>Id</Typography>
                            <Typography>aaGuid</Typography>
                            <Typography>credType</Typography>
                            <Typography>regDate</Typography>
                            <Typography>signatureCounter</Typography>
                        </Stack>
                        <Stack flexDirection='column' justifyContent='space-evenly' width='100vw'>
                            {user.credentials?.map(credential => (
                                <Stack flexDirection='row' justifyContent='space-evenly' width='100vw'>
                                    <Typography >{`${credential.id?.slice(0, 15)}...`}</Typography>
                                    <Typography >{credential.aaGuid}</Typography>
                                    <Typography >{credential.credType}</Typography>
                                    <Typography >{credential.regDate}</Typography>
                                    <Typography >{credential.signatureCounter}</Typography>

                                </Stack>
                            ))}
                            </Stack>*/}
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Id</TableCell>
                                        <TableCell align="right">aaGuid</TableCell>
                                        <TableCell align="right">credType</TableCell>
                                        <TableCell align="right">regDate</TableCell>
                                        <TableCell align="right">signatureCounter</TableCell>
                                        <TableCell align="right" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {user.credentials?.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="right">{row.id}</TableCell>
                                            <TableCell align="right">{row.aaGuid}</TableCell>
                                            <TableCell align="right">{row.credType}</TableCell>
                                            <TableCell align="right">{row.regDate}</TableCell>
                                            <TableCell align="right">{row.signatureCounter}</TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => handleDeleteCredential(row.id!)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Stack >
            )}
        </>
    )
}

export default Dashboard