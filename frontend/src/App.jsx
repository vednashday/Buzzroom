
import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import OnBoardingPage from './pages/OnBoardingPage'
import NotificationPage from './pages/NotificationPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import { Toaster } from 'react-hot-toast'

import PageLoader from './components/PageLoader'

import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore'
import SearchPage from './pages/SearchPage'

function App() {

  const {isLoading,authUser} = useAuthUser();
  const {theme} = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if(isLoading) return <PageLoader/>;

  return (
    
      <div className='h-screen' data-theme={theme}>
        
        <Routes>
          <Route path='/' element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><HomePage/></Layout>) : (<Navigate to={!isAuthenticated ? "/login":"/onboarding"}/>)} />
          <Route path='/signup' element={!isAuthenticated ? <SignUpPage/> : <Navigate to="/" />} />
          <Route path='/login' element={!isAuthenticated ? <LoginPage/> : <Navigate to={isOnboarded ? "/":"/"} />} />
          <Route path='/notifications' element={isAuthenticated ? (<Layout showSidebar > <NotificationPage/> </Layout>) : (<Navigate to="/login" />)} />
          <Route path='/call/:id' element={isAuthenticated ? (<Layout showSidebar><CallPage/></Layout>) : (<Navigate to="/login" />)} />
          <Route path='/search' element={isAuthenticated ? (<Layout showSidebar><SearchPage/></Layout>) : <Navigate to="/login" />} />         
          <Route path='/chat/:id' element={isAuthenticated ? (<Layout showSidebar><ChatPage/></Layout>) : (<Navigate to="/login" />)} />
          <Route path='/onboarding' element={isAuthenticated ? (
            !isOnboarded ? (
            <OnBoardingPage/>
            ):(
            <Navigate to={'/'}/>
            )
            ):(
              <Navigate to={'/login'} />
            )} />

        </Routes>

        <Toaster />
      </div>
    
  )
}

export default App
