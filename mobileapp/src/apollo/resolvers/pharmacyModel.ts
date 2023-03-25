import { GetUserDocument, GetUserQuery, PharmacyModelResolvers } from '../requests';
import { fromCacheOrServer } from './helpers';

export const PharmacyModel: PharmacyModelResolvers = {
  isFavourite: async (parent, args, { client }) => {
    const result = await fromCacheOrServer<GetUserQuery>(client, GetUserDocument);
    return result?.user.favoritePharmaciesIds.includes(parent.id) || false;
  },
};
