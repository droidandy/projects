import React, { Fragment, useEffect, useState } from "react";
import { Subtitle } from "../../../../../components/texts/title_with_subtitle/styles";
import { Card } from "./styles";
import "./faq_styles.css";

function QuestionItem(props) {
	const { data } = props;

	const [accordionItems, setAccordionItems] = useState([]);

	useEffect(() => {
		let accordion = [];

		data.forEach((i) => {
			accordion.push({
				title: i.title,
				content: i.content,
				open: false
			});
		});
		setAccordionItems(accordion)
	}, [0]);

	function click(i) {
		const newAccordion = accordionItems.slice();
		const index = newAccordion.indexOf(i)
		newAccordion.forEach(function (element, i) {
			if (index !== i ) { 
				element.open = false;
			} 
		});
		newAccordion[index].open = !newAccordion[index].open;
		setAccordionItems(newAccordion)
	}

	const PlusImage = () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 6V18" stroke="#61AD15" stroke-width="1.4" stroke-linejoin="round"/>
				<path d="M6 12H18" stroke="#61AD15" stroke-width="1.4" stroke-linejoin="round"/>
				<circle cx="12" cy="12" r="11" stroke="#61AD15" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		);
	};
	const MinusImage = () => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M6 12H18" stroke="#61AD15" stroke-width="1.4" stroke-linejoin="round"/>
				<circle cx="12" cy="12" r="11" stroke="#61AD15" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		);
	};

	return (
		<Fragment>
			{accordionItems.map((i) => (				
				<div className="accordionItem" key={accordionItems.indexOf(i)}>
					<div
						className="title"
						onClick={() => { click(i); }}
					>
						<p className="title-text">{i.title}</p>
						<div className="arrow-wrapper">{i.open ? <MinusImage/> : <PlusImage/>}</div>
					</div>
					<div className={i.open
						? "content content-open"
						: "content"}
					>
						<p className={i.open
							? "content-text content-text-open"
							: "content-text"}
						>{i.content}
						</p>
					</div>
				</div>
			))
			}
		</Fragment>
	);
}

export default QuestionItem;
