import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Alert,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';

import Modal from 'react-native-modal';
import CasterPool, {CasterPoolEntry} from '../../fc/Caster/CasterPool';
import SourceTable from '../../fc/Caster/SourceTable';

const CasterPoolScreen = () => {
  const [casterPool, setCasterPool] = useState<CasterPool>(
    new CasterPool([], []),
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [port, setPort] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAddressChange = text => {
    setAddress(text);
  };

  const handlePortChange = text => {
    setPort(text);
  };

  const handleUsernameChange = text => {
    setUsername(text);
  };

  const handlePasswordChange = text => {
    setPassword(text);
  };

  const handleFormSubmit = () => {
    // Handle form submission logic here
    toggleModal();
    casterPool.addCaster(new SourceTable(address), username, password);
    setCasterPool(casterPool);
    console.log(casterPool);
    console.log(
      `Address: ${address}, Port: ${port}, Username: ${username}, Password: ${password}`,
    );
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    try {
      setCasterPool(casterPool);
    } catch (e) {
      console.log(e);
    }
  }, []);

  function formatData() {
    return [
      {
        title: 'Active casters',
        data: casterPool.subscribed,
      },
      {
        title: 'Saved casters',
        data: casterPool.unsubscribed,
      },
    ];
  }

  function showCasterInfo(item) {
    return Alert.alert('TODO');
  }

  function upArrow(item: CasterPoolEntry) {
    console.log(casterPool);
    casterPool.subscribe(item.sourceTable);
    setCasterPool(
      new CasterPool(casterPool.subscribed, casterPool.unsubscribed),
    );
  }

  function downArrow(item: CasterPoolEntry) {
    console.log(casterPool);
    casterPool.unsubscribe(item.sourceTable);
    setCasterPool(
      new CasterPool(casterPool.subscribed, casterPool.unsubscribed),
    );
  }

  const HeaderMoreButton = () => {
    toggleModal();
  };

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
          Manage
        </Text>
        <Pressable style={styles.TabButton} onPress={HeaderMoreButton}>
          <MaterialIcons name="add" color={'white'} size={25} />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      <Modal
        style={styles.modal}
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        onSwipeComplete={toggleModal}
        swipeDirection={['down']}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <View style={styles.container}>
          <Text style={styles.header}>Ajouter un caster</Text>
          <TextInput
            mode="outlined"
            style={styles.textinput}
            label="Address"
            value={address}
            onChangeText={handleAddressChange}
          />
          <TextInput
            mode="outlined"
            style={styles.textinput}
            label="Port"
            value={port}
            onChangeText={handlePortChange}
            keyboardType="numeric"
          />
          <TextInput
            mode="outlined"
            style={styles.textinput}
            label="Username"
            value={username}
            onChangeText={handleUsernameChange}
          />
          <TextInput
            mode="outlined"
            style={styles.textinput}
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
          />
          <Pressable style={styles.TabButton} onPress={handleFormSubmit}>
            <View style={styles.item}>
              <Text style={styles.title}>Ajouter Caster</Text>
              <MaterialIcons name="add" color={'white'} size={25} />
            </View>
          </Pressable>
        </View>
      </Modal>

      <SectionList
        sections={formatData()}
        keyExtractor={(item, index) => item.sourceTable.adress + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.sourceTable.adress}</Text>
            <View style={{marginRight: 10, flexDirection: 'row'}}>
              {CasterPool.findCaster(
                item.sourceTable,
                casterPool.unsubscribed,
              ) !== -1 ? (
                <Pressable
                  style={{padding: 3}}
                  onPress={() => {
                    upArrow(item);
                  }}>
                  <MaterialIcons
                    name="arrow-upward"
                    color={'#5bcf70'}
                    size={25}
                  />
                </Pressable>
              ) : (
                <Pressable
                  style={{padding: 3}}
                  onPress={() => {
                    downArrow(item);
                  }}>
                  <MaterialIcons
                    name="arrow-downward"
                    color={'#d43f35'}
                    size={25}
                  />
                </Pressable>
              )}
              <Pressable
                style={{padding: 3}}
                onPress={() => {
                  showCasterInfo(item);
                }}>
                <MaterialIcons name="info" color={'white'} size={25} />
              </Pressable>
            </View>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  modal: {
    margin: 0, // This is the important style you need to set
  },
  item: {
    backgroundColor: '#3F4141',
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  header: {
    fontSize: 25,
    color: 'white',
    marginLeft: 15,
    paddingTop: 20,
    paddingBottom: 5,
  },

  title: {
    marginHorizontal: 10,
    fontSize: 20,
    color: 'white',
  },
  sortButton: {
    flex: 1,
    backgroundColor: '#151515',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  textinput: {
    margin: 10,
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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

export default CasterPoolScreen;
