import { dep } from '@nodescript/mesh';
import glob from 'glob';
import { promisify } from 'util';

import { ConfigManager } from './config.js';

const globAsync = promisify(glob);

export interface ModuleDescriptor {
    file: string;
    sourceUrl: string;
}

export class WorkdirManager {

    @dep({ key: 'rootDir' }) private rootDir!: string;
    @dep() private config!: ConfigManager;

    async *readModuleDescriptors(): AsyncIterable<ModuleDescriptor> {
        for (const group of this.config.options.modules) {
            const { pattern, sourceUrl } = group;
            const files = await globAsync(pattern, {
                cwd: this.rootDir,
            });
            for (const file of files) {
                yield { file, sourceUrl };
            }
        }
    }

}
