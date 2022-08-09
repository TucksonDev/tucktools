module.exports = {
    env: {
        node: true,
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
        "prettier", // To avoid conflicts with prettier rules
    ],
    rules: {
        // override/add rules settings here, such as:
        "prettier/prettier": "warn",
        "@typescript-eslint/no-explicit-any": "off",
    },
};
