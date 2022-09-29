import 'reflect-metadata';

import { Mesh } from '@flexent/mesh';

import { ApiManager } from './managers/api.js';
import { BuilderManager } from './managers/builder.js';
import { ConfigManager } from './managers/config.js';
import { PublishTask } from './tasks/publish.js';

export class App {

    mesh: Mesh;

    constructor(readonly rootDir: string) {
        this.mesh = new Mesh('App');
        this.mesh.constant('rootDir', rootDir);
        this.mesh.service(ConfigManager);
        this.mesh.service(ApiManager);
        this.mesh.service(BuilderManager);
        this.mesh.service(PublishTask);
    }

    async init() {
        await this.mesh.resolve(ConfigManager).init();
    }

    get publishTask() {
        return this.mesh.resolve(PublishTask);
    }

}
