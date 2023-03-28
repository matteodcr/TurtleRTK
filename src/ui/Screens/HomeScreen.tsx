import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import {baseStyle} from './Styles';
const styles = baseStyle;

const HomeScreen = () => {
  const HeaderMoreButton = () => {
    Alert.alert('TODO Screen');
  };

  const renderHeaderTab = () => {
    return (
      <View style={styles.headerTab}>
        <Text style={{marginLeft: 15, fontSize: 18, fontWeight: 'bold'}}>
          Home Screen
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
        <Text>Home</Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
