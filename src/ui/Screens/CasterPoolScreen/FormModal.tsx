import Modal from 'react-native-modal';
import {ScrollView, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import React from 'react';
import {styles} from './CasterPoolScreen';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';
import SourceTable from '../../../fc/Caster/SourceTable';

interface FormModalProps {
  isFormVisible: boolean;
  toogleForm(): void;
  address: string;
  handleAddressChange(string): void;
  port: string;
  handlePortChange(number): void;
  username: string;
  handleUsernameChange(string): void;
  password: string;
  handlePasswordChange(string): void;
  handleFormSubmit(): void;
}

export default observer(function FormModal({
  isFormVisible,
  toogleForm,
  address,
  handleAddressChange,
  port,
  handlePortChange,
  username,
  handleUsernameChange,
  password,
  handlePasswordChange,
  handleFormSubmit,
}: FormModalProps) {
  const store = useStoreContext();

  return (
    <Modal
      style={styles.modal}
      isVisible={isFormVisible}
      useNativeDriver={true}
      onBackButtonPress={toogleForm}
      onSwipeComplete={toogleForm}
      swipeDirection={['down']}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.header}>New caster</Text>
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
          <Button
            style={{marginHorizontal: 100, marginTop: 20}}
            mode="contained"
            onPress={handleFormSubmit}
            loading={store.casterPool.isLoading}>
            Add this caster
          </Button>
        </ScrollView>
      </View>
    </Modal>
  );
});
