/* eslint-disable prettier/prettier */
import React from 'react';
import {
    StyleSheet,
} from 'react-native';

// styles de base, globaux à toute l'application
export const baseStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  TabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
  boldText:{
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  text:{
    color: 'purple'
  }
});

// specs de la classe details ble
const ajouts_details_ble = StyleSheet.create({
  detailsTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  details: {
    fontSize: 15,
    color: 'white',
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
    paddingHorizontal: 50,
  },
});

export const recStyle = StyleSheet.flatten([baseStyle, ajouts_recording_screen]);

const ajoutsRover = StyleSheet.create({
  sortButton: {
    flexDirection: 'row',
    backgroundColor: '#151515',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})

export const RoverStyle = StyleSheet.flatten([baseStyle, ajoutsRover]);

// specs de la vue caster pool
const ajouts_caster_pool = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222',
    },
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
        color: 'white',
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
        fontSize: 20,
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
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
    color: 'white',
  },
  deviceId: {
    color: 'gray',
  }
});