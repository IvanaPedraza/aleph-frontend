"use client"

import { Search, X } from "lucide-react"
import { artists as staticArtists } from "@/data/artists"
import { albums } from "@/data/albums"
import { categories } from "@/data/categories"
// Importamos el servicio con las nuevas interfaces y funciones
import { 
    getAllSongs, 
    getSongById, 
    getAllArtists,
    getAlbumsFromSongs, 
    Song as SongType, 
    Album as AlbumType,
    Artist as ArtistType 
} from "@/services/songService"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function MainContent() {
    const [activeTab, setActiveTab] = useState("artistas")
    const [searchTerm, setSearchTerm] = useState("")
    const [apiSongs, setApiSongs] = useState<SongType[]>([]) 
    const [apiAlbums, setApiAlbums] = useState<AlbumType[]>([])
    const [apiArtists, setApiArtists] = useState<ArtistType[]>([]) // Cambiamos a usar el tipo ArtistType
    const [searchResults, setSearchResults] = useState<{
        artists: { id: number | string; name: string; imageUrl: string }[],
        albums: { id: number | string; title: string; artist: string; coverUrl: string }[],
        songs: SongType[], // Modificamos para usar el tipo SongType
    }>({
        artists: [],
        albums: [],
        songs: [],
    })
    const [isSearching, setIsSearching] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadingError, setLoadingError] = useState<string | null>(null) // Para manejar errores de carga

    const tabs = [
        { key: "artistas", label: "Artistas" },
        { key: "albums", label: "Albums" },
        { key: "categorias", label: "Categorías" },
        { key: "canciones", label: "Canciones" }, // Nuevo tab para mostrar canciones
        { key: "favoritos", label: "Favoritos" },
        { key: "comentarios", label: "Mis comentarios" },
    ]

    // Cargar datos del microservicio
    useEffect(() => {
        async function fetchDataFromApi() {
            try {
                setLoadingError(null)
                setIsLoading(true)
                
                // Cargar canciones
                const songs = await getAllSongs()
                console.log("Canciones cargadas:", songs.length);
                
                // Depurar valores nulos
                const songsWithoutAlbum = songs.filter(song => !song.album).length;
                const songsWithoutArtist = songs.filter(song => !song.artist).length;
                console.log("Canciones sin álbum:", songsWithoutAlbum);
                console.log("Canciones sin artista:", songsWithoutArtist);
                
                setApiSongs(songs)
                
                // Extraer álbumes
                const extractedAlbums = getAlbumsFromSongs(songs);
                console.log(`Álbumes extraídos del API: ${extractedAlbums.length}`);
                console.log("Lista de álbumes:", extractedAlbums.map(album => album.title).join(", "));
                setApiAlbums(extractedAlbums);
                
                // Cargar artistas directamente del endpoint de artistas
                try {
                    const artists = await getAllArtists();
                    console.log(`Artistas cargados de la API: ${artists.length}`);
                    console.log("Lista de artistas:", artists.map(artist => artist.name).join(", "));
                    setApiArtists(artists);
                } catch (artistError) {
                    console.error("Error obteniendo artistas:", artistError);
                    // Si falla la carga de artistas, intentar extraerlos de las canciones como fallback
                    extractArtistsFromSongs(songs);
                }
                
                setIsLoading(false)
            } catch (error) {
                console.error("Error cargando datos:", error)
                setLoadingError("No se pudieron cargar los datos del servicio. Usando datos de ejemplo.")
                setIsLoading(false)
            }
        }

        fetchDataFromApi()
    }, [])
    
    // Función para extraer artistas únicos de las canciones (como fallback)
    const extractArtistsFromSongs = (songs: SongType[]) => {
        const artistMap = new Map<string, ArtistType>();
        let validArtistCount = 0;
        
        songs.forEach(song => {
            // Solo procesar canciones con información de artista
            if (song.artist && song.artist !== "null" && song.artist !== "undefined") {
                validArtistCount++;
                // Usar el artista como clave única
                const artistKey = song.artist;
                
                if (!artistMap.has(artistKey)) {
                    console.log(`Agregando artista: ${song.artist}`);
                    artistMap.set(artistKey, {
                        id: artistKey,
                        name: song.artist,
                        image_url: song.cover_url // Usamos la portada de la canción como imagen del artista
                    });
                }
            }
        });
        
        // Convertir el mapa a un array
        const extractedArtists = Array.from(artistMap.values());
        console.log(`Canciones con artista válido: ${validArtistCount}`);
        console.log(`Artistas únicos extraídos: ${extractedArtists.length}`);
        console.log("Lista de artistas:", extractedArtists.map(artist => artist.name).join(", "));
        setApiArtists(extractedArtists);
    };

    // Simular carga de datos para otras pestañas
    useEffect(() => {
        if (activeTab !== "canciones") {
            setIsLoading(true)
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 250)

            return () => clearTimeout(timer)
        }
    }, [activeTab])

    // Función para realizar la búsqueda
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setIsSearching(false)
            return
        }

        setIsSearching(true)
        setIsLoading(true)

        const term = searchTerm.toLowerCase()

        // Simular tiempo de búsqueda
        const timer = setTimeout(() => {
            // Filtrar artistas
            const filteredArtists = staticArtists.filter((artist) => artist.name.toLowerCase().includes(term))

            // Filtrar álbumes - Ahora incluimos álbumes del API
            const staticAlbums = albums.filter(
                (album) => album.title.toLowerCase().includes(term) || album.artist.toLowerCase().includes(term),
            )
            
            // Filtrar álbumes del API
            const dynamicAlbums = apiAlbums.filter(
                (album) => album.title.toLowerCase().includes(term) || album.artist.toLowerCase().includes(term)
            )
            
            // Combinar álbumes estáticos y dinámicos
            const allAlbums = [...staticAlbums, ...dynamicAlbums]

            // Filtrar canciones desde la API
            const filteredSongs = apiSongs.filter(
                (song) =>
                    song.title.toLowerCase().includes(term) ||
                    song.artist.toLowerCase().includes(term) ||
                    (song.album && song.album.toLowerCase().includes(term)),
            )

            setSearchResults({
                artists: filteredArtists,
                albums: allAlbums,
                songs: filteredSongs,
            })

            setIsLoading(false)
        }, 250)

        return () => clearTimeout(timer)
    }, [searchTerm, apiSongs, apiAlbums])

    // Limpiar la búsqueda
    const clearSearch = () => {
        setSearchTerm("")
        setIsSearching(false)
    }

    // Componentes Skeleton
    const ArtistSkeleton = () => (
        <div className="group">
            <div className="p-3 rounded-lg">
                <Skeleton className="w-full aspect-square rounded-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    )

    const AlbumSkeleton = () => (
        <div className="group">
            <div className="p-3 rounded-lg">
                <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    )

    const CategorySkeleton = () => (
        <div className="group">
            <Skeleton className="w-full aspect-square rounded-lg" />
        </div>
    )

    const SongSkeleton = () => (
        <div className="flex items-center p-3">
            <Skeleton className="h-8 w-8 rounded mr-3" />
            <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-3 w-10" />
        </div>
    )

    return (
        <div className="flex-1 flex flex-col h-full rounded-lg bg-gradient-to-b from-zinc-800 to-black">
            {/* Parte superior fija (sin scroll) */}
            <div className="p-6 pb-0">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Busca canciones, artistas o albums"
                        className="w-full py-3 pl-10 pr-10 bg-zinc-900 rounded-full text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {searchTerm && (
                        <button onClick={clearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <X className="h-5 w-5 text-zinc-400 hover:text-white" />
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-6 border-b border-zinc-700 overflow-x-auto custom-scrollbar pb-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                className={`pb-2 px-1 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.key ? "text-white border-b-2 border-green-500" : "text-zinc-400 hover:text-white"
                                    }`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Parte con scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-0">
                {/* Mensaje de error si falla la carga del API */}
                {loadingError && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-900/30 rounded-lg text-red-300 text-sm">
                        {loadingError}
                    </div>
                )}

                {/* Mostrar resultados de búsqueda o contenido normal */}
                {isSearching ? (
                    <div className="space-y-6">
                        {/* Resultados de artistas */}
                        {isLoading ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Artistas</h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                    {[...Array(7)].map((_, index) => (
                                        <ArtistSkeleton key={index} />
                                    ))}
                                </div>
                            </div>
                        ) : searchResults.artists.length > 0 ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Artistas</h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                    {searchResults.artists.map((artist) => (
                                        <div key={artist.id} className="group cursor-pointer">
                                            <div className="relative group-hover:bg-zinc-800 p-3 rounded-lg transition-colors">
                                                <img
                                                    src={artist.imageUrl || "/placeholder.svg"}
                                                    alt={artist.name}
                                                    className="w-full aspect-square rounded-full object-cover mb-2"
                                                />
                                                <h3 className="font-bold text-sm text-white truncate">{artist.name}</h3>
                                                <p className="text-xs text-zinc-400 truncate">Artista</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Resultados de álbumes */}
                        {isLoading ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Álbumes</h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                    {[...Array(7)].map((_, index) => (
                                        <AlbumSkeleton key={index} />
                                    ))}
                                </div>
                            </div>
                        ) : searchResults.albums.length > 0 ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Álbumes</h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                    {searchResults.albums.map((album) => (
                                        <div key={album.id} className="group cursor-pointer">
                                            <div className="relative group-hover:bg-zinc-800 p-3 rounded-lg transition-colors">
                                                <img
                                                    src={album.coverUrl || "/placeholder.svg"}
                                                    alt={album.title}
                                                    className="w-full aspect-square rounded-lg object-cover mb-2"
                                                />
                                                <h3 className="font-bold text-sm text-white truncate">{album.title}</h3>
                                                <p className="text-xs text-zinc-400 truncate">{album.artist}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Resultados de canciones - Actualizado para usar apiSongs */}
                        {isLoading ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Canciones</h2>
                                <div className="bg-zinc-900/40 rounded-md overflow-hidden">
                                    {[...Array(5)].map((_, index) => (
                                        <SongSkeleton key={index} />
                                    ))}
                                </div>
                            </div>
                        ) : searchResults.songs.length > 0 ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Canciones</h2>
                                <div className="bg-zinc-900/40 rounded-md overflow-hidden">
                                    {searchResults.songs.map((song, index) => (
                                        <div
                                            key={song._id}
                                            className={`flex items-center p-3 hover:bg-zinc-800 ${index % 2 === 0 ? "bg-zinc-900/60" : "bg-zinc-900/30"}`}
                                        >
                                            <img
                                                src={song.cover_url || "/placeholder.svg"}
                                                alt={song.title}
                                                className="h-8 w-8 rounded object-cover mr-3"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-white truncate">{song.title}</h3>
                                                <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                                            </div>
                                            <div className="text-xs text-zinc-400">{song.duration}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* No hay resultados */}
                        {!isLoading &&
                            searchResults.artists.length === 0 &&
                            searchResults.albums.length === 0 &&
                            searchResults.songs.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-zinc-400">No se encontraron resultados para "{searchTerm}"</p>
                                </div>
                            )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {activeTab === "artistas" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Artistas populares</h2>
                                    <button className="text-sm text-zinc-400 hover:text-white">Ver todo</button>
                                </div>
                                {isLoading ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                        {[...Array(14)].map((_, index) => (
                                            <ArtistSkeleton key={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                        {/* Mostrar artistas de la API usando la nueva interfaz ArtistType */}
                                        {apiArtists.length > 0 ? (
                                            apiArtists.map((artist) => (
                                                <div key={artist.id} className="group cursor-pointer">
                                                    <div className="relative group-hover:bg-zinc-800 p-3 rounded-lg transition-colors">
                                                        <img
                                                            src={artist.image_url || "/placeholder.svg"}
                                                            alt={artist.name}
                                                            className="w-full aspect-square rounded-full object-cover mb-2"
                                                        />
                                                        <h3 className="font-bold text-sm text-white truncate">{artist.name}</h3>
                                                        <p className="text-xs text-zinc-400 truncate">
                                                            {artist.genres && artist.genres.length > 0 ? artist.genres[0] : "Artista"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            staticArtists.map((artist) => (
                                                <div key={artist.id} className="group cursor-pointer">
                                                    <div className="relative group-hover:bg-zinc-800 p-3 rounded-lg transition-colors">
                                                        <img
                                                            src={artist.imageUrl || "/placeholder.svg"}
                                                            alt={artist.name}
                                                            className="w-full aspect-square rounded-full object-cover mb-2"
                                                        />
                                                        <h3 className="font-bold text-sm text-white truncate">{artist.name}</h3>
                                                        <p className="text-xs text-zinc-400 truncate">Artista</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        
                                        {/* Mensaje cuando no hay artistas */}
                                        {apiArtists.length === 0 && staticArtists.length === 0 && (
                                            <div className="col-span-full text-center py-10">
                                                <p className="text-zinc-400">No hay artistas disponibles</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "albums" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Álbumes destacados</h2>
                                    <button className="text-sm text-zinc-400 hover:text-white">Ver todo</button>
                                </div>
                                {isLoading ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                        {[...Array(14)].map((_, index) => (
                                            <AlbumSkeleton key={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                        {/* Mostrar álbumes de la API si hay disponibles, si no, mostrar estáticos */}
                                        {apiAlbums.length > 0 ? (
                                            apiAlbums.map((album) => (
                                                <div key={album.id} className="group cursor-pointer">
                                                    <div className="relative group-hover:bg-zinc-800 p-3 rounded-lg transition-colors">
                                                        <img
                                                            src={album.coverUrl || "/placeholder.svg"}
                                                            alt={album.title}
                                                            className="w-full aspect-square rounded-lg object-cover mb-2"
                                                        />
                                                        <h3 className="font-bold text-sm text-white truncate">{album.title}</h3>
                                                        <p className="text-xs text-zinc-400 truncate">{album.artist}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            albums.map((album) => (
                                                <div key={album.id} className="group cursor-pointer">
                                                    <div className="relative group-hover:bg-zinc-800 p-3 rounded-lg transition-colors">
                                                        <img
                                                            src={album.coverUrl || "/placeholder.svg"}
                                                            alt={album.title}
                                                            className="w-full aspect-square rounded-lg object-cover mb-2"
                                                        />
                                                        <h3 className="font-bold text-sm text-white truncate">{album.title}</h3>
                                                        <p className="text-xs text-zinc-400 truncate">{album.artist}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        
                                        {/* Mensaje cuando no hay álbumes */}
                                        {apiAlbums.length === 0 && albums.length === 0 && (
                                            <div className="col-span-full text-center py-10">
                                                <p className="text-zinc-400">No hay álbumes disponibles</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "categorias" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Explora por categorías</h2>
                                    <button className="text-sm text-zinc-400 hover:text-white">Ver todo</button>
                                </div>
                                {isLoading ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                        {[...Array(14)].map((_, index) => (
                                            <CategorySkeleton key={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                        {categories.map((category) => (
                                            <div key={category.id} className="group cursor-pointer">
                                                <div
                                                    className={`relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br ${category.color} p-3 flex items-end`}
                                                >
                                                    <h3 className="font-bold text-white text-sm z-10">{category.name}</h3>
                                                    <div className="absolute inset-0 opacity-20 bg-pattern-dots"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Nueva pestaña para mostrar todas las canciones desde el microservicio */}
                        {activeTab === "canciones" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Todas las canciones</h2>
                                </div>
                                {isLoading ? (
                                    <div className="bg-zinc-900/40 rounded-md overflow-hidden">
                                        {[...Array(10)].map((_, index) => (
                                            <SongSkeleton key={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-zinc-900/40 rounded-md overflow-hidden">
                                        {apiSongs.length > 0 ? (
                                            apiSongs.map((song, index) => (
                                                <div
                                                    key={song._id}
                                                    className={`flex items-center p-3 hover:bg-zinc-800 ${index % 2 === 0 ? "bg-zinc-900/60" : "bg-zinc-900/30"}`}
                                                >
                                                    <img
                                                        src={song.cover_url || "/placeholder.svg"}
                                                        alt={song.title}
                                                        className="h-10 w-10 rounded object-cover mr-3"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-white truncate">{song.title}</h3>
                                                        <div className="flex items-center">
                                                            <p className="text-xs text-zinc-400 truncate">
                                                                {song.artist} • {song.album}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <div className="text-xs text-zinc-400">{song.duration}</div>
                                                        <div className="text-xs text-zinc-500">
                                                            {new Intl.NumberFormat().format(song.plays)} reproducciones
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-zinc-400">No hay canciones disponibles</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Información detallada de canciones */}
                                {apiSongs.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="text-xl font-bold mb-4">Información detallada</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {apiSongs.slice(0, 4).map((song) => (
                                                <div key={song._id} className="bg-zinc-800/50 p-4 rounded-lg">
                                                    <div className="flex">
                                                        <img
                                                            src={song.cover_url || "/placeholder.svg"}
                                                            alt={song.title}
                                                            className="h-24 w-24 rounded object-cover"
                                                        />
                                                        <div className="ml-4">
                                                            <h3 className="font-bold text-white">{song.title}</h3>
                                                            <p className="text-sm text-zinc-300">{song.artist}</p>
                                                            <p className="text-sm text-zinc-400">Álbum: {song.album}</p>
                                                            <p className="text-sm text-zinc-400">Género: {song.genre}</p>
                                                            <p className="text-sm text-zinc-400">
                                                                Lanzamiento: {new Date(song.release_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-sm">
                                                        <p className="text-zinc-300">
                                                            <span className="font-semibold">Autores:</span>{" "}
                                                            {song.authors.join(", ")}
                                                        </p>
                                                        <div className="flex justify-between mt-1">
                                                            <p className="text-zinc-400">
                                                                <span className="font-semibold">👍</span> {new Intl.NumberFormat().format(song.likes)}
                                                            </p>
                                                            <p className="text-zinc-400">
                                                                <span className="font-semibold">▶️</span> {new Intl.NumberFormat().format(song.plays)} reproducciones
                                                            </p>
                                                            <p className="text-zinc-400">
                                                                <span className="font-semibold">⏱️</span> {song.duration}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
