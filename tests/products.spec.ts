import { createMocks } from 'node-mocks-http';
import { addProduct, removeProduct } from '@/src/utils/products';
import handler from '@/pages/api/products';
import deleteProductHandler from '@/pages/api/products/[id]';

jest.mock('@/src/utils/products', () => ({
  addProduct: jest.fn(),
  removeProduct: jest.fn(),
}));

describe('/api/products', () => {
  describe('POST /api/create-product', () => {
    it('should return 201 and the product data on successful creation', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Oriental Blue Fresh Shirt',
          price: '82.00',
          description: 'A stylish blue shirt for all occasions.',
          category: 'Clothing',
          rating: 4.3,
          numReviews: 10,
          countInStock: 50,
          productType: 0,
        },
      });

      (addProduct as jest.Mock).mockResolvedValueOnce('bf9a0051-54cf-4e8a-916d-4a8418ac3a67');

      await handler(req as any, res as any);

      const responseData = JSON.parse(res._getData());

      expect(res._getStatusCode()).toBe(201);
      expect(responseData).toEqual({
        id: 'bf9a0051-54cf-4e8a-916d-4a8418ac3a67',
        name: 'Oriental Blue Fresh Shirt',
        price: '82.00',
        description: 'A stylish blue shirt for all occasions.',
        category: 'Clothing',
        rating: 4.3,
        numReviews: 10,
        countInStock: 50,
      });
    });

    it('should return 400 if validation fails', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {},
      });

      await handler(req as any, res as any);

      const responseData = JSON.parse(res._getData());

      expect(res._getStatusCode()).toBe(400);
      expect(responseData).toHaveProperty('error');
    });

    it('should return 500 if addProduct throws an error', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Oriental Blue Fresh Shirt',
          price: '82.00',
          description: 'A stylish blue shirt for all occasions.',
          category: 'Clothing',
          rating: 4.3,
          numReviews: 10,
          countInStock: 50,
          productType: 0,
        },
      });

      (addProduct as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await handler(req as any, res as any);

      const responseData = JSON.parse(res._getData());

      expect(res._getStatusCode()).toBe(500);
      expect(responseData).toHaveProperty('error', 'Erro ao adicionar o produto');
    });

    it('should return 405 if method is not POST', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Método GET não permitido');
    });
  });

  describe('DELETE /api/products/[id]', () => {
    it('should return 200 and a success message on successful deletion', async () => {
      const productId = 'bf9a0051-54cf-4e8a-916d-4a8418ac3a67';
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: productId },
      });

      (removeProduct as jest.Mock).mockReturnValueOnce(productId);

      await deleteProductHandler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toBe(`Product ${productId} removed successfully.`);
    });

    it('should return 400 if validation fails', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: '' },
      });

      await deleteProductHandler(req as any, res as any);

      const responseData = JSON.parse(res._getData());

      expect(res._getStatusCode()).toBe(400);
      expect(responseData).toHaveProperty('error');
    });

    it('should return 404 if the product does not exist', async () => {
      const productId = 'bf9a0051-54cf-4e8a-916d-4a8418ac3a67';
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: productId },
      });

      (removeProduct as jest.Mock).mockReturnValueOnce(null);

      await deleteProductHandler(req as any, res as any);

      const responseData = JSON.parse(res._getData());

      expect(res._getStatusCode()).toBe(404);
      expect(responseData).toHaveProperty('error', 'Product not found');
    });

    it('should return 500 if removeProduct throws an error', async () => {
      const productId = 'bf9a0051-54cf-4e8a-916d-4a8418ac3a67';
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: productId },
      });

      (removeProduct as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await deleteProductHandler(req as any, res as any);

      const responseData = JSON.parse(res._getData());

      expect(res._getStatusCode()).toBe(500);
      expect(responseData).toHaveProperty('error', 'Error removing the product');
    });

    it('should return 405 if method is not DELETE', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await deleteProductHandler(req as any, res as any);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Method GET not allowed');
    });
  });
});
