import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.node },
rules : {
    'no-unused-vars' : 'warn',
    // 'quotes' : ['warn','single'],
    "semi": ["warn", "always"],
  }
},
  pluginJs.configs.recommended,
];
