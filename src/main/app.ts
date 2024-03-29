import 'reflect-metadata';

import { dep, Mesh } from 'mesh-ioc';

import { ApiManager } from './managers/api.js';
import { BuilderManager } from './managers/builder.js';
import { ConfigManager } from './managers/config.js';
import { WorkdirManager } from './managers/workdir.js';
import { PublishTask } from './tasks/publish.js';

export class App {

    @dep() publishTask!: PublishTask;

    mesh: Mesh;

    constructor(readonly rootDir: string) {
        this.mesh = new Mesh('App');
        this.mesh.connect(this);
        this.mesh.constant('rootDir', rootDir);
        this.mesh.service(ApiManager);
        this.mesh.service(BuilderManager);
        this.mesh.service(ConfigManager);
        this.mesh.service(PublishTask);
        this.mesh.service(WorkdirManager);
    }

    async init() {
        await this.mesh.resolve(ConfigManager).init();
    }

}
