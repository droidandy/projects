import React from 'react';
import { SectionList } from 'react-native';
import { ISection, ISectionItem } from './ChooseEntityTabs';
import { fuzzySearch } from '../../../utils';
import ListItem from '../ListItem';
import SectionListHeader from '../SectionListHeader';
import { defaultTheme } from '../../../themes';

interface IProps {
	searchTerm: string;
	onItemPress(newContact: ISectionItem): any;
	sections: any;
	sectionHeaderBackgroundColor?: string;
	sectionHeaderTextColor?: string;
	sectionHeaderTextSize?: number;
}

const ContactsTab: React.FC<IProps> = props => {
	let {
		searchTerm,
		onItemPress,
		sections,
		sectionHeaderBackgroundColor,
		sectionHeaderTextColor,
		sectionHeaderTextSize
	} = props;

	if (searchTerm.trim().length) {
		sections = sections.map((section: ISection<ISectionItem>) => {
			const updatedData = section.data.filter(item =>
				fuzzySearch(searchTerm, item.text)
			);
			return {
				...section,
				data: updatedData
			};
		});
	}

	return (
		<SectionList
			sections={sections}
			keyExtractor={(item: ISectionItem) => item.key}
			keyboardShouldPersistTaps='always'
			bounces={false}
			renderItem={({ item }) => (
				<ListItem
					// New Contact button has it's own logic for onItemPress.
					onPress={() => (item.onPress ? item.onPress() : onItemPress(item))}
					backgroundColor={defaultTheme.colors.gray12}
					icon='initials'
					text={item.text}
					bold
				/>
			)}
			renderSectionHeader={({ section: { title } }) =>
				title ? (
					<SectionListHeader
						backgroundColor={sectionHeaderBackgroundColor}
						textColor={sectionHeaderTextColor}
						textSize={sectionHeaderTextSize}
						text={title}
					/>
				) : null
			}
		/>
	);
};

export default React.memo(ContactsTab);
