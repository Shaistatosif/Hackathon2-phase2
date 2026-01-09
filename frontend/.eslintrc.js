module.exports = {
  extends: [
    "next/core-web-vitals",
    "next/typescript",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off",
    "prefer-const": "error",
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "coverage/",
    "*.min.js",
  ],
};
