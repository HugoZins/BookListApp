import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import BookCard from "../components/BookCard";
import { fetchBooks, Book } from "../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

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
  const { isDark, toggleTheme } = useTheme();

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
      console.warn("Mode hors ligne activé");
    } finally {
      setLoading(false);
    }
  }, [search, filterRead, filterFavorite, sort, order]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

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
      <View style={[styles.center, isDark && styles.darkBg]}>
        <Text style={[styles.loading, isDark && styles.darkText]}>
          Chargement...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkBg]}>
      {/* HEADER */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Text style={[styles.title, isDark && styles.darkTitle]}>
          Ma Bibliothèque
        </Text>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, isDark && styles.darkInput]}>
            <Ionicons
              name="search"
              size={18}
              color={isDark ? "#aaa" : "#666"}
            />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, isDark && styles.darkText]}
              placeholder="Rechercher..."
              placeholderTextColor={isDark ? "#aaa" : "#999"}
              value={rawSearch}
              onChangeText={setRawSearch}
              autoFocus={false}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, isDark && styles.darkBtn]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="options-outline" size={22} color="#6C5CE7" />
            {activeFilters > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFilters}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={24}
              color={isDark ? "#fff" : "#6C5CE7"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* LISTE */}
      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.empty, isDark && styles.darkText]}>
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
                <BookCard
                  book={item}
                  onUpdate={loadBooks}
                  theme={isDark ? "dark" : "light"}
                />
              </View>
            )}
            style={styles.grid}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 6 }}
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
          <View style={[styles.modal, isDark && styles.darkModal]}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 180 }}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, isDark && styles.darkText]}>
                  Filtres & Tri
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons
                    name="close"
                    size={26}
                    color={isDark ? "#ccc" : "#666"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.filterGroup}>
                <Text style={[styles.groupTitle, isDark && styles.darkText]}>
                  Statut
                </Text>
                <View style={styles.filterRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filterRead === true && styles.activeChip,
                      isDark && styles.darkChip,
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
                      isDark && styles.darkChip,
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
                <Text style={[styles.groupTitle, isDark && styles.darkText]}>
                  Favoris
                </Text>
                <View style={styles.filterRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filterFavorite === true && styles.activeChip,
                      isDark && styles.darkChip,
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

              <View style={styles.filterGroup}>
                <Text style={[styles.groupTitle, isDark && styles.darkText]}>
                  Trier par
                </Text>
                {["title", "author", "theme"].map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.sortItem,
                      sort === key && styles.activeSort,
                      isDark && styles.darkSort,
                    ]}
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
                      <Text
                        style={[styles.sortText, isDark && styles.darkText]}
                      >
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
                style={[styles.resetBtn, isDark && styles.darkBtn]}
                onPress={() => {
                  setFilterRead(undefined);
                  setFilterFavorite(undefined);
                  setSort("title");
                  setOrder("asc");
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.resetText, isDark && styles.darkText]}>
                  Réinitialiser
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  darkBg: { backgroundColor: "#121212" },
  header: {
    padding: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkHeader: { backgroundColor: "#1e1e1e" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#6C5CE7",
  },
  darkTitle: { color: "#fff" },
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
  darkInput: { backgroundColor: "#333", borderColor: "#555", color: "#fff" },
  searchInput: {
    flex: 1,
    padding: 6,
    fontSize: 15,
    color: "#000",
  },
  filterBtn: {
    backgroundColor: "#f0f0f0",
    padding: 6,
    borderRadius: 10,
  },
  darkBtn: { backgroundColor: "#333" },
  themeBtn: {
    padding: 6,
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
    maxHeight: Dimensions.get("window").height * 0.85,
    width: "100%",
  },
  darkModal: { backgroundColor: "#1e1e1e" },
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
  darkChip: { backgroundColor: "#444" },
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
  darkSort: { backgroundColor: "#333" },
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
  darkText: { color: "#fff" },
});
