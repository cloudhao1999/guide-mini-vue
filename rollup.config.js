const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');

module.exports = {
    input: 'src/index.ts',
    output: [
        // 1. cjs -> commonjs
        // 2. esm
        {
            format: 'cjs',
            file: pkg.main,
        },
        {
            format: 'es',
            file: pkg.module,
        }
    ],
    plugins: [
        typescript()
    ],
}