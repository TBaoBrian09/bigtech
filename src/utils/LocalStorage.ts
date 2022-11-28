import AsyncStorage from '@react-native-async-storage/async-storage';

export const PROFILE = 'PROFILE';
export const TOKEN = 'TOKEN';

const storeData = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Save data error', e);
  }
};

const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Get data error', e);
    return null;
  }
};

const storeValue = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Save data error', e);
  }
};

const getValue = async (key: string) => {
  try {
    const value: any = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('Save data error', e);
  }
};

export default {
  storeData,
  getData,
  storeValue,
  getValue,
  keys: {
    PROFILE,
    TOKEN,
  },
};
