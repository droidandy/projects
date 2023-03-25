import '../styles/globals.css';
import React, { useEffect } from 'react';
import ScrollOut from 'scroll-out';
import { Header } from '../components';

const points = {
  property: `
    top: 0; 
    left: 0;
    transform: scale(0.7, 0.7);
  `,
  administration: `
    top: 90%; 
    left: 65%;
    transform: scale(1.2, 1.2);
  `,
  digitalization: `
    top: 50%; 
    left: 23%;
    transform: scale(1.2, 1.2);
  `,
  monitoring: `
    top: -30%; 
    left: 50%;
    transform: scale(1.2, 1.2);
  `,
  'fleet-management': `
    top: -56%; 
    left: 19%;
    transform: scale(1.2, 1.2);
  `,
  'other-services': `
    top: -130%; 
    left: 55%;
    transform: scale(1.2, 1.2);
  `,
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const map = document.getElementById('map');
    ScrollOut({
      threshold: 0.6,
      onShown: function(element, ctx, scrollingElement) {
        const scrollSection = element.getAttribute("name");
        if (scrollSection) {
          map.style.cssText = points[scrollSection];
        }
      },
    });
  }, []);

  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
