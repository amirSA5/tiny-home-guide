import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "favorites-store.json");

let store = { clients: {} };
let loaded = false;

async function loadStore() {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    store = JSON.parse(raw);
  } catch (_err) {
    // First run or unreadable file; start with empty store.
    store = { clients: {} };
  }
  loaded = true;
  return store;
}

async function ensureLoaded() {
  if (!loaded) {
    await loadStore();
  }
}

async function persistStore() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}

export async function getFavorites(clientId) {
  await ensureLoaded();
  return store.clients[clientId]?.favorites ?? [];
}

export async function setFavorites(clientId, favorites) {
  await ensureLoaded();
  store.clients[clientId] = {
    favorites,
    updatedAt: new Date().toISOString(),
  };
  await persistStore();
  return store.clients[clientId].favorites;
}

export async function getSnapshot() {
  await ensureLoaded();
  return store;
}
