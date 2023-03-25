import React from "react";
import Header from "@Components/Structure/Header";
import Product from "./Product";

const Products = ({list, title, products = [], lang, isCourse, imageSize}) => (
  <div className={`Products spacingBottom ${list}`}>
    <Header text={title} sub />
    <div className={`row m-auto js-tns-1`}>
      {products.map(product => {
        if (product.isHiddenInLang[lang]) return null;

        return (
          <Product
            key={product.handle}
            isCourses={isCourse}
            imageSize={imageSize}
            {...product}
            lang={lang}
          />
        );
      })}
    </div>
  </div>
);

export default Products;
