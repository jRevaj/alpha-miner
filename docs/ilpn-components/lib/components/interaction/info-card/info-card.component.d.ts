import { FileDisplay } from '../../layout/file-display';
import * as i0 from "@angular/core";
export declare class InfoCardComponent {
    squareContent: string;
    title: string;
    description: string;
    fileDisplay: FileDisplay | undefined;
    disabled: boolean;
    descriptionLines: number;
    constructor();
    resolveSquareContent(): string;
    resolveSquareColor(): string;
    resolveBorderColor(): string;
    resolveDescriptionHeight(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<InfoCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InfoCardComponent, "ilpn-info-card", never, { "squareContent": "squareContent"; "title": "title"; "description": "description"; "fileDisplay": "fileDisplay"; "disabled": "disabled"; "descriptionLines": "descriptionLines"; }, {}, never, never>;
}
