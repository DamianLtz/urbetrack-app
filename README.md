# Urbetrack — Torre de control de higiene urbana (CABA)

SPA operativa para monitorear **mobiliario urbano (assets)**, **incidentes** y **vehículos** de higiene urbana en la Ciudad de Buenos Aires. Consume una API mockeada (Node/Express) y pone el foco en **Mapa** e **Incidentes**.

---

## Stack

| Área               | Herramienta                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| Build / runtime    | Vite 8, React 19 (React Compiler activado), TypeScript 6                 |
| Estado de servidor | TanStack Query (React Query) 5                                           |
| Estado de cliente  | Zustand 5 (filtros del mapa) + URL search params (filtros de incidentes) |
| Ruteo              | React Router 8                                                           |
| UI                 | shadcn/ui + Tailwind CSS v4 (primitivos RadixUI)                         |
| Formularios        | react-hook-form + `@hookform/resolvers` (zodResolver)                    |
| Validación         | Zod 4 (schemas compartidos runtime + tipos)                              |
| Mapa               | Leaflet + react-leaflet 5 + react-leaflet-cluster                        |
| Gráficos           | Recharts 3 (shadcn/ui)                                                   |
| Notificaciones     | Sonner (shadcn/ui)                                                       |
| Tests              | Vitest 4                                                                 |
| Lint               | oxlint                                                                   |

---

## Requisitos y puesta en marcha

Requiere **Node** y **pnpm**.

### 1. Backend (API mockeada)

Desde `backend/`:

```bash
pnpm install
pnpm dev        # levanta la API en http://localhost:3000
```

> Los datos viven **en memoria**: se reinician cada vez que reiniciás el backend.

### 2. Frontend

Desde `frontend/urbetrack-app/`:

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

La URL del backend es configurable con la variable **`VITE_API_URL`** en un `.env` (default: `http://localhost:3000`).

### Scripts

| Script       | Qué hace                                   |
| ------------ | ------------------------------------------ |
| `pnpm dev`   | Servidor de desarrollo                     |
| `pnpm build` | Typecheck (`tsc -b`) + build de producción |
| `pnpm test`  | Tests con Vitest                           |
| `pnpm lint`  | Lint con oxlint                            |

---

## Rutas

| Ruta                | Pantalla                                                       |
| ------------------- | -------------------------------------------------------------- |
| `/`                 | Redirige a `/dashboard`                                        |
| `/mapa`             | Mapa operativo: assets clusterizados + incidentes, con filtros |
| `/dashboard`        | Resumen: KPIs por estado (clickeables) + incidentes por zona   |
| `/incidentes`       | Listado con tabla paginada, filtros y orden                    |
| `/incidentes/nuevo` | Alta de incidente (formulario + ubicación en mapa)             |
| `/incidentes/:id`   | Detalle de un incidente                                        |

---

## Arquitectura

```
src/
├─ pages/            # una por ruta (contenedores: fetch + estados + composición)
├─ layouts/          # AppLayout (sidebar + shell)
├─ components/
│  ├─ ui/            # shadcn/ui (Radix)
│  ├─ dataTable/     # DataTable genérico + paginación + columns/
│  ├─ charts/        # gráficos presentacionales (reciben data por props)
│  ├─ dialogs/ chips/ map/ pageHeader/ ...
├─ hooks/            # useIncidents, useZones, useAssets, useVehicles (React Query)
├─ stores/           # filterStore (Zustand) — filtros del mapa
├─ lib/
│  ├─ api.ts         # cliente HTTP (apiFetch / apiPost)
│  ├─ schemas.ts     # schemas Zod + tipos inferidos + type guards
│  ├─ queryKeys.ts   # query key factory
│  ├─ incidentStats.ts   # agregadores puros (para el dashboard) + tests
│  ├─ incidentOptions.ts / assetOptions.ts   # opciones y labels (i18n)
│  └─ formatDate.ts
```

**Flujo de datos:** los componentes de página piden datos vía hooks de React Query → los hooks pegan a la API con `apiFetch` y **validan la respuesta con Zod en la frontera** (`z.array(schema).parse(data)`) → los datos ya tipados bajan a componentes presentacionales.

---

## Decisiones de arquitectura

- **React Query para el estado de servidor.** Cache, estados de `loading`/`error`, refetch e invalidación resueltos por la librería. No hay estado de servidor duplicado en el cliente.
- **Zod en la frontera.** Los tipos salen de los schemas (`z.infer`), así hay **una sola fuente de verdad** y además validación en runtime de lo que devuelve la API (que es mockeada y podría cambiar).
- **Query key factory + `staleTime` por volatilidad.** Keys centralizadas en `queryKeys.ts`; las zonas se cachean con `staleTime: Infinity` porque prácticamente no cambian, a diferencia de los incidentes, el resto usa 60s.
- **Zustand solo para los filtros del mapa.** Es el único estado de cliente que comparten componentes que no se conocen entre sí (los selects del toolbar y la capa de incidentes del mapa). Para el resto alcanzó con `useState` local y la URL, así que no hizo falta un store global.
- **Filtros de incidentes por URL (`?status=…`).** Al tocar una KPI card del dashboard se navega a `/incidentes?status=…` y el listado arranca ya filtrado por ese estado. Como el filtro vive en la URL, el link se puede copiar, compartir o refrescar sin perderlo. El valor que llega por query param se valida contra el enum de estados antes de usarse (si alguien escribe `?status=cualquierCosa` a mano, se ignora).
- **Validación del formulario en el front** (además del backend) con react-hook-form + zodResolver: feedback inmediato por campo → mejor UX.
- **shadcn/ui sobre Radix.** Los componentes utilizados usan la variante de RadixUI y no la de BaseUI.
- **Tabla:** paginación client-side con `autoResetPageIndex: false` (evita saltar a la página 1 en cada refetch) y orden por fecha descendente (lo más reciente primero).

---

## Limitaciones conocidas

- **El backend de incidentes solo expone `GET` y `POST`** (no hay `PATCH`/`PUT`/`DELETE`). En consecuencia, **no se puede editar el estado de un incidente ni borrarlo** desde la app. Las acciones de edición/lote quedan como próximos pasos (ver más abajo).
- **Datos en memoria:** todo lo que se crea se pierde al reiniciar el backend.
- **`GET /assets` devuelve todo el mobiliario urbano de una sola vez** (~1500 registros entre cestos, contenedores y bancos), sin paginación. Renderizar 1500 marcadores individuales haría el mapa inusable, así que se agrupan con **clustering** y se van abriendo a medida que se hace zoom.
- Un incidente nuevo lo agrega el backend al **final** de la lista; se mitiga ordenando la tabla por fecha descendente para que aparezca arriba.

---

_El prototipo todavía no tiene autenticación ni roles: se muestra el perfil de **supervisor**, que tiene la visión completa (dashboard, mapa, listado, gestión) y puede además hacer las tareas del operador (como reportar un incidente). Por eso las historias implementadas están narradas desde el supervisor. Las pendientes ya separan los perfiles: operador de carga, supervisor y un administrador para la gestión de accesos._

## User stories implementadas

- **Como** supervisor, **quiero** ver el mobiliario urbano y los incidentes sobre un mapa de CABA, **para** tener una lectura geográfica de la operación (assets agrupados con clustering + incidentes).
- **Como** supervisor, **quiero** filtrar los incidentes del mapa por estado, tipo y zona, **para** enfocarme en lo que me interesa.
- **Como** supervisor, **quiero** un listado de incidentes en tabla —con filtros, paginación y orden por fecha—, **para** revisarlos ordenadamente y llegar al detalle.
- **Como** supervisor, **quiero** ver el detalle de un incidente con su ubicación en un mini-mapa, **para** entender el caso completo.
- **Como** supervisor, **quiero** registrar un incidente marcando la ubicación en el mapa y con validación de los campos, **para** cargar reportes confiables y con feedback inmediato.
- **Como** supervisor, **quiero** un dashboard con métricas por estado y un gráfico de incidentes por zona, **para** tener un pulso rápido del estado general.
- **Como** supervisor, **quiero** tocar una métrica del dashboard y saltar al listado ya filtrado por ese estado, **para** investigar sin re-filtrar a mano.

---

## User stories (próximas iteraciones)

- **Como** usuario, **quiero** iniciar sesión, **para** acceder a la aplicación de forma segura.
- **Como** administrador, **quiero** que cada rol (operador / supervisor) acceda solo a las pantallas de su función, **para** que cada perfil vea lo que necesita (el operador entra directo a reportar; el supervisor, al dashboard y la gestión).
- **Como** supervisor, **quiero** cambiar el estado de un incidente (`REPORTED → IN_PROGRESS → RESOLVED`) **para** reflejar el avance de la cuadrilla en tiempo real.
- **Como** supervisor, **quiero** seleccionar varios incidentes y cambiarles el estado en lote **para** despachar trabajo sin ir uno por uno.
- **Como** supervisor, **quiero** asignar un vehículo/cuadrilla a un incidente **para** organizar la operación del día.
- **Como** supervisor, **quiero** que los incidentes se actualicen en tiempo real **para** tener visibilidad del estado actual de la ciudad.
- **Como** operador, **quiero** registrar un incidente en menos de un minuto con los datos mínimos, **para** atender el volumen de llamadas sin dejar reclamos sin cargar.
- **Como** supervisor, **quiero** unificar incidentes duplicados (mismos reclamos sobre la misma ubicación) en un único caso, **para** no despachar más de una cuadrilla al mismo lugar y optimizar el trabajo del área.
- **Como** supervisor, **quiero** desglosar el gráfico de incidentes por zona según el tipo de incidente, **para** identificar qué problema predomina en cada zona y priorizar los recursos adecuados.

---

## Próximos pasos

- Endpoints de escritura (`PATCH`/`DELETE`) → habilitar edición de estado y **acciones en lote** desde el listado.
- Barras del gráfico del dashboard clickeables (drill-down por zona).
- Vista de vehículos.
- Tests de componentes/integración además de los unitarios de agregadores y validación.

---

## Tests

```bash
pnpm test
```

Cubren los **agregadores del dashboard** (`incidentStats`) y la **validación del formulario** de alta de incidentes (`incidentInputSchema`).
