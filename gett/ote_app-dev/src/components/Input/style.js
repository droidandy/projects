import { StyleSheet } from 'react-native';
import { color } from 'theme';

const styles = theme => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: theme.color.pixelLine
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: theme.color.primaryText
  },
  error: {
    borderBottomColor: color.danger
  },
  label: {
    position: 'absolute',
    color: theme.color.secondaryText
  },
  clearBtn: {
    padding: 8
  },
  errorMessage: {
    paddingTop: 4,
    color: color.danger
  },
  errorPlaceholder: {
    height: 14
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

export default styles;
