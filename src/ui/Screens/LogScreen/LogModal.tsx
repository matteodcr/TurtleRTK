import Modal from 'react-native-modal';
import {ScrollView, Text, View} from 'react-native';
import {Button, Chip} from 'react-native-paper';
import React from 'react';
import {styles} from '../CasterScreen/CasterScreen';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';

interface LogModalProps {
  selectedLog: string;
  isLogVisible: boolean;
  modifyLogVisibility;
}

export default observer(function LogModal({
  selectedLog,
  isLogVisible,
  modifyLogVisibility,
}: LogModalProps) {
  const store = useStoreContext();
  return (
    <Modal
      style={styles.modal}
      useNativeDriver={true}
      isVisible={isLogVisible}
      onBackButtonPress={() => modifyLogVisibility(false)}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.headerTab}>
        {store.logManager.currentFile.infos !== undefined && (
          <Text
            style={{
              marginLeft: 15,
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {store.logManager.getFileName(
              store.logManager.currentFile.infos?.path,
            )}
          </Text>
        )}
      </View>
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        />
        <View style={styles.container}>
          {store.logManager.currentFile.infos !== undefined && (
            <View style={styles.chipsContainer}>
              <Chip style={styles.chip} icon="dns">
                Path: {store.logManager.currentFile.infos?.mode}
              </Chip>
              <Chip style={styles.chip} icon="dns">
                Ctime: {store.logManager.currentFile.infos?.ctime.toString()}
              </Chip>
              <Chip style={styles.chip} icon="dns">
                Mtime: {store.logManager.currentFile.infos?.mtime.toString()}
              </Chip>
              <Chip style={styles.chip} icon="dns">
                Size: {store.logManager.currentFile.infos?.size}
              </Chip>
            </View>
          )}
          <Button
            onPress={() =>
              console.log(store.logManager.getClearContent())
            }>
            View
          </Button>
          <ScrollView>
            <Text style={{color: 'white'}}>
              {store.logManager.getClearContent()}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});
