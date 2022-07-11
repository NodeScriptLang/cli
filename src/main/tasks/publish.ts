import chalk from 'chalk';
import { dep } from 'mesh-ioc';

import { ApiManager } from '../managers/api.js';
import { ConfigManager } from '../managers/config.js';
import { WorkdirManager } from '../managers/workdir.js';
import { Task } from '../task.js';

export class PublishTask implements Task {

    @dep() protected api!: ApiManager;
    @dep() protected config!: ConfigManager;
    @dep() protected workdir!: WorkdirManager;
    @dep({ key: 'rootDir' }) protected rootDir!: string;

    async run() {
        const files = await this.workdir.getNodeFiles();
        for (const file of files) {
            await this.publishFile(file);
        }
    }

    protected async publishFile(file: string) {
        console.info('Publishing', chalk.green(file));
        const { code, metadata } = await this.workdir.buildNodeFile(file);
        const { channel, name, version } = metadata;
        const module = await this.api.getModule(channel, name);
        if (module && module.versions.includes(version)) {
            console.info('  version', chalk.yellow(version), 'already exists — skipping');
            return;
        }
        await this.api.publishModule({
            type: 'esm',
            comment: '',
            metadata,
            code,
        });
        console.info('  version', chalk.yellow(version), 'published');
    }

}
