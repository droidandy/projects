import {
  GetCartDocument,
  GetCartQuery,
  GetUserDocument,
  GetUserQuery,
  ProductModelResolvers,
} from '../requests';
import { fromCacheOrServer } from './helpers';

export const ProductModel: ProductModelResolvers = {
  isInBasket: async (product, args, { client }) => {
    const res = await fromCacheOrServer<GetCartQuery>(client, GetCartDocument);
    return res?.cart.items.some(x => x.productId === product.id) || false;
  },
  isFavourite: async (parent, args, { client }) => {
    const result = await fromCacheOrServer<GetUserQuery>(client, GetUserDocument);
    return result?.user.favoriteProductsIds.includes(parent.id) || false;
  },
};
