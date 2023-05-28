import { FileDisplay } from '../../layout/file-display';
import * as i0 from "@angular/core";
export declare class DescriptiveLinkComponent {
    baseHref: string;
    squareContent: string;
    title: string;
    description: string;
    fileDisplay: FileDisplay | undefined;
    disabled: boolean;
    descriptionLines: number;
    link: Array<string> | string | undefined;
    download: boolean;
    constructor(baseHref: string);
    type(): string;
    resolveAnchorLink(): string;
    buttonClick(): void;
    private isAnchor;
    private resolveSingleLink;
    private createDownloadLink;
    static ɵfac: i0.ɵɵFactoryDeclaration<DescriptiveLinkComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DescriptiveLinkComponent, "ilpn-descriptive-link", never, { "squareContent": "squareContent"; "title": "title"; "description": "description"; "fileDisplay": "fileDisplay"; "disabled": "disabled"; "descriptionLines": "descriptionLines"; "link": "link"; "download": "download"; }, {}, never, never>;
}
