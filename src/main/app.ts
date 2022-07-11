import 'reflect-metadata';

import { Mesh } from 'mesh-ioc';

import { ApiManager } from './managers/api.js';
import { ConfigManager } from './managers/config.js';
import { WorkdirManager } from './managers/workdir.js';
import { PublishTask } from './tasks/publish.js';

export class App {

    mesh: Mesh;

    constructor(readonly rootDir: string) {
        this.mesh = new Mesh('App');
        this.mesh.constant('rootDir', rootDir);
        this.mesh.service(ConfigManager);
        this.mesh.service(ApiManager);
        this.mesh.service(WorkdirManager);
        this.mesh.service(PublishTask);
    }

    async init() {
        await this.mesh.resolve(ConfigManager).init();
    }

    get publishTask() {
        return this.mesh.resolve(PublishTask);
    }

}
