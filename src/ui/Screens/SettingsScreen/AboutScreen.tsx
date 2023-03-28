import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import {baseStyle} from '../Styles';
const styles = baseStyle;

export default function RoverSettingsScreen() {
  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={styles.text}>About</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <ScrollView style={{margin: 20}}>
        <Text style={{color: 'white'}}>Licence MIT</Text>
        <Text style={{color: 'white'}}>
          Developers : Mattéo Decorsaire / Paul Grandhomme / Tanguy Delas /
          Thomas Bousquet
        </Text>
        <Text style={{color: 'white'}}>
          With the help of Yves Pratter and Eric Sibert
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
