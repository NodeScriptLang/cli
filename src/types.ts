import { ModuleSpec } from '@nodescript/core/types';

export interface PublishEsmSpec {
    channelId: string;
    moduleName: string;
    moduleSpec: ModuleSpec;
    computeCode: string;
    bundleCode?: string;
    sourceUrl?: string;
}
