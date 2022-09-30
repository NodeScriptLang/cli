import { dep } from '@flexent/mesh';

import { PublishEsmSpec } from '../../types.js';
import { ConfigManager } from './config.js';

// TODO consider publishing the Hub Proto package
export class ApiManager {

    @dep() private config!: ConfigManager;

    async publishEsm(spec: PublishEsmSpec) {
        return await this.sendPost('/Registry/publishEsm', { spec });
    }

    protected async sendGet(path: string, params: Record<string, any> = {}): Promise<any> {
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
    }

    protected async sendPost(path: string, params: Record<string, any> = {}): Promise<any> {
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
        const username = this.config.options.apiUsername;
        const password = this.config.options.apiToken;
        if (!username || !password || username.startsWith('<') || password.startsWith('<')) {
            throw new Error('Please setup NODESCRIPT_API_USERNAME and NODESCRIPT_API_PASSWORD in .env file');
        }
        return `Basic ${Buffer.from(username + ':' + password).toString('base64')}`;
    }

}
