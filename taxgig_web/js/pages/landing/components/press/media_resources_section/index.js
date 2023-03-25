import React from "react";

import {
	Section,
	MediaBlock,
} from "./styles";

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import MediaBoxItem from "./media_box_item"
import {gql} from "apollo-boost";
import {useQuery} from "@apollo/react-hooks";
import FaqCategoryItem from "../../faq/faq_category_section/faq_category_item";
import {clientBlog} from "../../../../../application/utils/apollo_client";

function MediaResourcesSection(props) {

	const NEWS_MEDIA = gql`
	{
		newsMedias
			{
			  id
			  title,
			  content,
			  file {
				url
			  }
			}
	  }`;

	const { loading, error, data } = useQuery(NEWS_MEDIA, { client: clientBlog });

	return (
		<Section>
			<TitleWithSubtitle title="Media resources" subtitle="You can use this information for media publications." />
			{data &&
				<MediaBlock>

					{data.newsMedias.map(media => {
						return (
							<MediaBoxItem
								key={media.id}
								title={media.title}
								text={media.content}
								url={media.file.url}
							/>
						)
					})}
				</MediaBlock>
			}
		</Section>
	);
}

export default MediaResourcesSection;
