// app/add.tsx
import { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { createBook } from "../lib/api";
import Toast from "react-native-toast-message";

export default function AddBook() {
  const router = useRouter();
  const [book, setBook] = useState({
    name: "",
    author: "",
    editor: "",
    year: 0,
    read: false,
    favorite: false,
  });

  const handleSubmit = async () => {
    if (!book.name || !book.author) {
      Toast.show({
        type: "error",
        text1: "Champs requis",
        text2: "Titre et auteur obligatoires",
      });
      return;
    }

    try {
      await createBook(book);
      Toast.show({
        type: "success",
        text1: "Succès !",
        text2: "Livre ajouté avec succès",
      });
      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible d’ajouter le livre",
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={book.name}
        onChangeText={(v) => setBook({ ...book, name: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Auteur"
        value={book.author}
        onChangeText={(v) => setBook({ ...book, author: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Éditeur"
        value={book.editor}
        onChangeText={(v) => setBook({ ...book, editor: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Année"
        value={book.year.toString()}
        onChangeText={(v) => setBook({ ...book, year: Number(v) || 0 })}
        keyboardType="numeric"
      />
      <Button title="Ajouter le livre" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
});
