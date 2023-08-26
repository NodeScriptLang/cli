import { ModuleSpec } from '@nodescript/core/types';

export type ModuleVisibility = 'private' | 'public';

export interface PublishEsmSpec {
    workspaceId: string;
    moduleSpec: ModuleSpec;
    computeCode: string;
    bundleCode?: string;
    visibility: ModuleVisibility;
    channel?: string;
    sourceUrl?: string;
}

export interface ModuleInfo {
    id: string;
    moduleSpec: ModuleSpec;
    visibility: ModuleVisibility;
    refs: Record<string, string>;
}
