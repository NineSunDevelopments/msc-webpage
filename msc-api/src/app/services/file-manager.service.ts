import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {FileManager} from "@shared/types/file-manager";
import {MongoConnector} from "../utilities/mongoConnector";
import {Fencing} from "@shared/types/fencing";

import * as fs from "fs";
import * as path from "path";
import {Log} from "../utilities/type";

@Injectable()
export class FileManagerService extends DataService<FileManager.File, MongoConnector<FileManager.File>> {

    private storagePath = path.join(process.env.STORAGE_PATH ?? (process.cwd() + "/storage/"));

    constructor(
        connector: MongoConnector<FileManager.File>
    ) {
        super("files", connector);
    }

    public async init() {
        if (!fs.existsSync(this.storagePath)) {
            Log.info(`\t...Storage does not exist, creating storage under '${this.storagePath}'`);
            fs.mkdirSync(this.storagePath, {recursive: true});
        }
    }

    private makeFileName(file: FileManager.File): string {
        return `${file._id}`;
    }

    public async readFile(file: FileManager.File): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(this.storagePath, this.makeFileName(file)), (err, data) => {
                if (err)
                    reject(err);

                resolve(data);
            })
        })
    }

    public async writeFile(file: FileManager.File, content: Buffer): Promise<FileManager.File> {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(this.storagePath, this.makeFileName(file)), content, (err) => {
                if (err)
                    reject(err);

                file.size = content.length * 8;

                resolve(this.update(file));
            });
        });
    }

    public async deleteFile(file: FileManager.File): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.rm(path.join(this.storagePath, this.makeFileName(file)), (err) => {
                if (err)
                    reject(err);

                resolve(true);
            });
        });
    }
}
