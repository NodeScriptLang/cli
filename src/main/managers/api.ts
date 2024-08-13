import { dep } from 'mesh-ioc';

import { ModuleInfo, PublishEsmSpec } from '../../types.js';
import { ConfigManager } from './config.js';

export class ApiManager {

    @dep() private config!: ConfigManager;

    async getWorkspaceModules(workspaceId: string): Promise<ModuleInfo[]> {
        const { modules } = await this.sendGet('/Module/getWorkspaceModules', {
            workspaceId,
        });
        return modules;
    }

    async publishEsm(spec: PublishEsmSpec) {
        return await this.sendPost('/Module/publishEsm', { spec });
    }

    protected async sendGet(path: string, params: Record<string, any> = {}): Promise<any> {
        const url = new URL(path.replace(/^\//, ''), this.config.options.apiUrl);
        for (const [k, v] of Object.entries(params)) {
            url.searchParams.append(k, v);
        }
        const authorization = this.getAuthorization();
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                authorization,
            }
        });
        return await this.processResponse(res);
    }

    protected async sendPost(path: string, params: Record<string, any> = {}): Promise<any> {
        const url = new URL(path.replace(/^\//, ''), this.config.options.apiUrl);
        const authorization = this.getAuthorization();
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                authorization,
                'content-type': 'application/json'
            },
            body: JSON.stringify(params),
        });
        return await this.processResponse(res);
    }

    protected async processResponse(res: Response) {
        if (!res.ok) {
            const errJson = await res.json().catch(err => {
                return {
                    name: err.name,
                    message: err.message,
                };
            });
            const err = new Error();
            err.name = errJson.name ?? 'UnknownError';
            err.message = errJson.message ?? 'Unknown message';
            (err as any).status = res.status;
            throw err;
        }
        return await res.json();
    }

    protected getAuthorization() {
        const token = this.config.options.apiToken;
        if (!token) {
            throw new Error('Please setup NODESCRIPT_API_TOKEN in .env file');
        }
        return `Bearer ${token}`;
    }

}
