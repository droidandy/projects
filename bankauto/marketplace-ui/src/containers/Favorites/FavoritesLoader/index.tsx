import { FC, useEffect } from 'react';
import { useFavourites } from 'store/profile/favourites';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/user';
import { getCookieImpersonalization } from 'helpers/authCookies';

export const FavoritesLoader: FC = () => {
  const { initial, fetchFavourites, setItems } = useFavourites();
  const user = useSelector(selectUser);
  const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());

  useEffect(() => {
    if (!initial && isAuthorized) fetchFavourites();
    if (initial && !isAuthorized) setItems({ items: [], initial: false });
  }, [initial, isAuthorized, setItems, fetchFavourites]);

  return null;
};
