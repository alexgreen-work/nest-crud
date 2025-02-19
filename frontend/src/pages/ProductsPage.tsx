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

  const queryParams: ProductQueryParams = {
    page,
    limit,
    sortBy,
    order,
    name: name || undefined,
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
    const nameValue = formData.get('name') as string;
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: '1',
      name: nameValue,
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
        <TextField
          name="name"
          label="Search by Name"
          defaultValue={name}
          variant="outlined"
          size="small"
          style={{ marginRight: 8 }}
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
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
                <TableCell>Actions</TableCell>
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
                        alt={product.name}
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
