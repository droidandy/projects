import { StyleSheet } from 'react-native';

// eslint-disable-next-line import/prefer-default-export
export function getCalendarTheme(theme) {
  return (
    {
      calendarBackground: theme.color.bgPrimary,
      dayTextColor: theme.color.primaryText,
      textDisabledColor: theme.color.secondaryText,
      todayTextColor: theme.color.primaryBtns,
      monthTextColor: theme.color.primaryText,
      'stylesheet.calendar.header': {
        week: {
          marginTop: 7,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.color.pixelLine
        }
      },
      'stylesheet.day.period': {
        base: {
          width: 34,
          height: 34,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        },
        text: {
          fontSize: 16,
          fontFamily: 'System',
          color: theme.color.primaryText
        }
      }
    }
  );
}
