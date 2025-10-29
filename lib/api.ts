const API_URL = 'http://localhost:3000';

export interface Book {
  id: number;
  name: string;
  author: string;
  editor: string;
  year: number;
  read: boolean;
}

export const fetchBooks = async (): Promise<Book[]> => {
  const res = await fetch(`${API_URL}/books`);
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