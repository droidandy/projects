import { StyleSheet } from 'react-native';
import { formattedColor } from 'theme';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    backgroundColor: theme.color.bgPrimary
  },
  input: {
    fontSize: 17
  },
  inputContainer: {
    marginLeft: 16,
    paddingTop: 8
  },
  clearIcon: {
    marginRight: 20
  },
  cameraWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    borderRadius: 100,
    overflow: 'hidden'
  },
  cameraIcon: {
    position: 'absolute'
  },
  avatarBackDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: formattedColor.primaryText.opacity(0.3)
  },
  singleInputContainer: {
    backgroundColor: theme.color.bgPrimary,
    paddingTop: 24
  },
  phoneInputWrapper: {
    marginLeft: 16,
    alignItems: 'flex-start'
  },
  phoneInput: {
    height: 'auto',
    paddingTop: 8
  },
  flag: {
    marginTop: 20
  }
});
