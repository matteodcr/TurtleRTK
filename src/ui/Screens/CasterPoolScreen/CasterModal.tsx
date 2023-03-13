import Modal from 'react-native-modal';
import {ScrollView, Text, View} from 'react-native';
import {Button, Chip, Paragraph} from 'react-native-paper';
import React from 'react';
import {styles} from './CasterPoolScreen';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';
import SourceTable from '../../../fc/Caster/SourceTable';

interface CasterModalProps {
  selectedSourceTable: SourceTable;
  isInfoVisible: boolean;
  toogleInfo(): void;
}
export default observer(function CasterModal({
  selectedSourceTable,
  isInfoVisible,
  toogleInfo,
}: CasterModalProps) {
  const store = useStoreContext();
  const caster = selectedSourceTable.entries.casterList[0];
  return (
    <Modal
      style={styles.modal}
      isVisible={isInfoVisible}
      useNativeDriver={true}
      onBackButtonPress={toogleInfo}
      onSwipeComplete={toogleInfo}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.container}>
        <ScrollView>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          />
          <Text style={styles.header}>{caster.host}</Text>
          <View style={styles.container}>
            <View style={styles.chipsContainer}>
              <Chip style={styles.chip} icon="dns">
                Identifier : {caster.identifier}
              </Chip>
              <Chip style={styles.chip} icon="router">
                Port : {caster.port}
              </Chip>
              <Chip style={styles.chip}>
                Operator : {String(caster.operator)}
              </Chip>
              <Chip style={styles.chip}>Country : {caster.country}</Chip>
              <Chip style={styles.chip}>VRS : {String(caster.nmea)}</Chip>
            </View>
            <View style={styles.header}>
              <Paragraph style={styles.title}>
                Position : {caster.latitude}, {caster.longitude}
              </Paragraph>
              <Paragraph style={styles.title}>
                Fallback IP : {caster.fallbackHost}
              </Paragraph>
              <Paragraph style={styles.title}>
                Fallback host : {caster.fallbackHost}
              </Paragraph>
              <Paragraph style={styles.title}>Misc : {caster.misc}</Paragraph>
            </View>
            <Button
              style={{marginHorizontal: 100, marginTop: 20}}
              mode="contained"
              onPress={() => {
                store.casterPool.removeCaster(selectedSourceTable);
                toogleInfo();
              }}
              loading={store.casterPool.isLoading}>
              Remove
            </Button>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
});
