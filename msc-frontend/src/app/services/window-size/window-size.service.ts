import { Injectable } from '@angular/core';
import { EOrientation, ESize, WindowSize } from '@app/types/window';

@Injectable({ providedIn: 'root' })
export class WindowSizeService {

  constructor() {
  }

  public static SetSize(width: number, height: number): WindowSize {
    return {
      width: width,
      height: height,
      orientation: width > height ? EOrientation.LANDSCAPE : EOrientation.PORTRAIT,
      size: WindowSizeService.GetSize(width),
    };
  }

  private static GetSize(width: number): ESize {
    if (width >= 1200) return ESize.DESKTOP;
    if (width >= 768) return ESize.TABLET;
    return ESize.MOBILE;
  }
}
