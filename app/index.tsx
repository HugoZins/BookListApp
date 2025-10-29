import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import BookItem from "../components/BookItem";
import { fetchBooks, Book } from "../lib/api";

export default function Index() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les livres");
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
        <Text>Chargement...</Text>
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
            <Button title="Ajouter un livre" />
          </Link>
        </View>
      ) : (
        <>
          <Link href="/add" asChild>
            <Button title="Ajouter un livre" />
          </Link>

          <FlatList
            data={books}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BookItem book={item} onUpdate={loadBooks} />
            )}
            style={styles.list}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { fontSize: 18, marginBottom: 16, color: "#666" },
  list: { marginTop: 16 },
});
