// app/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import {
  fetchBook,
  updateBook,
  fetchNotes,
  createNote,
  toggleFavorite,
  Book,
  Note,
} from "../lib/api";
import Toast from "react-native-toast-message";

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);

  // État pour le mode édition
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Omit<Book, "id">>({
    name: "",
    author: "",
    editor: "",
    year: 0,
    read: false,
    favorite: false,
  });

  // Chargement des données
  const loadData = async () => {
    setLoading(true);
    try {
      const [b, n] = await Promise.all([
        fetchBook(Number(id)),
        fetchNotes(Number(id)),
      ]);
      setBook(b);
      setForm({
        name: b.name,
        author: b.author,
        editor: b.editor,
        year: b.year,
        read: b.read,
        favorite: b.favorite,
      });
      setNotes(n);
    } catch {
      Alert.alert("Erreur", "Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Sauvegarde des modifications
  const handleSave = async () => {
    try {
      const updated = await updateBook(Number(id), form);
      setBook(updated);
      setEditing(false);
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Livre mis à jour !",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de sauvegarder",
      });
    }
  };

  // Ajout d'une note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setSavingNote(true);
    try {
      const note = await createNote(Number(id), newNote.trim());
      setNotes([note, ...notes]);
      setNewNote("");
      Toast.show({
        type: "success",
        text1: "Note ajoutée !",
        text2: new Date().toLocaleTimeString("fr"),
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible d’ajouter la note",
      });
    } finally {
      setSavingNote(false);
    }
  };

  // Favori
  const toggleFav = async () => {
    if (!book) return;
    try {
      const updated = await toggleFavorite(book.id, book.favorite);
      setBook(updated);
      setForm({ ...form, favorite: updated.favorite });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de modifier le favori",
      });
    }
  };

  // États de chargement
  if (loading) return <Text style={styles.center}>Chargement...</Text>;
  if (!book) return <Text style={styles.center}>Livre non trouvé</Text>;

  return (
    <View style={styles.container}>
      {/* === MODE ÉDITION === */}
      {editing ? (
        <View>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
            placeholder="Titre"
          />
          <TextInput
            style={styles.input}
            value={form.author}
            onChangeText={(v) => setForm({ ...form, author: v })}
            placeholder="Auteur"
          />
          <TextInput
            style={styles.input}
            value={form.editor}
            onChangeText={(v) => setForm({ ...form, editor: v })}
            placeholder="Éditeur"
          />
          <TextInput
            style={styles.input}
            value={form.year.toString()}
            onChangeText={(v) => setForm({ ...form, year: Number(v) || 0 })}
            placeholder="Année"
            keyboardType="numeric"
          />
          <View style={styles.row}>
            <Text>Lu ?</Text>
            <Switch
              value={form.read}
              onValueChange={(v) => setForm({ ...form, read: v })}
            />
          </View>

          <View style={styles.buttons}>
            <Button title="Annuler" onPress={() => setEditing(false)} />
            <Button title="Sauvegarder" onPress={handleSave} />
          </View>
        </View>
      ) : (
        <>
          {/* === AFFICHAGE NORMAL === */}
          <Text style={styles.title}>{book.name}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <Text style={styles.meta}>
            {book.editor} • {book.year}
          </Text>

          {/* CŒUR FAVORI */}
          <TouchableOpacity onPress={toggleFav} style={styles.fav}>
            <Text style={styles.heart}>
              {book.favorite ? "❤️" : "♡"} Favori
            </Text>
          </TouchableOpacity>

          {/* BOUTON MODIFIER */}
          <Button title="Modifier le livre" onPress={() => setEditing(true)} />

          {/* AJOUT NOTE */}
          <View style={styles.addNote}>
            <TextInput
              style={styles.input}
              placeholder="Ajouter une note..."
              value={newNote}
              onChangeText={setNewNote}
            />
            <Button
              title={savingNote ? "..." : "Ajouter"}
              onPress={handleAddNote}
              disabled={savingNote}
            />
          </View>

          {/* LISTE DES NOTES */}
          <Text style={styles.section}>Notes ({notes.length})</Text>
          {notes.length === 0 ? (
            <Text style={styles.empty}>Aucune note</Text>
          ) : (
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.note}>
                  <Text style={styles.noteContent}>{item.content}</Text>
                  <Text style={styles.noteDate}>
                    {new Date(item.dateISO).toLocaleDateString("fr")}
                  </Text>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  author: { fontSize: 18, color: "#555", marginTop: 4 },
  meta: { fontSize: 14, color: "#888", marginTop: 4 },
  center: { flex: 1, textAlign: "center", marginTop: 50, color: "#666" },
  fav: { marginVertical: 12 },
  heart: { fontSize: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  addNote: { flexDirection: "row", gap: 8, marginVertical: 12 },
  section: { fontSize: 18, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  empty: { color: "#999", fontStyle: "italic" },
  note: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  noteContent: { fontSize: 16 },
  noteDate: { fontSize: 12, color: "#999", marginTop: 4 },
});
