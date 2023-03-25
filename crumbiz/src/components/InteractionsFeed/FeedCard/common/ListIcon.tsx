import { Icons } from '../../../Shared';
import React, { useMemo } from 'react';
import merge from 'lodash.merge';
import styled, { DefaultTheme } from 'styled-components/native';
import { DynamicObject } from '../../../../types/interfaces';
import { useTheme } from '../../../../hooks';

interface IProps {
	styles: {
		container?: DynamicObject<any>,
		svg?: DynamicObject<any>
	}
};

const ListIcon: React.FC<IProps> = (props) => {
	const theme = useTheme();

	const defaultStyles = useMemo(() => {
		return {
			container: {
				backgroundColor: theme.colors.orange
			},
			svg: {
				fill: 'white'
			}
		}
	}, [theme]);

	const styles = useMemo(() => {
		return merge({}, defaultStyles, props.styles)
	}, [defaultStyles, props.styles]);

	return (
		<S.Container {...styles.container}>
			<Icons.ListIcon {...styles.svg} width={10} height={10} />
		</S.Container>
	)
}

ListIcon.defaultProps = {
	styles: {}
};

const S: any = {};
S.Container = styled.View`
	background-color: ${({ backgroundColor, theme }: {
		backgroundColor: string;
		theme: DefaultTheme
	}) => backgroundColor};
	border-radius: 4;
	padding-top: 8;
	padding-bottom: 5;
	padding-horizontal: 6;
`

export default ListIcon;
