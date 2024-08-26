import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { adjustHtmlPathsPlugin } from './adjustHtmlPathsPlugin';

const getAssetFileName = (assetInfo) => {
    const extType = assetInfo.name.split('.').pop();
    if (assetInfo.originalFileName) {
        const relativePath = assetInfo.originalFileName.replace(/^src\//, '');
        if (!/css|js/i.test(extType)) {
            return `${relativePath}`;
        }
    }
    if (/css/i.test(extType)) {
        return 'assets/styles/[name][extname]';
    }
    if (/js/i.test(extType)) {
        return 'assets/scripts/[name][extname]';
    }
    return `assets/[name][extname]`;
};

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
        adjustHtmlPathsPlugin('dist')
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
