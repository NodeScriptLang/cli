#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { config } from 'dotenv';
import fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { App } from './app.js';

export function main() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));

    const program = new Command('nodescript')
        .version(pkg.version);

    program.command('publish')
        .description('publish modules to NodeScript registry')
        .option('-r, --root <root>', 'Root directory', process.cwd())
        .option('-e, --env <env>', 'Env file to use', '.env')
        .option('--log <logLevel>', 'Logging level', 'info')
        .action(async opts => {
            try {
                config({ path: opts.env });
                const app = new App(opts.root);
                await app.init();
                await app.publishTask.run();
            } catch (err: any) {
                console.error(chalk.red(err.message));
                process.exit(1);
            }
        });

    program.parse();
}
