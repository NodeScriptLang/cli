import { dep } from '@flexent/mesh';
import { ModuleSpecSchema } from '@nodescript/core/schema';
import { evalEsmModule } from '@nodescript/core/util';
import { build } from 'esbuild';
import glob from 'glob';
import { promisify } from 'util';

import { ConfigManager } from './config.js';

const globAsync = promisify(glob);

export class BuilderManager {

    @dep({ key: 'rootDir' }) protected rootDir!: string;
    @dep() protected config!: ConfigManager;

    async getNodeFiles() {
        const res: string[] = [];
        for (const pattern of this.config.options.nodes) {
            const files = await globAsync(pattern, {
                cwd: this.rootDir,
            });
            for (const file of files) {
                if (!res.includes(file)) {
                    res.push(file);
                }
            }
        }
        return res;
    }

    async buildNodeFile(file: string) {
        const computeCode = await this.compileCompute(file);
        const moduleCode = await this.compileModuleJson(file);
        const { module } = await evalEsmModule(moduleCode);
        const moduleSpec = ModuleSpecSchema.decode(module);
        return { computeCode, moduleSpec };
    }

    private async compileCompute(file: string) {
        const res = await build({
            bundle: true,
            stdin: {
                resolveDir: process.cwd(),
                loader: /\.ts/i.test(file) ? 'ts' : 'js',
                contents: [
                    `import { compute } from ${JSON.stringify('./' + file)};`,
                    `export { compute };`,
                ].join('\n'),
            },
            write: false,
            minify: true,
            keepNames: true,
            format: 'esm',
        });
        return res.outputFiles[0].text;
    }

    private async compileModuleJson(file: string) {
        const res = await build({
            bundle: true,
            stdin: {
                resolveDir: process.cwd(),
                loader: /\.ts/i.test(file) ? 'ts' : 'js',
                contents: [
                    `import { module } from ${JSON.stringify('./' + file)};`,
                    `export { module };`,
                ].join('\n'),
            },
            write: false,
            minify: true,
            keepNames: true,
            format: 'esm',
        });
        return res.outputFiles[0].text;
    }

}
