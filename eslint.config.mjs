import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

//  аналог Airbnb
const recommendedRules = {
  "@typescript-eslint/consistent-type-imports": "warn",
  "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
  "@typescript-eslint/no-unused-vars": "warn",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/ban-ts-comment": "warn",
  "@typescript-eslint/no-floating-promises": "warn",
  "import/no-extraneous-dependencies": [
    "error", 
    { devDependencies: ["**/*.test.ts", "**/*.spec.ts"] }
  ],
  "import/order": [
    "warn",
    {
      groups: [
        "builtin",
        "external",
        "internal",
        "parent",
        "sibling",
        "index"
      ],
      "newlines-between": "always"
    }
  ]
};

export default [
  {
    ignores: [
      "build/**/*",
      "library/**/*",
      "settings/**/*",
      "temp/**/*",
      "**/*.d.ts",
      "node_modules/**/*"
    ]
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
      project: "./tsconfig.json",   
      ecmaVersion: "latest",
      sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "prettier": prettier,
      "import": importPlugin 
    },
    rules: {
      ...recommendedRules,
      
      // Базовые правила (аналог Airbnb)
      "no-console": "warn",
      "curly": ["warn", "multi-line"],
      "eqeqeq": ["warn", "always"],
      "object-shorthand": "warn",
      "prefer-const": "warn",
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      
      // Правила импортов
      "import/prefer-default-export": "off",
      "import/no-default-export": "warn",
      
      // Prettier интеграция
      "prettier/prettier": "warn",
      ...eslintConfigPrettier.rules
    }
  }
];