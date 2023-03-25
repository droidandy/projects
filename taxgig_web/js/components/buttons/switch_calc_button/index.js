import React from 'react';

import { 
	ContainerButton, 
	ButtonIncome, 
	ButtonBusiness, 
	ButtonSales
} from './styles';


function SwitchCalcButton(props) {

	const { onClick, text, isActive } = props;

	return (
		<ContainerButton>
			<ButtonIncome isActive={isActive} onClick={onClick}>Income Tax</ButtonIncome>
			<ButtonBusiness isActive={isActive} onClick={onClick}>Small Business Tax</ButtonBusiness>
			<ButtonSales isActive={isActive} onClick={onClick}>Sales Tax</ButtonSales>
		</ContainerButton>		

	);
}

export default SwitchCalcButton;