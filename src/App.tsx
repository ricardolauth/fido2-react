import { ThemeProvider } from '@emotion/react'
import { CssBaseline, Grid, createTheme } from '@mui/material'
import { AuthProvider } from './components/auth/AuthProvider'
import Unauthorized from './components/auth/Unauthorized'
import SignUpSide from './components/SignUpSide'
import Authorized from './components/auth/Authorized'
import SignInSide from './components/SignInSide'

function App() {
  const defaultTheme = createTheme();

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <AuthProvider>
          <Grid container component="main" sx={{ height: '100vh', width: '100vw' }}>
            <CssBaseline />
            <Unauthorized>
              {// <SignUpSide />
              }
              <SignInSide />
            </Unauthorized>
            <Authorized>
              <h1>YOUR ARE SIGNED IN</h1>
            </Authorized>
          </Grid>
        </AuthProvider>
      </ThemeProvider>

    </>
  )
}

export default App
