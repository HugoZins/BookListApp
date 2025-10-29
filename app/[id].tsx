import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { fetchBooks, updateBook, Book } from "../lib/api";

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    author: "",
    editor: "",
    year: "",
    read: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      const books = await fetchBooks();
      const found = books.find((b) => b.id === Number(id));
      if (found) {
        setBook(found);
        setForm({
          name: found.name,
          author: found.author,
          editor: found.editor,
          year: found.year.toString(),
          read: found.read,
        });
      }
    };
    loadBook();
  }, [id]);

  const handleSave = async () => {
    if (!book) return;
    setSaving(true);
    try {
      await updateBook(book.id, {
        name: form.name,
        author: form.author,
        editor: form.editor,
        year: parseInt(form.year),
        read: form.read,
      });
      Alert.alert("Succès", "Livre modifié !");
      setEditing(false);
      const updated = await fetchBooks();
      const b = updated.find((x) => x.id === book.id);
      if (b) setBook(b);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de sauvegarder");
    } finally {
      setSaving(false);
    }
  };

  if (!book) return <Text>Chargement...</Text>;

  return (
    <View style={styles.container}>
      {editing ? (
        <>
          <TextInput
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
            style={styles.input}
          />
          <TextInput
            value={form.author}
            onChangeText={(t) => setForm({ ...form, author: t })}
            style={styles.input}
          />
          <TextInput
            value={form.editor}
            onChangeText={(t) => setForm({ ...form, editor: t })}
            style={styles.input}
          />
          <TextInput
            value={form.year}
            onChangeText={(t) => setForm({ ...form, year: t })}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.row}>
            <Text>Lu :</Text>
            <Switch
              value={form.read}
              onValueChange={(v) => setForm({ ...form, read: v })}
            />
          </View>
          <Button title="Sauvegarder" onPress={handleSave} disabled={saving} />
          <Button
            title="Annuler"
            onPress={() => setEditing(false)}
            color="gray"
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>{book.name}</Text>
          <Text style={styles.author}>par {book.author}</Text>
          <Text style={styles.meta}>
            {book.editor} • {book.year}
          </Text>
          <Text
            style={[styles.status, book.read ? styles.read : styles.unread]}
          >
            {book.read ? "Lu" : "Non lu"}
          </Text>
          <Button title="Modifier" onPress={() => setEditing(true)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  author: { fontSize: 18, color: "#555", marginBottom: 8 },
  meta: { fontSize: 16, color: "#888", marginBottom: 16 },
  status: { fontSize: 16, marginBottom: 30 },
  read: { color: "green" },
  unread: { color: "#CC5500" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
