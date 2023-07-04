import glob from 'glob';
import { dep } from 'mesh-ioc';

import { ConfigManager } from './config.js';

export interface ModuleDescriptor {
    file: string;
    sourceUrl: string;
    channel: string;
}

export class WorkdirManager {

    @dep({ key: 'rootDir' }) private rootDir!: string;
    @dep() private config!: ConfigManager;

    async *readModuleDescriptors(): AsyncIterable<ModuleDescriptor> {
        for (const group of this.config.options.modules) {
            const { pattern, sourceUrl, channel } = group;
            const files = await glob(pattern, {
                cwd: this.rootDir,
            });
            for (const file of files) {
                yield { file, sourceUrl, channel };
            }
        }
    }

}
