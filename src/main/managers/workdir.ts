import { NodeMetadataSchema } from '@nodescript/core/schema';
import { NodeMetadata } from '@nodescript/core/types';
import { evalEsmModule } from '@nodescript/core/util';
import { build } from 'esbuild';
import glob from 'glob';
import { dep } from 'mesh-ioc';
import { promisify } from 'util';

import { ConfigManager } from './config.js';

const globAsync = promisify(glob);

export class WorkdirManager {

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

    async buildNodeFile(file: string): Promise<{
        code: string;
        metadata: NodeMetadata;
    }> {
        const res = await build({
            bundle: true,
            entryPoints: [file],
            write: false,
            minify: true,
            keepNames: true,
            format: 'esm',
        });
        const code = res.outputFiles[0].text;
        const { node } = await evalEsmModule(code);
        if (!node) {
            throw new Error(`Cannot build ${file}: export node not found`);
        }
        const metadata = NodeMetadataSchema.decode(node.metadata, { throw: true });
        return { code, metadata };
    }

}
