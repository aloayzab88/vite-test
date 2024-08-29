export const getAssetFileName = (assetInfo) => {
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
