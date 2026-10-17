import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './components/Routes/Routes.jsx'
import AuthProvider from './providers/AuthProvider.jsx'
import {
  RouterProvider,
} from "react-router-dom";



import {
  QueryClient,
  QueryClientProvider,
  
} from '@tanstack/react-query'


const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
