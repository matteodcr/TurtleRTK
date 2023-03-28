import React, {useState} from 'react';

import {SafeAreaView} from 'react-native';
import {useStoreContext} from '../../../fc/Store';

import SourceTable from '../../../fc/Caster/SourceTable';
import {observer} from 'mobx-react-lite';
import HeaderCasterPoolScreen from './HeaderCasterPoolScreen';

import CasterList from './CasterList';
import CasterModal from './CasterModal';
import FormModal from './FormModal';
import {ConnectionStatusBar} from 'react-native-ui-lib';

import {casterPoolStyle} from '../Styles';
export const styles = casterPoolStyle;

export default observer(function CasterPoolScreen() {
  const store = useStoreContext();
  const mockSourceTable = new SourceTable(
    store.casterPool,
    'None',
    2101,
    'None',
    'None',
    true,
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
      store.casterPool.isNTRIPv1,
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
      <ConnectionStatusBar
        onConnectionChange={() => console.log('connection changed')}
      />
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
