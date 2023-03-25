import { isAndroid } from 'utils';

export default function getDefaultHeaderStyle(navigation) {
  const styles = {
    borderBottomColor: navigation.state.params.theme.color.pixelLine,
    backgroundColor: navigation.state.params.theme.color.bgPrimary
  };

  if (isAndroid) {
    styles.paddingTop = 20;
    styles.height = 80;
  }

  return styles;
}
