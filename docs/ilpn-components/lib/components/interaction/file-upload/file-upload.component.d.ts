import { EventEmitter, OnDestroy } from '@angular/core';
import { FileReaderService } from '../../../utility/file-reader.service';
import { DropFile } from '../../../utility/drop-file';
import { FileDisplay } from '../../layout/file-display';
import * as i0 from "@angular/core";
export declare class FileUploadComponent implements OnDestroy {
    private _fileReader;
    fileContentEmitter: EventEmitter<Array<DropFile>>;
    descriptionText: string;
    squareContent: string | undefined;
    showText: boolean;
    fileDisplay: FileDisplay | undefined;
    bold: boolean | undefined;
    isHovered: boolean;
    constructor(_fileReader: FileReaderService);
    ngOnDestroy(): void;
    prevent(e: Event): void;
    hoverStart(e: Event): void;
    hoverEnd(e: MouseEvent, drop?: boolean): void;
    fileDrop(e: DragEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileUploadComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FileUploadComponent, "ilpn-file-upload", never, { "descriptionText": "descriptionText"; "squareContent": "squareContent"; "showText": "showText"; "fileDisplay": "fileDisplay"; "bold": "bold"; }, { "fileContentEmitter": "fileContent"; }, never, never>;
}
