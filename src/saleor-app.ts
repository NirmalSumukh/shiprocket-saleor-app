import { APL } from "@saleor/app-sdk/APL";
import { SaleorApp } from "@saleor/app-sdk/saleor-app";
import { FileAPL } from "@saleor/app-sdk/APL/file";
import path from "path";

/**
 * By default auth data are stored in the `.auth-data.json` (FileAPL).
 * For multi-tenant applications and deployments please use UpstashAPL.
 *
 * To read more about storing auth data, read the
 * [APL documentation](https://github.com/saleor/saleor-app-sdk/blob/main/docs/apl.md)
 */

// Create APL instance based on environment
function getAPL(): APL {
  // Use /app/data directory for persistent storage in Docker
  const dataDir = process.env.APL_DATA_DIR || '/app/data';
  const authFilePath = path.join(dataDir, '.auth-data.json');

  console.log('[APL] Using FileAPL with path:', authFilePath);

  switch (process.env.APL) {
    /**
     * Depending on env variables, chose what APL to use.
     * To reduce the footprint, import only these needed
     *
     * TODO: See docs
     */
    default:
      return new FileAPL({
        fileName: authFilePath,
      });
  }
}

// Export as const (not let)
export const apl: APL = getAPL();

export const saleorApp = new SaleorApp({
  apl,
});

