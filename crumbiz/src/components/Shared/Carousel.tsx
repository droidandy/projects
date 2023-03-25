import React, { useRef } from 'react';
import Carousel from 'react-native-snap-carousel';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { defaultTheme } from '../../themes';
import CustomText from './CustomText';
import { useTheme } from '../../hooks';

interface IProps {
	opportunityTypeCards: Array<{}>;
	selected: string;
}
const MyCarousel: React.FC<IProps> = ({ opportunityTypeCards, selected }) => {
	const theme = useTheme();
	const carouselRef = useRef(null);

	//@ts-ignore
	const carouselTemplate = ({ item, index }, parallaxProps) => {
		const cardColor =
			selected === item.id ? theme.colors.gray18 : theme.colors.gray12;
		return (
			<TouchableOpacity key={index} onPress={() => item.onPress()}>
				<View style={[styles.item, { backgroundColor: cardColor }]}>
					<View style={styles.image}>{item.image}</View>
					<CustomText
						text={item.title}
						style={styles.title}
						color='black'
						bold
					/>
					<CustomText
						style={styles.text}
						text={item.description}
						size='s14'
						color='gray15'
						center
					/>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<Carousel
				ref={carouselRef}
				sliderWidth={deviceWidth}
				itemWidth={deviceWidth * 0.7222}
				data={opportunityTypeCards}
				renderItem={carouselTemplate}
			/>
		</View>
	);
};

export default MyCarousel;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: deviceHeight,
		backgroundColor: defaultTheme.colors.white,
		marginTop: deviceHeight * 0.0593,
		marginBottom: deviceHeight * 0.056,
		borderRadius: 8
	},
	item: {
		width: deviceWidth * 0.7222,
		borderRadius: 20,
		alignItems: 'center'
	},
	image: {
		marginTop: deviceHeight * 0.0765
	},
	title: {
		marginBottom: deviceHeight * 0.02
	},
	text: {
		marginHorizontal: deviceWidth * 0.07,
		marginBottom: deviceHeight * 0.02
	}
});
