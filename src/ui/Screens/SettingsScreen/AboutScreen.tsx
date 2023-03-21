import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

export default function RoverSettingsScreen() {
  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
          }}>
          About
        </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headerTab: {
    backgroundColor: '#111111',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: '#151515',
    borderBottomWidth: 1,
    height: 50,
    alignItems: 'center',
  },
});
