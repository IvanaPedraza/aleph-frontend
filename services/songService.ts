// Definición de la interfaz Song que coincide con el modelo en el microservicio
export interface Song {
  _id: string;
  title: string;
  artist: string;
  authors: string[];
  album: string;
  release_date: string;
  duration: string;
  genre: string;
  likes: number;
  plays: number;
  cover_url: string;
  audio_url: string;
  spotify_id?: string;  // ID del álbum en Spotify (opcional)
  album_id?: string;    // ID del álbum (opcional)
  created_at?: string;
  updated_at?: string;
}

// Interfaz para álbumes extraídos de canciones
export interface Album {
  id: string;
  title: string;  // Nombre real del álbum
  artist: string;
  coverUrl: string;
  releaseDate?: string;
  songsCount: number;
}

// Interfaz para artistas de la API
export interface Artist {
  id: string;
  name: string;
  image_url: string;
  genres?: string[];
  popularity?: number;
}

// Interfaz para categorías
// Interfaz para los géneros de música
export interface Genre {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Category {
  id: string;
  name: string;
  image_url?: string;
  color?: string;
  genres?: Genre[];
}

// URL base del microservicio utilizando variables de entorno
const LEGACY_BASE_URL = '/api';  // Ruta anterior para compatibilidad
const API_VERSION = 'v1';
const LEGACY_API_URL = `${LEGACY_BASE_URL}/${API_VERSION}`;

// Nueva estructura de rutas con prefijo /api/music
const MUSIC_API_URL = '/api/music';

// Función para obtener todas las canciones
export async function getAllSongs(): Promise<Song[]> {
  try {
    // Usar la nueva estructura de URL
    const response = await fetch(`${MUSIC_API_URL}/songs`);
    
    if (!response.ok) {
      // Intentar con la estructura antigua como fallback
      console.warn('Trying legacy API endpoint as fallback');
      const legacyResponse = await fetch(`${LEGACY_API_URL}/songs`);
      
      if (!legacyResponse.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return legacyResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
}

// Función para obtener una canción por su ID
export async function getSongById(id: string): Promise<Song> {
  try {
    // Usar la nueva estructura de URL
    const response = await fetch(`${MUSIC_API_URL}/songs/${id}`);
    
    if (!response.ok) {
      // Intentar con la estructura antigua como fallback
      console.warn('Trying legacy API endpoint as fallback');
      const legacyResponse = await fetch(`${LEGACY_API_URL}/songs/${id}`);
      
      if (!legacyResponse.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return legacyResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching song with id ${id}:`, error);
    throw error;
  }
}

// Función para obtener todos los artistas
export async function getAllArtists(): Promise<Artist[]> {
  try {
    // Usar la nueva estructura de URL
    const response = await fetch(`${MUSIC_API_URL}/artists`);
    
    if (!response.ok) {
      // Intentar con la estructura antigua como fallback
      console.warn('Trying legacy API endpoint as fallback');
      const legacyResponse = await fetch(`${LEGACY_API_URL}/artists`);
      
      if (!legacyResponse.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return legacyResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
}

// Función para obtener un artista por su ID
export async function getArtistById(id: string): Promise<Artist> {
  try {
    // Usar la nueva estructura de URL
    const response = await fetch(`${MUSIC_API_URL}/artists/${id}`);
    
    if (!response.ok) {
      // Intentar con la estructura antigua como fallback
      console.warn('Trying legacy API endpoint as fallback');
      const legacyResponse = await fetch(`${LEGACY_API_URL}/artists/${id}`);
      
      if (!legacyResponse.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return legacyResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching artist with id ${id}:`, error);
    throw error;
  }
}

// Función para obtener todos los álbumes
export async function getAllAlbums(): Promise<Album[]> {
  try {
    // Usar la nueva estructura de URL
    const response = await fetch(`${MUSIC_API_URL}/albums`);
    
    if (!response.ok) {
      // Intentar con la estructura antigua como fallback
      console.warn('Trying legacy API endpoint as fallback for albums');
      const legacyResponse = await fetch(`${LEGACY_API_URL}/albums`);
      
      if (!legacyResponse.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return legacyResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
}

// Función para obtener un álbum por su ID
export async function getAlbumById(id: string): Promise<Album> {
  try {
    // Usar la nueva estructura de URL
    const response = await fetch(`${MUSIC_API_URL}/albums/${id}`);
    
    if (!response.ok) {
      // Intentar con la estructura antigua como fallback
      console.warn('Trying legacy API endpoint as fallback');
      const legacyResponse = await fetch(`${LEGACY_API_URL}/albums/${id}`);
      
      if (!legacyResponse.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return legacyResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching album with id ${id}:`, error);
    throw error;
  }
}

// Función para obtener todas las categorías
export async function getAllCategories(): Promise<Category[]> {
  try {
    // Usar la nueva estructura de URL
    const response = await fetch(`${MUSIC_API_URL}/categories`);
    
    if (!response.ok) {
      // Intentar con la estructura antigua como fallback
      console.warn('Trying legacy API endpoint as fallback for categories');
      const legacyResponse = await fetch(`${LEGACY_API_URL}/categories`);
      
      if (!legacyResponse.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await legacyResponse.json();
      return processCategories(data);
    }
    
    const data = await response.json();
    return processCategories(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Función auxiliar para procesar categorías y asegurar que tengan el formato correcto
function processCategories(categories: any[]): Category[] {
  return categories.map(category => {
    // Verificar si la categoría tiene el formato esperado
    const processedCategory = {
      id: category.id || category._id || String(Math.random()),
      name: category.name,
      // Si hay géneros disponibles, crear una URL de imagen basada en el primer género
      image_url: category.image_url || 
                (category.genres && category.genres.length > 0 
                  ? `/api/music/genres/${category.genres[0].slug}/image` 
                  : '/placeholder.svg?height=200&width=200'),
      color: category.color || getRandomGradient(), // Usar color existente o generar uno aleatorio
      // Agregar los géneros si están disponibles
      genres: category.genres || []
    };
    
    console.log("Categoría procesada:", processedCategory);
    return processedCategory;
  });
}

// Función para generar un gradiente aleatorio de color para categorías sin color definido
function getRandomGradient(): string {
  const gradients = [
    'from-pink-500 to-purple-500',
    'from-yellow-500 to-orange-500',
    'from-red-500 to-red-800',
    'from-blue-400 to-indigo-600',
    'from-purple-400 to-purple-800',
    'from-green-400 to-emerald-600',
    'from-amber-500 to-yellow-800',
    'from-gray-400 to-gray-700',
    'from-teal-400 to-cyan-600',
    'from-rose-400 to-pink-600'
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
}

// Función para obtener una categoría por su ID
export async function getCategoryById(id: string): Promise<Category> {
  try {
    // Usar la nueva estructura de URL
    const response = await fetch(`${MUSIC_API_URL}/categories/${id}`);
    
    if (!response.ok) {
      // Intentar con la estructura antigua como fallback
      console.warn('Trying legacy API endpoint as fallback');
      const legacyResponse = await fetch(`${LEGACY_API_URL}/categories/${id}`);
      
      if (!legacyResponse.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return legacyResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
}

// Función para obtener el audio de una canción
export async function getSongAudio(id: string): Promise<Blob> {
  try {
    // Usar la nueva estructura de URL
    const response = await fetch(`${MUSIC_API_URL}/songs/${id}/audio`);
    
    if (!response.ok) {
      // Intentar con la estructura antigua como fallback
      console.warn('Trying legacy API endpoint as fallback');
      const legacyResponse = await fetch(`${LEGACY_API_URL}/songs/${id}/audio`);
      
      if (!legacyResponse.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return legacyResponse.blob();
    }
    
    return response.blob();
  } catch (error) {
    console.error(`Error fetching audio for song ${id}:`, error);
    throw error;
  }
}

// Función para extraer álbumes reales desde las canciones
export function getAlbumsFromSongs(songs: Song[]): Album[] {
  // Usar un mapa para agrupar canciones por álbum y evitar duplicados
  const albumMap = new Map<string, Album>();
  
  songs.forEach(song => {
    if (song.album && !song.album.includes(' - Collection')) {
      // Usar una clave única basada en álbum y artista
      const albumKey = `${song.album}-${song.artist}`;
      
      // Si este álbum ya está en el mapa, incrementamos el contador de canciones
      if (albumMap.has(albumKey)) {
        const existingAlbum = albumMap.get(albumKey)!;
        existingAlbum.songsCount++;
        return;
      }
      
      // Sino, creamos una nueva entrada para el álbum
      albumMap.set(albumKey, {
        id: albumKey,
        title: song.album,
        artist: song.artist,
        coverUrl: song.cover_url,
        releaseDate: song.release_date,
        songsCount: 1
      });
    }
  });
  
  // Convertir el mapa a un array y ordenar por artista y álbum
  return Array.from(albumMap.values())
    .sort((a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title));
}