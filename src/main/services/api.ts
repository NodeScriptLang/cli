import { dep } from 'mesh-ioc';

import { Module, Revision } from '../../types.js';
import { Env } from './env.js';

export class ApiService {

    @dep() private env!: Env;

    async getModule(id: string): Promise<Module | null> {
        const { module } = await this.sendGet('/Registry/getModuleById', {
            id,
        });
        return module;
    }

    async findRevision(moduleId: string, version: string): Promise<Revision | null> {
        const { revision } = await this.sendGet('/Registry/findRevision', {
            moduleId,
            version,
        });
        return revision;
    }

    protected async sendGet(path: string, params: Record<string, any> = {}): Promise<any> {
        const url = new URL(this.env.NODESCRIPT_API_URL + path);
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
        if (!res.ok) {
            const errJson = await res.json().catch(err => {
                return {
                    name: err.name,
                    message: err.message,
                };
            });
            throw new Error(`GET ${path} failed: ${errJson.message ?? 'Unknown error'}`);
        }
        return await res.json();
    }

    protected getAuthorization() {
        const username = this.env.get('NODESCRIPT_API_USERNAME');
        const password = this.env.get('NODESCRIPT_API_TOKEN');
        return `Basic ${Buffer.from(username + ':' + password).toString('base64')}`;
    }

}
