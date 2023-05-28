import { DropFile } from '../../../utility/drop-file';
import { FileDisplay } from '../../layout/file-display';
import * as i0 from "@angular/core";
export declare class FileDownloadComponent {
    descriptionText: string;
    squareContent: string | undefined;
    showText: boolean;
    disabled: boolean;
    files: undefined | DropFile | Array<DropFile>;
    zipFileName: string;
    fileDisplay: FileDisplay | undefined;
    bold: boolean | undefined;
    isHovered: boolean;
    constructor();
    prevent(e: Event): void;
    hoverStart(e: Event): void;
    hoverEnd(e: MouseEvent, drop?: boolean): void;
    download(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileDownloadComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FileDownloadComponent, "ilpn-file-download", never, { "descriptionText": "descriptionText"; "squareContent": "squareContent"; "showText": "showText"; "disabled": "disabled"; "files": "files"; "zipFileName": "zipFileName"; "fileDisplay": "fileDisplay"; "bold": "bold"; }, {}, never, never>;
}
