import { dep } from '@flexent/mesh';
import chalk from 'chalk';

import { ApiManager } from '../managers/api.js';
import { BuilderManager } from '../managers/builder.js';
import { ConfigManager } from '../managers/config.js';
import { Task } from '../task.js';

export class PublishTask implements Task {

    @dep() protected api!: ApiManager;
    @dep() protected config!: ConfigManager;
    @dep() protected builder!: BuilderManager;
    @dep({ key: 'rootDir' }) protected rootDir!: string;

    async run() {
        console.info(`Publishing to `, chalk.green(this.config.options.apiUrl));
        const files = await this.builder.getNodeFiles();
        if (!files.length) {
            console.info(chalk.yellow('No files to publish.'));
        }
        for (const file of files) {
            await this.publishFile(file);
        }
    }

    protected async publishFile(file: string) {
        console.info('  ', chalk.yellow(file));
        const res = await this.builder.buildNodeFile(file);
        // console.log(res);
        // const { channel, name, version } = ;
        // const module = await this.api.getModule(channel, name);
        // if (module && module.versions.includes(version)) {
        //     if (this.config.options.logLevel === 'debug') {
        //         console.info('  - version', chalk.yellow(version), 'already exists — skipping');
        //     }
        //     return;
        // }
        // await this.api.publishEsm({
        //     moduleId,
        //     bundleCode,
        //     computeCode,
        //     moduleSpec,
        //     sourceUrl,
        // });
    }

}
