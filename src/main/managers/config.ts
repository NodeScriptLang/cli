import chalk from 'chalk';
import * as fs from 'fs';
import glob from 'glob';
import { dep } from 'mesh-ioc';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import Yaml from 'yaml';

import { CliOptions, CliOptionsSchema } from '../options.js';
import { isFileExists } from '../util.js';

const globAsync = promisify(glob);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ConfigManager {

    @dep({ key: 'rootDir' }) protected rootDir!: string;

    options: CliOptions = CliOptionsSchema.decode({});

    async init() {
        // await this.copyResources();
        await this.readOptions();
    }

    get envFile() {
        return path.resolve(this.rootDir, '.env');
    }

    get optionsFile() {
        return path.resolve(this.rootDir, '.nodescriptrc.yaml');
    }

    protected async copyResources() {
        const resourcesDir = path.join(__dirname, '../../../resources');
        const resources = await globAsync('**/*', {
            cwd: resourcesDir,
            dot: true,
        });
        for (const filename of resources) {
            const sourceFile = path.join(resourcesDir, filename);
            const targetFile = path.join(this.rootDir, filename);
            await fs.promises.mkdir(path.dirname(targetFile), { recursive: true });
            const exists = await isFileExists(targetFile);
            if (exists) {
                continue;
            }
            await fs.promises.cp(sourceFile, targetFile, { errorOnExist: true });
            console.info('Created', chalk.yellow(filename), ' — please review and adjust it');
        }
    }

    protected async readOptions() {
        await this.readOptionsFile();
        await this.readEnv();
    }

    protected async readOptionsFile() {
        const file = this.optionsFile;
        try {
            const text = await fs.promises.readFile(file, 'utf-8');
            const opts = Yaml.parse(text);
            this.options = CliOptionsSchema.decode(opts);
        } catch (err) { }
    }

    protected async readEnv() {
        for (const key of Object.keys(this.options)) {
            const envKey = 'NODESCRIPT_' + key.replace(/([A-Z])/g, '_$1').toUpperCase();
            const envValue = process.env[envKey];
            if (envValue) {
                (this.options as any)[key] = envValue;
            }
        }
    }

}
