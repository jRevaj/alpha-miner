import { FileDisplay } from '../../layout/file-display';
import * as i0 from "@angular/core";
export declare class FileDisplayComponent {
    constructor();
    bold: boolean | undefined;
    squareContent: string | undefined;
    fileDisplay: FileDisplay | undefined;
    hover: boolean;
    resolveSquareContent(): string;
    resolveSquareColor(): string;
    resolveFontWeight(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileDisplayComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FileDisplayComponent, "ilpn-file-display", never, { "bold": "bold"; "squareContent": "squareContent"; "fileDisplay": "fileDisplay"; "hover": "hover"; }, {}, never, never>;
}
