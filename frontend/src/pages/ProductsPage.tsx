import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product, ProductQueryParams } from '../api/products';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  TableSortLabel,
} from '@mui/material';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const sortBy = searchParams.get('sortBy') || 'id';
  const order = (searchParams.get('order') || 'ASC') as 'ASC' | 'DESC';

  const name = searchParams.get('name') || '';
  const description = searchParams.get('description') || '';
  const sku = searchParams.get('sku') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const minDiscountPrice = searchParams.get('minDiscountPrice') || '';
  const maxDiscountPrice = searchParams.get('maxDiscountPrice') || '';

  const queryParams: ProductQueryParams = {
    page,
    limit,
    sortBy,
    order,
    name: name || undefined,
    description: description || undefined,
    sku: sku || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minDiscountPrice: minDiscountPrice ? Number(minDiscountPrice) : undefined,
    maxDiscountPrice: maxDiscountPrice ? Number(maxDiscountPrice) : undefined,
  };

  const { data, isLoading, error } = useQuery(
    ['products', queryParams],
    () => fetchProducts(queryParams),
    { keepPreviousData: true }
  );

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: '1',
      name: (formData.get('name') as string) || '',
      description: (formData.get('description') as string) || '',
      sku: (formData.get('sku') as string) || '',
      minPrice: (formData.get('minPrice') as string) || '',
      maxPrice: (formData.get('maxPrice') as string) || '',
      minDiscountPrice: (formData.get('minDiscountPrice') as string) || '',
      maxDiscountPrice: (formData.get('maxDiscountPrice') as string) || '',
    });
  };

  const handleClearFilters = () => {
    setSearchParams({
      page: '1',
      limit: limit.toString(),
    });
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: (newPage + 1).toString(),
    });
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      limit: event.target.value,
      page: '1',
    });
  };

  const handleSort = (column: string) => {
    const currentSortBy = searchParams.get('sortBy') || 'id';
    const currentOrder = searchParams.get('order') || 'ASC';
    let newOrder: 'ASC' | 'DESC' = 'ASC';
    if (currentSortBy === column) {
      newOrder = currentOrder === 'ASC' ? 'DESC' : 'ASC';
    }
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      sortBy: column,
      order: newOrder,
      page: '1',
    });
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
        <h1>Products</h1>
        <Button variant="contained" onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </Box>
      <form onSubmit={handleSearch} style={{ marginTop: 16, marginBottom: 16 }}>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            name="name"
            label="Search by Name"
            defaultValue={name}
            variant="outlined"
            size="small"
          />
          <TextField
            name="description"
            label="Search by Description"
            defaultValue={description}
            variant="outlined"
            size="small"
          />
          <TextField
            name="sku"
            label="Search by SKU"
            defaultValue={sku}
            variant="outlined"
            size="small"
          />
          <TextField
            name="minPrice"
            label="Min Price"
            defaultValue={minPrice}
            variant="outlined"
            size="small"
            type="number"
          />
          <TextField
            name="maxPrice"
            label="Max Price"
            defaultValue={maxPrice}
            variant="outlined"
            size="small"
            type="number"
          />
          <TextField
            name="minDiscountPrice"
            label="Min Discount Price"
            defaultValue={minDiscountPrice}
            variant="outlined"
            size="small"
            type="number"
          />
          <TextField
            name="maxDiscountPrice"
            label="Max Discount Price"
            defaultValue={maxDiscountPrice}
            variant="outlined"
            size="small"
            type="number"
          />
        </Box>
        <Box display="flex" marginTop={2} gap={2}>
          <Button type="submit" variant="contained">
            Search
          </Button>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching products</p>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'id'}
                    direction={sortBy === 'id' ? order.toLowerCase() as 'asc' | 'desc' : 'asc'}
                    onClick={() => handleSort('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'name'}
                    direction={sortBy === 'name' ? order.toLowerCase() as 'asc' | 'desc' : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'description'}
                    direction={sortBy === 'description' ? order.toLowerCase() as 'asc' | 'desc' : 'asc'}
                    onClick={() => handleSort('description')}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'price'}
                    direction={sortBy === 'price' ? order.toLowerCase() as 'asc' | 'desc' : 'asc'}
                    onClick={() => handleSort('price')}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'discountPrice'}
                    direction={sortBy === 'discountPrice' ? order.toLowerCase() as 'asc' | 'desc' : 'asc'}
                    onClick={() => handleSort('discountPrice')}
                  >
                    Discount Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'sku'}
                    direction={sortBy === 'sku' ? order.toLowerCase() as 'asc' | 'desc' : 'asc'}
                    onClick={() => handleSort('sku')}
                  >
                    SKU
                  </TableSortLabel>
                </TableCell>
                <TableCell>Photo</TableCell>
                <TableCell width={200}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.discountPrice}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    {product.photo && (
                      <img
                        src={`http://localhost:3000/uploads/${product.photo}`}
                        alt={`${product.name} photo`}
                        width={50}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                      style={{ marginLeft: 8 }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data?.count || 0}
            page={page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={limit}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
    </Container>
  );
};

export default ProductsPage;
