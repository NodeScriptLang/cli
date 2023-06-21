import chalk from 'chalk';
import { dep } from 'mesh-ioc';

import { ModuleInfo } from '../../types.js';
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
        const map = await this.fetchModuleMap();
        for await (const mod of this.workdir.readModuleDescriptors()) {
            await this.publishModule(map, mod);
        }
    }

    private async publishModule(existingModules: Map<string, ModuleInfo>, mod: ModuleDescriptor) {
        const { file, sourceUrl } = mod;
        try {
            const res = await this.builder.buildModuleFile(file);
            const { moduleSpec, computeCode } = res;
            const existing = existingModules.get(moduleSpec.moduleName);
            if (existing && existing.refs[moduleSpec.version]) {
                // Skipping
                return;
            }
            moduleSpec.attributes = {
                ...moduleSpec.attributes,
                sourceUrl: sourceUrl.replace(/\{file\}/ig, file),
            };
            await this.api.publishEsm({
                workspaceId: this.config.options.workspaceId,
                moduleSpec,
                computeCode,
            });
            console.info('  ', chalk.yellow(file));
            console.info(chalk.green('    published'));
        } catch (error: any) {
            if (error.status === 409) {
                return;
            }
            console.info('  ', chalk.yellow(file));
            console.error(chalk.yellow(error.status), chalk.red(error.message));
        }
    }

    private async fetchModuleMap() {
        const map = new Map<string, ModuleInfo>();
        const { workspaceId } = this.config.options;
        const existingModules = await this.api.getWorkspaceModules(workspaceId);
        for (const module of existingModules) {
            map.set(module.moduleSpec.moduleName, module);
        }
        return map;
    }

}
