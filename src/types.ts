import { ModuleSpec } from '@nodescript/core/types';

export interface PublishEsmSpec {
    moduleId: string;
    moduleSpec: ModuleSpec;
    computeCode: string;
    bundleCode: string;
    sourceUrl: string;
}
