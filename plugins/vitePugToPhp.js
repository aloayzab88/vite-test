import fs from 'fs';
import path from 'path';
import pug from 'pug';

export default function vitePugIncludesToPhp(dist) {
    return {
        name: 'vite-pug-includes-to-php',
        apply: 'build',
        generateBundle() {
            const componentsDir = path.resolve('src/components');
            const distDir = path.resolve(dist);

            // Función para ajustar las rutas
            function adjustPaths(htmlContent) {
                // Reemplaza las rutas en src y href con la ruta relativa adecuada
                return htmlContent
                    .replace(/src="\/src\//g, 'src="./') // Ajusta el prefijo para src
                    .replace(/href="\/src\//g, 'href="./') // Ajusta el prefijo para href
                    .replace(/src="\/assets\//g, 'src="./assets/') // Ajusta la ruta de assets
                    .replace(/href="\/assets\//g, 'href="./assets/'); // Ajusta la ruta de assets
            }

            // Recorrer la carpeta src/components para encontrar archivos .pug
            fs.readdirSync(componentsDir).forEach(file => {
                if (file.endsWith('.pug')) {
                    const filePath = path.resolve(componentsDir, file);

                    // Compilar el archivo Pug a HTML
                    const compiled = pug.compileFile(filePath, {
                        doctype: 'html',
                        pretty: true
                    })();

                    // Ajustar las rutas en el contenido HTML
                    const adjustedHtml = adjustPaths(compiled);

                    // Cambiar la extensión a .php
                    const phpFileName = file.replace(/\.pug$/, '.php');
                    const phpFilePath = path.resolve(distDir, phpFileName);

                    // Asegurarse de que la carpeta dist/components exista
                    fs.mkdirSync(path.dirname(phpFilePath), { recursive: true });

                    // Escribir el archivo compilado como PHP en la carpeta dist
                    fs.writeFileSync(phpFilePath, adjustedHtml, 'utf-8');
                }
            });
        }
    };
}