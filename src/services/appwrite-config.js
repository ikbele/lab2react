// src/services/appwrite-config.js
import { Client } from "appwrite";


// Initialize the Appwrite client
const client = new Client();

client.setEndpoint("https://nyc.cloud.appwrite.io/v1").setProject("692637f80020222ffb5c");

export default client;

