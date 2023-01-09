import { ModuleSpec } from '@nodescript/core/types';

export interface PublishEsmSpec {
    workspaceId: string;
    moduleSpec: ModuleSpec;
    computeCode: string;
    bundleCode?: string;
}
