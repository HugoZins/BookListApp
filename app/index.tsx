// app/index.tsx
import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import BookCard from "../components/BookCard";
import { fetchBooks, Book } from "../lib/api";

export default function Index() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch {
      console.error("Erreur chargement livres");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadBooks();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ma Bibliothèque</Text>

      {books.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Aucun livre</Text>
          <Link href="/add" asChild>
            <Text style={styles.addFirst}>Ajouter votre premier livre</Text>
          </Link>
        </View>
      ) : (
        <>
          <Link href="/add" asChild>
            <Text style={styles.addButton}>+ Ajouter un livre</Text>
          </Link>

          <FlatList
            data={books}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <BookCard book={item} onUpdate={loadBooks} />
              </View>
            )}
            style={styles.grid}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f9fa" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#6C5CE7",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { fontSize: 18, color: "#666" },
  empty: { fontSize: 18, marginBottom: 16, color: "#666" },
  addFirst: { color: "#6C5CE7", fontWeight: "600" },
  addButton: {
    color: "#6C5CE7",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  grid: { marginTop: 8 },
  gridRow: { justifyContent: "space-between", paddingHorizontal: 4 },
  cardWrapper: { width: "48%", marginBottom: 16 },
});
