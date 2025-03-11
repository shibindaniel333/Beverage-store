
import { useState, useEffect, Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { Box } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './components/Products'
import Categories from './components/Categories';
import Cart from './components/Cart'
import About from './components/About'
import SpecialOffers from './components/SpecialOffers';
import Contact from './components/Contact'
import Profile from './components/Profile'
import Wishlist from './components/Wishlist'
import SignUp from './components/SignUp'
import Login from './components/Login'
import LoadingScreen from './components/LoadingScreen'
import PageNotFound from './components/PageNotFound'
import ProductDetails from './components/ProductDetails';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './admin/AdminDashboard';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// In your Routes component
import { createAppTheme } from './theme'
import './App.css'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <PageNotFound />
  }
  return children
}

function App() {
  const location = useLocation();
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode')
    return savedMode || 'dark'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [location])

  const theme = createAppTheme(mode)

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar mode={mode} onThemeToggle={toggleTheme} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {isLoading && <LoadingScreen />}
        <Box sx={{ mt: 8, flex: 1 }}>
          <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><SpecialOffers /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orderhistory" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          </Suspense>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App
