"use client"

import { useState } from "react"
import google_Icon from "@/public/logo_google.png"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
/*importar el global para tener la paleta de colores*/
import "@/app/globals.css"


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Welcome title */}
            <div className="absolute top-24 right-14 z-40">
                <h1 className="text-4xl md:text-6xl font-bold text-white text-center">¡Bienvenido<br></br> a Aleph!</h1>
            </div>
            
            {/* Vinyl record image */}
            <div className="absolute top-44 left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-20">
                <div className="relative min-w-[700px] mx-auto">
                    <Image
                        src="/Vinilo.png"
                        alt="Vinyl Record"
                        width={900}
                        height={500}
                        className="object-contain animate-spin-slow object-center"
                        style={{ animationDuration: "20s" }}
                    />
                </div>
            </div>
            {/* Logo positioned above the vinyl */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-30">
                <Image
                    src="/Logo.png"
                    alt="Aleph Logo"
                    width={250}
                    height={60}
                    className="object-contain object-center w-[100%] max-w-[250px] mx-auto"
                />
            </div>

            {/* Login form container */}
            <div className="w-full rounded-t-3xl z-10 absolute bottom-0 flex content-center justify-center bg-gradient-to-t from-black to-transparent">
                <div className=" lg:basis-[50%] sm:basis-[50%] bg-violet-400 pt-24 px-32 pb-8 rounded-t-3xl ">

                    <form className="space-y-4">
                        <div className="space-y-2 sm:w-[70%] mx-auto  ">
                            <label
                                htmlFor="email"
                                className="block text-xl font-bold text-electricViolet text-center sm:text-left sm:ml-6 "
                            >
                                Nombre de Usuario:
                            </label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="Usuario"
                                className="w-[90%] sm:w-[70%] text-gray-950 mx-auto"
                            />
                        </div>

                        <div className="space-y-2 sm:w-[70%] mx-auto ">
                            <label
                                htmlFor="password"
                                className="block text-xl font-bold text-electricViolet text-center sm:text-left sm:ml-6"
                            >
                                Contraseña:
                            </label>
                            <div className="relative w-[90%] sm:w-[70%] mx-auto">
                                <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pr-10 text-gray-950"
                                />
                                <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                {showPassword ? <EyeOff className="h-5 w-5 text-electricViolet" /> : <Eye className="h-5 w-5 text-electricViolet" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center w-[30%] mx-auto ">
                            <Button type="submit" className=" font-bold text-lg text-white bg-electricViolet  hover:bg-mauve shadow-lg">
                                ¡Ingresa!
                            </Button>
                        </div>
                        

                        <div className="relative my-6">
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 text-persianIndigo">O puedes continuar con</span>
                            </div>
                        </div>

                        <div className=" flex justify-center ">
                            <Button variant="outline" className="w-[70%] border-none text-electricViolet  hover:bg-mauve">
                                <Image
                                    src={google_Icon}
                                    alt="Google Icon"
                                    width={20}
                                    height={20}
                                    className="mr-2">

                                    </Image>
                                Google
                            </Button>
                        </div>

                        <div className="text-center text-sm text-white space-y-2 mt-6">
                            <p>
                                ¿No tienes una cuenta?{" "}
                                <Link href="/register" className="text-electricViolet hover:underline">
                                    ¡Regístrate!
                                </Link>
                            </p>
                            <p>
                                <Link href="/forgot-password" className="text-electricViolet hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
