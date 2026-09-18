# Cloud Foundations

Proyecto React para simular una consola de arquitectura Cloud orientada a la planificación, análisis y operación de soluciones AWS. Permite evaluar costos, infraestructura, seguridad, conectividad y servicios clave de un entorno cloud enterprise.

## Descripción general

Cloud Foundations es un dashboard interactivo que ayuda a:

- definir una solución Cloud con sus objetivos y servicios
- comparar costos por recurso y perfil de uso
- revisar infraestructura global por región
- evaluar controles de seguridad y cumplimiento
- inspeccionar la topología de red y conectividad
- explorar servicios AWS con filtro, búsqueda y detalle

## Tecnologías utilizadas

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- localStorage para persistencia

## Requisitos del proyecto

Este proyecto incluye y cumple los requisitos solicitados:

- Proyecto React con código fuente completo
- README con nombre, descripción, tecnologías, instalación, ejecución, funcionalidades y evidencia visual
- Dashboard principal
- Planificación Cloud
- Costos con gráfico interactivo
- Infraestructura y selector de regiones
- Seguridad
- Arquitectura de red
- Servicios AWS con buscador y filtros
- Vista detallada de cada servicio
- Exportación de reporte CSV
- Notificaciones de la UI
- Animaciones y transiciones
- Persistencia mediante localStorage
- Vista responsive

## Estructura del proyecto

```bash
src/
├── App.css
├── App.tsx
├── components/
│   ├── CostCard.tsx
│   ├── Header.tsx
│   ├── Icon.tsx
│   ├── Panel.tsx
│   ├── RegionCard.tsx
│   ├── SectionHeader.tsx
│   ├── SecurityCard.tsx
│   ├── ServiceCard.tsx
│   └── Sidebar.tsx
├── data/
│   └── cloudData.ts
├── hooks/
│   └── usePersistentState.ts
├── layout/
│   └── DashboardLayout.tsx
├── pages/
│   ├── Costs.tsx
│   ├── Dashboard.tsx
│   ├── Infrastructure.tsx
│   ├── Network.tsx
│   ├── Planning.tsx
│   ├── Security.tsx
│   └── Services.tsx
├── types/
│   └── cloud.ts
├── index.css
├── main.tsx
└──
```

## Funcionalidades principales

### Dashboard

Vista general con indicadores de:

- costo mensual estimado
- costo anual
- recursos activos
- seguridad del entorno
- estado de la arquitectura

### Planificación Cloud

Formulario para definir:

- nombre de la solución
- tipo de aplicación
- región
- usuarios estimados
- disponibilidad requerida
- servicios seleccionados

La configuración se guarda en localStorage para mantener la propuesta entre sesiones.

### Costos

Permite:

- modificar cantidad de recursos por servicio
- ajustar horas de uso mensual
- visualizar un gráfico interactivo con Recharts
- exportar un reporte CSV
- evaluar si el consumo está dentro del presupuesto

### Infraestructura

Incluye:

- selector de regiones
- mapa de cobertura global
- métricas por región
- recursos disponibles
- monitoreo y búsqueda por recurso

### Seguridad

Muestra:

- controles activos
- review states por dominio
- priorización de hallazgos
- resumen de responsabilidad compartida

### Arquitectura de red

Presenta la ruta de tráfico desde internet hasta base de datos con:

- componentes principales
- latencia
- direcciones de red
- validación de conectividad

### Servicios AWS

Cuenta con:

- buscador por nombre o descripción
- filtros por categoría
- vista detallada del servicio seleccionado
- catálogo con estado, tipo y propósito

## Instalación

1. Clona este repositorio.
2. Accede a la carpeta del proyecto.
3. Instala las dependencias:

```bash
npm install
```

## Ejecución

Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

Abre la dirección que te indique Vite en el navegador.

## Construcción para producción

```bash
npm run build
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Evidencias / capturas del proyecto

La aplicación incluye vistas completas para cada módulo del dashboard, con diseño responsive y navegación por secciones:

- Dashboard
- Planificación Cloud
- Costos
- Infraestructura
- Seguridad
- Arquitectura de Red
- Servicios AWS
- Vista responsive móvil y desktop

La estructura visual se compone de paneles, tarjetas, gráficas y filtros interactivos que hacen referencia a cada una de estas pantallas principales.

## Nota de diseño

Se incorporaron transiciones suaves, estados hover, notificaciones, selector de regiones, búsqueda, filtros y persistencia para ofrecer una experiencia más realista de administración Cloud.

## Autor

Proyecto desarrollado como dashboard de arquitectura Cloud para visión estratégica, operativa y de costos.
