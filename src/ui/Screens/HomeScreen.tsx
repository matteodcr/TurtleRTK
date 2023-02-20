import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight!,
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headerTab: {
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    height: 50,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
