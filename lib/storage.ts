import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKS_KEY = 'books_offline';

export const saveBooks = async (books: any[]) => {
  await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
};

export const loadBooks = async (): Promise<any[]> => {
  const data = await AsyncStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
};