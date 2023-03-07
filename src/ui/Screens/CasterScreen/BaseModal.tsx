import Modal from 'react-native-modal';
import {ScrollView, Text, View} from 'react-native';
import {Chip, Paragraph} from 'react-native-paper';
import React from 'react';

const toogleInfo = () => {
  setInfoVisible(!isInfoVisible);
};

function showBaseInfo(item) {
  setSelectedBase(item);
  toogleInfo();
}

const renderBaseModal = () => {
  const base = selectedBase;
  return (
    <Modal
      style={styles.modal}
      isVisible={isInfoVisible}
      onBackButtonPress={toogleInfo}
      onSwipeComplete={toogleInfo}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.headerTab}>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
          }}>
          {base.mountpoint}
        </Text>
      </View>
      <View style={styles.container}>
        <ScrollView>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          />
          <View style={styles.container}>
            <View style={styles.chipsContainer}>
              <Chip style={styles.chip} icon="dns">
                Identifier : {base.identifier}
              </Chip>
              <Chip style={styles.chip} icon="account-key">
                Authentification : {base.authentification}
              </Chip>
              <Chip style={styles.chip} icon="arrow-u-left-top-bold">
                VRS : {String(String(base.nmea))}
              </Chip>
              <Chip style={styles.chip} icon="earth">
                Country : {base.country}
              </Chip>
              <Chip style={styles.chip} icon="wallet">
                Fee : {String(base.fee)}
              </Chip>
              <Chip style={styles.chip} icon="vector-triangle">
                Network of base : {String(base.solution)}
              </Chip>
              <Chip style={styles.chip} icon="human-queue">
                Network : {base.network}
              </Chip>
            </View>
            <View style={styles.baseText}>
              <Paragraph style={styles.baseText}>
                Position : {base.latitude}, {base.longitude}
              </Paragraph>
              <Paragraph style={styles.baseText}>
                Bitrate : {base.bitrate} bits per second
              </Paragraph>
              <Paragraph style={styles.baseText}>
                Network : {base.network}
              </Paragraph>
              <Paragraph style={styles.baseText}>
                Format : {base.format + ' (' + base.formatDetails + ')'}
              </Paragraph>
              <Paragraph style={styles.baseText}>
                Carrier : {base.carrier}
              </Paragraph>
              <Paragraph style={styles.baseText}>
                NavSystem : {base.navSystem}
              </Paragraph>
              <Paragraph style={styles.baseText}>
                Compression : {base.compression}
              </Paragraph>
              <Paragraph style={styles.baseText}>Misc : {base.misc}</Paragraph>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
