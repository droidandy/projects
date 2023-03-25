// ts - nocheck
import React from "react";
import Application from "./icons/Application";
import Ingredients from "./icons/Ingredients";
import OtherQuestions from "./icons/OtherQuestions";
import Package from "./icons/Package";
import ProductLine from "./icons/ProductLine";
import Shipping from "./icons/Shipping";
import VideoCourses from "./icons/VideoCourses";
import { FAQCategory, FAQItem } from "./data";
import CategoryItem from "./CategoryItem";

const ICONS_BY_CATEGORY = {
  Application: <Application />,
  Ingredients: <Ingredients />,
  OtherQuestions: <OtherQuestions />,
  Package: <Package />,
  ProductLine: <ProductLine />,
  Shipping: <Shipping />,
  VideoCourses: <VideoCourses />
};

interface ICategoryProps {
  category: FAQCategory;
}

const Category = ({ category }: ICategoryProps) => {
  if (
    category && category.items &&
    Array.isArray(category.items) &&
    category.items.length > 0
  ) {
    return (
      <div className="category-container" key={category.name}>
        <div className="category-title row no-gutters">
          {category.icon in ICONS_BY_CATEGORY && (
            <div className="col icon">{ICONS_BY_CATEGORY[category.icon]}</div>
          )}

          <div className="col">
            <h4 id={category.id}>{category.name}</h4>
          </div>
        </div>
        <div className="category-wrapper">
          {category.items.map((item: FAQItem, index) => (
            <CategoryItem key={item.key} item={item} index={index} />
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default React.memo(Category);
