import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";
import { Link } from "expo-router";
import { Book, toggleFavorite, deleteBook } from "../lib/api";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";

type BookCardProps = {
  book: Book;
  onUpdate: () => void;
  theme?: "light" | "dark";
};

export default function BookCard({
  book,
  onUpdate,
  theme = "light",
}: BookCardProps) {
  const [fav, setFav] = useState(book.favorite);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleFav = async (e: any) => {
    e.preventDefault();
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

  const isDark = theme === "dark";

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      {/* COUVERTURE CLIQUABLE */}
      <Link href={`/${book.id}`} asChild>
        <Pressable style={styles.cover}>
          {book.cover ? (
            <Image source={{ uri: book.cover }} style={styles.image} />
          ) : (
            <View
              style={[styles.placeholder, isDark && styles.darkPlaceholder]}
            >
              <Text style={[styles.placeholderText, isDark && styles.darkText]}>
                {book.name[0]?.toUpperCase()}
              </Text>
            </View>
          )}
        </Pressable>
      </Link>

      {/* CONTENU TEXTE CLIQUABLE */}
      <Link href={`/${book.id}`} asChild>
        <Pressable style={styles.content}>
          <Text
            style={[styles.title, isDark && styles.darkText]}
            numberOfLines={1}
          >
            {book.name}
          </Text>
          <Text
            style={[styles.author, isDark && styles.darkText]}
            numberOfLines={1}
          >
            {book.author}
          </Text>
          <Text style={[styles.meta, isDark && styles.darkText]}>
            {book.editor} • {book.year}
          </Text>

          {book.rating && book.rating > 0 && (
            <Rating
              startingValue={book.rating}
              ratingCount={5}
              imageSize={16}
              readonly
              style={styles.cardRating}
              tintColor={isDark ? "#1e1e1e" : "#fff"}
            />
          )}
        </Pressable>
      </Link>

      {/* CŒUR FAVORI */}
      <TouchableOpacity
        onPress={toggleFav}
        style={[styles.fav, isDark && styles.darkIconBg]}
        activeOpacity={0.7}
      >
        <Ionicons
          name={fav ? "heart" : "heart-outline"}
          size={24}
          color={fav ? "#FF3B30" : isDark ? "#ccc" : "#666"}
        />
      </TouchableOpacity>

      {/* BOUTON SUPPRIMER */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.delete, isDark && styles.darkIconBg]}
        activeOpacity={0.7}
      >
        {deleting ? (
          <Text style={styles.deletingText}>...</Text>
        ) : (
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        )}
      </TouchableOpacity>

      {/* MODALE SUPPRESSION */}
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
    position: "relative",
  },
  darkCard: {
    backgroundColor: "#1e1e1e",
  },
  cover: {
    height: 140,
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  darkPlaceholder: {
    backgroundColor: "#333",
  },
  placeholderText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#aaa",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  author: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  meta: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  darkText: {
    color: "#fff",
  },
  cardRating: {
    marginTop: 4,
  },
  fav: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 6,
  },
  darkIconBg: {
    backgroundColor: "rgba(30,30,30,0.8)",
  },
  delete: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 6,
  },
  deletingText: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
});
