import { Injectable, Injector } from '@angular/core';
import { DataService } from '@app/services/data-service';
import {FileManager} from '@shared/types/file-manager';


@Injectable({ providedIn: 'root' })
export class FileService extends DataService<FileManager.File> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/file',
      injector,
    });
  }

  private arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  public async upload(file: FileManager.File, content: ArrayBuffer) {
    return this.api.post(`${this.dataLink}/upload`, {file, content: this.arrayBufferToBase64(content)});
  }

  public download(file: FileManager.File) {
    this.api.download(this.getDownloadUrl(file)).then();
  }

  public getDownloadUrl(file: FileManager.File) {
    return `${this.dataLink}/download/${file._id}`;
  }
}
