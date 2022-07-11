import { dep } from 'mesh-ioc';

import { Module, PublishModuleSpec, Revision } from '../../types.js';
import { ConfigManager } from './config.js';

// TODO consider publishing the Hub Proto package
export class ApiManager {

    @dep() private config!: ConfigManager;

    async getModuleByName(name: string): Promise<Module | null> {
        const { module } = await this.sendGet('/Registry/getModuleByName', {
            name,
        });
        return module;
    }

    async getRevision(moduleId: string, version: string): Promise<Revision | null> {
        const { revision } = await this.sendGet('/Registry/getRevision', {
            moduleId,
            version,
        });
        return revision;
    }

    async publishModule(spec: PublishModuleSpec): Promise<{ module: Module; revision: Revision }> {
        const { module, revision } = await this.sendPost('/Registry/publishModule', spec);
        return { module, revision };
    }

    protected async sendGet(path: string, params: Record<string, any> = {}): Promise<any> {
        try {
            const url = new URL(this.config.options.apiUrl + path);
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
        } catch (err: any) {
            throw new Error(`GET ${path} failed: ${err.cause?.message ?? err.message}`);
        }
    }

    protected async sendPost(path: string, params: Record<string, any> = {}): Promise<any> {
        try {
            const url = new URL(this.config.options.apiUrl + path);
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
        } catch (err: any) {
            throw new Error(`POST ${path} failed: ${err.message}`);
        }
    }

    protected async processResponse(res: Response) {
        if (!res.ok) {
            const errJson = await res.json().catch(err => {
                return {
                    name: err.name,
                    message: err.message,
                };
            });
            throw new Error(errJson.message ?? 'Unknown error');
        }
        return await res.json();
    }

    protected getAuthorization() {
        const username = this.config.options.apiUsername;
        const password = this.config.options.apiToken;
        if (!username || !password || username.startsWith('<') || password.startsWith('<')) {
            throw new Error('Please setup NODESCRIPT_API_USERNAME and NODESCRIPT_API_PASSWORD in .env file');
        }
        return `Basic ${Buffer.from(username + ':' + password).toString('base64')}`;
    }

}
