import { createHash } from 'node:crypto';

import { ModuleSpecSchema } from '@nodescript/core/schema';
import { evalEsmModule } from '@nodescript/core/util';
import { build } from 'esbuild';

export class BuilderManager {

    async buildModuleFile(file: string) {
        const computeCode = await this.compileCompute(file);
        const moduleCode = await this.compileModuleJson(file);
        const { module } = await evalEsmModule(moduleCode);
        const moduleSpec = ModuleSpecSchema.decode(module);
        const computeHash = createHash('sha256').update(computeCode).digest('hex');
        return { computeCode, computeHash, moduleSpec };
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
