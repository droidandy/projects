import { Icons } from '../../../Shared';
import React, { useMemo } from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../../../../hooks';
import merge from 'lodash.merge';
interface IProps {};

const MagnetIcon: React.FC<IProps> = (props) => {
	const theme = useTheme();

	const defaultStyles = useMemo(() => {
		return {
			width: 15,
			height: 15,
			backgroundColor: theme.colors.green1,
			fill: 'white'
		}
	}, [theme]);

	const styles = merge({}, defaultStyles, props);
	return (
		<S.Container backgroundColor={styles.backgroundColor}>
			<Icons.MagnetFullIcon {...styles} />
		</S.Container>
	)
}

const S: any = {};
S.Container = styled.View`
	background-color: ${({ backgroundColor }: { backgroundColor: string }) => backgroundColor};
	border-radius: 5;
	padding-vertical: 5;
	padding-horizontal: 5;
	border-radius: 200px;
`

export default MagnetIcon;
