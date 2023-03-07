import Base from '../../../fc/Caster/Base';
import {observer} from 'mobx-react-lite';
import {useStoreContext} from '../../../fc/Store';
import {Pressable, Text, TouchableWithoutFeedback, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryFlag from 'react-native-country-flag';
import {getDistance} from 'geolib';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

export interface ChosenItemProps {
  showBaseInfo: (item: Base) => void;
}
observer(function ChosenItem({showBaseInfo}: ChosenItemProps) {
  const store = useStoreContext();
  if (store.casterConnection.connectedBase != null) {
    return (
      <TouchableWithoutFeedback
        delayLongPress={300}
        onLongPress={() => showBaseInfo(store.casterConnection.connectedBase)}>
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
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontStyle: 'italic',
                  fontSize: 15,
                  color: 'lightgrey',
                }}>
                {limitCityName(store.casterConnection.connectedBase.identifier)}
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
                      longitude: store.casterConnection.connectedBase.longitude,
                    },
                    {latitude: myLatitude, longitude: MyLongitude},
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
                  showBaseInfo(store.casterConnection.connectedBase);
                }}>
                <MaterialIcons name="more-horiz" color={'white'} size={40} />
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return;
});
