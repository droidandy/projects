import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import {
	Typography,
	SubmitButton,
	Button
} from '../../../../components/Shared';
import { WebView } from 'react-native-webview';
import { useCaptureBackButton } from '../../../../hooks';
import {
	calcFontSize,
	deviceHeight,
	deviceWidth,
	calcWidth,
	calcHeight
} from '../../../../utils/dimensions';
import AttachIcon from './AttachIcon';
import { sendIntroSelector } from '../../../../store/selectors/sendIntroSelectors';
import Textarea from '../../../Shared/Textarea';
import { navigationService } from '../../../../services';
import BottomAutoCompleteOptions from './BottomAutoCompleteOptions';
import { Keyboard, LayoutChangeEvent, NativeComponent } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
	sendIntroAddAttachment,
	updateIntroAction,
	saveNewTemplate
} from '../../../../store/actions/sendIntroActions';
import BottomAttachments from './BottomAttachments';
import { useNavigation } from 'react-navigation-hooks';
import { CSS } from '../../../../utils/webview';
import {
	ITemplate,
	ModalAndSlidingDropdownRef
} from '../../../../types/interfaces';
import { AttachmentTypesEnum } from '../../../../types/enums';
import { AttachLinkModal } from '../../Modals';
import DocumentPicker from 'react-native-document-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScreensEnum } from '../../../../navigation/screens';

interface IProps {
	content?: ITemplate | null;
	isEditable: boolean;
}

const CreateTemplate: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const { isEditable, content } = props;
	const [isBottomAutoCompleteVisible, setBottomAutoCompleteVisible] = useState(
		false
	);
	const [textareaValue, setTextAreaValue] = useState('');
	const textareaRef = useRef<NativeComponent>(null);
	const scrollViewRef = useRef(null);
	const dispatch = useDispatch();
	const [scrollViewContainerHeight, setScrollViewContainerHeight] = useState(
		100
	);
	const editorRef = useRef(null);
	const navigation = useNavigation();

	useCaptureBackButton(isBottomAutoCompleteVisible, () => {
		setBottomAutoCompleteVisible(false);
	});

	const handleKeyboardOpen = useCallback(() => {
		setBottomAutoCompleteVisible(false);
	}, []);

	useEffect(() => {
		Keyboard.addListener('keyboardDidShow', handleKeyboardOpen);
		return () => Keyboard.removeListener('keyboardDidShow', handleKeyboardOpen);
	}, []);

	useEffect(() => {
		if (isBottomAutoCompleteVisible) {
			Keyboard.dismiss();
		}
	}, [isBottomAutoCompleteVisible]);

	const { oppDetails } = useSelector(sendIntroSelector);

	const onSendIntroContent = () => {
		let introMessage;
		if (isEditable) {
			introMessage = { id: null, body: textareaValue };
		} else {
			introMessage = { id: content?.id, body: content?.body };
		}
		dispatch(updateIntroAction('introMessage', introMessage));
		navigation.navigate(ScreensEnum.ALL_SET);
	};

	const translationPrefix = 'connectEntities.createTemplate';
	const showSaveTemplateButton = textareaValue.trim() ? true : false;

	const attachLinkModalRef = useRef(null);

	const attachFileHandler = async () => {
		try {
			const file = await DocumentPicker.pick({
				type: [
					DocumentPicker.types
						.allFiles /*,DocumentPicker.types.images,DocumentPicker.types.pdf,DocumentPicker.types.plainText*/
				]
			});
			const { uri, type, name, size } = file;

			let megaSize = parseFloat(
				(parseInt(size) / Math.pow(1024, 2)).toFixed(2)
			);
			if (megaSize < 100) {
				let attachment = {
					title: name,
					content: { type, uri, name, megaSize }
				};
				dispatch(sendIntroAddAttachment(AttachmentTypesEnum.FILE, attachment));
			}
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
			} else {
				throw err;
			}
		}
	};
	const attachLinkHandler = (link: string, linkName: string) => {
		(attachLinkModalRef as ModalAndSlidingDropdownRef).current?.close();
		let attachment;
		if (link && link.trim().length) {
			if (linkName && linkName.trim().length) {
				attachment = { content: { link, linkName }, title: linkName };
			} else {
				attachment = { content: link, title: link };
			}

			dispatch(sendIntroAddAttachment(AttachmentTypesEnum.LINK, attachment));
		}
	};
	const onCreateAttachment = (key: string) => {
		switch (key) {
			case AttachmentTypesEnum.LINK: {
				(attachLinkModalRef as ModalAndSlidingDropdownRef).current?.open();
				break;
			}
			case AttachmentTypesEnum.FILE: {
				attachFileHandler();
				break;
			}
			default: {
				dispatch(
					sendIntroAddAttachment(AttachmentTypesEnum.PHONE_NUMBER, {
						content: '',
						title: key
					})
				);
			}
		}
	};
	return (
		<KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<S.SaveToTemplateBtn
				disabled={!showSaveTemplateButton}
				textSize={12}
				border-radius='12px'
				text='Save To Template'
				width={deviceWidth * 0.35}
				height={deviceHeight * 0.04}
				gradientBackground='darkGray'
				onPress={() =>
					navigation.navigate(ScreensEnum.MODAL, {
						headerText: 'Name Your Template',
						inputPlaceholder: 'Template Name',
						actionButtonText: 'SAVE',
						onActionButtonPress: (templateTitle: string) => {
							dispatch(
								saveNewTemplate({ title: templateTitle, body: textareaValue })
							);
							navigation.goBack(null);
						}
					})
				}
			/>
			<S.ScrollViewContainer
				onLayout={(event: LayoutChangeEvent) =>
					setScrollViewContainerHeight(event.nativeEvent.layout.height)
				}
			>
				<S.TextareaAndAttachmentsScrollableContainer ref={scrollViewRef}>
					<S.TextareaAndAttachmentsContainer>
						{isEditable ? (
							<S.Textarea
								placeholder={t(`${translationPrefix}.placeholder`)}
								value={textareaValue}
								onChange={setTextAreaValue}
								ref={textareaRef}
								scrollEnabled={false}
							/>
						) : (
							<S.WebViewContainer pointerEvents='none'>
								<WebView
									scalesPageToFit
									originWhitelist={['*']}
									source={{
										baseUrl: '',
										html: `${CSS}${content?.body}`
									}}
								/>
							</S.WebViewContainer>
						)}
					</S.TextareaAndAttachmentsContainer>
				</S.TextareaAndAttachmentsScrollableContainer>
			</S.ScrollViewContainer>
			<BottomAttachments
				onAttachmentAdded={() => {
					// @ts-ignore
					scrollViewRef.current!.scrollToEnd({ animated: true });
				}}
			/>

			<AttachIcon onAttachOptionPress={key => onCreateAttachment(key)} />

			<SubmitButton
				onPress={onSendIntroContent}
				disabled={isEditable && !textareaValue.length}
				gradientBackground='orange'
				upperCase
				width='100%'
				text='Next'
				gradientProps={{ useAngle: true, angle: 261 }}
			/>
			<AttachLinkModal ref={attachLinkModalRef} onPressOk={attachLinkHandler} />
		</KeyboardAwareScrollView>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
`;

S.SaveToTemplateBtn = styled(Button)`
	align-items: center;
	align-self: flex-end;
	justify-content: center;
	margin-right: ${deviceWidth * 0.1388};
	margin-top: ${deviceHeight * 0.02};
`;

S.WebViewContainer = styled.View`
	width: 100%;
	flex: 1;
	margin-top: ${deviceHeight * 0.05};
	height: ${deviceHeight * 0.5};
	padding-horizontal: ${calcWidth(25)};
`;

S.Textarea = styled(Textarea)`
	border-width: 0;
	flex: 1 0 auto;
	font-size: ${calcFontSize(18)};
	margin-top: ${deviceHeight * 0.1};
	margin-left: ${deviceWidth * 0.0694};
	color: ${props => props.theme.colors.black};
`;

S.ScrollViewContainer = styled.View`
	flex: 1;
	margin-top: ${calcHeight(40)};
	padding-horizontal: ${calcWidth(25)};
`;

S.TextareaAndAttachmentsScrollableContainer = styled.ScrollView`
	flex: 1;
`;
S.TextareaAndAttachmentsContainer = styled.View`
	flex: 1;
`;

S.Textarea = styled(Textarea)`
	font-size: ${calcFontSize(18)};
	border-width: 0;
	flex: 1 0 auto;
	color: ${({ theme }) => theme.colors.black};
`;
S.WebViewContainer = styled.View`
	width: 100%;
	flex: 1;
	height: ${deviceHeight * 0.5};
`;

export default CreateTemplate;
