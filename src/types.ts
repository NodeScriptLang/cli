import { NodeMetadata } from '@nodescript/core/types';

export interface Module {
    id: string;
    label: string;
    activeVersion: string;
    versions: string[];
}

export interface Revision {
    moduleId: string;
    version: string;
    code?: string;
    source?: string;
}

export interface PublishModuleSpec {
    type: 'graph' | 'esm';
    comment: string;
    metadata: NodeMetadata;
    code: string;
    source?: string;
}
