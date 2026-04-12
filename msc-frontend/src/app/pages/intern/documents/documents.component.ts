import {Component, inject, Injector} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LoadingComponent} from '@app/components/loading/loading.component';
import {MatAnchor, MatIconAnchor} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {SmartComponent} from '@app/components/smart-component';
import {FileService} from '@app/services/file.service';
import {FileManager} from '@shared/types/file-manager';
import {DateTime} from 'luxon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {ThumbnailComponent} from '@app/components/thumbnail/thumbnail.component';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import FILE_TYPE = FileManager.FILE_TYPE;

interface EditableFile extends FileManager.File {
  editMode: boolean;
}

@Component({
  imports: [
    FormsModule,
    LoadingComponent,
    MatAnchor,
    MatIcon,
    NgIf,
    RouterLink,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    ThumbnailComponent,
    MatIconAnchor,
    MatFormField,
    MatInput,
    MatFormField,
    MatLabel,
    MatSelectModule,
    MatOptionModule
  ],
  selector: 'msc-documents',
  styleUrl: './documents.component.scss',
  templateUrl: './documents.component.html'
})
export class DocumentsComponent extends SmartComponent {
  public loading = true;
  private fileService = inject(FileService);
  public allFiles: EditableFile[] = [];
  public files: EditableFile[] = [];
  public FILE_TYPE = FileManager.FILE_TYPE;

  public selectedFilter: string | FileManager.FILE_TYPE = "all";

  public displayedColumns: string[] = [ "thumbnail", "name", "type", "actions" ];

  constructor( ) {
    super();
    this.loadData(true).then();
  }

  public async loadData(showLoading: boolean = false) {
    this.loading = showLoading;
    return this.fileService.load().then((files) => {
      this.allFiles = files.map(x => {
        const existing = this.allFiles.find(y => x._id === y._id)
        return {...x, editMode: existing?.editMode || false};
      });

      this.allFiles.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
      this.filter();
      this.loading = false;
    });
  }

  public filter() {
    this.files = this.allFiles.filter(x => {
      if (!this.selectedFilter || this.selectedFilter === "all")
        return true;

      return x.fileType === this.selectedFilter;
    })
  }

  public getFileSize(file: EditableFile): string {// Calculate total size
    let numberOfBytes = file.size;

    // Approximate to the closest prefixed unit
    const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const exponent = Math.min(
      Math.floor(Math.log(numberOfBytes) / Math.log(1000)),
      units.length - 1,
    );
    const approx = numberOfBytes / 1000 ** exponent;
    return `${approx.toFixed(1)} ${units[exponent]}`;
  }

  public isInCharge(): boolean {
    return this.appState.user.isAdmin || this.appState.user.isSuperAdmin;
  }

  public toggleEdit(file: EditableFile): void {
    file.editMode = !file.editMode;
    this.files = [...this.files];
  }

  public save(file: EditableFile) {
    file.editMode = false;
    this.files = [...this.files];
    this.fileService.update(file).then(() => this.loadData());
  }

  public download(file: EditableFile) {
    this.fileService.download(file);
  }

  public delete(file: EditableFile) {
    this.allFiles = this.allFiles.filter(x => x._id !== file._id);
    this.filter();
    this.fileService.delete(file).then(() => this.loadData());
  }

  public async upload(event: Event) {
    let fileData: ArrayBuffer;

    for (const raw of (event.target as HTMLInputElement).files) {
      let fullName = raw.name.split('.');
      const extension = fullName.pop();
      const name = fullName.join('.');

      const protoFile: FileManager.File = {
        createdAt: DateTime.now(),
        deleted: false,
        extension,
        mimeType: raw.type,
        name,
        size: raw.size,
        fileType: FILE_TYPE.UNKNOWN,
        updatedAt: DateTime.now(),
        fileDate: DateTime.fromMillis(raw.lastModified),
      }

      const file = await this.fileService.insert(protoFile);

      if (file) {
        const fileData = await this.loadFile(raw);
        await this.fileService.upload(file, fileData).then(() => this.loadData());
      }
    }
  }

  private async loadFile(file: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async (e) => {
        resolve(reader.result as ArrayBuffer);
      }
      reader.readAsArrayBuffer(file);
    })
  }
}
