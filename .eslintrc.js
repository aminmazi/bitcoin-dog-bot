"use strict";
module.exports = {
  env: { es6: true, node: true },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  rules: {
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/no-object-literal-type-assertion": 0,
    "@typescript-eslint/camelcase": ["warn", { properties: "never" }],
    "linebreak-style": ["error", "unix"],
    "no-constant-condition": "error",
    semi: "error",
    "no-extra-semi": "error",
    "prefer-const": "error",
    "eol-last": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "no-console": 0,
    "prettier/prettier": "error",
    curly: "error",
  },
};
