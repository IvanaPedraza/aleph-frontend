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

// URL base del microservicio - Usa la variable de entorno si está disponible, de lo contrario usa localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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