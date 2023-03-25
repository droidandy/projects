import React from "react";
import { useHistory } from "react-router-dom";

import {
	FaqItem,
	FaqBlockLeft,
	FaqBlockRight,
	FaqItemHeader,
	FaqItemDescription,
	FaqItemText
} from "./styles";

//export image
import FaqListPaper from "../../../../../components/images/faq_list_paper"

function FaqListItem(props) {

const { title, count, text, background, shadow, hover, id } = props;

const history = useHistory();

  function handleClick() {
  	background == "white" ? history.push(`/faq/category/${id}`) : null;
  }
	return (
		<FaqItem background={background} shadow={shadow} hover={hover} onClick={handleClick}>
			<FaqBlockLeft><FaqListPaper /></FaqBlockLeft>
			<FaqBlockRight>
				<FaqItemHeader>{title}</FaqItemHeader>
				<FaqItemDescription>{count} faqs in this category</FaqItemDescription>
				<FaqItemText>{text}</FaqItemText>
			</FaqBlockRight>
		</FaqItem>
	);
}

export default FaqListItem;
