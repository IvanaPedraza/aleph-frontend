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

// Interfaz para géneros musicales
export interface Genre {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Interfaz para categorías musicales (agrupación de géneros)
export interface Category {
  id: string;
  name: string;
  genres: Genre[];
  color?: string; // Para mantener la compatibilidad con la visualización actual
}

// URL base del microservicio - Usamos diferentes estrategias
// Opción 1: URL directa al microservicio (funciona pero podría ser bloqueada por extensiones)
// const API_URL = 'http://localhost:3001/api/v1';
  
// Opción 2: Usar proxy de Next.js en la ruta /api (podría ser bloqueada por extensiones)
// const API_URL = '/api/v1';

// Opción 3: Usar proxy de Next.js en una ruta alternativa para evitar bloqueos
const API_URL = '/_data/v1';

// Opción 4: Usar URL relativa al host actual (útil si accedemos por IP de Docker)
// const API_URL = (typeof window !== 'undefined')
//   ? `${window.location.protocol}//${window.location.host}/_data/v1`
//   : 'http://songs-ms:3001/api/v1';

// Función para obtener todas las canciones
export async function getAllSongs(): Promise<Song[]> {
  try {
    const response = await fetch(`${API_URL}/songs`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
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
    const response = await fetch(`${API_URL}/songs/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
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
    const response = await fetch(`${API_URL}/artists`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
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
    const response = await fetch(`${API_URL}/artists/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching artist with id ${id}:`, error);
    throw error;
  }
}

// Función para obtener todas las categorías de géneros musicales
export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    // Obtener las categorías de la API
    const categories = await response.json();
    
    // Asignar colores aleatorios a las categorías para el UI
    const colorOptions = [
      'from-red-500 to-orange-500',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-amber-500 to-yellow-500',
      'from-teal-500 to-cyan-500',
      'from-fuchsia-500 to-violet-500',
      'from-rose-500 to-red-500',
      'from-indigo-500 to-blue-500',
      'from-emerald-500 to-teal-500',
    ];
    
    // Asignar un color a cada categoría
    return categories.map((category: Category, index: number) => ({
      ...category,
      color: colorOptions[index % colorOptions.length]
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Función para obtener todos los géneros musicales
export async function getAllGenres(): Promise<Genre[]> {
  try {
    const response = await fetch(`${API_URL}/genres`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching genres:', error);
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