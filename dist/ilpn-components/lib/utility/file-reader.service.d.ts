import { Observable } from 'rxjs';
import { DropFile } from './drop-file';
import * as i0 from "@angular/core";
export declare class FileReaderService {
    processFileUpload(files: FileList | undefined): Observable<Array<DropFile>>;
    private readFile;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileReaderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FileReaderService>;
}
