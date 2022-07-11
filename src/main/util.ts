import * as fs from 'fs';

export function isFileExistsSync(file: string) {
    try {
        return fs.statSync(file).isFile();
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            return false;
        }
        throw err;
    }
}

export async function isFileExists(file: string) {
    return fs.promises.stat(file)
        .then(_ => _.isFile(), err => {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        });
}
