import { ModuleSpec } from '@nodescript/core/types';

export interface PublishEsmSpec {
    moduleSpec: ModuleSpec;
    computeCode: string;
    bundleCode?: string;
}
