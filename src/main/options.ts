import { Schema } from '@flexent/schema';

export interface CliModuleGroup {
    pattern: string;
    channelId: string;
    sourceUrl: string;
}

export const CliModuleGroupSchema = new Schema<CliModuleGroup>({
    type: 'object',
    properties: {
        pattern: { type: 'string' },
        channelId: { type: 'string' },
        sourceUrl: { type: 'string' },
    }
});

export interface CliOptions {
    modules: CliModuleGroup[];
    apiUrl: string;
    apiUsername: string;
    apiToken: string;
}

export const CliOptionsSchema = new Schema<CliOptions>({
    type: 'object',
    properties: {
        modules: {
            type: 'array',
            items: CliModuleGroupSchema.schema,
        },
        apiUrl: { type: 'string', default: 'https://hub.nodescript.dev' },
        apiUsername: { type: 'string' },
        apiToken: { type: 'string' },
    }
});
