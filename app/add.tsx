import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Switch, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Rating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import { createBook } from "../lib/api";
import { useTheme } from "../context/ThemeContext";

export default function AddBook() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [form, setForm] = useState({
    name: "",
    author: "",
    editor: "",
    year: 0,
    read: false,
    rating: 0,
    cover: "",
  });

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

  const handleSave = async () => {
    try {
      await createBook(form);
      router.back();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
      <TextInput
        style={[styles.input, isDark && styles.darkInput]}
        placeholder="Titre"
        value={form.name}
        onChangeText={(v) => setForm({ ...form, name: v })}
        placeholderTextColor={isDark ? "#aaa" : "#999"}
      />
      <TextInput
        style={[styles.input, isDark && styles.darkInput]}
        placeholder="Auteur"
        value={form.author}
        onChangeText={(v) => setForm({ ...form, author: v })}
        placeholderTextColor={isDark ? "#aaa" : "#999"}
      />
      <TextInput
        style={[styles.input, isDark && styles.darkInput]}
        placeholder="Éditeur"
        value={form.editor}
        onChangeText={(v) => setForm({ ...form, editor: v })}
        placeholderTextColor={isDark ? "#aaa" : "#999"}
      />
      <TextInput
        style={[styles.input, isDark && styles.darkInput]}
        placeholder="Année"
        value={form.year.toString()}
        onChangeText={(v) => setForm({ ...form, year: Number(v) || 0 })}
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
        onFinishRating={(r: any) => setForm((prev) => ({ ...prev, rating: r }))}
        style={styles.rating}
        tintColor={isDark ? "#121212" : "#f9f9f9"}
      />
      <Button title="Choisir une couverture" onPress={pickImage} />
      {form.cover ? (
        <Image source={{ uri: form.cover }} style={styles.coverPreview} />
      ) : null}
      <View style={styles.buttons}>
        <Button title="Annuler" onPress={() => router.back()} />
        <Button title="Sauvegarder" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  darkContainer: { backgroundColor: "#121212" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  darkInput: { backgroundColor: "#333", color: "#fff", borderColor: "#555" },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  rating: { marginVertical: 12 },
  coverPreview: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginVertical: 12,
  },
  darkText: { color: "#fff" },
});
