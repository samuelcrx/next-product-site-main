import { removeProduct } from '@/src/utils/products';
import { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';

const idSchema = Joi.string().required();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'DELETE') {
    try {
      const { error } = idSchema.validate(id);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const removedId = removeProduct(id as string);
      if (removedId) {
        res.status(200).send(`Product ${removedId} removed successfully.`);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error removing the product' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
