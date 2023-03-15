import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

const SettingsScreen = () => {
  const HeaderMoreButton = () => {
    Alert.alert('TODO Screen');
  };

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={{marginLeft: 15, fontSize: 18, fontWeight: 'bold'}}>
          Settings Screen
        </Text>
        <Pressable style={styles.TabButton} onPress={HeaderMoreButton}>
          <Text style={{color: 'white', fontSize: 25}}>+</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <View>
        <Text>Settings</Text>
      </View>
    </SafeAreaView>
  );
};

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
      alignItems: 'center'
    }
  });

  export default SettingsScreen;