import { Schema } from 'airtight';

import { ModuleVisibility } from '../types.js';

export interface CliModuleGroup {
    pattern: string;
    channelId: string;
    sourceUrl: string;
    channel: string;
    visibility: ModuleVisibility;
}

export const CliModuleGroupSchema = new Schema<CliModuleGroup>({
    type: 'object',
    properties: {
        pattern: { type: 'string' },
        channelId: { type: 'string' },
        sourceUrl: { type: 'string' },
        channel: {
            type: 'string',
            default: 'universe',
        },
        visibility: {
            type: 'string',
            enum: ['private', 'public'],
            default: 'public',
        },
    }
});

export interface CliOptions {
    modules: CliModuleGroup[];
    apiUrl: string;
    apiToken: string;
    workspaceId: string;
}

export const CliOptionsSchema = new Schema<CliOptions>({
    type: 'object',
    properties: {
        modules: {
            type: 'array',
            items: CliModuleGroupSchema.schema,
        },
        apiUrl: { type: 'string', default: 'https://hub.nodescript.dev' },
        apiToken: { type: 'string' },
        workspaceId: { type: 'string' },
    }
});
