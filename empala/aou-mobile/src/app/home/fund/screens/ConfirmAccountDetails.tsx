import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AccountTypeViewType = {
  title: string;
  selected: boolean;
  onPress: (acctountType: AccountTypes) => void;
};

enum AccountTypes {
  Cash = 'Cash',
  Margin = 'Margin',
  IRA = 'IRA',
  RothIRA = 'Roth IRA',
}

const AccountTypeView = ({ title, selected, onPress }: AccountTypeViewType) => (
  <TouchableOpacity
    style={{
      borderColor: '#8692A6',
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 15,
      backgroundColor: selected ? '#b5dea2' : 'white',
    }}
    onPress={onPress}>
    <Text
      style={{
        fontSize: 24,
        margin: 15,
        fontWeight: '300',
      }}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const ConfirmAccountDetails = ({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState<string>();

  React.useLayoutEffect(() => {
    navigation.setOptions({ tabBarVisible: false });
  }, [navigation]);

  const onContinue = () => {
    // navigation.navigate(NewAccountFlowScreens.ConfirmAccountDetails);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <View>
        <Text style={{ fontWeight: '800', fontSize: 18, paddingBottom: 10 }}>
          Is your profile information still correct?
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', width: '90%' }}>
        <SectionList
          sections={[
            { title: 'contact', data: ['phone number', 'email', 'residential address', 'mailing address'] },
            { title: 'identity', data: ['date of birth', 'social security #'] },
            { title: 'employment', data: ['employment status', 'employer'] },
            { title: 'financial profile', data: ['inv. experience', 'annual income', 'liquid net worth'] },
          ]}
          renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
          renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: '#55a333',
          width: '90%',
          borderRadius: 6,
        }}
        onPress={onContinue}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '800',
            color: '#243841',
            margin: 15,
            textAlign: 'center',
          }}>
          CONTINUE
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 30,
    fontWeight: '300',
    color: '#243841',
    backgroundColor: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#243841',
    fontWeight: '700',
  },
});
