import { ThemeProvider } from '@emotion/react'
import { CssBaseline, Grid, createTheme } from '@mui/material'
import { AuthProvider } from './components/auth/AuthProvider'
import Unauthorized from './components/auth/Unauthorized'
import Authorized from './components/auth/Authorized'
import SignInSide from './components/SignInSide'
import { SnackbarProvider } from 'notistack'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import SignUpSide from './components/SignUpSide'

function App() {
  const defaultTheme = createTheme();
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
        <Authorized>
          <Dashboard />
        </Authorized>,
    },
  ]);


  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <SnackbarProvider />
        <AuthProvider>
          <Grid container component="main" sx={{ height: '100vh', width: '100vw' }}>
            <CssBaseline />
            <RouterProvider router={router} />
          </Grid>
        </AuthProvider>
      </ThemeProvider>

    </>
  )
}

export default App
