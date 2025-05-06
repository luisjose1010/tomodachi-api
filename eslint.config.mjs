import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { ignores: ["dist", "api", "prisma"] },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    languageOptions: {
      globals: globals.node,
    },
    extends: ["js/recommended"],
  },
  tseslint.configs.recommended,
]);
