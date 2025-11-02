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
  Image,
  ScrollView,
} from "react-native";
import { Rating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import {
  fetchBook,
  updateBook,
  fetchNotes,
  createNote,
  toggleFavorite,
  fetchOpenLibraryEditions,
  Book,
  Note,
} from "../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const { isDark } = useTheme();
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [editions, setEditions] = useState<number>(0);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Omit<Book, "id">>({
    name: "",
    author: "",
    editor: "",
    year: 0,
    read: false,
    favorite: false,
    rating: 0,
    cover: "",
  });

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
        rating: b.rating || 0,
        cover: b.cover || "",
      });
      setNotes(n);

      if (b.name) {
        const count = await fetchOpenLibraryEditions(b.name);
        setEditions(count);
      }
    } catch {
      Alert.alert("Erreur", "Mode hors ligne activé");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setForm({ ...form, cover: result.assets[0].uri });
    }
  };

  if (loading)
    return (
      <Text style={[styles.center, isDark && styles.darkText]}>
        Chargement...
      </Text>
    );
  if (!book)
    return (
      <Text style={[styles.center, isDark && styles.darkText]}>
        Livre non trouvé
      </Text>
    );

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {editing ? (
        <ScrollView>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
            placeholder="Titre"
            placeholderTextColor={isDark ? "#aaa" : "#999"}
          />
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.author}
            onChangeText={(v) => setForm({ ...form, author: v })}
            placeholder="Auteur"
            placeholderTextColor={isDark ? "#aaa" : "#999"}
          />
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.editor}
            onChangeText={(v) => setForm({ ...form, editor: v })}
            placeholder="Éditeur"
            placeholderTextColor={isDark ? "#aaa" : "#999"}
          />
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={form.year.toString()}
            onChangeText={(v) => setForm({ ...form, year: Number(v) || 0 })}
            placeholder="Année"
            keyboardType="numeric"
            placeholderTextColor={isDark ? "#aaa" : "#999"}
          />
          <View style={styles.row}>
            <Text style={isDark && styles.darkText}>Lu ?</Text>
            <Switch
              value={form.read}
              onValueChange={(v) => setForm({ ...form, read: v })}
            />
          </View>
          <Rating
            startingValue={form.rating}
            ratingCount={5}
            imageSize={24}
            onFinishRating={(rating: any) =>
              setForm((prev) => ({ ...prev, rating }))
            }
            style={styles.rating}
            tintColor={isDark ? "#121212" : "#f9f9f9"}
          />
          <Button title="Choisir une couverture" onPress={pickImage} />
          {form.cover ? (
            <Image source={{ uri: form.cover }} style={styles.coverPreview} />
          ) : null}
          <View style={styles.buttons}>
            <Button title="Annuler" onPress={() => setEditing(false)} />
            <Button title="Sauvegarder" onPress={handleSave} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView>
          {book.cover ? (
            <Image source={{ uri: book.cover }} style={styles.coverImage} />
          ) : null}
          <Text style={[styles.title, isDark && styles.darkText]}>
            {book.name}
          </Text>
          <Text style={[styles.author, isDark && styles.darkText]}>
            {book.author}
          </Text>
          <Text style={[styles.meta, isDark && styles.darkText]}>
            {book.editor} • {book.year}
          </Text>
          <Rating
            startingValue={book.rating || 0}
            ratingCount={5}
            imageSize={24}
            readonly
            style={styles.rating}
            tintColor={isDark ? "#121212" : "#f9f9f9"}
          />
          <TouchableOpacity onPress={toggleFav} style={styles.fav}>
            <Ionicons
              name={book.favorite ? "heart" : "heart-outline"}
              size={28}
              color={book.favorite ? "#FF3B30" : isDark ? "#ccc" : "#666"}
            />
          </TouchableOpacity>

          <Text style={[styles.openLibrary, isDark && styles.darkText]}>
            Éditions OpenLibrary : {editions}
          </Text>

          <Button title="Modifier le livre" onPress={() => setEditing(true)} />

          <View style={styles.addNote}>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              placeholder="Ajouter une note..."
              value={newNote}
              onChangeText={setNewNote}
              placeholderTextColor={isDark ? "#aaa" : "#999"}
            />
            <Button
              title={savingNote ? "..." : "Ajouter"}
              onPress={handleAddNote}
              disabled={savingNote}
            />
          </View>

          <Text style={[styles.section, isDark && styles.darkText]}>
            Notes ({notes.length})
          </Text>
          {notes.length === 0 ? (
            <Text style={[styles.empty, isDark && styles.darkText]}>
              Aucune note
            </Text>
          ) : (
            <View style={{ paddingBottom: 150 }}>
              {notes.map((item) => (
                <View
                  key={item.id.toString()}
                  style={[styles.note, isDark && styles.darkNote]}
                >
                  <Text style={[styles.noteContent, isDark && styles.darkText]}>
                    {item.content}
                  </Text>
                  <Text style={[styles.noteDate, isDark && styles.darkText]}>
                    {new Date(item.dateISO).toLocaleDateString("fr")}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  darkContainer: { backgroundColor: "#121212" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginTop: 12 },
  author: { fontSize: 18, color: "#555", marginTop: 4 },
  meta: { fontSize: 14, color: "#888", marginTop: 4 },
  center: { flex: 1, textAlign: "center", marginTop: 50, color: "#666" },
  fav: { marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  darkInput: { backgroundColor: "#333", color: "#fff", borderColor: "#555" },
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
  darkNote: { backgroundColor: "#1e1e1e" },
  noteContent: { fontSize: 16 },
  noteDate: { fontSize: 12, color: "#999", marginTop: 4 },
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  coverPreview: { width: 100, height: 150, borderRadius: 8, marginVertical: 8 },
  rating: { marginVertical: 12 },
  openLibrary: {
    marginVertical: 12,
    fontStyle: "italic",
    color: "#6C5CE7",
    fontWeight: "600",
  },
  darkText: { color: "#fff" },
});
