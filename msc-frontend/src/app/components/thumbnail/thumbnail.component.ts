import {Component, inject, Input} from '@angular/core';
import {FileService} from '@app/services/file.service';
import {FileManager} from '@shared/types/file-manager';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'msc-thumbnail',
  imports: [
    MatIconModule,
  ],
  templateUrl: './thumbnail.component.html',
  styleUrl: './thumbnail.component.scss'
})
export class ThumbnailComponent {
  @Input() public file: FileManager.File = null;
  private fileService = inject(FileService);

  public getType() {
    if (this.file.mimeType.startsWith('image'))
      return 'image';

    switch (this.file.mimeType) {
      case 'application/pdf':
        return 'pdf';

      case 'text/plain':
        return 'text';

      default:
        return 'unknown';
    }
  }

  public getThumbnailUrl(): string {
    return this.fileService.getDownloadUrl(this.file);
  }
}
