import {MongoEntity} from "./mongo-entity";
import {DateTime} from "luxon";


export namespace FileManager {
    export enum MIME_TYPE {
        PDF = 'application/pdf',
        TEXT = 'text/plain',
        PNG = 'image/png',
        JPEG = 'image/jpeg',
        JPG = 'image/jpeg',
        ZIP = 'application/zip',
    }

    export enum FILE_TYPE {
        PROTOCOL = 'Protocol',
        COMMENT = 'Comment',
        UNKNOWN = 'Unbekannt',
    }

    export interface File extends MongoEntity {
        name: string;
        extension: string;
        size?: number;
        fileType?: FILE_TYPE;
        mimeType: string;
        fileDate: DateTime
    }
}
