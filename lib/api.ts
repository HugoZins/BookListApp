const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

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

export const fetchBooks = async (params: {
  q?: string;
  read?: boolean;
  favorite?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
} = {}): Promise<Book[]> => {
  const url = new URL(`${API_URL}/books`);
  if (params.q) url.searchParams.append('q', params.q);
  if (params.read !== undefined) url.searchParams.append('read', params.read.toString());
  if (params.favorite !== undefined) url.searchParams.append('favorite', params.favorite.toString());
  if (params.sort) url.searchParams.append('sort', params.sort);
  if (params.order) url.searchParams.append('order', params.order);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erreur chargement');
  return res.json();
};

export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const res = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Erreur création');
  return res.json();
};

export const updateBook = async (id: number, book: Partial<Book>): Promise<Book> => {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Erreur mise à jour');
  return res.json();
};

export const deleteBook = async (id: number): Promise<void> => {
  const url = `${API_URL}/books/${id}`;

  try {
    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok && res.status !== 404) {
      const txt = await res.text();
      console.error("Erreur serveur:", txt);
      throw new Error(`Suppression échouée: ${txt}`);
    }
  } catch (err: any) {
    console.error("ERREUR RÉSEAU:", err);
    throw err;
  }
};

export const toggleRead = async (id: number, currentRead: boolean): Promise<Book> => {
  return updateBook(id, { read: !currentRead });
};

export const fetchBook = async (id: number): Promise<Book> => {
  const res = await fetch(`${API_URL}/books/${id}`);
  if (!res.ok) throw new Error("Livre non trouvé");
  return res.json();
};

export const fetchNotes = async (bookId: number): Promise<Note[]> => {
  const res = await fetch(`${API_URL}/books/${bookId}/notes`);
  if (!res.ok) throw new Error("Erreur chargement notes");
  return res.json();
};

export const createNote = async (bookId: number, content: string): Promise<Note> => {
  const res = await fetch(`${API_URL}/books/${bookId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Erreur ajout note");
  return res.json();
};

export const toggleFavorite = async (id: number, current: boolean): Promise<Book> => {
  return updateBook(id, { favorite: !current });
};