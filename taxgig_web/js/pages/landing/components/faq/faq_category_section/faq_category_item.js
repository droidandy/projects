import React from "react";
import { useHistory } from "react-router-dom";

import {
	ArticleItem,
	ArticleItemHeader,
	ArticleItemDescription,
} from "./styles";

//export image
import FaqListPaper from "../../../../../components/images/faq_list_paper"

function FaqCategoryItem(props) {

const { title, description, id, category_id, resetSearchInput } = props;

const history = useHistory();

  function handleClick() {
  	history.push(`/faq/category/${category_id}/${id}`);
	  resetSearchInput && resetSearchInput();
  }

	return (
		<ArticleItem onClick={handleClick}>
			<ArticleItemHeader>{title}</ArticleItemHeader>
			<ArticleItemDescription>{description.substring(2,123)}...</ArticleItemDescription>
		</ArticleItem>
	);
}

export default FaqCategoryItem;
