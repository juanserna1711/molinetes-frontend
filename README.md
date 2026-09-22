# MOLIPLUS Frontend

## Descripción

Interfaz para administrar tallas, usuarios, molinetes y rendimientos textiles, preparar cálculos de tiempo de giro TIGIMOLI y consultar su historial y detalle.

La pantalla de acceso presenta campos de usuario y contraseña, pero el botón Ingresar actualmente navega a tallas sin enviar credenciales. Las rutas operativas no comprueban una sesión. Los identificadores de usuario para registrar rendimientos y cálculos están fijados en sus respectivos componentes.

## Tecnologías

Dependencias declaradas en `package.json`:

- React y React DOM 19; React Router DOM 7 para navegación.
- Axios 1 para solicitudes HTTP.
- Material UI e iconos MUI 9; Emotion 11 para su sistema de estilos.
- Lucide React está declarado como dependencia.
- Vite 8 y su plugin React 6 para desarrollo y compilación.
- ESLint 10, plugins de hooks y React Refresh, globals y tipos de React como herramientas de desarrollo.

Los rangos exactos están en `package.json`; `package-lock.json` registra las versiones resueltas.

## Requisitos

Node.js y npm compatibles con las dependencias del proyecto, un navegador y acceso a la API del backend para consultar o modificar datos. El `package.json` del proyecto no declara un campo `engines`.

## Instalación

Desde la carpeta del frontend:

```sh
npm ci
```

Configurar localmente la variable descrita a continuación tomando `.env.example` como referencia. Las credenciales de Oracle pertenecen al backend.

## Variables de entorno

| Nombre | Finalidad |
|--------|-----------|
| `VITE_API_URL` | Base de la API usada por todos los servicios Axios; debe incluir el prefijo `/api` del backend. |

Los servicios agregan a esa base `/tallas`, `/usuarios`, `/molinetes`, `/rendtallas` o `/tigimoli`. No existe una URL alternativa en esos archivos. Este documento solo incluye nombres y finalidad, sin valores del entorno.

## Ejecución en desarrollo

```sh
npm run dev
```

Abrir la dirección que indique Vite. Mantener disponible el backend para las operaciones de datos.

## Estructura del proyecto

| Ubicación | Responsabilidad |
|-----------|-----------------|
| `src/components` | Marco visual, navegación, tablas, formularios, confirmación y notificaciones; incluye captura y resultados de TIGIMOLI. |
| `src/pages` | Estados de cada pantalla, filtros, carga, operaciones de datos y coordinación de componentes. |
| `src/services` | Funciones Axios para los cinco recursos del backend. |
| `src/styles` | Once hojas CSS globales de estructura, pantallas, tablas, formularios y avisos. |
| `src/assets` | Logotipos de MOLIPLUS y Textiles del Pacífico y decoración de ondas, utilizados desde los componentes. |
| `src/App.jsx` | Rutas, redirección inicial y agrupación bajo Layout. |
| `src/main.jsx` | Montaje en `root`, StrictMode, BrowserRouter e importación de estilos. |
| `public` | Recursos estáticos, incluido el logotipo referenciado como icono en index.html. |
| `index.html` | Documento de entrada que carga main.jsx. |
| `vite.config.js` / `eslint.config.js` | Configuración de desarrollo/compilación y análisis estático. |
| `CHANGELOG.md` | Bitácora existente del proyecto. |

## Arquitectura del frontend

`main.jsx → App → página → servicio Axios → API backend`.

Las páginas mantienen el estado con hooks y pasan datos y callbacks a los componentes. Layout incorpora Sidebar y el Outlet de las rutas operativas. Los formularios de tallas, usuarios y molinetes también consultan sus servicios para detectar códigos duplicados durante la creación.

Los servicios retornan `response.data`, es decir, el cuerpo JSON de la API. Las páginas consultan su propiedad `data` para obtener los registros y utilizan `message` en los errores. Los formularios pueden asociar el error de la API a un campo mediante `field`.

Las hojas CSS se cargan globalmente desde main.jsx. El orden importa porque existen selectores compartidos entre archivos.

## Módulos/pantallas existentes

| Ruta | Pantalla y operaciones |
|------|-----------------------|
| `/` | Redirige a `/login`. |
| `/login` | Pantalla de acceso; Ingresar navega a `/tallas`. |
| `/tallas` | Consulta, creación, edición, activación, desactivación y eliminación de tallas. |
| `/usuarios` | Consulta, creación, edición, activación, desactivación y eliminación de usuarios. |
| `/molinetes` | Consulta, creación, edición y eliminación de molinetes con RPM y perímetro. |
| `/rendimiento-tallas` | Consulta de tallas con sus rendimientos; creación, edición y eliminación del rendimiento. |
| `/nuevo-tigimoli` | Selección de molinetes/tallas, cantidades de rollos, vista previa y registro del cálculo. |
| `/tigimoli` | Historial con búsqueda por código/nombre, fecha, páginas de diez registros y detalle expandible. |
| Ruta desconocida | Muestra el mensaje 404. |

En los catálogos, la búsqueda distingue un código numérico de un nombre. Tallas, usuarios y rendimientos incluyen estado en los filtros construidos; el efecto de búsqueda automática de estas páginas depende de `busqueda`. El historial vuelve a la primera página cuando cambia la búsqueda o la fecha.

## Cálculos y captura

RendTallaForm calcula una vista previa:

- Rendimiento: `1000 / ((ancho * 2 / 100) * peso)`, si ancho y peso son positivos.
- Metros por rollo: `peso del rollo * rendimiento`, si ambos factores son positivos.

El formulario envía código de talla, ancho, peso, peso del rollo y usuario; los valores calculados de la vista previa no forman parte del cuerpo enviado.

NuevoTigimoliPage carga molinetes y rendimientos en paralelo. Por talla calcula `rollos * metrosRollo`; suma rollos y metros, y para cada molinete calcula minutos como `totalMetros / ((rpm * perimetro) / 100)`, usando el perímetro en centímetros. Si RPM, perímetro o metros son no positivos, la vista previa del tiempo devuelve cero.

El guardado exige al menos un molinete, una talla y rollos positivos por talla. Construye las combinaciones molinete-talla y envía `codigosMolinetes`, `codigosTallas` y `cantidadesRollos` como arreglos correspondientes por índice, junto con `usuario`. Al guardar correctamente limpia la selección. El historial obtiene sus valores persistidos del backend.

## Comunicación con el backend

Los servicios usan GET para consultas, POST para crear, PUT para actualizar, DELETE para eliminar y PATCH para activar/desactivar tallas y usuarios. El detalle del historial se obtiene desde `/tigimoli/detalle` con código y fecha.

Axios propaga los errores a los consumidores. Las páginas presentan estados de carga, errores, ausencia de resultados y avisos; los formularios controlan campos obligatorios y errores de captura. La API completa, incluidos los contratos de entrada, está documentada en el README del backend.

## Scripts disponibles

| Comando | Acción declarada |
|---------|------------------|
| `npm run dev` | Ejecuta `vite`. |
| `npm run build` | Ejecuta `vite build`. |
| `npm run lint` | Ejecuta `eslint .`. |
| `npm run preview` | Ejecuta `vite preview`. |

No hay un script de pruebas declarado.

## Estrategia de ramas

Se conserva la convención documentada de Git Flow: `main` para producción y `develop` para pruebas/QA.
