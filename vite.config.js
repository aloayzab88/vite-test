import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
//import { adjustHtmlPathsPlugin } from './plugins/adjustHtmlPathsPlugin';
import vitePugToPhp from './plugins/vitePugToPhp.js';
import { getAssetFileName } from './plugins/assetFileNames.js';


export default {
    base: './',
    plugins: [
        vituum({pages: {normalizeBasePath: true}}),
        pug({options : {pretty: true}}),
        ViteImageOptimizer({
            test: /^(?!.*icons\.svg$).*\.svg$/i,
            cache: true,
            cacheLocation: 'node_modules/.cache/image-optimizer'
        }),
        //adjustHtmlPathsPlugin('dist'),
        vitePugToPhp('dist')
    ],
    build: {
        assetsInlineLimit: 0,
        rollupOptions: {
            output: {
                assetFileNames: getAssetFileName,
                entryFileNames: `assets/scripts/[name].js`,
                chunkFileNames: `assets/scripts/[name].js`,
            },
        }
    },
    css: {
        devSourcemap: true
    }
};
