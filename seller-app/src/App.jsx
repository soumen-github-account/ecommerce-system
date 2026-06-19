import React from 'react'
import AddProductPage from './pages/AddProductPage'
import { Toaster } from "sonner";
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Toaster richColors position="top-right" />

      <Routes>
        <Route path='/' element={<AddProductPage />}/>
      </Routes>
    </div>
  )
}

export default App
