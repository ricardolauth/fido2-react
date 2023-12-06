import { Button, Divider, Grid, IconButton, Paper, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useRef, useState } from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { JSONTree } from "react-json-tree";
import { AssertionOptions, AuthenticatorAssertionRawResponse, AuthenticatorAttestationRawResponse, User } from "../api";

type callbackFunc = () => void
type ValueType = {
    data: User | CredentialCreationOptions | AuthenticatorAttestationRawResponse | AssertionOptions | AuthenticatorAssertionRawResponse
    name: string
}

export type DebugContextType = {
    value: ValueType
    setValue: (val: ValueType) => void
    onContinue: callbackFunc | undefined
    isDebug: boolean
    isHolding: boolean
    setIsDebug: (val: boolean) => void
    waitUntilResume: () => Promise<void>
}

export const DebugContext = React.createContext<DebugContextType>(
    {
        value: { data: {}, name: 'Start Authentication or Registration' },
        onContinue: undefined,
        setValue: () => { },
        isDebug: false,
        isHolding: false,
        setIsDebug: () => { },
        waitUntilResume: () => Promise.resolve()

    })

export const DebugContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<any>({})
    const [isDebug, setIsDebug] = useState(false)
    const [isHolding, setIsHolding] = useState(false)
    const callbackRef = useRef<callbackFunc | undefined>(undefined)

    const handleWaitUntilResume = async () => {
        let fininish = false;
        // do silly stuff to await user actions in debug view
        async function sleep() {
            while (true) {
                if (fininish) return
                await new Promise(resolve => setTimeout(resolve, 100))
            }
        }

        callbackRef.current = () => {
            fininish = true
        }
        setIsHolding(true)

        await sleep()

        callbackRef.current = undefined
        setIsHolding(false)
    }

    useEffect(() => {
        console.log("debugCo", state)
    }, [state])

    return (
        <DebugContext.Provider value={{ value: state, setValue: val => setState(val), onContinue: callbackRef.current, isHolding: isHolding, isDebug: isDebug, setIsDebug: val => setIsDebug(val), waitUntilResume: handleWaitUntilResume }} >
            {children}
        </DebugContext.Provider>
    )
}

interface DrawerProps {
    context: DebugContextType
}

export const DebugDrawer = ({ context }: DrawerProps) => {
    return (
        <Grid container width='max-content' height='max-content' overflow='hidden'>
            <Grid container flexDirection='row' justifyContent='flex-end' px={1} py={1} width='100vw' height='fit-content' alignItems='center' gap={2}>
                <Button onClick={() => context.onContinue!()} startIcon={<ArrowRightIcon fontSize="large" />} disabled={!context.isHolding}>
                    Continue
                </Button>
                <Typography>{context.value.name}</Typography>
                <IconButton onClick={() => context.setIsDebug(false)} sx={{ height: '48px', width: '48px' }}>
                    <CloseIcon />
                </IconButton>
                <Divider />
            </Grid>
            <Grid item sx={{ width: '100vw', height: '35vh', overflowX: 'hidden', overflowY: 'scroll' }} component={
                Paper
            }>
                <JSONTree data={context.value.data} />
            </Grid>
        </Grid>
    )
}