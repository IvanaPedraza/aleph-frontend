"use client"

import { Search, X } from "lucide-react"
import { artists } from "@/data/artists"
import { albums } from "@/data/albums"
import { categories } from "@/data/categories"
import { songs } from "@/data/songs"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function MainContent() {
    const [activeTab, setActiveTab] = useState("artistas")
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<{
        artists: { id: number; name: string; imageUrl: string }[],
        albums: { id: number; title: string; artist: string; coverUrl: string }[],
        songs: { id: number; title: string; artist: string; album: string; coverUrl: string; duration: string }[],
    }>({
        artists: [],
        albums: [],
        songs: [],
    })
    const [isSearching, setIsSearching] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const tabs = [
        { key: "artistas", label: "Artistas" },
        { key: "albums", label: "Albums" },
        { key: "categorias", label: "Categorías" },
        { key: "favoritos", label: "Favoritos" },
        { key: "comentarios", label: "Mis comentarios" },
    ]

    // Simular carga de datos
    useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 250)

        return () => clearTimeout(timer)
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
            const filteredArtists = artists.filter((artist) => artist.name.toLowerCase().includes(term))

            // Filtrar álbumes
            const filteredAlbums = albums.filter(
                (album) => album.title.toLowerCase().includes(term) || album.artist.toLowerCase().includes(term),
            )

            // Filtrar canciones
            const filteredSongs = songs.filter(
                (song) =>
                    song.title.toLowerCase().includes(term) ||
                    song.artist.toLowerCase().includes(term) ||
                    song.album.toLowerCase().includes(term),
            )

            setSearchResults({
                artists: filteredArtists,
                albums: filteredAlbums,
                songs: filteredSongs,
            })

            setIsLoading(false)
        }, 250)

        return () => clearTimeout(timer)
    }, [searchTerm])

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

                        {/* Resultados de canciones */}
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
                                            key={song.id}
                                            className={`flex items-center p-3 hover:bg-zinc-800 ${index % 2 === 0 ? "bg-zinc-900/60" : "bg-zinc-900/30"}`}
                                        >
                                            <img
                                                src={song.coverUrl || "/placeholder.svg"}
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
                                        {artists.map((artist) => (
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
                                        {albums.map((album) => (
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
                    </div>
                )}
            </div>
        </div>
    )
}
