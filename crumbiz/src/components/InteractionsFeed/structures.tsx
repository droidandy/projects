import { InteractionTypesEnum } from '../../types/enums';
import AvatarHeader from './FeedCard/headers/AvatarHeader';
import { Icons } from '../Shared';
import { DefaultTheme } from 'styled-components';
import NewOppBody from './FeedCard/bodies/NewOppBody';
import BaseFooter from './FeedCard/footers/BaseFooter';
import React from 'react';
import { StructureBuilder } from './FeedCard/builder';
import ListIcon from './FeedCard/common/ListIcon';
import MagnetIcon from './FeedCard/common/MagnetIcon';
import ConnectionHeader from './FeedCard/headers/ConnectionHeader';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import DoneDealBody from './FeedCard/bodies/DoneDealBody';
import GoodToGoHeader from './FeedCard/headers/GoodToGoHeader';
import IconHeader from './FeedCard/headers/IconHeader';
import MessageBody from './FeedCard/bodies/MessageBody';
import PillHeader from './FeedCard/headers/PillHeader';
import SendInviteBody from './FeedCard/bodies/SendInviteBody';
import { DynamicObject } from '../../types/interfaces';
import OrangeCardBackground from '../../assets/images/orangeCard.svg';
import BlueCardBackground from '../../assets/images/blueCard.svg';
import SoundRecordBody from './FeedCard/bodies/SoundRecordBody';

const avatarImageSize = 0.144 * deviceWidth;

type Structures = DynamicObject<StructureBuilder>;

export const defaultBuilder = new StructureBuilder();

export default {
	[InteractionTypesEnum.DELETED_OPP]: new StructureBuilder({
		components: {
			header: (props: any) => {
				return <IconHeader {...props} icon={Icons.GarbageFullIcon} />;
			}
		},
		getStyles: (theme: DefaultTheme) => ({
			header: {
				imageSize: avatarImageSize,
				icon: {
					fill: theme.colors.red1,
					width: deviceWidth * 0.05,
					height: deviceHeight * 0.0265625,
					marginBottom: 20
				}
			}
		})
	}),
	[InteractionTypesEnum.ON_HOLD]: new StructureBuilder({
		components: {
			header: (props: any) => {
				return <PillHeader {...props} text='On Hold' />;
			}
		},
		getStyles: (theme: DefaultTheme) => ({
			header: {
				imageSize: avatarImageSize,
				icon: {
					fill: theme.colors.red1,
					width: deviceWidth * 0.06666666666,
					height: deviceHeight * 0.06666666666
				}
			}
		})
	}),
	[InteractionTypesEnum.BACK_STEP]: new StructureBuilder({
		components: {
			header: (props: any) => {
				return <IconHeader {...props} icon={Icons.PreviousIcon} />;
			}
		},
		getStyles: (theme: DefaultTheme) => ({
			header: {
				imageSize: avatarImageSize,
				icon: {
					fill: theme.colors.red1,
					width: deviceWidth * 0.06666666666,
					height: deviceHeight * 0.06666666666
				}
			}
		})
	}),
	[InteractionTypesEnum.GOOD_TO_GO]: new StructureBuilder({
		components: {
			header: (props: any) => {
				return <GoodToGoHeader {...props} icon={MagnetIcon} />;
			}
		},
		getStyles: (theme: DefaultTheme) => {
			return {
				container: {
					backgroundImage: BlueCardBackground
				},
				body: {
					color: 'white',
					fontWeight: 'bold'
				},
				footer: {
					color: 'white',
					fontWeight: 'normal'
				},
				header: {
					dateColor: 'halfWhite'
				}
			};
		}
	}),
	[InteractionTypesEnum.DONE_DEAL]: new StructureBuilder({
		components: {
			body: DoneDealBody
		},
		getStyles: (theme: DefaultTheme) => ({
			container: {
				backgroundImage: OrangeCardBackground
			},
			body: {
				color: 'white'
			},
			footer: {
				color: 'white',
				fontWeight: 'normal'
			},
			header: {
				dateColor: 'halfWhite'
			}
		})
	}),
	[InteractionTypesEnum.VOICE_INTRODUCTION]: new StructureBuilder({
		components: {
			body: SoundRecordBody
		}
		// getStyles: (theme: DefaultTheme) => ({
		// 	container: {
		// 		backgroundImage: OrangeCardBackground
		// 	},
		// 	body: {
		// 		color: 'white'
		// 	},
		// 	footer: {
		// 		color: 'white',
		// 		fontWeight: 'normal'
		// 	},
		// 	header: {
		// 		dateColor: 'halfWhite'
		// 	}
		// })
	}),
	[InteractionTypesEnum.REJECTED_INVITE]: new StructureBuilder({
		components: {
			footer: (props: any) => {
				return <BaseFooter {...props} showRole={false} />;
			},
			header: (props: any) => {
				return (
					<AvatarHeader {...props} idProperty='fromUserId' icon={ListIcon} />
				);
			}
		},
		getStyles: (theme: DefaultTheme) => ({
			header: {
				imageSize: avatarImageSize,
				icon: {
					container: {
						backgroundColor: theme.colors.red1
					}
				}
			}
		})
	}),
	[InteractionTypesEnum.CONFIRMED_INVITE]: new StructureBuilder({
		components: {
			header: (props: any) => {
				return <ConnectionHeader {...props} icon={MagnetIcon} />;
			}
		},
		getStyles: (theme: DefaultTheme) => ({
			header: {
				imageSize: avatarImageSize,
				icon: {}
			}
		})
	}),
	[InteractionTypesEnum.SEND_INVITE]: new StructureBuilder({
		components: {
			body: SendInviteBody,
			header: (props: any) => {
				return <AvatarHeader {...props} icon={ListIcon} />;
			}
		},
		getStyles: (theme: DefaultTheme) => ({
			header: {
				imageSize: avatarImageSize
			}
		})
	}),
	[InteractionTypesEnum.INTRODUCTION]: new StructureBuilder({
		components: {
			body: MessageBody,
			header: (props: any) => {
				return (
					<AvatarHeader
						{...props}
						idProperty='fromUserId'
						icon={Icons.MessageIcon}
					/>
				);
			}
		},
		getStyles: (theme: DefaultTheme) => ({
			header: {
				imageSize: avatarImageSize
			}
		})
	}),
	[InteractionTypesEnum.SEND_MESSAGE]: new StructureBuilder({
		components: {
			header: (props: any) => {
				return <AvatarHeader {...props} icon={Icons.MessageIcon} />;
			}
		},
		getStyles: (theme: DefaultTheme) => ({
			header: {
				imageSize: avatarImageSize
			}
		})
	}),
	[InteractionTypesEnum.FIRST_MESSAGE]: new StructureBuilder({
		components: {
			header: (props: any) => {
				return <AvatarHeader {...props} icon={Icons.MessageIcon} />;
			}
		},
		getStyles: (theme: DefaultTheme) => ({
			header: {
				imageSize: avatarImageSize
			}
		})
	}),
	[InteractionTypesEnum.OPP_CREATED]: new StructureBuilder({
		components: {
			body: NewOppBody,
			footer: (props: any) => <BaseFooter {...props} showRole={false} />
		},
		getStyles: (theme: DefaultTheme) => ({
			container: {
				colors: theme.gradients.blue,
				start: { x: 0, y: 0 },
				end: { x: 1, y: 0 }
			},
			body: {
				color: 'white',
				fontWeight: 'bold'
			},
			footer: {
				color: 'white',
				fontWeight: 'normal'
			},
			header: {
				dateColor: 'halfWhite'
			}
		})
	})
} as Structures;
