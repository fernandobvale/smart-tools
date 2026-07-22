import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "favorite_tools";

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let favorites: string[] = read();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function setFavorites(next: string[]) {
  favorites = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      favorites = read();
      emit();
    }
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return favorites;
}

export function useFavoriteTools() {
  const favs = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isFavorite = useCallback(
    (id: string) => favs.includes(id),
    [favs]
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(
      favorites.includes(id)
        ? favorites.filter((f) => f !== id)
        : [...favorites, id]
    );
  }, []);

  return { favorites: favs, isFavorite, toggleFavorite };
}
