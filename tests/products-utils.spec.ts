import fs from 'fs';
import path from 'path';
import { addProduct, removeProduct } from '@/src/utils/products';
import { v4 as uuidv4 } from 'uuid';
import { TProduct, EProductType } from '@/src/type/products';

jest.mock('fs');
jest.mock('uuid');

const mockProduct: TProduct = {
  name: 'Woody Toy',
  price: 199.99,
  description:
    'Woody is a loyal and brave cowboy toy. He is the leader of the toys and always ready to help his friends.',
  category: 'Toys',
  rating: 4.8,
  numReviews: 150,
  countInStock: 75,
};

const mockLargeProductsPath = path.join(process.cwd(), 'src', 'mock', 'large', 'products.json');
const mockSmallProductsPath = path.join(process.cwd(), 'src', 'mock', 'small', 'products.json');

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  fs.writeFileSync(mockLargeProductsPath, JSON.stringify([]));
  fs.writeFileSync(mockSmallProductsPath, JSON.stringify([]));
});

describe('Product Utils', () => {
  describe('addProduct', () => {
    it('should add a new product and return its ID', async () => {
      const initialProducts: TProduct[] = [];
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(initialProducts));
      (uuidv4 as jest.Mock).mockReturnValueOnce('bf9a0051-54cf-4e8a-916d-4a8418ac3a67');

      const productId = await addProduct(EProductType.large, mockProduct);

      expect(productId).toBe('bf9a0051-54cf-4e8a-916d-4a8418ac3a67');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockLargeProductsPath,
        JSON.stringify(
          [
            {
              ...mockProduct,
              id: 'bf9a0051-54cf-4e8a-916d-4a8418ac3a67',
            },
          ],
          null,
          2
        ),
        'utf8'
      );
    });
  });

  describe('removeProduct', () => {
    it('should remove a product and return its ID', () => {
      const products = [
        { id: 'bf9a0051-54cf-4e8a-916d-4a8418ac3a67', ...mockProduct },
        { id: 'mock-uuid-456', name: 'Another Product', price: '20.00' },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(products));

      const result = removeProduct('bf9a0051-54cf-4e8a-916d-4a8418ac3a67');

      expect(result).toBe('bf9a0051-54cf-4e8a-916d-4a8418ac3a67');
    });

    it('should return undefined if the product does not exist', () => {
      const products = [
        {
          id: 'mock-uuid-456',
          name: 'Another Product',
          price: '20.00',
          description: 'A description for another product.',
          category: 'Toys',
          rating: 4.8,
          numReviews: 150,
          countInStock: 75,
          productType: EProductType.large,
        },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(products));

      const result = removeProduct('bf9a0051-54cf-4e8a-916d-4a8418ac3a67');

      expect(result).toBeUndefined();
    });
  });
});
