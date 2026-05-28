# Tisico App



Plataforma interna para automatizar la gestión de **Seguridad, Calidad y Medio Ambiente (SHE)**.



## Stack



| Capa | Tecnología |

|------|------------|

| Frontend | Next.js 16, Tailwind CSS 4, shadcn/ui |

| Backend | NestJS 11, Prisma |

| Base de datos | PostgreSQL 16 |

| Storage | MinIO (S3 compatible) |

| Infra | Docker Compose |

| Auth | JWT + RBAC |



## Estructura



```

tisico-app/

├── apps/

│   ├── api/          # NestJS + Prisma

│   └── web/          # Next.js + shadcn

├── docker-compose.yml

└── package.json      # npm workspaces

```



## Requisitos



- Node.js 20+

- Docker Desktop (o Docker + Docker Compose)

- npm 10+



## Inicio rápido



### 1. Variables de entorno



```bash

cp .env.example .env

cp apps/api/.env.example apps/api/.env

cp apps/web/.env.example apps/web/.env.local

```



### 2. Instalar dependencias



```bash

npm install

```



### 3. Levantar servicios (PostgreSQL + MinIO)



```bash

npm run docker:up

```



### 4. Migraciones y seed



```bash

npm run db:migrate

npm run db:seed

```



El seed crea un usuario administrador:



| Campo | Valor por defecto |

|-------|-------------------|

| Email | `admin@tisico.com` |

| Contraseña | `Admin123!` |



Configurable en `apps/api/.env` con `SEED_ADMIN_*`.



### 5. Desarrollo



```bash

npm run dev:api    # http://localhost:3001

npm run dev:web    # http://localhost:3000

```



Ingresá en http://localhost:3000/login con las credenciales del admin.



## Roles (RBAC)



| Rol | Permisos |

|-----|----------|

| **Operador** | Acceso al dashboard (módulos futuros) |

| **Supervisor** | Idem operador (permisos extendidos en módulos) |

| **Admin** | Gestión de usuarios + todos los permisos |



## Scripts útiles



| Comando | Descripción |

|---------|-------------|

| `npm run dev:api` | API en modo watch |

| `npm run dev:web` | Frontend Next.js |

| `npm run docker:up` | Levantar Postgres y MinIO |

| `npm run db:migrate` | Ejecutar migraciones Prisma |

| `npm run db:seed` | Crear usuario admin inicial |

| `npm run build` | Build de todos los workspaces |



## Endpoints API



| Método | Ruta | Auth | Descripción |

|--------|------|------|-------------|

| GET | `/api` | Pública | Info de la API |

| GET | `/api/health` | Pública | Health check |

| POST | `/api/auth/login` | Pública | Login (retorna JWT) |

| GET | `/api/auth/me` | JWT | Usuario actual |

| GET | `/api/users` | Admin | Listar usuarios |

| POST | `/api/users` | Admin | Crear usuario |

| PATCH | `/api/users/:id` | Admin | Actualizar usuario |



## Próximos pasos



1. **Seguridad** — Registro y seguimiento de hallazgos

2. **Calidad** — Planificación de mantenimientos y retorno diario

