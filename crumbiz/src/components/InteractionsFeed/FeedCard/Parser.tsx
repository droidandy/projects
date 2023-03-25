import React from 'react';
import styled from 'styled-components/native';
import { CustomText } from '../../Shared';
import { removeHTMLTags } from '../../../utils';

const htmlPattern = /<(\w+).*<\/\1\s*>/ims;
const globalPattern = /\w+|<(\w+).*<\/\1\s*>/igsm;

const escapeRegExp = (str: string) => {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface IProps {
	text: string;
}

const Parser: React.FC<IProps> = ({ text, ...rest }) => {
	const texts: Array<string> | null = escapeRegExp(text).match(globalPattern);

	return (
		<S.Container>
			{texts && texts.map(value => {
				const isHtml = htmlPattern.test(value);
				const text = isHtml ? removeHTMLTags(value) : value;
				return (
					<CustomText text={`${text} `} bold={isHtml} {...rest} />
				)
			})}
		</S.Container>
	)
}

const S: any = {};
S.Container = styled.View`
	flex: 1;
	flex-direction: row;
	flex-wrap: wrap;
`;

export default Parser;