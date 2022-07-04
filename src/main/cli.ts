#!/usr/bin/env node

import { Command } from 'commander';
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
        .action(opts => {
            const app = new App(opts.root);
            app.publishTask.run();
        });

    program.parse();
}
