import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProduct, deleteProduct, Product } from '../api/products';
import { Container, Button, Typography, Box } from '@mui/material';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading, error } = useQuery<Product>(
    ['product', id],
    () => fetchProduct(Number(id)),
    { enabled: !!id }
  );

  const deleteMutation = useMutation(() => deleteProduct(Number(id)), {
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      navigate('/');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) return <Container>Loading...</Container>;
  if (error || !product) return <Container>Error loading product.</Container>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="body1">{product.description}</Typography>
      <Typography variant="body2">Price: {product.price}</Typography>
      {product.discountPrice && (
        <Typography variant="body2">Discount Price: {product.discountPrice}</Typography>
      )}
      <Typography variant="body2">SKU: {product.sku}</Typography>
      {product.photo && (
        <img src={`http://localhost:3000/uploads/${product.photo}`} alt={`${product.name} photo`} width={200} />
      )}
      <Box marginTop={2}>
        <Button
          variant="contained"
          onClick={() => navigate(`/products/${product.id}/edit`)}
          style={{ marginRight: 8 }}
        >
          Edit
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </Container>
  );
};

export default ProductPage;
