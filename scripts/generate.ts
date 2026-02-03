#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";
import {logger} from "../src/config/logger";

/* ---------------- ARGUMENT ---------------- */

const name = process.argv[2];

if (!name) {
    logger.error("❌ Please provide a model name");
    logger.error("   Example: npm run make:model product");
    process.exit(1);
}

/* ---------------- NAMING ---------------- */

const kebab = name.toLowerCase();
const pascal = kebab.charAt(0).toUpperCase() + kebab.slice(1);
const plural = kebab.endsWith("s") ? kebab : `${kebab}s`;

/* ---------------- PATHS ---------------- */

const basePath = path.join(__dirname, "..", "src");

const paths = {
    models: path.join(basePath, "models"),
    services: path.join(basePath, "services"),
    controllers: path.join(basePath, "controllers"),
    validators: path.join(basePath, "validators"),
    routes: path.join(basePath, "routes"),
};

const files = {
    model: path.join(paths.models, `${kebab}.model.ts`),
    service: path.join(paths.services, `${kebab}.service.ts`),
    controller: path.join(paths.controllers, `${kebab}.controller.ts`),
    validator: path.join(paths.validators, `${kebab}.validator.ts`),
    routes: path.join(paths.routes, `${kebab}.routes.ts`),
};

/* ---------------- HELPERS ---------------- */

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function createFile(filePath: string, content: string) {
    if (fs.existsSync(filePath)) {
        logger.info(`⚠️  Skipped (exists): ${filePath}`);
        return;
    }
    fs.writeFileSync(filePath, content);
    logger.info(`✅ Created: ${filePath}`);
}

/* ---------------- ENSURE DIRS ---------------- */

Object.values(paths).forEach(ensureDir);

/* ---------------- TEMPLATES ---------------- */

const modelTpl = `
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class ${pascal} extends Model {
  declare id: number;
}

${pascal}.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "${plural}",
  }
);
`.trim() + "\n";

const serviceTpl = `
import { ${pascal} } from "../models";

export class ${pascal}Service {
  static async findAll() {
    return ${pascal}.findAll();
  }

  static async findById(id: number) {
    return ${pascal}.findByPk(id);
  }
}
`.trim() + "\n";

const controllerTpl = `
import { Request, Response, NextFunction } from "express";
import { ${pascal}Service } from "../services/${kebab}.service";

export class ${pascal}Controller {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await ${pascal}Service.findAll());
    } catch (e) {
      next(e);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await ${pascal}Service.findById(Number(req.params.id)));
    } catch (e) {
      next(e);
    }
  }
}
`.trim() + "\n";

const validatorTpl = `
import { ApiError } from "../utils/ApiError";

export function validateCreate${pascal}(body: any) {
  if (!body) {
    throw new ApiError(400, "Invalid payload");
  }
}
`.trim() + "\n";

const routesTpl = `
import { Router } from "express";
import { ${pascal}Controller } from "../controllers/${kebab}.controller";

const router = Router();

router.get("/", ${pascal}Controller.getAll);
router.get("/:id", ${pascal}Controller.getById);

export default router;
`.trim() + "\n";

/* ---------------- CREATE FILES ---------------- */

createFile(files.model, modelTpl);
createFile(files.service, serviceTpl);
createFile(files.controller, controllerTpl);
createFile(files.validator, validatorTpl);
createFile(files.routes, routesTpl);

/* ---------------- UPDATE models/index.ts ---------------- */
/* ---------------- UPDATE models/index.ts ---------------- */

const modelsIndexPath = path.join(paths.models, "index.ts");

// créer index.ts s'il n'existe pas
if (!fs.existsSync(modelsIndexPath)) {
    fs.writeFileSync(modelsIndexPath, "export {\n};\n");
}

let modelsIndex = fs.readFileSync(modelsIndexPath, "utf-8");

// ---------- IMPORT ----------
const modelImport = `import { ${pascal} } from "./${kebab}.model";`;

if (!modelsIndex.includes(modelImport)) {
    modelsIndex = modelImport + "\n" + modelsIndex;
}

// ---------- EXPORT (MERGE SAFE) ----------

const exportRegex = /export\s*{\s*([\s\S]*?)\s*};/m;

if (exportRegex.test(modelsIndex)) {
    modelsIndex = modelsIndex.replace(exportRegex, (_match, exportBlock) => {
        const existing = exportBlock
            .split(",")
            .map((e: string) => e.trim())
            .filter(Boolean);

        if (!existing.includes(pascal)) {
            existing.push(pascal);
        }

        return `export {\n  ${existing.join(",\n  ")}\n};`;
    });
} else {
    // fallback sécurité
    modelsIndex += `\nexport {\n  ${pascal},\n};\n`;
}

fs.writeFileSync(modelsIndexPath, modelsIndex);
logger.info("🔗 models/index.ts merged correctly");

/* ---------------- UPDATE routes/index.ts ---------------- */

const routesIndexPath = path.join(paths.routes, "index.ts");

if (fs.existsSync(routesIndexPath)) {
    let routesIndex = fs.readFileSync(routesIndexPath, "utf-8");

    const importLine = `import ${pascal}Routes from "./${kebab}.routes";`;
    const useLine = `router.use("/${plural}", ${pascal}Routes);`;

    if (!routesIndex.includes(importLine)) {
        routesIndex = importLine + "\n" + routesIndex;
    }

    if (!routesIndex.includes(useLine)) {
        routesIndex = routesIndex.replace(
            /export default router;/,
            `${useLine}\n\nexport default router;`
        );
    }

    fs.writeFileSync(routesIndexPath, routesIndex);
    logger.info("🔗 routes/index.ts updated");
}

logger.info("🎉 Generation completed successfully");
