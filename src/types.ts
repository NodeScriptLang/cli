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
