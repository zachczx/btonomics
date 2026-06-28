import eslintPluginAstro from 'eslint-plugin-astro'
import eslintConfigPrettier from 'eslint-config-prettier'
export default [
    // add more generic rule sets here, such as:
    // js.configs.recommended,
    ...eslintPluginAstro.configs.recommended,
    {
        rules: {
            semi: 'error',
            'prefer-const': 'error',
        },
    },
    eslintConfigPrettier,
]
