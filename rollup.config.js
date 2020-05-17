import {terser} from 'rollup-plugin-terser';

export default {
    input: 'src/main.js',
    output: [{
        file: 'dist/html2pptxgenjs.cjs.js',
        format: 'cjs'
    }, {
        file: 'dist/html2pptxgenjs.min.js',
        format: 'iife',
        name: 'html2pptxgenjs',
        plugins: [terser()]
    }]
};
