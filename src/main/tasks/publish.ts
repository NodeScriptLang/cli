import { dep } from 'mesh-ioc';

import { ApiService } from '../services/api.js';
import { Task } from '../task.js';

export class PublishTask implements Task {

    @dep() private api!: ApiService;

    async run() {

    }

}
