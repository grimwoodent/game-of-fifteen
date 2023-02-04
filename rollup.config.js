import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'cjs',
        // Removes the hash from the asset filename
        assetFileNames: '[name][extname]',
    },
    plugins: [
        typescript(),
        scss({
            name: 'styles.css',
        }),
    ]
};
