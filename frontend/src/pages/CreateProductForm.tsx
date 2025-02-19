import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  colors,
} from '@mui/material';
import { createProduct, updateProduct, fetchProduct } from '../api/products';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().optional(),
  sku: z.string().min(1, 'SKU is required'),
  photoFile: z.any().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      discountPrice: undefined,
      sku: '',
      photoFile: undefined,
    },
  });

  // Если редактирование, получаем продукт и заполняем форму
  useQuery(['product', id], () => fetchProduct(Number(id)), {
    enabled: isEditMode,
    onSuccess: data => {
      reset({
        name: data.name,
        description: data.description || '',
        price: data.price || 0,
        discountPrice: data.discountPrice || 0,
        sku: data.sku,
        photoFile: undefined,
      });
      if (data.photo) {
        setCurrentPhoto(data.photo);
      }
    },
  });

  const mutation = useMutation(
    (formData: FormData) => {
      if (isEditMode && id) {
        return updateProduct(Number(id), formData);
      } else {
        return createProduct(formData);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        navigate('/');
      },
      onError: e => {
        console.log({ e });
        setErrorText(e?.response?.data?.error?.message);
      },
    },
  );

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price.toString());
    if (data.discountPrice !== undefined) {
      formData.append('discountPrice', data.discountPrice.toString());
    }
    formData.append('sku', data.sku);

    if (data.photoFile && data.photoFile.length > 0) {
      formData.append('photo', data.photoFile[0]);
    }

    mutation.mutate(formData);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Product' : 'Add Product'}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 2 }}
      >
        <TextField
          {...register('name')}
          label="Name"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          {...register('description')}
          label="Description"
          fullWidth
          margin="normal"
          error={!!errors.description}
          helperText={errors.description?.message}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          {...register('price', { valueAsNumber: true })}
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          error={!!errors.price}
          helperText={errors.price?.message}
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          {...register('discountPrice', { valueAsNumber: true })}
          label="Discount Price"
          type="number"
          fullWidth
          margin="normal"
          error={!!errors.discountPrice}
          helperText={errors.discountPrice?.message}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          {...register('sku')}
          label="SKU"
          fullWidth
          margin="normal"
          error={!!errors.sku}
          helperText={errors.sku?.message}
          required
          InputLabelProps={{ shrink: true }}
        />

        {isEditMode && currentPhoto && (
          <Box my={2}>
            <Typography variant="subtitle1">Current Photo:</Typography>
            <img
              src={`http://localhost:3000/uploads/${currentPhoto}`}
              alt="Current"
              width={200}
            />
          </Box>
        )}

        <Box my={2}>
          <input type="file" accept="image/*" {...register('photoFile')} />
        </Box>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            {isEditMode ? 'Update Product' : 'Create Product'}
          </Button>
        </Box>

        <Box mt={2}>
          <Typography color={colors.red[500]}>{errorText}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductFormPage;
