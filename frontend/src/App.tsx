import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CreateProductForm from './pages/CreateProductForm';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/products/new" element={<CreateProductForm />} />
      <Route path="/products/:id/edit" element={<CreateProductForm />} />
      <Route path="/products/:id" element={<ProductPage />} />
    </Routes>
  );
};

export default App;
