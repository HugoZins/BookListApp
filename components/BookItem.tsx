import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Book, deleteBook } from "../lib/api";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

export default function BookItem({
  book,
  onUpdate,
}: {
  book: Book;
  onUpdate: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBook(book.id);
      onUpdate();
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* === AFFICHAGE DU LIVRE === */}
      <Link href={`/${book.id}`} asChild>
        <TouchableOpacity style={styles.content}>
          <Text style={styles.title}>{book.name}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <Text style={styles.meta}>
            {book.editor} • {book.year}
          </Text>
          <Text style={styles.status}>{book.read ? "Lu" : "Non lu"}</Text>
        </TouchableOpacity>
      </Link>

      {/* === BOUTON SUPPRIMER === */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          disabled={deleting}
        >
          <Text style={styles.delete}>
            {deleting ? "Suppression..." : "Supprimer"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* === MODALE DE CONFIRMATION === */}
      <DeleteModal
        visible={modalVisible}
        book={book}
        onConfirm={handleDelete}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600" },
  author: { color: "#555", marginTop: 2 },
  meta: { fontSize: 12, color: "#888", marginTop: 4 },
  status: { fontSize: 14, color: "#666", marginTop: 4 },
  actions: { justifyContent: "center" },
  delete: { color: "#FF3B30", fontWeight: "bold" },
});
