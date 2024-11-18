export type TProduct = {
  id?: string;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
};

export enum EProductType {
  large,
  small
}
