import { createHash } from 'node:crypto';

import * as bundler from '@nodescript/bundler';
import { ModuleSpecSchema } from '@nodescript/core/schema';
import { evalEsmModule } from '@nodescript/core/util';

export class BuilderManager {

    async buildModuleFile(file: string) {
        const computeCode = await bundler.bundleModuleCompute(file);
        const moduleCode = await bundler.bundleModuleJson(file);
        const { module } = await evalEsmModule(moduleCode);
        const moduleSpec = ModuleSpecSchema.decode(module);
        const computeHash = createHash('sha256').update(computeCode).digest('hex');
        return { computeCode, computeHash, moduleSpec };
    }

}
