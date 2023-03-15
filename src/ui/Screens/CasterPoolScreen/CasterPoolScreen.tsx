import React, {useState} from 'react';

import {SafeAreaView, StyleSheet} from 'react-native';
import {useStoreContext} from '../../../fc/Store';

import SourceTable from '../../../fc/Caster/SourceTable';
import {observer} from 'mobx-react-lite';
import HeaderCasterPoolScreen from './HeaderCasterPoolScreen';

import CasterList from './CasterList';
import CasterModal from './CasterModal';
import FormModal from './FormModal';

export default observer(function CasterPoolScreen() {
  const store = useStoreContext();
  const mockSourceTable = new SourceTable(
    store.casterPool,
    'None',
    2101,
    'None',
    'None',
  );
  mockSourceTable.getMockSourceTable();
  const [isFormVisible, setFormVisible] = useState(false);
  const [isInfoVisible, setInfoVisible] = useState(false);
  const [address, setAddress] = useState('caster.centipede.fr');
  const [port, setPort] = useState('2101');
  const [username, setUsername] = useState('centipede');
  const [password, setPassword] = useState('centipede');

  const [selectedSourceTable, setSelectedSourceTable] =
    useState(mockSourceTable);

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
    const sourceTable: SourceTable = new SourceTable(
      store.casterPool,
      address,
      +port,
      username,
      password,
    );
    try {
      store.casterPool.addCaster(sourceTable);
    } catch (error) {
      toogleForm();
      store.errorManager.printError(String(error));
      store.casterPool.setTyping(false);
    }
  };

  const toogleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const toogleInfo = () => {
    setInfoVisible(!isInfoVisible);
  };

  function showCasterInfo(item) {
    setSelectedSourceTable(item);
    toogleInfo();
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderCasterPoolScreen toogleForm={toogleForm} />
      <CasterModal
        selectedSourceTable={selectedSourceTable}
        isInfoVisible={isInfoVisible}
        toogleInfo={toogleInfo}
      />
      <FormModal
        isFormVisible={isFormVisible}
        toogleForm={toogleForm}
        address={address}
        handleAddressChange={handleAddressChange}
        port={port}
        handlePortChange={handlePortChange}
        username={username}
        handleUsernameChange={handleUsernameChange}
        password={password}
        handlePasswordChange={handlePasswordChange}
        handleFormSubmit={handleFormSubmit}
      />
      <CasterList showCasterInfo={showCasterInfo} />
    </SafeAreaView>
  );
});

export const styles = StyleSheet.create({
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
    alignItems: 'center',
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
    marginVertical: 5,
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
  chipsContainer: {
    paddingLeft: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
  },
});
