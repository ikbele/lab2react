// src/screens/NotesScreen.js (updated)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getNotes,
  addNote,
  deleteNote,
  updateNote,
} from "../services/noteService";
import NoteItem from "../components/NoteItem";
import AddNoteModal from "../components/AddNoteModal";
import { AuthContext } from "../context/AuthContext";

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext); // Get the current user from context

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      // Pass the user ID when fetching notes
      const fetchedNotes = await getNotes(user.$id);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const handleAddNote = async (text) => {
    try {
      // Pass the user ID when adding a note
      const newNote = await addNote(text, user.$id);
      setNotes([newNote, ...notes]);
      setIsAddModalVisible(false);
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter((note) => note.$id !== noteId));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleUpdateNote = async (noteId, newText) => {
    try {
      const updatedNote = await updateNote(noteId, newText);
      setNotes(notes.map((note) => (note.$id === noteId ? updatedNote : note)));
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };
  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You don't have any notes yet.</Text>
        <Text style={styles.emptySubtext}>
          Tap the + button to create your first note!
        </Text>
      </View>
    );
  };
  

  // Render the list of notes
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

       <FlatList
        data={notes}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onNoteDeleted={handleNoteDeleted}
            onNoteUpdated={handleNoteUpdated}
          />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={notes.length === 0 ? { flex: 1 } : {}}
        ListEmptyComponent={!isLoading && renderEmptyComponent()}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchNotes}
      />

      <AddNoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNoteAdded={handleNoteAdded}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default NotesScreen;