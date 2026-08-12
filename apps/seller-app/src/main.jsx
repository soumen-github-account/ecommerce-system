// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'
// import { ProductProvider } from './contexts/ProductContext.jsx'

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <ProductProvider>
//       <App />
//     </ProductProvider>
//   </BrowserRouter>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ProductProvider } from './contexts/ProductContext.jsx'

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { SellerProvider } from './contexts/SellerContext.jsx'
import "leaflet/dist/leaflet.css";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProductProvider>
          <SellerProvider>
            <App />
          </SellerProvider>
        </ProductProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)