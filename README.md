<div align="center">

# 🚀 boilerplate-nodejs

**Node.js v24 + TypeScript + Express (MVC) + Sequelize (MySQL) + JWT Auth (Access/Refresh) + PM2 + Winston**

A production-ready backend boilerplate with a clean architecture, security best practices, and an internal code generator.

<br/>

[![Node.js](https://img.shields.io/badge/Node-24.x-3C873A?logo=node.js&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](#)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?logo=sequelize&logoColor=white)](#)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](#)
[![PM2](https://img.shields.io/badge/PM2-Cluster-2B2B2B?logo=pm2&logoColor=white)](#)
[![Winston](https://img.shields.io/badge/Logs-Winston-2B2B2B)](#)

<br/>

</div>

---

## ✨ Features

- **Clean MVC architecture** (Controllers / Services / Routes / Models)
- **Sequelize + MySQL** (pooling + structured init)
- **Security**: `helmet` + global rate-limit
- **Validation**: `validator` (middleware-based)
- **Logging**: Winston (colorized in DEV, clean in PROD)
- **PM2**: Cluster mode + production execution
- **Auth (advanced)**:
  - Access Token + Refresh Token
  - Refresh token rotation
  - Logout (session revoke)
  - Token blacklist (revoked access tokens)
  - Global revoke (tokenVersion strategy)
  - Login rate-limit
- **Internal generator**: creates model + service + controller + validator + routes + auto-registers in index files

---

## 🧩 Project Structure

```txt
src/
├── app.ts
├── server.ts
├── config/
│   ├── env.ts
│   ├── database.ts
│   └── logger.ts
├── models/
│   ├── index.ts
│   ├── user.model.ts
│   ├── refreshToken.model.ts
│   └── revokedToken.model.ts
├── controllers/
├── services/
├── validators/
├── middlewares/
├── routes/
│   └── index.ts
└── utils/
scripts/
└── generate.ts

```
## ✅ Requirements

Node.js v24.x

MySQL (local or remote)

## ⚙️ Installation
Always show details
git clone https://github.com/khyassine2/boilerplate-nodejs.git
cd boilerplate-nodejs
npm install


## ⚠️ Production recommendation: disable DB sync and use migrations.

Always show details
DB_SYNC=false
DB_SYNC_ALTER=false
DB_SYNC_FORCE=false

**▶️ Run**
Development
Always show details
npm run dev

**Build**
Always show details
npm run build

Start compiled output
Always show details
npm start

**⚡ PM2 (Production)**
Start
Always show details
pm2 start ecosystem.config.js --env production

Useful commands
Always show details
pm2 list
pm2 logs
pm2 logs boilerplate-nodejs
pm2 restart boilerplate-nodejs
pm2 reload boilerplate-nodejs     # zero-downtime (cluster)
pm2 stop boilerplate-nodejs
pm2 delete boilerplate-nodejs
pm2 kill


## 🧾 Logging (Winston)

DEV: colorized logs

PROD: clean logs (no ANSI codes)

## PM2 output files:

logs/pm2-out.log

logs/pm2-error.log

**Optional app logs (if enabled):**

logs/app.log

logs/error.log


## 🔐 Auth (JWT Advanced)
**- Endpoints**
Always show details
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

**- Protected route header**
Always show details
Authorization: Bearer <ACCESS_TOKEN>

- **What’s included**

  - Access token + refresh token
  
  - Refresh token rotation
  
  - Logout (revoke refresh token + optional access token blacklist)
  
  - Access blacklist using jti
  
  - Global revoke using tokenVersion
  
  - Login brute-force limiter
  
  - RBAC roles (user, admin)


## 👮 RBAC (Roles)

**- Supported roles:**

  - user
  
  - admin

**- Example:**

Always show details
router.get("/admin", authMiddleware, requireRole("admin"), handler);


## 🧰 Generator (CLI)

**- Generates automatically:**

  - model
  
  - service
  
  - controller
  
  - validator
  
  - routes

  - And auto-updates:

    src/models/index.ts (import + export)

    src/routes/index.ts (import + router.use())

**Run:**

Always show details
**npm run make:model name_model**


**Output:**

Always show details
src/models/product.model.ts
src/services/product.service.ts
src/controllers/product.controller.ts
src/validators/product.validator.ts
src/routes/product.routes.ts








