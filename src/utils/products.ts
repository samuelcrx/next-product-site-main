import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { EProductType, TProduct } from '../type/products';

export async function addProduct(productType: EProductType, newProductData: TProduct): Promise<string> {
  const size = productType === EProductType.large ? 'large' : 'small';
  const filePath = path.join(process.cwd(), 'src', 'mock', size, 'products.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(fileData);

  newProductData.id = uuidv4();

  products.unshift(newProductData);

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');

  return newProductData.id;
}

export const removeProduct = (productId: string): string | undefined => {
  const smallFilePath = path.join(process.cwd(), 'src', 'mock', 'small', 'products.json');
  const largeFilePath = path.join(process.cwd(), 'src', 'mock', 'large', 'products.json');

  let checkWasRemoved = false;

  checkWasRemoved = removeProductFromDatabase(smallFilePath, productId);

  if (!checkWasRemoved) {
    checkWasRemoved = removeProductFromDatabase(largeFilePath, productId);
  }

  return checkWasRemoved ? productId : undefined;
};

export const removeProductFromDatabase = (filePath: string, productId: string): boolean => {
  const fileData = fs.readFileSync(filePath, 'utf8');
  if (!fileData) {
    return false;
  }
  const products: TProduct[] = JSON.parse(fileData);

  const checkIfExists = products.find((product) => product.id === productId);

  if (!checkIfExists) {
    return false;
  }

  const updatedProducts = products.filter((product) => product.id !== productId);

  fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2), 'utf8');

  return true;
};
