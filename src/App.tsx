import { ThemeProvider } from '@emotion/react'
import { CssBaseline, Fab, Grid, createTheme } from '@mui/material'
import { AuthProvider } from './components/auth/AuthProvider'
import Unauthorized from './components/auth/Unauthorized'
import Authorized from './components/auth/Authorized'
import SignInSide from './components/SignInSide'
import { SnackbarProvider } from 'notistack'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import SignUpSide from './components/SignUpSide'
import { useEffect, useState } from 'react'
import { DebugContext, DebugContextProvider, DebugDrawer } from './components/DebugView'
import AdbIcon from '@mui/icons-material/Adb';

function App() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const lightTheme = createTheme();
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })
  const router = createBrowserRouter([
    {
      path: "/signin",
      element:
        <>
          <Unauthorized>
            <SignInSide />
          </Unauthorized>
          <Authorized>
            <Navigate to='/dashboard' />
          </Authorized>
        </>

    },
    {
      path: "/signup",
      element:
        <>
          <Unauthorized>
            <SignUpSide />
          </Unauthorized>
          <Authorized>
            <Navigate to='/dashboard' />
          </Authorized>
        </>,
    },
    {
      path: "/",
      element:
        <>
          <Unauthorized>
            <Navigate to='/signup' />
          </Unauthorized>
          <Authorized>
            <Navigate to='/dashboard' />
          </Authorized>
        </>
      ,
    },
    {
      path: "/dashboard",
      element:
        <>
          <Unauthorized>
            <Navigate to='/signin' />
          </Unauthorized>
          <Authorized>
            <Dashboard />
          </Authorized>,

        </>

    },
  ]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      // dark mode
      setMode('light')
    }
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        const colorScheme = event.matches ? "dark" : "light";
        console.log(colorScheme); // "dark" or "light"
        setMode(colorScheme);
      });
  }, []);

  return (
    <>
      <ThemeProvider theme={mode == 'dark' ? darkTheme : lightTheme}>
        <SnackbarProvider preventDuplicate />
        <AuthProvider>
          <Grid container component="main" sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <CssBaseline />
            <DebugContextProvider>
              <RouterProvider router={router} />
              <DebugContext.Consumer>
                {ctx => (
                  <>
                    {ctx.isDebug && (<DebugDrawer context={ctx} />)}
                    {!ctx.isDebug && (
                      <Fab sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                      }} color="secondary" aria-label="debug" onClick={() => ctx.setIsDebug(true)} >
                        <AdbIcon />
                      </Fab>
                    )}
                  </>
                )}

              </DebugContext.Consumer>
            </DebugContextProvider>
          </Grid>
        </AuthProvider>
      </ThemeProvider>

    </>
  )
}

export default App
