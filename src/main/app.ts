import 'reflect-metadata';

import { Mesh } from 'mesh-ioc';

import { ApiService } from './services/api.js';
import { Env } from './services/env.js';
import { PublishTask } from './tasks/publish.js';

export class App {

    mesh: Mesh;

    constructor(readonly rootDir: string) {
        this.mesh = new Mesh('App');
        this.mesh.constant('rootDir', rootDir);
        this.mesh.service(Env);
        this.mesh.service(ApiService);
        this.mesh.service(PublishTask);
    }

    get publishTask() {
        return this.mesh.resolve(PublishTask);
    }

}
