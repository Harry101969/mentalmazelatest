module.exports = {
    extends: ['next', 'plugin:react/recommended'],
    rules: {
        '@next/next/no-img-element': 'off',
        'jsx-a11y/alt-text': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'react/no-unescaped-entities': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/no-unknown-property': 'off',
    },
    overrides: [
        {
            files: ['app/dashboard/page.js', 'app/dashboard/**/*.js', 'app/games/**/*.js', 'app/games/level-3/page.js', 'app/games/level-2/page.js'],
            rules: {
                // disable *all* rules for dashboard files
                'no-unused-vars': 'off',
                'no-undef': 'off',
                'react-hooks/rules-of-hooks': 'off',
                'react-hooks/exhaustive-deps': 'off',
                // or even:
                // '*': 'off'
            },
        },
    ],
};
