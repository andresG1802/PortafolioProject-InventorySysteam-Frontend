# Inventory Frontend

Frontend de un mini-ERP (inventario, catálogo, compras y ventas) construido con **React 19 + Vite + TypeScript + Redux Toolkit + Tailwind v4**.

## Requisitos

- Node.js 18+
- El backend (`PortafolioProject-InventorySystem`) corriendo y accesible (ver su README)

## Instalación

```bash
npm install   # o yarn install
```

Crea el archivo de variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

`VITE_API_URL` debe apuntar a la URL base de la API del backend (por defecto `http://localhost:3000/api`).

## Correr en desarrollo

```bash
npm run dev
```

Levanta el servidor de Vite en `http://localhost:5173`.

## Otros comandos

| Comando | Descripción |
|---|---|
| `npm run build` | Type-check (`tsc -b`) y build de producción a `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Corre Oxlint |

## Estructura

Organizado por features (`src/products`, `src/categories`, `src/purchase-orders`, etc.), cada uno con `pages/` y `components/`. El estado global vive en `src/store` (un slice de Redux Toolkit por feature) y las llamadas HTTP en `src/api` (una instancia de Axios compartida en `axiosInstance.ts` con interceptor de token JWT). Componentes de UI reutilizables (`Button`, `Input`, `Select`, `Modal`, etc.) están en `src/components/ui`.

## Stack

React 19 · Vite · TypeScript · Redux Toolkit · React Router v7 · React Hook Form · Tailwind CSS v4 · Framer Motion · Axios · react-hot-toast
