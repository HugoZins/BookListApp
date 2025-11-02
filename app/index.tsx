import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import BookCard from "../components/BookCard";
import { fetchBooks, Book } from "../lib/api";
import { Ionicons } from "@expo/vector-icons";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Index() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawSearch, setRawSearch] = useState("");
  const search = useDebounce(rawSearch, 400);
  const [filterRead, setFilterRead] = useState<boolean | undefined>(undefined);
  const [filterFavorite, setFilterFavorite] = useState<boolean | undefined>(
    undefined
  );
  const [sort, setSort] = useState<string>("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [modalVisible, setModalVisible] = useState(false);

  const searchInputRef = useRef<TextInput>(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBooks({
        q: search,
        read: filterRead,
        favorite: filterFavorite,
        sort,
        order,
      });
      setBooks(data);
    } catch (error) {
      console.error("Erreur chargement livres", error);
    } finally {
      setLoading(false);
    }
  }, [search, filterRead, filterFavorite, sort, order]);

  // Recharge sur debounce, filtres, tri
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Recharge sur focus (retour après ajout/modif)
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );

  const activeFilters = [
    filterRead === true && "Lus",
    filterRead === false && "Non lus",
    filterFavorite === true && "Favoris",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Ma Bibliothèque</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#666" />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Rechercher..."
              value={rawSearch}
              onChangeText={setRawSearch}
              autoFocus={false}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="options-outline" size={22} color="#6C5CE7" />
            {activeFilters > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFilters}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* LISTE */}
      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>
            {rawSearch ? "Aucun livre trouvé" : "Aucun livre"}
          </Text>
          <Link href="/add" asChild>
            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ Ajouter un livre</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <>
          <Link href="/add" asChild>
            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ Ajouter un livre</Text>
            </TouchableOpacity>
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90, paddingHorizontal: 6 }}
          />
        </>
      )}

      {/* MODAL FILTRES */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres & Tri</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={26} color="#666" />
              </TouchableOpacity>
            </View>

            {/* FILTRES */}
            <View style={styles.filterGroup}>
              <Text style={styles.groupTitle}>Statut</Text>
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterRead === true && styles.activeChip,
                  ]}
                  onPress={() =>
                    setFilterRead(filterRead === true ? undefined : true)
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      filterRead === true && styles.activeText,
                    ]}
                  >
                    Lus
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterRead === false && styles.activeChip,
                  ]}
                  onPress={() =>
                    setFilterRead(filterRead === false ? undefined : false)
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      filterRead === false && styles.activeText,
                    ]}
                  >
                    Non lus
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.groupTitle}>Favoris</Text>
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterFavorite === true && styles.activeChip,
                  ]}
                  onPress={() =>
                    setFilterFavorite(
                      filterFavorite === true ? undefined : true
                    )
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      filterFavorite === true && styles.activeText,
                    ]}
                  >
                    Favoris
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* TRI */}
            <View style={styles.filterGroup}>
              <Text style={styles.groupTitle}>Trier par</Text>
              {["title", "author", "theme"].map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.sortItem, sort === key && styles.activeSort]}
                  onPress={() => {
                    if (sort === key) {
                      setOrder(order === "asc" ? "desc" : "asc");
                    } else {
                      setSort(key);
                      setOrder("asc");
                    }
                  }}
                >
                  <View style={styles.sortRow}>
                    <Text style={styles.sortText}>
                      {key === "title"
                        ? "Titre"
                        : key === "author"
                        ? "Auteur"
                        : "Thème"}
                    </Text>
                    {sort === key && (
                      <Ionicons
                        name={order === "asc" ? "arrow-up" : "arrow-down"}
                        size={16}
                        color="#6C5CE7"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setFilterRead(undefined);
                setFilterFavorite(undefined);
                setSort("title");
                setOrder("asc");
                setModalVisible(false);
              }}
            >
              <Text style={styles.resetText}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    padding: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#6C5CE7",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    padding: 6,
    fontSize: 15,
  },
  filterBtn: {
    backgroundColor: "#f0f0f0",
    padding: 6,
    borderRadius: 10,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 12,
    marginVertical: 10,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  grid: {
    flex: 1,
  },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterGroup: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#eee",
    borderRadius: 16,
  },
  activeChip: {
    backgroundColor: "#6C5CE7",
  },
  chipText: {
    color: "#666",
    fontSize: 13,
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  sortItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 6,
  },
  activeSort: {
    backgroundColor: "#e8e6ff",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sortText: {
    fontSize: 14,
    color: "#333",
  },
  resetBtn: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  resetText: {
    color: "#666",
    fontWeight: "600",
  },
});
