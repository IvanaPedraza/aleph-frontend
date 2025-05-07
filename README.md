# Aleph Frontend

Este es el repositorio del frontend para el proyecto Aleph.

## Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

## Configuración del entorno de desarrollo

### Requisitos previos

- Node.js (versión recomendada: >= 18.x)
- pnpm (gestor de paquetes)
- Git

### Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd aleph-front
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Iniciar el servidor de desarrollo:
```bash
pnpm dev
```

4. Abrir http://localhost:3000 en el navegador

### Desarrollo con Docker

También es posible utilizar Docker para el desarrollo:

```bash
docker-compose up
```

## Estructura del proyecto

- `app/`: Componentes y páginas principales de la aplicación (Next.js App Router)
- `components/`: Componentes reutilizables de la UI
- `lib/`: Utilidades y funciones comunes
- `hooks/`: Hooks personalizados de React
- `styles/`: Estilos globales

## Colaboración

Para colaborar en este proyecto, por favor sigue estos pasos:

1. Crea una rama para tu característica o corrección (`git checkout -b feature/amazing-feature`)
2. Realiza tus cambios
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request