import Base from '../../../fc/Caster/Base';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';
import {Pressable, Text, TouchableWithoutFeedback, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryFlag from 'react-native-country-flag';
import {getDistance} from 'geolib';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {styles} from './CasterScreen';

export interface ConnectedBaseProps {
  showBaseInfo: (item: Base | null) => void;
  latitude: number;
  longitude: number;
}
export default observer(function ConnectedBase({
  showBaseInfo,
  latitude,
  longitude,
}: ConnectedBaseProps) {
  const store = useStoreContext();

  return (
    <View>
      {store.casterConnection.connectedBase !== null && (
        <TouchableWithoutFeedback
          delayLongPress={300}
          onLongPress={() =>
            showBaseInfo(store.casterConnection.connectedBase)
          }>
          <View style={styles.itemConnected}>
            <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {store.casterConnection.connectedBase.country == null ? (
                  <MaterialCommunityIcons
                    name="map-marker-question-outline"
                    color={'white'}
                    size={30}
                  />
                ) : (
                  <CountryFlag
                    isoCode={store.casterConnection.connectedBase.country}
                    size={21}
                  />
                )}
                <Text style={styles.title}>
                  {'  ' + store.casterConnection.connectedBase.mountpoint}
                </Text>
                <Text
                  style={{
                    fontStyle: 'italic',
                    fontSize: 15,
                    color: 'darksalmon',
                  }}>
                  {' '}
                  {Math.floor(
                    getDistance(
                      {
                        latitude: store.casterConnection.connectedBase.latitude,
                        longitude:
                          store.casterConnection.connectedBase.longitude,
                      },
                      {latitude: latitude, longitude: longitude},
                    ) / 1000,
                  )}{' '}
                  km
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Pressable
                  onPress={() => {
                    store.casterConnection.resetConnection();
                  }}>
                  <MaterialIcons name="close" color={'white'} size={40} />
                </Pressable>
              </View>
              <View>
                <Pressable
                  onPress={() => {
                    showBaseInfo(store.casterConnection.connectedBase);
                  }}>
                  <MaterialIcons name="more-horiz" color={'white'} size={40} />
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
});
