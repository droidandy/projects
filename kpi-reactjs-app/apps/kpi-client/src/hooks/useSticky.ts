import React from 'react';

export function useSticky(scrollY = 210) {
  const [sticky, setSticky] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onScroll = () => {
    if (window.scrollY > scrollY) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  return sticky;
}
