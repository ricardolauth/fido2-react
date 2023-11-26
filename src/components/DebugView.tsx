import { Button, Divider, Grid, IconButton, Paper, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useRef, useState } from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { JSONTree } from "react-json-tree";
import './json.css'

type func = (value: any) => void
type callbackFunc = () => void

export type DebugContextType = {
    value: any
    setValue: func
    setOnContinue: (callback: callbackFunc | undefined) => void
    onContinue: callbackFunc | undefined
    isDebug: boolean
    setIsDebug: (val: boolean) => void
}

export const DebugContext = React.createContext<DebugContextType>(
    {
        value: {},
        onContinue: undefined,
        setValue: () => { },
        setOnContinue: () => { },
        isDebug: false,
        setIsDebug: () => { }
    })

export const DebugContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<any>({})
    const [isDebug, setIsDebug] = useState(false)
    const callbackRef = useRef<callbackFunc | undefined>(undefined)

    const handleCallback = (callback: callbackFunc | undefined) => {
        callbackRef.current = callback
    }

    useEffect(() => {
        console.log("debugCo", state)
    }, [state])

    return (
        <DebugContext.Provider value={{ value: state, setValue: val => setState(val), onContinue: callbackRef.current, setOnContinue: handleCallback, isDebug: isDebug, setIsDebug: val => setIsDebug(val) }} >
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
            <Grid item flexDirection='row' justifyContent='space-between' px={2} py={1} width='100vw' height='fit-content'>
                {context.onContinue !== undefined && (
                    <Button onClick={() => context.onContinue!()} startIcon={<ArrowRightIcon fontSize="large" />}>
                        Continue
                    </Button>
                )}
                {context.onContinue === undefined && (
                    <Typography variant="body1">Info: Start authentication/registration</Typography>
                )}
                <IconButton onClick={() => context.setIsDebug(false)} sx={{ height: '48px', width: '48px' }}>
                    <CloseIcon />
                </IconButton>
                <Divider />
            </Grid>
            <Grid item sx={{ width: '100vw', height: '35vh', overflowX: 'hidden', overflowY: 'scroll' }} component={
                Paper
            }>
                <JSONTree data={context.value} />
            </Grid>
        </Grid>
    )
}