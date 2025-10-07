# URL Shortener Web App

Una aplicación web moderna construida con Next.js para crear, gestionar y redirigir URLs acortadas con una interfaz minimalista y elegante.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Guía de Inicio Rápido](#-guía-de-inicio-rápido)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Ejecución Local](#-ejecución-local)
- [Despliegue en la Nube](#-despliegue-en-la-nube)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API y Backend](#-api-y-backend)
- [Uso de la Aplicación](#-uso-de-la-aplicación)

## ✨ Características

- **Creación de URLs Cortas**: Convierte URLs largas en enlaces cortos y compartibles
- **Gestión de URLs**: Visualiza todas tus URLs acortadas en una lista organizada
- **Almacenamiento Persistente**: Guarda tus URLs en el navegador (localStorage)
- **Copiar al Portapapeles**: Copia URLs acortadas con un solo clic
- **Página de Redirección**: Muestra un mensaje de carga antes de redirigir al destino
- **Modo Oscuro**: Soporte completo para tema claro y oscuro
- **Diseño Minimalista**: Interfaz limpia y profesional enfocada en la funcionalidad
- **Responsive**: Funciona perfectamente en dispositivos móviles y de escritorio
- **Notificaciones Toast**: Feedback visual para todas las acciones del usuario

## 🛠️ Tecnologías

- **Next.js 15.5.4** - Framework de React con Turbopack
- **React 19.1.0** - Biblioteca de interfaz de usuario
- **TypeScript 5** - Tipado estático para JavaScript
- **Tailwind CSS 4.0** - Framework CSS utility-first
- **LocalStorage API** - Persistencia de datos en el navegador

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.0.0 o superior ([Descargar Node.js](https://nodejs.org/))
- **npm** 9.0.0 o superior (incluido con Node.js)
- **Git** (para clonar el repositorio)

Para verificar las versiones instaladas:

```bash
node --version
npm --version
git --version
```

## 🚀 Guía de Inicio Rápido

Ejecuta estos comandos para tener la aplicación corriendo en menos de 2 minutos:

```bash
# 1. Clona el repositorio
git clone <URL_DEL_REPOSITORIO>
cd url-shortener-web

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

¡Listo! Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd url-shortener-web
```

### 2. Instalar Dependencias

Usando npm:
```bash
npm install
```

Usando yarn:
```bash
yarn install
```

Usando pnpm:
```bash
pnpm install
```

### 3. Configuración del Backend (Opcional)

La aplicación está configurada para usar el backend en `http://18.116.202.212`. Si necesitas cambiar esta URL:

1. Abre `src/app/api/short-urls/route.ts`
2. Modifica la variable `BACKEND_URL`:
   ```typescript
   const BACKEND_URL = 'http://TU_BACKEND_URL/api/short-urls';
   ```

3. Abre `src/app/s/[code]/page.tsx`
4. Modifica la URL de redirección:
   ```typescript
   window.location.href = `http://TU_BACKEND_URL/s/${code}`;
   ```

## 💻 Ejecución Local

### Modo Desarrollo

El modo desarrollo incluye hot-reload, lo que significa que verás los cambios instantáneamente:

```bash
npm run dev
```

La aplicación estará disponible en:
- **URL principal**: [http://localhost:3000](http://localhost:3000)
- **Si el puerto 3000 está ocupado**: [http://localhost:3001](http://localhost:3001)

### Modo Producción (Local)

Para probar la versión optimizada localmente:

```bash
# 1. Construir la aplicación
npm run build

# 2. Iniciar el servidor de producción
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con Turbopack

# Producción
npm run build        # Construye la aplicación para producción
npm start            # Inicia el servidor de producción

# Testing
npm test             # Ejecuta todos los tests
npm run test:watch   # Ejecuta tests en modo watch
npm run test:coverage # Genera reporte de cobertura

# Utilidades
npm run lint         # Ejecuta ESLint para verificar código
```

## ☁️ Despliegue en la Nube

### Opción 1: Vercel (Recomendado)

Vercel es la plataforma creada por los desarrolladores de Next.js y ofrece el mejor soporte:

#### Despliegue Automático desde GitHub

1. **Crea una cuenta en [Vercel](https://vercel.com)**

2. **Conecta tu repositorio de GitHub**:
   - Haz clic en "Add New Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configura el proyecto** (Vercel usa configuración por defecto):
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Haz clic en "Deploy"**

5. **Tu aplicación estará en línea** en una URL como:
   ```
   https://tu-proyecto.vercel.app
   ```

#### Despliegue desde la Terminal

```bash
# 1. Instala Vercel CLI
npm install -g vercel

# 2. Inicia sesión en Vercel
vercel login

# 3. Despliega tu proyecto
vercel

# 4. Para producción
vercel --prod
```

### Opción 2: Netlify

1. **Crea una cuenta en [Netlify](https://www.netlify.com)**

2. **Conecta tu repositorio**:
   - Click en "Add new site" → "Import an existing project"
   - Conecta con GitHub y selecciona tu repositorio

3. **Configura el build**:
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Despliega**

### Opción 3: AWS Amplify

1. **Crea una cuenta en [AWS Amplify](https://aws.amazon.com/amplify/)**

2. **Conecta tu repositorio de GitHub**

3. **Amplify detectará Next.js automáticamente**

4. **Configuración de build** (amplify.yml):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. **Despliega**

### Opción 4: Docker

Si prefieres usar Docker:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Construir y ejecutar:

```bash
# Construir imagen
docker build -t url-shortener .

# Ejecutar contenedor
docker run -p 3000:3000 url-shortener
```

### Variables de Entorno (Opcional)

Si necesitas configurar variables de entorno en producción:

1. Crea un archivo `.env.production`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://18.116.202.212
   ```

2. Configura las variables en tu plataforma de despliegue:
   - **Vercel**: Settings → Environment Variables
   - **Netlify**: Site settings → Build & deploy → Environment
   - **AWS Amplify**: App settings → Environment variables

## 📁 Estructura del Proyecto

```plaintext
url-shortener-web/
├── public/                      # Archivos estáticos
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   └── app/
│       ├── api/
│       │   └── short-urls/
│       │       └── route.ts     # Proxy API para evitar CORS
│       ├── components/
│       │   └── Header.tsx       # Componente de navegación
│       ├── create/
│       │   └── page.tsx         # Página de creación de URLs
│       ├── s/
│       │   └── [code]/
│       │       └── page.tsx     # Página de redirección
│       ├── favicon.ico
│       ├── globals.css          # Estilos globales y animaciones
│       ├── layout.tsx           # Layout principal de la app
│       └── page.tsx             # Página principal (lista de URLs)
├── eslint.config.mjs            # Configuración de ESLint
├── next.config.ts               # Configuración de Next.js
├── package.json                 # Dependencias y scripts
├── postcss.config.mjs           # Configuración de PostCSS
├── tailwind.config.ts           # Configuración de Tailwind CSS
├── tsconfig.json                # Configuración de TypeScript
└── README.md                    # Este archivo

```

### Descripción de Archivos Clave

- **`src/app/page.tsx`**: Página principal que muestra la lista de URLs acortadas con opciones de copiar, redirigir y eliminar
- **`src/app/create/page.tsx`**: Formulario para crear nuevas URLs acortadas
- **`src/app/s/[code]/page.tsx`**: Página de redirección con animación de carga
- **`src/app/api/short-urls/route.ts`**: Proxy para el backend que evita problemas de CORS
- **`src/app/components/Header.tsx`**: Componente de navegación reutilizable
- **`src/app/globals.css`**: Estilos globales, animaciones y tema oscuro

## 🔌 API y Backend

La aplicación se conecta a un servicio backend de acortador de URLs en `http://18.116.202.212`

### Crear URL Corta

**Endpoint**: `POST /api/short-urls`

**Request Body**:

```json
{
  "url": "https://www.example.com/very/long/url/path"
}
```

**Response**:

```json
{
  "original_url": "https://www.example.com/very/long/url/path",
  "short_url": "http://18.116.202.212/s/2caf8b",
  "short_code": "2caf8b",
  "created_at": "2025-10-06T14:05:35.000000Z"
}
```

### Redirección

**Endpoint**: `GET /s/{code}`

Redirige automáticamente a la URL original asociada al código.

### Flujo de Datos

1. **Usuario ingresa URL** → Formulario en `/create`
2. **Petición al proxy** → `POST /api/short-urls` (Next.js)
3. **Proxy al backend** → `POST http://18.116.202.212/api/short-urls`
4. **Respuesta del backend** → Código corto generado
5. **Guardado local** → localStorage del navegador
6. **Redirección** → Vista de lista en `/`

## 📱 Uso de la Aplicación

### 1. Ver URLs Acortadas

En la página principal (`/`):
- Visualiza todas tus URLs acortadas
- Información mostrada: ID, código, URL original y fecha de creación
- Acciones disponibles por URL:
  - **Copiar**: Copia la URL corta al portapapeles
  - **Redirigir**: Prueba el enlace en una nueva pestaña
  - **Eliminar**: Borra la URL de tu lista
- **Clear All**: Elimina todas las URLs de una vez

### 2. Crear Nueva URL

1. Haz clic en "Create URL" en el header o en el botón de la página principal
2. Ingresa la URL larga que quieres acortar
3. La validación se hace en tiempo real (debe comenzar con http:// o https://)
4. Haz clic en "Shorten URL"
5. Serás redirigido a la página principal con tu nueva URL

### 3. Probar Redirección

1. En la lista de URLs, haz clic en el icono de redirección
2. Se abrirá la página `/s/[code]` con una animación de carga
3. Después de 1.5 segundos, serás redirigido al destino final

### 4. Persistencia de Datos

- Todas las URLs se guardan en el **localStorage** del navegador
- Los datos persisten incluso después de cerrar el navegador
- Solo se pierden si borras los datos del navegador o usas "Clear All"

## 🎨 Características de Diseño

- **Minimalista y Limpio**: Enfoque en funcionalidad sobre decoración
- **Colores Neutros**: Paleta de grises, negro y blanco
- **Modo Oscuro**: Soporte completo sin configuración adicional
- **Responsive**: Adaptable a móviles, tablets y escritorio
- **Accesibilidad**: Compatible con lectores de pantalla y navegación por teclado
- **Animaciones Sutiles**: Transiciones suaves en hover y feedback visual

## 🔍 Solución de Problemas

### El servidor no inicia

```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### El puerto 3000 está ocupado

```bash
# Usa un puerto diferente
PORT=3001 npm run dev
```

O Next.js automáticamente intentará usar el puerto 3001.

### Errores de CORS

La aplicación usa un proxy interno (`/api/short-urls`) para evitar errores de CORS. Si experimentas problemas:

1. Verifica que el backend esté en línea: `http://18.116.202.212`
2. Revisa la consola del navegador para errores
3. Asegúrate de que el proxy esté configurado correctamente

### Los datos no persisten

Si tus URLs no se guardan:

1. Verifica que el navegador permita localStorage
2. Revisa la consola para errores de JavaScript
3. Prueba en modo incógnito para descartar extensiones

## � Testing

Este proyecto incluye un conjunto completo de tests para garantizar la calidad del código.

### Configuración de Tests

Para instalar las dependencias de testing:

```bash
npm install
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

### Cobertura de Tests

El proyecto incluye tests para:

- ✅ **Componentes**: Header, UrlListContent
- ✅ **Páginas**: Home, Create, Redirect
- ✅ **API Routes**: /api/short-urls
- ✅ **Integración**: Flujos completos de usuario
- ✅ **Utilidades**: Helpers y funciones auxiliares

**Meta de cobertura**: 80%+ en todas las métricas

### Documentación de Tests

Para información detallada sobre testing, consulta:

📖 **[TESTING.md](./TESTING.md)** - Guía completa de testing

Incluye:
- Estructura de tests
- Cómo escribir nuevos tests
- Mejores prácticas
- Solución de problemas
- Ejemplos de código

### Continuous Integration

Los tests se ejecutan automáticamente en:
- Cada push a las ramas principales
- Cada Pull Request
- Antes del deployment

Ver configuración en `.github/workflows/test.yml`

## �🤝 Contribuir

¿Quieres contribuir? ¡Genial! Aquí está cómo:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 📞 Soporte

Si tienes preguntas o problemas:

1. Revisa la sección [Solución de Problemas](#-solución-de-problemas)
2. Abre un Issue en GitHub
3. Consulta la documentación de [Next.js](https://nextjs.org/docs)

## 🚀 Próximas Características

- [ ] Autenticación de usuarios
- [ ] Estadísticas de clics
- [ ] URLs personalizadas
- [ ] Fecha de expiración para URLs
- [ ] Códigos QR para URLs cortas
- [ ] Exportar URLs a CSV/JSON
- [ ] API pública con documentación

---

Desarrollado con ❤️ usando Next.js y Tailwind CSS
