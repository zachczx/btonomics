import eslintPluginAstro from 'eslint-plugin-astro'
import eslintConfigPrettier from 'eslint-config-prettier'
export default [
    // never lint build output or generated dirs (Pagefind ships minified JS there)
    { ignores: ['dist/**', '.astro/**', 'node_modules/**'] },
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
