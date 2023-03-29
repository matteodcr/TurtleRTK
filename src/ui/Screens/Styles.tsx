/* eslint-disable prettier/prettier */
import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import { useStoreContext } from '../../fc/Store';


const store = useStoreContext();

// styles de base, globaux à toute l'application
export const baseStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: store.settings.darkTheme ? '#222' : '#FCFCFC',
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headerTab: {
    backgroundColor: store.settings.darkTheme ? '#111111' : '#dedcdc',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: store.settings.darkTheme ? '#151515' : '#E0E0E0',
    borderBottomWidth: 1,
    height: store.settings.bigFontEnabled ? 70 : 50,
    alignItems: 'center',
  },
  boldText:{
    marginLeft: 15,
    fontSize: store.settings.bigFontEnabled ? 40 : 18,
    fontWeight: 'bold',
    color: store.settings.darkTheme ? 'white' : 'dark',
  },
  text:{
    fontSize: store.settings.bigFontEnabled ? 25 : 15,
    color: store.settings.darkTheme ? 'white' : 'dark',
  }
});

// specs de la classe details ble
const ajouts_details_ble = StyleSheet.create({
  detailsTitle: {
    fontSize: store.settings.bigFontEnabled ? 28 : 18,
    color: store.settings.darkTheme ? 'white' : 'dark',
    fontWeight: 'bold',
  },
  detailsSection: {
    fontSize: store.settings.bigFontEnabled ? 28 : 18,
    color:store.settings.darkTheme ? 'white' : 'dark',
    marginTop: 15,
  },
  details: {
    fontSize: store.settings.bigFontEnabled ? 25 : 15,
    color: store.settings.darkTheme ? 'white' : 'dark',
  },
  Title: {
    fontSize: store.settings.bigFontEnabled ? 45 : 30,
    color:store.settings.darkTheme ? 'white' : 'dark',
    marginBottom: 20,
  },
});

// concaténation des styles
export const details_bleStyle = StyleSheet.flatten([baseStyle, ajouts_details_ble]);

// specs de l'écran recording
const ajouts_recording_screen = StyleSheet.create({
  modal: {
    margin: 0, // This is the important style you need to set
  },
  item: {
    backgroundColor: store.settings.darkTheme ? '#3F4141' : '#3F728B',
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  header: {
    fontSize: store.settings.bigFontEnabled ? 40 : 25,
    color: store.settings.darkTheme ? 'white' : 'dark',
    marginLeft: 15,
    paddingTop: 20,
    paddingBottom: 5,
  },
  title: {
    marginHorizontal: 10,
    marginVertical: 5,
    fontSize: store.settings.bigFontEnabled ? 32 : 20,
    color: store.settings.darkTheme ? 'white' : 'dark',
  },
  sortButton: {
    flex: 1,
    backgroundColor: store.settings.darkTheme ? '#151515' : '#82B5CE',
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
    backgroundColor: store.settings.darkTheme ? '#151515' : '#82B5CE',
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
});

export const recStyle = StyleSheet.flatten([baseStyle, ajouts_recording_screen]);

const ajoutsRover = StyleSheet.create({
  sortButton: {
    flexDirection: 'row',
    backgroundColor: store.settings.darkTheme ? '#151515' : '#82B5CE',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centeredText: {
    color: store.settings.darkTheme ? 'white' : 'dark',
    fontSize: store.settings.bigFontEnabled ? 35 : 20,
    textAlign: 'center',
    marginVertical: 15,
},
})

export const RoverStyle = StyleSheet.flatten([baseStyle, ajoutsRover]);

// specs de la vue caster pool
const ajouts_caster_pool = StyleSheet.create({
    modal: {
      margin: 0, // This is the important style you need to set
    },
    TabButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    chipsContainer: {
      paddingTop: 10,
      paddingLeft: 15,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 4,
    },
  });

export const casterPoolStyle = StyleSheet.flatten([recStyle, ajouts_caster_pool]);

// specs de la vue caster
export const ajoutsCaster = StyleSheet.create({
    textinput: {
        height: 50,
        borderColor: '#919191',
        borderWidth: 1,
        margin: 10,
        paddingLeft: 15,
        borderRadius: 10,
        color: store.settings.darkTheme ? 'white' : 'dark',
        backgroundColor: store.settings.darkTheme ? '#151515' : '#82B5CE',
      },
      itemConnected: {
        backgroundColor: 'green',
        padding: 12,
        marginTop: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
      },
      baseText: {
        fontSize: store.settings.bigFontEnabled ? 30 : 20,
        color: store.settings.darkTheme ? 'white' : 'dark',
        paddingHorizontal: 10,
        paddingVertical: 5,
      },
      textCity: {
        fontStyle: 'italic',
        fontSize: store.settings.bigFontEnabled ? 22 : 15,
        color: 'lightgrey',
      },
      textDistance: {
        fontStyle: 'italic',
        fontSize: store.settings.bigFontEnabled ? 22 : 15,
        color: 'darksalmon',
      },
});

export const styleCaster = StyleSheet.flatten([casterPoolStyle, ajoutsCaster]);

export const errorStyle = StyleSheet.create({
  errorView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});




export const PeripheralListItemStyle = StyleSheet.create({
  item: {
    backgroundColor: '#3F4141',
    padding: 20,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  deviceName: {
    marginRight: 10,
    color: store.settings.darkTheme ? 'white' : 'dark',
  },
  deviceId: {
    color: 'gray',
  }
});