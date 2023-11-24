import { ThemeProvider } from '@emotion/react'
import { CssBaseline, Grid, createTheme } from '@mui/material'
import { AuthProvider } from './components/auth/AuthProvider'
import Unauthorized from './components/auth/Unauthorized'
import SignUpSide from './components/SignUpSide'

function App() {
  const defaultTheme = createTheme();

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <AuthProvider>
          <Grid container component="main" sx={{ height: '100vh', width: '100vw' }}>
            <CssBaseline />
            <Unauthorized>
              <SignUpSide />
            </Unauthorized>
          </Grid>
        </AuthProvider>
      </ThemeProvider>

    </>
  )
}

export default App
