// components/BookCard.tsx
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { Book, toggleFavorite, deleteBook } from "../lib/api";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import { Ionicons } from "@expo/vector-icons"; // ← AJOUT

export default function BookCard({
  book,
  onUpdate,
}: {
  book: Book;
  onUpdate: () => void;
}) {
  const [fav, setFav] = useState(book.favorite);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleFav = async () => {
    try {
      await toggleFavorite(book.id, fav);
      setFav(!fav);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

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
      {/* COUVERTURE */}
      <View style={styles.cover}>
        {book.cover ? (
          <Image source={{ uri: book.cover }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {book.name[0]?.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <Link href={`/${book.id}`} asChild>
        <TouchableOpacity style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {book.name}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
          <Text style={styles.meta}>
            {book.editor} • {book.year}
          </Text>
        </TouchableOpacity>
      </Link>

      {/* CŒUR FAVORI */}
      <TouchableOpacity onPress={toggleFav} style={styles.fav}>
        <Text style={styles.heart}>{fav ? "❤️" : "♡"}</Text>
      </TouchableOpacity>

      {/* BOUTON SUPPRIMER */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.delete}
        disabled={deleting}
      >
        {deleting ? (
          <Text style={styles.deletingText}>...</Text>
        ) : (
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        )}
      </TouchableOpacity>

      {/* MODALE */}
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
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: "100%",
    position: "relative",
  },
  cover: {
    height: 140,
    backgroundColor: "#eee",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  placeholderText: { fontSize: 40, fontWeight: "bold", color: "#aaa" },
  content: { padding: 12 },
  title: { fontSize: 15, fontWeight: "600", color: "#222" },
  author: { fontSize: 13, color: "#666", marginTop: 2 },
  meta: { fontSize: 11, color: "#999", marginTop: 4 },
  fav: { position: "absolute", top: 8, right: 8 },
  heart: { fontSize: 20 },
  delete: { position: "absolute", top: 8, left: 8 },
  deletingText: { color: "#FF3B30", fontWeight: "bold" },
});
