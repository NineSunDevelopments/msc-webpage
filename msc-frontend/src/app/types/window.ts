export enum ESize {
  MOBILE,
  TABLET,
  DESKTOP
}

export enum EOrientation {
  PORTRAIT,
  LANDSCAPE
}

export interface WindowSize {
  width: number;
  height: number;
  size: ESize;
  orientation: EOrientation;
}
