import { useMutation, useQueryClient } from '@tanstack/react-query';
import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';

// 상품 등록
// POST /v1/items
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async (productData) => {
      // Mock data
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
          success: true,
          data: {
            item_id: Math.floor(Math.random() * 10000),
            ...productData,
          },
        };
      }

      // Real API
      const response = await carHarttApi({
        method: 'POST',
        url: '/v1/items',
        data: productData,
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// 상품 수정
// PUT /v1/items/:itemId
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async ({ itemId, productData }) => {
      // Mock data
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
          success: true,
          data: {
            item_id: itemId,
            ...productData,
          },
        };
      }

      // Real API
      const response = await carHarttApi({
        method: 'PUT',
        url: `/v1/items/${itemId}`,
        data: productData,
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['product', variables.itemId],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// 상품 삭제
// DELETE /v1/items/:itemId
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async (itemId) => {
      // Mock data
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true, message: '상품이 삭제되었습니다.' };
      }

      // Real API
      const response = await carHarttApi({
        method: 'DELETE',
        url: `/v1/items/${itemId}`,
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data, itemId) => {
      queryClient.invalidateQueries({ queryKey: ['product', itemId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// 단일 이미지의 Presigned URL 가져오기
// POST /v1/items/presigned-url
export function usePresignedUrl() {
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async (imageFile) => {
      // Mock data
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return {
          preSignedUrl: 'https://fake-s3-url.com/upload',
          filePath: `/mock/images/${Date.now()}-${imageFile.name}`,
        };
      }

      // Real API
      const response = await carHarttApi({
        method: 'POST',
        url: '/v1/items/presigned-url',
        data: {
          originalFileName: imageFile.name,
          fileSize: imageFile.size,
          extension: imageFile.name.split('.').pop(),
        },
        withCredentials: true,
      });
      return response.data?.data || {};
    },
  });
}

// S3에 이미지 업로드
export async function uploadToS3(file, presignedUrl) {
  // Mock mode
  if (presignedUrl.includes('fake-s3-url')) {
    console.log('Mock mode: Skipping S3 upload');
    return { ok: true };
  }

  // Real upload
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.statusText}`);
  }

  return response;
}
