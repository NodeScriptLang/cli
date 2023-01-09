import chalk from 'chalk';
import { dep } from 'mesh-ioc';

import { ApiManager } from '../managers/api.js';
import { BuilderManager } from '../managers/builder.js';
import { ConfigManager } from '../managers/config.js';
import { ModuleDescriptor, WorkdirManager } from '../managers/workdir.js';
import { Task } from '../task.js';

export class PublishTask implements Task {

    @dep() private api!: ApiManager;
    @dep() private workdir!: WorkdirManager;
    @dep() private config!: ConfigManager;
    @dep() private builder!: BuilderManager;

    async run() {
        console.info(`Publishing to `, chalk.green(this.config.options.apiUrl));
        for await (const mod of this.workdir.readModuleDescriptors()) {
            await this.publishModule(mod);
        }
    }

    protected async publishModule(mod: ModuleDescriptor) {
        const { file, sourceUrl } = mod;
        console.info('  ', chalk.yellow(file));
        try {
            const res = await this.builder.buildModuleFile(file);
            const { moduleSpec, computeCode } = res;
            moduleSpec.attributes = {
                ...moduleSpec.attributes,
                sourceUrl: sourceUrl.replace(/\{file\}/ig, file),
            };
            await this.api.publishEsm({
                workspaceId: this.config.options.workspaceId,
                moduleSpec,
                computeCode,
            });
            console.info(chalk.green('    published'));
        } catch (error: any) {
            if (error.status === 409) {
                return;
            }
            console.error(chalk.yellow(error.status), chalk.red(error.message));
        }
    }

}
