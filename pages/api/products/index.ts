import { addProduct } from '@/src/utils/products';
import { NextApiRequest, NextApiResponse } from 'next';
import { productSchema } from './validators/create-product.schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    const { error } = productSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { productType, ...rest } = req.body;

    try {
      const createdId = await addProduct(productType, rest);
      res.status(201).json({ ...rest, id: createdId });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao adicionar o produto' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
