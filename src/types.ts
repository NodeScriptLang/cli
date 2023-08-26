import { ModuleSpec } from '@nodescript/core/types';

export interface PublishEsmSpec {
    workspaceId: string;
    moduleSpec: ModuleSpec;
    computeCode: string;
    bundleCode?: string;
    channel?: string;
    sourceUrl?: string;
}

export interface ModuleInfo {
    id: string;
    moduleSpec: ModuleSpec;
    refs: Record<string, string>;
}
