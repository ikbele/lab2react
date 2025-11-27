// src/services/note-service.js
import { Query } from "appwrite";
import { listDocuments } from "./database-service";
import client from "./appwrite-config";
import { Databases, ID } from "appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "@env";
import { appwriteDatabase } from "./appwriteConfig";
import { Query } from "appwrite";

export const getNotes = async (userId) => {
  try {
    const response = await appwriteDatabase.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_COLLECTION_ID,
      [Query.equal("user_id", userId)] // Filter by user_id
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

export const addNote = async (text, userId) => {
  try {
    const response = await appwriteDatabase.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_COLLECTION_ID,
      "unique()",
      {
        text,
        user_id: userId, // Add user ID to the note
      }
    );

    return response;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};