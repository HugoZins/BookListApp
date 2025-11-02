import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = "http://192.168.1.XX:3000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

const BOOKS_KEY = 'books_offline';

export interface Book {
  id: number;
  name: string;
  author: string;
  editor: string;
  year: number;
  read: boolean;
  favorite: boolean;
  rating: number | null;
  cover: string | null;
  theme?: string;
}

export interface Note {
  id: number;
  bookId: number;
  content: string;
  dateISO: string;
}

const saveOffline = async (books: Book[]) => {
  await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
};

const loadOffline = async (): Promise<Book[]> => {
  const data = await AsyncStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const fetchBooks = async (params = {}) => {
  try {
    const res = await api.get('/books', { params });
    const books = res.data;
    await saveOffline(books);
    return books;
  } catch {
    return loadOffline();
  }
};

export const createBook = async (book: Omit<Book, 'id'>) => {
  const res = await api.post('/books', book);
  const newBook = res.data;
  const books = await loadOffline();
  await saveOffline([...books, newBook]);
  return newBook;
};

export const updateBook = async (id: number, book: Partial<Book>) => {
  const res = await api.put(`/books/${id}`, book);
  const updated = res.data;
  const books = await loadOffline();
  await saveOffline(books.map(b => b.id === id ? updated : b));
  return updated;
};

export const deleteBook = async (id: number) => {
  await api.delete(`/books/${id}`);
  const books = await loadOffline();
  await saveOffline(books.filter(b => b.id !== id));
};

export const fetchBook = async (id: number): Promise<Book> => {
  try {
    const res = await api.get(`/books/${id}`);
    return res.data;
  } catch (error) {
    console.warn("Mode hors ligne : chargement du livre depuis le cache");
    const books = await loadOffline();
    const book = books.find(b => b.id === id);
    if (!book) {
      throw new Error("Livre non trouvé dans le cache");
    }
    return book;
  }
};

export const fetchNotes = async (bookId: number): Promise<Note[]> => {
  try {
    const res = await api.get(`/books/${bookId}/notes`);
    return res.data;
  } catch (error) {
    console.warn("Mode hors ligne : notes non disponibles");
    return [];
  }
};

export const createNote = async (bookId: number, content: string) => {
  const res = await api.post(`/books/${bookId}/notes`, { content });
  return res.data;
};

export const toggleFavorite = async (id: number, current: boolean) => {
  return updateBook(id, { favorite: !current });
};

export const fetchOpenLibraryEditions = async (title: string): Promise<number> => {
  try {
    const res = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`, {
      timeout: 4000,
    });
    return res.data.numFound || 0;
  } catch {
    return 0;
  }
};