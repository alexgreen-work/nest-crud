import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sku: string;
  photo?: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  sku?: string;
  photo?: string;
}

export interface PaginatedProducts {
  data: Product[];
  count: number;
}

export const fetchProducts = async (
  params: ProductQueryParams,
): Promise<PaginatedProducts> => {
  const response = await axios.get<PaginatedProducts>(`${API_URL}/products`, {
    params,
  });
  return response.data;
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/products/${id}`);
  return response.data;
};

export const createProduct = async (data: FormData): Promise<Product> => {
  const response = await axios.post<Product>(`${API_URL}/products`, data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: FormData,
): Promise<Product> => {
  const response = await axios.put<Product>(`${API_URL}/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/products/${id}`);
};
