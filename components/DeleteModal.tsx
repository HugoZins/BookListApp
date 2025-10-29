import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DeleteModal({
  visible,
  book,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  book: { name: string };
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Confirmer la suppression</Text>
          <Text style={styles.message}>
            Supprimer &quot;{book.name}&quot; ? Cette action est irréversible.
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancel} onPress={onCancel}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
              <Text style={styles.confirmText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    maxWidth: 400,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  message: { marginBottom: 20, color: "#555" },
  buttons: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  cancel: { padding: 8 },
  cancelText: { color: "#666" },
  confirm: { backgroundColor: "#FF3B30", padding: 8, borderRadius: 8 },
  confirmText: { color: "white", fontWeight: "bold" },
});
