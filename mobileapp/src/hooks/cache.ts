import { useApolloClient } from '@apollo/react-hooks';
import { useCallback, useState } from 'react';
import gql from 'graphql-tag';
import {
  EditFavoritesProductsActions,
  GetCartDocument,
  GetCartQuery,
  GetFavouriteProductsDocument,
  GetFavouriteProductsQuery,
  GetUserDocument,
  GetUserQuery,
  ListProductFragment,
  ProductInBasketFragmentDoc,
  useEditFavouritePharmacyMutation,
  useEditFavouriteProductMutation,
} from '../apollo/requests';

type Func = (id: number, isFavorite: boolean) => void;
type FuncProd = (product: ListProductFragment, isFavorite: boolean) => void;

export const useUpdateProductFavorite = (): [FuncProd, boolean] => {
  const client = useApolloClient();
  const [updating, setUpdating] = useState(false);
  const [mutate] = useEditFavouriteProductMutation();

  const update = useCallback(
    (product: ListProductFragment, isFavourite: boolean) => {
      setUpdating(true);
      const productId = product.id;
      const action = isFavourite
        ? EditFavoritesProductsActions.Add
        : EditFavoritesProductsActions.Delete;
      const variables = {
        id: productId,
        action,
      };
      mutate({
        variables,
        update: (cache, result) => {
          const favoriteProductsIds = result.data?.editFavoritesProducts;

          // update user favoriteIds
          try {
            const cachedData = cache.readQuery<GetUserQuery>({ query: GetUserDocument });
            if (cachedData && favoriteProductsIds && cachedData.user) {
              const data = { ...cachedData, user: { ...cachedData.user, favoriteProductsIds } };
              cache.writeQuery<GetUserQuery>({ query: GetUserDocument, data });
            }
          } catch (e) {
            console.log('failed to update favoriteProductsIds');
          }

          // update Product
          try {
            if (favoriteProductsIds) {
              const id = `ProductModel:${productId}`;
              const data = {
                isFavourite: favoriteProductsIds.includes(productId),
                __typename: 'ProductModel',
              };
              const fragment = gql`
                fragment favProdFrag on ProductModel {
                  isFavourite
                }
              `;
              client.cache.writeFragment({ fragment, id, data });
            }
          } catch (e) {
            console.log('failed to update Product');
          }

          //update getFavoriteProducts cache
          try {
            const prevData = cache.readQuery<GetFavouriteProductsQuery>({
              query: GetFavouriteProductsDocument,
            });
            if (prevData) {
              const prod = { ...product, isFavourite };
              const favoriteProducts = isFavourite
                ? [prod, ...prevData.user.favoriteProducts]
                : prevData.user.favoriteProducts.filter(p => p.id !== prod.id);

              const data: typeof prevData = {
                ...prevData,
                user: {
                  ...prevData.user,
                  favoriteProducts,
                },
              };
              cache.writeQuery<GetFavouriteProductsQuery>({
                query: GetFavouriteProductsDocument,
                data,
              });
            }
          } catch (e) {
            console.log('failed to update getFavoriteProducts');
          }
          setUpdating(false);
        },
      }).catch(console.warn);
    },
    [client.cache, mutate],
  );
  return [update, updating];
};

export const useUpdatePharmacyFavorite = (): [Func, boolean] => {
  const client = useApolloClient();
  const [mutate, mutationState] = useEditFavouritePharmacyMutation();

  const update = useCallback(
    function(pharmacyId: number, isFavourite: boolean) {
      const action = isFavourite
        ? EditFavoritesProductsActions.Add
        : EditFavoritesProductsActions.Delete;
      mutate({
        variables: { id: pharmacyId, action },
        update: (cache, mutationResult) => {
          const favoritePharmaciesIds = mutationResult.data?.editFavoritesPharmacy;
          const cachedData = cache.readQuery<GetUserQuery>({ query: GetUserDocument });

          if (cachedData && favoritePharmaciesIds && cachedData.user) {
            const data = { ...cachedData, user: { ...cachedData.user, favoritePharmaciesIds } };
            cache.writeQuery<GetUserQuery>({ query: GetUserDocument, data });
          }

          if (favoritePharmaciesIds) {
            const fragment = gql`
              fragment favPharmFrag on PharmacyModel {
                isFavourite
              }
            `;
            const id = `PharmacyModel:${pharmacyId}`;
            const data = {
              isFavourite: favoritePharmaciesIds.includes(pharmacyId),
              __typename: 'PharmacyModel',
            };
            client.cache.writeFragment({ fragment, id, data });
          }
        },
      }).catch(console.warn);
    },
    [client, mutate],
  );

  return [update, mutationState.loading];
};

export const useResetCart = () => {
  const client = useApolloClient();
  return useCallback(() => {
    try {
      const cached = client.cache.readQuery<GetCartQuery>({ query: GetCartDocument });
      if (!cached) return;
      const productIds = cached?.cart.items.map(item => item.productId) || [];
      for (const productId of productIds) {
        const id = `ProductModel:${productId}`;
        const data = { isInBasket: false, __typename: 'ProductModel' };
        client.cache.writeFragment({ id, fragment: ProductInBasketFragmentDoc, data });
      }
      const data: typeof cached = {
        ...cached,
        cart: { ...cached?.cart, items: [], price: 0, quantity: 0 },
      };
      client.cache.writeQuery<GetCartQuery>({ query: GetCartDocument, data });
    } catch (e) {
      console.warn('error resetting cart', e);
    }
  }, [client.cache]);
};
//
// export const useRemoveFromCart = () => {
//   const client = useApolloClient();
//   return useCallback(
//     (productId: number) => {
//       try {
//         const cached = client.cache.readQuery<GetCartQuery>({ query: GetCartDocument });
//         if (cached) {
//           const data: typeof cached = {
//             ...cached,
//             cart: {
//               ...cached?.cart,
//               items: cached.cart.items.filter(x => x.productId !== productId),
//             },
//           };
//           console.log('data1', cached, data);
//           client.cache.writeQuery<GetCartQuery>({ query: GetCartDocument, data });
//         }
//       } catch (e) {
//         console.error('error removing from cart cache', e);
//       }
//
//       try {
//         const cached = client.cache.readQuery<GetCartWithProductsQuery>({
//           query: GetCartWithProductsDocument,
//         });
//         if (cached) {
//           const data: typeof cached = {
//             ...cached,
//             cart: {
//               ...cached?.cart,
//               items: cached.cart.items.filter(x => x.productId !== productId),
//             },
//           };
//           console.log('data2', cached, data);
//           client.cache.writeQuery<GetCartWithProductsQuery>({
//             query: GetCartWithProductsDocument,
//             data,
//           });
//         }
//       } catch (e) {
//         console.error('error removing from cart cache', e);
//       }
//
//       try {
//         const id = `ProductModel:${productId}`;
//         const data = { isInBasket: false, __typename: 'ProductModel' };
//         client.cache.writeFragment({ id, fragment: ProductInBasketFragmentDoc, data });
//         console.log('data3', id, data);
//       } catch (e) {
//         console.error(e);
//       }
//     },
//     [client.cache],
//   );
// };
