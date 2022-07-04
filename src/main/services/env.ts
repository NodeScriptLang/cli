import { config } from 'dotenv';
import { dep } from 'mesh-ioc';
import path from 'path';

export class Env {

    @dep({ key: 'rootDir' }) private rootDir!: string;

    NODESCRIPT_API_URL = 'https://nodescript.dev';
    NODESCRIPT_API_USERNAME = '';
    NODESCRIPT_API_TOKEN = '';

    constructor() {
        config({ path: path.join(this.rootDir, '.env') });
        for (const [key, value] of Object.entries(this)) {
            if (/^[A-Z0-9_]+/.test(key)) {
                (this as any)[key] = process.env[key] ?? value;
            }
        }
    }

    get<K extends keyof Env>(key: K): Env[K] {
        const value = this[key];
        if (!value) {
            throw new Error(`Env ${key} is required`);
        }
        return value;
    }

}
