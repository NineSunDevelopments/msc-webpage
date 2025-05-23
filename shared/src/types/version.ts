export interface IVersion {
    major: number;
    minor: number;
    patch: number;
    addition: string;
}

export class Version implements IVersion {
    public major: number = 0;
    public minor: number = 0;
    public patch: number = 0;
    public addition: string;

    constructor(data: IVersion) {
        if (!data)
            data = { major: 0, minor: 0, patch: 0, addition: null };

        this.major = data.major ?? 0;
        this.minor = data.minor ?? 0;
        this.patch = data.patch ?? 0;
        this.addition = data.addition ?? null;
    }

    public get data(): IVersion {
        return this as IVersion;
    }

    public static fromString(versionString: string): Version {
        const parts = (versionString ?? "").split('-');

        const addition = parts.length > 1 ? parts[1] : null;
        const [ major, minor, patch ] = parts[0].split('.').map(x => parseInt(x, 10));

        return new Version({ major, minor, patch, addition });
    }

    public toString(): string {
        return !!this.addition ? `${ this.major }.${ this.minor }.${ this.patch }-${ this.addition }` : `${ this.major }.${ this.minor }.${ this.patch }`;
    }

    public equals(other: Version): boolean {
        return this.major === other.major &&
            this.minor === other.minor &&
            this.patch === other.patch &&
            this.addition.localeCompare(other.addition) === 0;
    }
}
