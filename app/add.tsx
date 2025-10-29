import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { createBook } from "../lib/api";

export default function AddBook() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [editor, setEditor] = useState("");
  const [year, setYear] = useState("");
  const [read, setRead] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !author || !editor || !year) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }

    setSubmitting(true);
    try {
      await createBook({
        name,
        author,
        editor,
        year: parseInt(year),
        read,
      });
      Alert.alert("Succès", "Livre ajouté !");
      router.back();
    } catch (err) {
      Alert.alert("Erreur", "Impossible d’ajouter le livre");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Titre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Auteur"
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
      />
      <TextInput
        placeholder="Éditeur"
        value={editor}
        onChangeText={setEditor}
        style={styles.input}
      />
      <TextInput
        placeholder="Année"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.row}>
        <Text>Lu :</Text>
        <Switch value={read} onValueChange={setRead} />
      </View>
      <Button title="Ajouter" onPress={handleSubmit} disabled={submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
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
    alignItems: "center",
    marginBottom: 20,
  },
});
