import fs from 'fs';
import path from 'path';

export default function adjustHtmlPathsPlugin(baseDir) {
  return {
    name: 'post-process-html',
    apply: 'build',
    closeBundle() {
      const adjustPath = (url, depth) => {
        if (url.startsWith('/') || url.startsWith('http')) {
          return url;
        }
        url = url.replace(/^\.\//, '');
        return depth > 0 ? `${'../'.repeat(depth)}${url}` : `./${url}`;
      };

      const processHtmlFile = (filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const depth = path.relative(baseDir, filePath).split(path.sep).length - 1;
        const adjustedContent = content.replace(/(src|href)="([^"]+)"/g, (match, attr, url) => {
          return `${attr}="${adjustPath(url, depth)}"`;
        });
        fs.writeFileSync(filePath, adjustedContent, 'utf-8');
      };

      const traverseDirectory = (dir) => {
        fs.readdirSync(dir).forEach((file) => {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            traverseDirectory(fullPath);
          } else if (path.extname(fullPath) === '.html') {
            processHtmlFile(fullPath);
          }
        });
      };

      traverseDirectory(baseDir);
    }
  };
}