import React, {useState} from 'react';
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
import {useStoreContext} from '../../fc/Caster/Store';

import Modal from 'react-native-modal';
import SourceTable from '../../fc/Caster/SourceTable';
import {observer} from 'mobx-react-lite';

export default observer(function CasterPoolScreen() {
  const store = useStoreContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('caster.centipede.fr');
  const [port, setPort] = useState('2101');
  const [username, setUsername] = useState('centipede');
  const [password, setPassword] = useState('centipede');

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
    toggleModal();
    const sourceTable: SourceTable = new SourceTable(
      address,
      +port,
      username,
      password,
    );
    store.casterPool.addCaster(sourceTable);
    store.basePool.generate(store.casterPool);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  function showCasterInfo(item) {
    return Alert.alert('TODO');
  }

  function upArrow(item: SourceTable) {
    store.casterPool.subscribe(item);
  }

  function downArrow(item: SourceTable) {
    store.casterPool.unsubscribe(item);
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

  const renderModal = () => {
    return (
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
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.adress}</Text>
      <View
        style={{marginRight: 10, flexDirection: 'row', alignItems: 'flex-end'}}>
        {store.casterPool.findCaster(
          item.sourceTable,
          store.casterPool.unsubscribed,
        ) !== -1 ? (
          <Pressable
            style={{padding: 3}}
            onPress={() => {
              upArrow(item);
            }}>
            <MaterialIcons name="arrow-upward" color={'#5bcf70'} size={25} />
          </Pressable>
        ) : (
          <Pressable
            style={{padding: 3}}
            onPress={() => {
              downArrow(item);
            }}>
            <MaterialIcons name="arrow-downward" color={'#d43f35'} size={25} />
          </Pressable>
        )}
        <View>
          <Pressable
            style={{padding: 3}}
            onPress={() => {
              showCasterInfo(item);
            }}>
            <MaterialIcons name="info" color={'white'} size={25} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeaderTab()}
      {renderModal()}

      <SectionList
        sections={store.casterPool.formatData}
        keyExtractor={(item, index) => item.adress + index}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
});

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
