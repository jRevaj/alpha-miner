import * as i0 from '@angular/core';
import { Component, Injectable, Input, EventEmitter, Output, Inject, NgModule } from '@angular/core';
import * as i1 from '@angular/flex-layout/flex';
import { of, forkJoin, ReplaySubject, take, takeUntil, Subject, BehaviorSubject, switchMap, EMPTY, concatMap, map, filter, from, toArray } from 'rxjs';
import * as i2 from '@angular/flex-layout/extended';
import * as i3 from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { saveAs } from 'file-saver';
import { downloadZip } from 'client-zip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as objectHash from 'object-hash';

class FooterComponent {
    constructor() {
    }
}
FooterComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FooterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
FooterComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: FooterComponent, selector: "ilpn-footer", ngImport: i0, template: "<div class=\"footer-font\">\r\n    ...and I know you do too!\r\n    <br>\r\n    <br>\r\n    <a href=\"https://www.fernuni-hagen.de/mi/fakultaet/lehrende/bergenthum/index.shtml\">Robin Bergenthum</a> and <a href=\"https://www.fernuni-hagen.de/ps/team/Jakub.Kovar.shtml\">Jakub Kov\u00E1\u0159</a>\r\n    <br>\r\n    Fakult\u00E4t f\u00FCr Mathematik und Informatik\r\n    <br>\r\n    Fernuni in Hagen, Germany\r\n    <br>\r\n    <a href=\"https://www.fernuni-hagen.de/service/impressum.shtml\">Impressum</a> \u00B7 <a href=\"https://www.fernuni-hagen.de/service/datenschutz.shtml\">Datenschutz</a>\r\n</div>\r\n", styles: [".footer-font{text-align:right;font-weight:300;font-size:18px;margin:0}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FooterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ilpn-footer', template: "<div class=\"footer-font\">\r\n    ...and I know you do too!\r\n    <br>\r\n    <br>\r\n    <a href=\"https://www.fernuni-hagen.de/mi/fakultaet/lehrende/bergenthum/index.shtml\">Robin Bergenthum</a> and <a href=\"https://www.fernuni-hagen.de/ps/team/Jakub.Kovar.shtml\">Jakub Kov\u00E1\u0159</a>\r\n    <br>\r\n    Fakult\u00E4t f\u00FCr Mathematik und Informatik\r\n    <br>\r\n    Fernuni in Hagen, Germany\r\n    <br>\r\n    <a href=\"https://www.fernuni-hagen.de/service/impressum.shtml\">Impressum</a> \u00B7 <a href=\"https://www.fernuni-hagen.de/service/datenschutz.shtml\">Datenschutz</a>\r\n</div>\r\n", styles: [".footer-font{text-align:right;font-weight:300;font-size:18px;margin:0}\n"] }]
        }], ctorParameters: function () { return []; } });

class PageLayoutComponent {
    constructor() {
    }
}
PageLayoutComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PageLayoutComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PageLayoutComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: PageLayoutComponent, selector: "ilpn-page-layout", ngImport: i0, template: "<div fxLayout=\"column\" fxLayoutAlign=\"start stretch\">\r\n    <a href=\"https://www.fernuni-hagen.de/ilovepetrinets/\"><h1>I <span class=\"red\">\u2764</span> Petri Nets</h1></a>\r\n\r\n    <ng-content></ng-content>\r\n\r\n    <hr>\r\n    <ilpn-footer></ilpn-footer>\r\n</div>\r\n", styles: [".red{color:red}h1{text-align:center;font-weight:300;font-size:30px;margin-top:0;margin-bottom:50px}a{text-decoration:none}a:visited{color:#000}hr{border-color:#d3d3d3;margin-top:30px;margin-bottom:30px;width:100%}\n"], components: [{ type: FooterComponent, selector: "ilpn-footer" }], directives: [{ type: i1.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { type: i1.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PageLayoutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ilpn-page-layout', template: "<div fxLayout=\"column\" fxLayoutAlign=\"start stretch\">\r\n    <a href=\"https://www.fernuni-hagen.de/ilovepetrinets/\"><h1>I <span class=\"red\">\u2764</span> Petri Nets</h1></a>\r\n\r\n    <ng-content></ng-content>\r\n\r\n    <hr>\r\n    <ilpn-footer></ilpn-footer>\r\n</div>\r\n", styles: [".red{color:red}h1{text-align:center;font-weight:300;font-size:30px;margin-top:0;margin-bottom:50px}a{text-decoration:none}a:visited{color:#000}hr{border-color:#d3d3d3;margin-top:30px;margin-bottom:30px;width:100%}\n"] }]
        }], ctorParameters: function () { return []; } });

class DropFile {
    constructor(name, content, suffix) {
        this.content = content;
        this.extractSuffix(name);
        if (suffix !== undefined) {
            this._suffix = suffix;
        }
    }
    get name() {
        return `${this._name}.${this.suffix}`;
    }
    set name(name) {
        this.extractSuffix(name);
    }
    get suffix() {
        return this._suffix;
    }
    set suffix(value) {
        this._suffix = value;
    }
    extractSuffix(name) {
        const parts = name.split('.');
        if (parts.length === 1) {
            this._name = name;
            this._suffix = '';
        }
        else {
            this._suffix = parts.splice(-1)[0];
            this._name = parts.join('.');
        }
    }
}

class FileReaderService {
    processFileUpload(files) {
        if (files === undefined) {
            return of([]);
        }
        const files$ = [];
        for (let i = 0; i < files.length; i++) {
            files$.push(this.readFile(files[i]));
        }
        return forkJoin(files$);
    }
    readFile(file) {
        const reader = new FileReader();
        const result = new ReplaySubject(1);
        reader.onerror = (e) => {
            console.debug('Error while reading file content', file, e);
            result.complete();
        };
        reader.onloadend = () => {
            result.next(new DropFile(file.name, reader.result));
            result.complete();
        };
        reader.readAsText(file);
        return result.asObservable();
    }
}
FileReaderService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileReaderService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FileReaderService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileReaderService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileReaderService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class FileDisplayComponent {
    constructor() {
        this.bold = false;
        this.hover = false;
    }
    resolveSquareContent() {
        var _a;
        if (this.fileDisplay !== undefined) {
            return this.fileDisplay.icon;
        }
        return (_a = this.squareContent) !== null && _a !== void 0 ? _a : '?';
    }
    resolveSquareColor() {
        if (this.fileDisplay !== undefined) {
            return this.fileDisplay.color;
        }
        return 'black';
    }
    resolveFontWeight() {
        let isBold;
        if (this.fileDisplay !== undefined) {
            isBold = this.fileDisplay.bold;
        }
        else {
            isBold = this.bold;
        }
        return isBold ? 'bold' : 'normal';
    }
}
FileDisplayComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileDisplayComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
FileDisplayComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: FileDisplayComponent, selector: "ilpn-file-display", inputs: { bold: "bold", squareContent: "squareContent", fileDisplay: "fileDisplay", hover: "hover" }, ngImport: i0, template: "<div class=\"interactive-square larger-icon\"\r\n     fxLayout=\"row\"\r\n     fxLayoutAlign=\"center center\"\r\n     [ngStyle]=\"{'color': resolveSquareColor(), 'font-weight': resolveFontWeight()}\"\r\n     [ngClass]=\"{'hover': hover}\">\r\n    {{resolveSquareContent()}}\r\n</div>\r\n", styles: [".interactive-square{width:100px;height:100px;border-color:gray;border-width:5px;border-style:solid;margin-top:14px;padding-top:5px}.larger-icon{font-size:50px}.hover{border-color:#000}\n"], directives: [{ type: i1.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { type: i1.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }, { type: i2.DefaultStyleDirective, selector: "  [ngStyle],  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]", inputs: ["ngStyle", "ngStyle.xs", "ngStyle.sm", "ngStyle.md", "ngStyle.lg", "ngStyle.xl", "ngStyle.lt-sm", "ngStyle.lt-md", "ngStyle.lt-lg", "ngStyle.lt-xl", "ngStyle.gt-xs", "ngStyle.gt-sm", "ngStyle.gt-md", "ngStyle.gt-lg"] }, { type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i2.DefaultClassDirective, selector: "  [ngClass], [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],  [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],  [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]", inputs: ["ngClass", "ngClass.xs", "ngClass.sm", "ngClass.md", "ngClass.lg", "ngClass.xl", "ngClass.lt-sm", "ngClass.lt-md", "ngClass.lt-lg", "ngClass.lt-xl", "ngClass.gt-xs", "ngClass.gt-sm", "ngClass.gt-md", "ngClass.gt-lg"] }, { type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileDisplayComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ilpn-file-display', template: "<div class=\"interactive-square larger-icon\"\r\n     fxLayout=\"row\"\r\n     fxLayoutAlign=\"center center\"\r\n     [ngStyle]=\"{'color': resolveSquareColor(), 'font-weight': resolveFontWeight()}\"\r\n     [ngClass]=\"{'hover': hover}\">\r\n    {{resolveSquareContent()}}\r\n</div>\r\n", styles: [".interactive-square{width:100px;height:100px;border-color:gray;border-width:5px;border-style:solid;margin-top:14px;padding-top:5px}.larger-icon{font-size:50px}.hover{border-color:#000}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { bold: [{
                type: Input
            }], squareContent: [{
                type: Input
            }], fileDisplay: [{
                type: Input
            }], hover: [{
                type: Input
            }] } });

class FileUploadComponent {
    constructor(_fileReader) {
        this._fileReader = _fileReader;
        this.descriptionText = '';
        this.showText = true;
        this.isHovered = false;
        this.fileContentEmitter = new EventEmitter();
    }
    ngOnDestroy() {
        this.fileContentEmitter.complete();
    }
    prevent(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    hoverStart(e) {
        this.prevent(e);
        this.isHovered = true;
    }
    hoverEnd(e, drop = false) {
        this.prevent(e);
        this.isHovered = false;
    }
    fileDrop(e) {
        var _a;
        this.hoverEnd(e, true);
        this._fileReader.processFileUpload((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files).pipe(take(1)).subscribe(result => {
            if (result.length > 0) {
                this.fileContentEmitter.emit(result);
            }
        });
    }
}
FileUploadComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileUploadComponent, deps: [{ token: FileReaderService }], target: i0.ɵɵFactoryTarget.Component });
FileUploadComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: FileUploadComponent, selector: "ilpn-file-upload", inputs: { descriptionText: "descriptionText", squareContent: "squareContent", showText: "showText", fileDisplay: "fileDisplay", bold: "bold" }, outputs: { fileContentEmitter: "fileContent" }, ngImport: i0, template: "<div fxLayout=\"column\" fxLayoutAlign=\"start center\" class=\"bottom-margin\">\r\n    <span [class.hidden]=\"!showText && !isHovered\">{{descriptionText}}</span>\r\n    <ilpn-file-display [hover]=\"isHovered\"\r\n                       [fileDisplay]=\"fileDisplay\"\r\n                       [squareContent]=\"squareContent\"\r\n                       [bold]=\"bold\"\r\n                       (drag)=\"prevent($event)\"\r\n                       (dragstart)=\"prevent($event)\"\r\n                       (dragover)=\"hoverStart($event)\"\r\n                       (dragenter)=\"hoverStart($event)\"\r\n                       (dragleave)=\"hoverEnd($event)\"\r\n                       (dragend)=\"hoverEnd($event)\"\r\n                       (drop)=\"fileDrop($event)\">\r\n    </ilpn-file-display>\r\n</div>\r\n", styles: [".hidden{-webkit-user-select:none;user-select:none;color:#0000}.bottom-margin{margin-bottom:8px}\n"], components: [{ type: FileDisplayComponent, selector: "ilpn-file-display", inputs: ["bold", "squareContent", "fileDisplay", "hover"] }], directives: [{ type: i1.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { type: i1.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileUploadComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ilpn-file-upload', template: "<div fxLayout=\"column\" fxLayoutAlign=\"start center\" class=\"bottom-margin\">\r\n    <span [class.hidden]=\"!showText && !isHovered\">{{descriptionText}}</span>\r\n    <ilpn-file-display [hover]=\"isHovered\"\r\n                       [fileDisplay]=\"fileDisplay\"\r\n                       [squareContent]=\"squareContent\"\r\n                       [bold]=\"bold\"\r\n                       (drag)=\"prevent($event)\"\r\n                       (dragstart)=\"prevent($event)\"\r\n                       (dragover)=\"hoverStart($event)\"\r\n                       (dragenter)=\"hoverStart($event)\"\r\n                       (dragleave)=\"hoverEnd($event)\"\r\n                       (dragend)=\"hoverEnd($event)\"\r\n                       (drop)=\"fileDrop($event)\">\r\n    </ilpn-file-display>\r\n</div>\r\n", styles: [".hidden{-webkit-user-select:none;user-select:none;color:#0000}.bottom-margin{margin-bottom:8px}\n"] }]
        }], ctorParameters: function () { return [{ type: FileReaderService }]; }, propDecorators: { fileContentEmitter: [{
                type: Output,
                args: ['fileContent']
            }], descriptionText: [{
                type: Input
            }], squareContent: [{
                type: Input
            }], showText: [{
                type: Input
            }], fileDisplay: [{
                type: Input
            }], bold: [{
                type: Input
            }] } });

class FileDownloadComponent {
    constructor() {
        this.descriptionText = '';
        this.showText = true;
        this.disabled = false;
        this.files = [];
        this.zipFileName = 'results';
        this.isHovered = false;
    }
    prevent(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    hoverStart(e) {
        this.prevent(e);
        this.isHovered = true;
    }
    hoverEnd(e, drop = false) {
        this.prevent(e);
        this.isHovered = false;
    }
    download() {
        if (this.disabled) {
            return;
        }
        if (this.files === undefined) {
            return;
        }
        if (Array.isArray(this.files) && this.files.length === 0) {
            return;
        }
        if (!Array.isArray(this.files) || this.files.length === 1) {
            // 1 file
            const file = Array.isArray(this.files) ? this.files[0] : this.files;
            saveAs(new Blob([file.content], { type: 'text/plain;charset=utf-8' }), file.name);
            return;
        }
        // multiple files
        downloadZip(this.files.map(f => ({ name: f.name, input: f.content }))).blob().then(content => {
            saveAs(content, `${this.zipFileName}.zip`);
        });
    }
}
FileDownloadComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileDownloadComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
FileDownloadComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: FileDownloadComponent, selector: "ilpn-file-download", inputs: { descriptionText: "descriptionText", squareContent: "squareContent", showText: "showText", disabled: "disabled", files: "files", zipFileName: "zipFileName", fileDisplay: "fileDisplay", bold: "bold" }, ngImport: i0, template: "<div fxLayout=\"column\" fxLayoutAlign=\"start center\" class=\"bottom-margin\">\r\n    <span [class.hidden]=\"!showText || disabled\">{{descriptionText}}</span>\r\n    <ilpn-file-display [hover]=\"isHovered && !disabled\"\r\n                       [class.disabled]=\"disabled\"\r\n                       [fileDisplay]=\"fileDisplay\"\r\n                       [squareContent]=\"squareContent\"\r\n                       [bold]=\"bold\"\r\n                       (click)=\"download()\"\r\n                       (mouseenter)=\"hoverStart($event)\"\r\n                       (mouseleave)=\"hoverEnd($event)\">\r\n    </ilpn-file-display>\r\n</div>\r\n", styles: [".hidden{-webkit-user-select:none;user-select:none;color:#0000}.disabled{color:#d3d3d3;border-color:#d3d3d3}.bottom-margin{margin-bottom:8px}\n"], components: [{ type: FileDisplayComponent, selector: "ilpn-file-display", inputs: ["bold", "squareContent", "fileDisplay", "hover"] }], directives: [{ type: i1.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { type: i1.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileDownloadComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ilpn-file-download', template: "<div fxLayout=\"column\" fxLayoutAlign=\"start center\" class=\"bottom-margin\">\r\n    <span [class.hidden]=\"!showText || disabled\">{{descriptionText}}</span>\r\n    <ilpn-file-display [hover]=\"isHovered && !disabled\"\r\n                       [class.disabled]=\"disabled\"\r\n                       [fileDisplay]=\"fileDisplay\"\r\n                       [squareContent]=\"squareContent\"\r\n                       [bold]=\"bold\"\r\n                       (click)=\"download()\"\r\n                       (mouseenter)=\"hoverStart($event)\"\r\n                       (mouseleave)=\"hoverEnd($event)\">\r\n    </ilpn-file-display>\r\n</div>\r\n", styles: [".hidden{-webkit-user-select:none;user-select:none;color:#0000}.disabled{color:#d3d3d3;border-color:#d3d3d3}.bottom-margin{margin-bottom:8px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { descriptionText: [{
                type: Input
            }], squareContent: [{
                type: Input
            }], showText: [{
                type: Input
            }], disabled: [{
                type: Input
            }], files: [{
                type: Input
            }], zipFileName: [{
                type: Input
            }], fileDisplay: [{
                type: Input
            }], bold: [{
                type: Input
            }] } });

class InfoCardComponent {
    constructor() {
        this.squareContent = '?';
        this.title = '';
        this.description = '';
        this.disabled = false;
        this.descriptionLines = 3;
    }
    resolveSquareContent() {
        if (this.fileDisplay !== undefined) {
            return this.fileDisplay.icon;
        }
        return this.squareContent;
    }
    resolveSquareColor() {
        if (this.disabled) {
            return 'grey';
        }
        if (this.fileDisplay !== undefined) {
            return this.fileDisplay.color;
        }
        return 'black';
    }
    resolveBorderColor() {
        if (this.disabled) {
            return 'grey';
        }
        else {
            return 'black';
        }
    }
    resolveDescriptionHeight() {
        return `${this.descriptionLines}em`;
    }
}
InfoCardComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: InfoCardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
InfoCardComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: InfoCardComponent, selector: "ilpn-info-card", inputs: { squareContent: "squareContent", title: "title", description: "description", fileDisplay: "fileDisplay", disabled: "disabled", descriptionLines: "descriptionLines" }, ngImport: i0, template: "<div class=\"border\" [ngClass]=\"{'border-enabled': !disabled}\" fxLayout=\"row\" fxLayoutAlign=\"start top\">\r\n    <div class=\"square\" [ngStyle]=\"{'color': resolveSquareColor(), 'border-color': resolveBorderColor()}\" fxLayout=\"row\" fxLayoutAlign=\"center center\" fxFlex=\"nogrow\">\r\n        {{resolveSquareContent()}}\r\n    </div>\r\n    <div class=\"description\" fxLayout=\"column\" fxLayoutAlign=\"top center\" fxFlex>\r\n        <span>{{title}}</span>\r\n        <hr class=\"width100\">\r\n        <span class=\"description-min-height\" [ngStyle]=\"{'height': resolveDescriptionHeight()}\">{{description}}</span>\r\n    </div>\r\n</div>\r\n", styles: [".border{width:380px;margin:10px;border:2px solid grey;padding:5px;float:left}.border-enabled:hover{border-color:#000}.square{min-width:50px;min-height:50px;width:50px;height:50px;margin:10px;border-width:3px;border-style:solid;font-size:30px}.description{margin:5px;font-weight:300;font-size:16px;text-align:start;padding-bottom:2px}.width100{width:100%}.description-min-height{min-height:3em}\n"], directives: [{ type: i1.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { type: i1.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }, { type: i2.DefaultClassDirective, selector: "  [ngClass], [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],  [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],  [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]", inputs: ["ngClass", "ngClass.xs", "ngClass.sm", "ngClass.md", "ngClass.lg", "ngClass.xl", "ngClass.lt-sm", "ngClass.lt-md", "ngClass.lt-lg", "ngClass.lt-xl", "ngClass.gt-xs", "ngClass.gt-sm", "ngClass.gt-md", "ngClass.gt-lg"] }, { type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.DefaultFlexDirective, selector: "  [fxFlex], [fxFlex.xs], [fxFlex.sm], [fxFlex.md],  [fxFlex.lg], [fxFlex.xl], [fxFlex.lt-sm], [fxFlex.lt-md],  [fxFlex.lt-lg], [fxFlex.lt-xl], [fxFlex.gt-xs], [fxFlex.gt-sm],  [fxFlex.gt-md], [fxFlex.gt-lg]", inputs: ["fxFlex", "fxFlex.xs", "fxFlex.sm", "fxFlex.md", "fxFlex.lg", "fxFlex.xl", "fxFlex.lt-sm", "fxFlex.lt-md", "fxFlex.lt-lg", "fxFlex.lt-xl", "fxFlex.gt-xs", "fxFlex.gt-sm", "fxFlex.gt-md", "fxFlex.gt-lg"] }, { type: i2.DefaultStyleDirective, selector: "  [ngStyle],  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]", inputs: ["ngStyle", "ngStyle.xs", "ngStyle.sm", "ngStyle.md", "ngStyle.lg", "ngStyle.xl", "ngStyle.lt-sm", "ngStyle.lt-md", "ngStyle.lt-lg", "ngStyle.lt-xl", "ngStyle.gt-xs", "ngStyle.gt-sm", "ngStyle.gt-md", "ngStyle.gt-lg"] }, { type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: InfoCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ilpn-info-card', template: "<div class=\"border\" [ngClass]=\"{'border-enabled': !disabled}\" fxLayout=\"row\" fxLayoutAlign=\"start top\">\r\n    <div class=\"square\" [ngStyle]=\"{'color': resolveSquareColor(), 'border-color': resolveBorderColor()}\" fxLayout=\"row\" fxLayoutAlign=\"center center\" fxFlex=\"nogrow\">\r\n        {{resolveSquareContent()}}\r\n    </div>\r\n    <div class=\"description\" fxLayout=\"column\" fxLayoutAlign=\"top center\" fxFlex>\r\n        <span>{{title}}</span>\r\n        <hr class=\"width100\">\r\n        <span class=\"description-min-height\" [ngStyle]=\"{'height': resolveDescriptionHeight()}\">{{description}}</span>\r\n    </div>\r\n</div>\r\n", styles: [".border{width:380px;margin:10px;border:2px solid grey;padding:5px;float:left}.border-enabled:hover{border-color:#000}.square{min-width:50px;min-height:50px;width:50px;height:50px;margin:10px;border-width:3px;border-style:solid;font-size:30px}.description{margin:5px;font-weight:300;font-size:16px;text-align:start;padding-bottom:2px}.width100{width:100%}.description-min-height{min-height:3em}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { squareContent: [{
                type: Input
            }], title: [{
                type: Input
            }], description: [{
                type: Input
            }], fileDisplay: [{
                type: Input
            }], disabled: [{
                type: Input
            }], descriptionLines: [{
                type: Input
            }] } });

class DescriptiveLinkComponent {
    constructor(baseHref) {
        this.baseHref = baseHref;
        this.squareContent = '?';
        this.title = '';
        this.description = '';
        this.disabled = false;
        this.descriptionLines = 3;
        this.download = false;
    }
    type() {
        if (this.disabled) {
            return 'disabled';
        }
        if (this.isAnchor()) {
            return 'anchor';
        }
        else {
            return 'button';
        }
    }
    resolveAnchorLink() {
        return this.resolveSingleLink(this.link);
    }
    buttonClick() {
        if (this.link === undefined || this.isAnchor()) {
            return;
        }
        const links = this.link.map(l => this.resolveSingleLink(l));
        for (const link of links) {
            this.createDownloadLink(link);
        }
    }
    isAnchor() {
        return this.link !== undefined && !Array.isArray(this.link);
    }
    resolveSingleLink(link) {
        if (link.startsWith('http')) {
            return link;
        }
        return this.baseHref + link;
    }
    createDownloadLink(link) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = link;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}
DescriptiveLinkComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: DescriptiveLinkComponent, deps: [{ token: APP_BASE_HREF }], target: i0.ɵɵFactoryTarget.Component });
DescriptiveLinkComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: DescriptiveLinkComponent, selector: "ilpn-descriptive-link", inputs: { squareContent: "squareContent", title: "title", description: "description", fileDisplay: "fileDisplay", disabled: "disabled", descriptionLines: "descriptionLines", link: "link", download: "download" }, ngImport: i0, template: "<!-- single link -->\r\n<ng-template [ngIf]=\"type() === 'anchor'\">\r\n    <a class=\"link\" [href]=\"resolveAnchorLink()\" [attr.download]=\"download ? '' : null\">\r\n        <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                        [squareContent]=\"squareContent\"\r\n                        [description]=\"description\"\r\n                        [title]=\"title\"\r\n                        [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n    </a>\r\n</ng-template>\r\n\r\n<!-- multiple links -->\r\n<ng-template [ngIf]=\"type() === 'button'\">\r\n    <button class=\"buttonStyle\" (click)=\"buttonClick()\">\r\n        <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                        [squareContent]=\"squareContent\"\r\n                        [description]=\"description\"\r\n                        [title]=\"title\"\r\n                        [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n    </button>\r\n</ng-template>\r\n\r\n<!-- descriptive link disabled -->\r\n<ng-template [ngIf]=\"type() === 'disabled'\">\r\n    <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                    [squareContent]=\"squareContent\"\r\n                    [description]=\"description\"\r\n                    [title]=\"title\"\r\n                    [disabled]=\"true\"\r\n                    [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n</ng-template>\r\n", styles: [".link{color:#000}.buttonStyle{border:none;background:none;font-family:inherit;cursor:pointer;padding:0}\n"], components: [{ type: InfoCardComponent, selector: "ilpn-info-card", inputs: ["squareContent", "title", "description", "fileDisplay", "disabled", "descriptionLines"] }], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: DescriptiveLinkComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ilpn-descriptive-link', template: "<!-- single link -->\r\n<ng-template [ngIf]=\"type() === 'anchor'\">\r\n    <a class=\"link\" [href]=\"resolveAnchorLink()\" [attr.download]=\"download ? '' : null\">\r\n        <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                        [squareContent]=\"squareContent\"\r\n                        [description]=\"description\"\r\n                        [title]=\"title\"\r\n                        [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n    </a>\r\n</ng-template>\r\n\r\n<!-- multiple links -->\r\n<ng-template [ngIf]=\"type() === 'button'\">\r\n    <button class=\"buttonStyle\" (click)=\"buttonClick()\">\r\n        <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                        [squareContent]=\"squareContent\"\r\n                        [description]=\"description\"\r\n                        [title]=\"title\"\r\n                        [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n    </button>\r\n</ng-template>\r\n\r\n<!-- descriptive link disabled -->\r\n<ng-template [ngIf]=\"type() === 'disabled'\">\r\n    <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                    [squareContent]=\"squareContent\"\r\n                    [description]=\"description\"\r\n                    [title]=\"title\"\r\n                    [disabled]=\"true\"\r\n                    [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n</ng-template>\r\n", styles: [".link{color:#000}.buttonStyle{border:none;background:none;font-family:inherit;cursor:pointer;padding:0}\n"] }]
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [APP_BASE_HREF]
                    }] }];
    }, propDecorators: { squareContent: [{
                type: Input
            }], title: [{
                type: Input
            }], description: [{
                type: Input
            }], fileDisplay: [{
                type: Input
            }], disabled: [{
                type: Input
            }], descriptionLines: [{
                type: Input
            }], link: [{
                type: Input
            }], download: [{
                type: Input
            }] } });

class IlpnComponentsModule {
}
IlpnComponentsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpnComponentsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IlpnComponentsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpnComponentsModule, declarations: [FooterComponent,
        PageLayoutComponent,
        FileUploadComponent,
        FileDownloadComponent,
        DescriptiveLinkComponent,
        InfoCardComponent,
        FileDisplayComponent], imports: [FlexLayoutModule,
        BrowserAnimationsModule], exports: [FooterComponent,
        PageLayoutComponent,
        FileUploadComponent,
        FileDownloadComponent,
        DescriptiveLinkComponent] });
IlpnComponentsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpnComponentsModule, imports: [[
            FlexLayoutModule,
            BrowserAnimationsModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpnComponentsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        FooterComponent,
                        PageLayoutComponent,
                        FileUploadComponent,
                        FileDownloadComponent,
                        DescriptiveLinkComponent,
                        InfoCardComponent,
                        FileDisplayComponent
                    ],
                    imports: [
                        FlexLayoutModule,
                        BrowserAnimationsModule
                    ],
                    exports: [
                        FooterComponent,
                        PageLayoutComponent,
                        FileUploadComponent,
                        FileDownloadComponent,
                        DescriptiveLinkComponent,
                    ]
                }]
        }] });

const FD_PETRI_NET = {
    icon: '♥',
    color: 'red'
};
const FD_BPMN = {
    icon: '♦',
    color: 'red'
};
const FD_PARTIAL_ORDER = {
    icon: '♠',
    color: 'black'
};
const FD_TRANSITION_SYSTEM = {
    icon: '♣',
    color: 'black'
};
const FD_LOG = {
    icon: '★',
    color: 'black'
};
const FD_CONCURRENCY = {
    icon: '┃┃',
    color: 'blue',
    bold: true
};

class Identifiable {
    constructor(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    getId() {
        if (this._id === undefined) {
            throw new Error('id is undefined');
        }
        return this._id;
    }
}
function getById(map, object) {
    if (typeof object === 'string') {
        return map.get(object);
    }
    else {
        return map.get(object.getId());
    }
}

class IdPoint extends Identifiable {
    constructor(x, y, id) {
        super(id);
        this._dragging = false;
        this._x = x;
        this._y = y;
        this._preDragPosition = { x, y };
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get center() {
        return { x: this.x, y: this.y };
    }
    bindEvents(mouseMoved$, mouseUp$, kill$, redraw$) {
        mouseMoved$.asObservable().pipe(takeUntil(kill$)).subscribe(e => this.processMouseMoved(e));
        mouseUp$.asObservable().pipe(takeUntil(kill$)).subscribe(() => this.processMouseUp());
        this._redraw$ = redraw$;
    }
    processMouseDown(event) {
        if (this._element === undefined) {
            return;
        }
        event.stopPropagation();
        this._dragging = true;
        this._preDragPosition = { x: this.x, y: this.y };
        this._svgOffset = this.svgOffset();
        this._lastPoint = { x: event.x, y: event.y };
    }
    processMouseUp() {
        if (this._element === undefined || !this._dragging) {
            return;
        }
        this._dragging = false;
        this._lastPoint = undefined;
        this.x = this._preDragPosition.x;
        this.y = this._preDragPosition.y;
        this.updateSVG();
        this.redraw();
    }
    processMouseMoved(event) {
        if (!this._dragging || this._element === undefined || this._lastPoint === undefined) {
            return;
        }
        this.y += event.y - this._lastPoint.y;
        this._lastPoint.x = event.x;
        this._lastPoint.y = event.y;
        this.updateSVG();
        if (this._layerNodes === undefined || this._layerIndex === undefined) {
            this.redraw();
            return;
        }
        const step = Math.sign(this.y - this._preDragPosition.y);
        if (step === 0) {
            this.redraw();
            return;
        }
        const neighbourIndex = this._layerIndex + step;
        if (neighbourIndex < 0 || neighbourIndex >= this._layerNodes.length) {
            this.redraw();
            return;
        }
        if ((step < 0 && this.y < this._layerNodes[neighbourIndex].y)
            || (step > 0 && this.y > this._layerNodes[neighbourIndex].y)) {
            this.swap(neighbourIndex);
        }
        this.redraw();
    }
    registerElement(element) {
        this._element = element;
        this._element.onmousedown = (event) => {
            this.processMouseDown(event);
        };
    }
    registerLayer(layer, index) {
        this._layerNodes = layer;
        this._layerIndex = index;
    }
    svgX() {
        return 'x';
    }
    svgY() {
        return 'y';
    }
    updateSVG(offset) {
        if (this._element === undefined || (this._svgOffset === undefined && offset === undefined)) {
            return;
        }
        const off = offset !== null && offset !== void 0 ? offset : this._svgOffset;
        this._element.setAttribute(this.svgX(), '' + (this.x + off.x));
        this._element.setAttribute(this.svgY(), '' + (this.y + off.y));
    }
    svgOffset() {
        var _a, _b;
        if (this._element === undefined) {
            throw new Error('Element not set. SVG offset cannot be computed!');
        }
        return {
            x: parseInt((_a = this._element.getAttribute(this.svgX())) !== null && _a !== void 0 ? _a : '0') - this.x,
            y: parseInt((_b = this._element.getAttribute(this.svgY())) !== null && _b !== void 0 ? _b : '0') - this.y
        };
    }
    swap(newIndex) {
        if (this._layerNodes === undefined || this._layerIndex === undefined) {
            return;
        }
        const neighbour = this._layerNodes[newIndex];
        const neighbourPos = { x: neighbour.x, y: neighbour.y };
        const offset = neighbour.svgOffset();
        neighbour.x = this._preDragPosition.x;
        neighbour.y = this._preDragPosition.y;
        this._preDragPosition = neighbourPos;
        this._layerNodes[this._layerIndex] = neighbour;
        this._layerNodes[newIndex] = this;
        neighbour._layerIndex = this._layerIndex;
        this._layerIndex = newIndex;
        neighbour.updateSVG(offset);
    }
    redraw() {
        if (this._redraw$ !== undefined) {
            this._redraw$.next();
        }
    }
}

class Node extends IdPoint {
    constructor(x, y, id) {
        super(x, y, id);
        this._ingoingArcs = new Map();
        this._outgoingArcs = new Map();
        this._ingoingArcWeights = new Map();
        this._outgoingArcWeights = new Map();
    }
    get ingoingArcs() {
        return Array.from(this._ingoingArcs.values());
    }
    get outgoingArcs() {
        return Array.from(this._outgoingArcs.values());
    }
    get ingoingArcWeights() {
        return this._ingoingArcWeights;
    }
    get outgoingArcWeights() {
        return this._outgoingArcWeights;
    }
    addOutgoingArc(arc) {
        this._outgoingArcs.set(arc.getId(), arc);
        this._outgoingArcWeights.set(arc.destinationId, arc.weight);
    }
    addIngoingArc(arc) {
        this._ingoingArcs.set(arc.getId(), arc);
        this._ingoingArcWeights.set(arc.sourceId, arc.weight);
    }
    removeArc(arc) {
        let a = getById(this._ingoingArcs, arc);
        if (a !== undefined) {
            this._ingoingArcs.delete(a.getId());
            this._ingoingArcWeights.delete(a.getId());
        }
        a = getById(this._outgoingArcs, arc);
        if (a !== undefined) {
            this._outgoingArcs.delete(a.getId());
            this._outgoingArcWeights.delete(a.getId());
        }
    }
}

class Place extends Node {
    constructor(marking = 0, x = 0, y = 0, id) {
        super(x, y, id);
        this._marking = marking;
    }
    get marking() {
        return this._marking;
    }
    set marking(value) {
        this._marking = value;
    }
    get foldingStatus() {
        return this._foldingStatus;
    }
    set foldingStatus(value) {
        this._foldingStatus = value;
    }
    get foldedPair() {
        return this._foldedPair;
    }
    set foldedPair(value) {
        this._foldedPair = value;
    }
    svgX() {
        return 'cx';
    }
    svgY() {
        return 'cy';
    }
}

class Transition extends Node {
    constructor(label, x = 0, y = 0, id) {
        super(x, y, id);
        this._label = label;
    }
    get label() {
        return this._label;
    }
    get isSilent() {
        return this._label === undefined;
    }
    set label(value) {
        this._label = value;
    }
    get foldedPair() {
        return this._foldedPair;
    }
    set foldedPair(value) {
        this._foldedPair = value;
    }
    getString() {
        const l = this.label;
        if (l === undefined) {
            throw new Error('Transition label is undefined');
        }
        return l;
    }
    setString(value) {
        this.label = value;
    }
}

class Arc extends Identifiable {
    constructor(id, source, destination, weight = 1) {
        super(id);
        this._source = source;
        this._destination = destination;
        this._weight = weight;
        this._breakpoints = [];
        this._source.addOutgoingArc(this);
        this._destination.addIngoingArc(this);
    }
    get sourceId() {
        return this._source.getId();
    }
    get destinationId() {
        return this._destination.getId();
    }
    get source() {
        return this._source;
    }
    get destination() {
        return this._destination;
    }
    get weight() {
        return this._weight;
    }
    get breakpoints() {
        return this._breakpoints;
    }
    set weight(value) {
        this._weight = value;
    }
    get hasBreakpoints() {
        return this._breakpoints.length > 0;
    }
    get firstBreakpoint() {
        if (this.hasBreakpoints) {
            return this._breakpoints[0];
        }
        throw new Error('Arc has no breakpoints!');
    }
    get lastBreakpoint() {
        if (this.hasBreakpoints) {
            return this._breakpoints[this._breakpoints.length - 1];
        }
        throw new Error('Arc has no breakpoints!');
    }
    addBreakpoint(point) {
        this._breakpoints.push(point);
        point.addArcRef(this);
    }
    bindEvents(mouseMoved$, mouseUp$, kill$, redraw$) {
        this.breakpoints.forEach(b => {
            b.bindEvents(mouseMoved$, mouseUp$, kill$, redraw$);
        });
    }
}

class IncrementingCounter {
    constructor() {
        this.value = 0;
    }
    next() {
        return this.value++;
    }
    current() {
        return this.value;
    }
    reset() {
        this.value = 0;
    }
    setCurrentValue(value) {
        this.value = value;
    }
}
function createUniqueString(prefix, existingNames, counter) {
    let result;
    do {
        result = `${prefix}${counter.next()}`;
    } while (existingNames.has(result));
    return result;
}

class Marking {
    constructor(marking) {
        this._marking = Object.assign({}, marking instanceof Marking ? marking._marking : marking);
    }
    get(placeId) {
        return this._marking[placeId];
    }
    set(placeId, tokens) {
        this._marking[placeId] = tokens;
    }
    equals(marking) {
        const [myKeys, otherKeys] = this.getComparisonKeys(marking);
        if (myKeys.length !== otherKeys.size) {
            return false;
        }
        for (const key of myKeys) {
            if (this.get(key) !== marking.get(key)) {
                return false;
            }
            otherKeys.delete(key);
        }
        return otherKeys.size === 0;
    }
    isGreaterThan(marking) {
        const [myKeys, otherKeys] = this.getComparisonKeys(marking);
        if (myKeys.length !== otherKeys.size) {
            return false;
        }
        let isGreater = false;
        for (const key of myKeys) {
            const thisM = this.get(key);
            const otherM = marking.get(key);
            if (thisM === undefined || otherM === undefined) {
                return false;
            }
            if (thisM < otherM) {
                return false;
            }
            else if (thisM > otherM) {
                isGreater = true;
            }
            otherKeys.delete(key);
        }
        return otherKeys.size === 0 && isGreater;
    }
    introduceOmegas(smallerMarking) {
        if (!this.isGreaterThan(smallerMarking)) {
            return;
        }
        const myKeys = Object.keys(this._marking);
        for (const key of myKeys) {
            if (this.get(key) > smallerMarking.get(key)) {
                this.set(key, Number.POSITIVE_INFINITY);
            }
        }
    }
    getKeys() {
        return Object.keys(this._marking);
    }
    getComparisonKeys(marking) {
        const myKeys = this.getKeys();
        const otherKeys = new Set(marking.getKeys());
        return [myKeys, otherKeys];
    }
}

class PetriNet {
    constructor() {
        this._placeCounter = new IncrementingCounter();
        this._transitionCounter = new IncrementingCounter();
        this._arcCounter = new IncrementingCounter();
        this._places = new Map();
        this._transitions = new Map();
        this._arcs = new Map();
        this._kill$ = new Subject();
        this._redraw$ = new Subject();
        this._inputPlaces = new Set();
        this._outputPlaces = new Set();
    }
    static createFromArcSubset(net, arcs) {
        const result = new PetriNet();
        net.getPlaces().forEach(p => {
            result.addPlace(new Place(p.marking, p.x, p.y, p.id));
        });
        net.getTransitions().forEach(t => {
            result.addTransition(new Transition(t.label, t.x, t.y, t.id));
        });
        arcs.forEach(a => {
            let source;
            let destination;
            if (a.source instanceof Place) {
                source = result.getPlace(a.sourceId);
                destination = result.getTransition(a.destinationId);
            }
            else {
                source = result.getTransition(a.sourceId);
                destination = result.getPlace(a.destinationId);
            }
            result.addArc(new Arc(a.getId(), source, destination, a.weight));
        });
        return result;
    }
    static netUnion(a, b) {
        const result = a.clone();
        const counter = new IncrementingCounter();
        const placeMap = new Map();
        const transitionMap = new Map();
        b.getPlaces().forEach(p => {
            let mappedId = p.getId();
            while (result.getPlace(mappedId) !== undefined) {
                mappedId = p.getId() + counter.next();
            }
            placeMap.set(p.getId(), mappedId);
            result.addPlace(new Place(p.marking, p.x, p.y, mappedId));
        });
        b.getTransitions().forEach(t => {
            let mappedId = t.getId();
            while (result.getTransition(mappedId) !== undefined) {
                mappedId = t.getId() + counter.next();
            }
            transitionMap.set(t.getId(), mappedId);
            result.addTransition(new Transition(t.label, t.x, t.y, mappedId));
        });
        b.getArcs().forEach(arc => {
            let arcId = arc.getId();
            while (result.getArc(arcId) !== undefined) {
                arcId = arc.getId() + counter.next();
            }
            if (arc.source instanceof Place) {
                result.addArc(new Arc(arcId, result.getPlace(placeMap.get(arc.sourceId)), result.getTransition(transitionMap.get(arc.destinationId)), arc.weight));
            }
            else {
                result.addArc(new Arc(arcId, result.getTransition(transitionMap.get(arc.sourceId)), result.getPlace(placeMap.get(arc.destinationId)), arc.weight));
            }
        });
        const inputPlacesB = new Set(result._inputPlaces);
        const outputPlacesB = new Set(result._outputPlaces);
        a.inputPlaces.forEach(p => {
            inputPlacesB.delete(p);
        });
        a.outputPlaces.forEach(p => {
            outputPlacesB.delete(p);
        });
        return { net: result, inputPlacesB, outputPlacesB };
    }
    static fireTransitionInMarking(net, transitionId, marking) {
        const transition = net.getTransition(transitionId);
        if (transition === undefined) {
            throw new Error(`The given net does not contain a transition with id '${transitionId}'`);
        }
        const newMarking = new Marking(marking);
        for (const inArc of transition.ingoingArcs) {
            const m = marking.get(inArc.sourceId);
            if (m === undefined) {
                throw new Error(`The transition with id '${transitionId}' has an incoming arc from a place with id '${inArc.sourceId}' but no such place is defined in the provided marking!`);
            }
            if (m - inArc.weight < 0) {
                throw new Error(`The transition with id '${transitionId}' is not enabled in the provided marking! The place with id '${inArc.sourceId}' contains ${m} tokens, but the arc weight is ${inArc.weight}.`);
            }
            newMarking.set(inArc.sourceId, m - inArc.weight);
        }
        for (const outArc of transition.outgoingArcs) {
            const m = marking.get(outArc.destinationId);
            if (m === undefined) {
                throw new Error(`The transition with id '${transitionId}' has an outgoing arc to a place with id '${outArc.destinationId}' but no such place is defined in the provided marking!`);
            }
            newMarking.set(outArc.destinationId, m + outArc.weight);
        }
        return newMarking;
    }
    static getAllEnabledTransitions(net, marking) {
        return net.getTransitions().filter(t => PetriNet.isTransitionEnabledInMarking(net, t.id, marking));
    }
    static isTransitionEnabledInMarking(net, transitionId, marking) {
        const transition = net.getTransition(transitionId);
        if (transition === undefined) {
            throw new Error(`The given net does not contain a transition with id '${transitionId}'`);
        }
        for (const inArc of transition.ingoingArcs) {
            const m = marking.get(inArc.sourceId);
            if (m === undefined) {
                throw new Error(`The transition with id '${transitionId}' has an incoming arc from a place with id '${inArc.sourceId}' but no such place is defined in the provided marking!`);
            }
            if (m - inArc.weight < 0) {
                return false;
            }
        }
        return true;
    }
    static determineInOut(p, input, output) {
        if (p.ingoingArcs.length === 0) {
            input.add(p.getId());
        }
        if (p.outgoingArcs.length === 0) {
            output.add(p.getId());
        }
    }
    getTransition(id) {
        return this._transitions.get(id);
    }
    getTransitions() {
        return Array.from(this._transitions.values());
    }
    getTransitionCount() {
        return this._transitions.size;
    }
    addTransition(transition) {
        if (transition.id === undefined) {
            transition.id = createUniqueString('t', this._transitions, this._transitionCounter);
        }
        this._transitions.set(transition.id, transition);
    }
    removeTransition(transition) {
        const t = getById(this._transitions, transition);
        if (t === undefined) {
            return;
        }
        transition = t;
        this._transitions.delete(transition.getId());
        transition.outgoingArcs.forEach(a => {
            this.removeArc(a);
        });
        transition.ingoingArcs.forEach(a => {
            this.removeArc(a);
        });
    }
    getPlace(id) {
        return this._places.get(id);
    }
    getPlaces() {
        return Array.from(this._places.values());
    }
    getPlaceCount() {
        return this._places.size;
    }
    addPlace(place) {
        if (place.id === undefined) {
            place.id = createUniqueString('p', this._places, this._placeCounter);
        }
        this._places.set(place.id, place);
        this._inputPlaces.add(place.id);
        this._outputPlaces.add(place.id);
    }
    removePlace(place) {
        const p = getById(this._places, place);
        if (p === undefined) {
            return;
        }
        place = p;
        this._places.delete(place.getId());
        place.outgoingArcs.forEach(a => {
            this.removeArc(a);
        });
        place.ingoingArcs.forEach(a => {
            this.removeArc(a);
        });
        this._inputPlaces.delete(place.getId());
        this._outputPlaces.delete(place.getId());
    }
    getArc(id) {
        return this._arcs.get(id);
    }
    getArcs() {
        return Array.from(this._arcs.values());
    }
    getArcCount() {
        return this._arcs.size;
    }
    addArc(arcOrSource, destination, weight = 1) {
        if (arcOrSource instanceof Arc) {
            this._arcs.set(arcOrSource.getId(), arcOrSource);
            if (arcOrSource.source instanceof Place) {
                this._outputPlaces.delete(arcOrSource.sourceId);
            }
            else if (arcOrSource.destination instanceof Place) {
                this._inputPlaces.delete(arcOrSource.destinationId);
            }
        }
        else {
            this.addArc(new Arc(createUniqueString('a', this._arcs, this._arcCounter), arcOrSource, destination, weight));
        }
    }
    removeArc(arc) {
        const a = getById(this._arcs, arc);
        if (a === undefined) {
            return;
        }
        arc = a;
        this._arcs.delete(arc.getId());
        arc.source.removeArc(arc);
        arc.destination.removeArc(arc);
        if (arc.source instanceof Place && arc.source.outgoingArcs.length === 0) {
            this._outputPlaces.add(arc.sourceId);
        }
        else if (arc.destination instanceof Place && arc.destination.ingoingArcs.length === 0) {
            this._inputPlaces.add(arc.destinationId);
        }
    }
    get frequency() {
        return this._frequency;
    }
    set frequency(value) {
        this._frequency = value;
    }
    get inputPlaces() {
        return this._inputPlaces;
    }
    get outputPlaces() {
        return this._outputPlaces;
    }
    getInputPlaces() {
        return this.getPlacesById(this._inputPlaces);
    }
    getOutputPlaces() {
        return this.getPlacesById(this._outputPlaces);
    }
    getInitialMarking() {
        const m = new Marking({});
        this.getPlaces().forEach(p => {
            m.set(p.id, p.marking);
        });
        return m;
    }
    isEmpty() {
        return this._places.size === 0 && this._transitions.size === 0;
    }
    clone() {
        return PetriNet.createFromArcSubset(this, this.getArcs());
    }
    destroy() {
        if (!this._kill$.closed) {
            this._kill$.next();
            this._kill$.complete();
        }
        this._redraw$.complete();
    }
    bindEvents(mouseMoved$, mouseUp$) {
        this._places.forEach((v, k) => v.bindEvents(mouseMoved$, mouseUp$, this._kill$.asObservable(), this._redraw$));
        this._transitions.forEach((v, k) => v.bindEvents(mouseMoved$, mouseUp$, this._kill$.asObservable(), this._redraw$));
        this._arcs.forEach((v, k) => v.bindEvents(mouseMoved$, mouseUp$, this._kill$.asObservable(), this._redraw$));
    }
    redrawRequest$() {
        return this._redraw$.asObservable();
    }
    getPlacesById(ids) {
        const r = [];
        for (const id of ids) {
            const p = this.getPlace(id);
            if (p === undefined) {
                throw new Error(`Place with id '${id}' is not present in the net!`);
            }
            r.push(p);
        }
        return r;
    }
}

class PartialOrderNetWithContainedTraces {
    constructor(net, containedTraces) {
        this.net = net;
        this.containedTraces = containedTraces;
    }
}

var BlockType$1;
(function (BlockType) {
    BlockType["TRANSITIONS"] = ".transitions";
    BlockType["PLACES"] = ".places";
    BlockType["ARCS"] = ".arcs";
    BlockType["FREQUENCY"] = ".frequency";
})(BlockType$1 || (BlockType$1 = {}));

class AbstractParser {
    constructor(allowedTypes) {
        this._allowedTypes = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];
    }
    parse(text) {
        const lines = text.split('\n');
        if (!lines[0].startsWith(AbstractParser.TYPE_BLOCK)) {
            console.debug('file does not specify type in first line');
            return;
        }
        if (!this._allowedTypes.includes(lines[0].trimEnd().slice(AbstractParser.TYPE_BLOCK.length + 1))) {
            console.debug('bad file type');
            return;
        }
        lines.shift();
        return this.processFileLines(lines);
    }
    ;
}
AbstractParser.TYPE_BLOCK = '.type';

class PetriNetSerialisationService {
    constructor() {
    }
    serialise(net) {
        return `${AbstractParser.TYPE_BLOCK} pn\n`
            + this.serialiseFrequency(net.frequency)
            + this.serialiseTransitions(net.getTransitions())
            + this.serialisePlaces(net.getPlaces())
            + this.serialiseArcs(net.getArcs());
    }
    serialiseFrequency(frequency) {
        if (frequency === undefined) {
            return '';
        }
        return `${BlockType$1.FREQUENCY} ${frequency}\n`;
    }
    serialiseTransitions(transitions) {
        let result = `${BlockType$1.TRANSITIONS}\n`;
        transitions.forEach(t => {
            var _a;
            result += `${this.removeSpaces(t.getId(), t.getId())} ${this.removeSpaces((_a = t.label) !== null && _a !== void 0 ? _a : '', t.getId())}\n`;
        });
        return result;
    }
    serialisePlaces(places) {
        let result = `${BlockType$1.PLACES}\n`;
        places.forEach(p => {
            result += `${this.removeSpaces(p.getId(), p.getId())} ${p.marking}\n`;
        });
        return result;
    }
    serialiseArcs(arcs) {
        let result = `${BlockType$1.ARCS}\n`;
        arcs.forEach(a => {
            result += `${this.removeSpaces(a.sourceId, a.getId())} ${this.removeSpaces(a.destinationId, a.getId())}`;
            if (a.weight > 1) {
                result += ` ${a.weight}`;
            }
            result += '\n';
        });
        return result;
    }
    removeSpaces(str, id) {
        if (str.includes(' ')) {
            console.warn(`Petri net element with id '${id}' contains a spaces in its definition! Replacing spaces with underscores, no uniqueness check is performed!`);
            return str.replace(/ /g, '_');
        }
        else {
            return str;
        }
    }
}
PetriNetSerialisationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetSerialisationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetSerialisationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetSerialisationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetSerialisationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class AbstractBlockParser extends AbstractParser {
    constructor(allowedTypes, supportedBlocks) {
        super(allowedTypes);
        this._supportedBlocks = supportedBlocks;
    }
    processFileLines(lines) {
        const result = this.newResult();
        let currentBlock = undefined;
        let blockStart = -1;
        try {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trimEnd();
                if (!line.startsWith('.')) {
                    continue;
                }
                const newBlock = this._supportedBlocks.find(block => line.startsWith(block));
                if (newBlock === undefined) {
                    console.debug(`ignoring unsupported block on line ${i}: '${line}'`);
                    continue;
                }
                this.parseBlock(currentBlock, blockStart, i, lines, result);
                blockStart = i + 1;
                currentBlock = newBlock;
            }
            this.parseBlock(currentBlock, blockStart, lines.length, lines, result);
        }
        catch (e) {
            console.error(e.message);
            return undefined;
        }
        return result;
    }
    parseEachLine(lines, partParser) {
        for (let i = 0; i < lines.length; i++) {
            const line = this.getLineTrimEnd(lines, i);
            if (line.length === 0) {
                continue;
            }
            const parts = line.split(' ');
            partParser(parts, line);
        }
    }
    getLineTrimEnd(lines, index) {
        return lines[index].trimEnd();
    }
    parseBlock(currentBlock, blockStart, blockEnd, lines, result) {
        if (currentBlock !== undefined) {
            const blockParser = this.resolveBlockParser(currentBlock);
            if (blockParser === undefined) {
                throw new Error(`block type '${currentBlock}' is suppoerted but no block parser could be resolved!`);
            }
            blockParser(lines.slice(blockStart, blockEnd), result);
        }
    }
}

class PetriNetParserService extends AbstractBlockParser {
    constructor() {
        super('pn', [BlockType$1.PLACES, BlockType$1.TRANSITIONS, BlockType$1.ARCS]);
    }
    newResult() {
        return new PetriNet();
    }
    resolveBlockParser(block) {
        switch (block) {
            case BlockType$1.PLACES:
                return (lines, result) => this.parsePlaces(lines, result);
            case BlockType$1.TRANSITIONS:
                return (lines, result) => this.parseTransitions(lines, result);
            case BlockType$1.ARCS:
                return (lines, result) => this.parseArcs(lines, result);
            default:
                return undefined;
        }
    }
    parsePlaces(lines, net) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length !== 2) {
                throw new Error(`line '${line}' does not have the correct number of elements! Place definition must contain exactly two elements!`);
            }
            const initialMarking = parseInt(parts[1]);
            if (isNaN(initialMarking)) {
                throw new Error(`line '${line}' marking cannot be parsed into a number! Place marking must be a non-negative integer!`);
            }
            if (initialMarking < 0) {
                throw new Error(`line '${line}' marking is less than 0! Place marking must be a non-negative integer!`);
            }
            if (net.getPlace(parts[0]) !== undefined || net.getTransition(parts[0]) !== undefined) {
                throw new Error(`line '${line}' place ids must be unique!`);
            }
            const place = new Place(initialMarking, 0, 0, parts[0]);
            net.addPlace(place);
        });
    }
    parseTransitions(lines, net) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length < 1 || parts.length > 2) {
                throw new Error(`line '${line}' does not have the correct number of elements! Transition definition must contain one or two elements!`);
            }
            if (net.getTransition(parts[0]) !== undefined || net.getPlace(parts[0]) !== undefined) {
                throw new Error(`line '${line}' transition ids must be unique!`);
            }
            net.addTransition(new Transition(parts[1], 0, 0, parts[0]));
        });
    }
    parseArcs(lines, net) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length < 2 || parts.length > 3) {
                throw new Error(`line '${line}' does not have the correct number of elements! Arc definition must contain two or three elements!`);
            }
            let weight = 1;
            if (parts.length === 3) {
                weight = parseInt(parts[2]);
                if (isNaN(weight)) {
                    throw new Error(`line '${line}' arc weight cannot be parsed into a number! Arc weight must be a positive integer!`);
                }
                if (weight < 1) {
                    throw new Error(`line '${line}' arc weight is less than 1! Arc weight must be a positive integer!`);
                }
            }
            const srcDest = this.extractSourceAndDestination(parts[0], parts[1], line, net);
            const arcId = parts[0] + ' ' + parts[1];
            if (net.getArc(arcId) !== undefined) {
                throw new Error(`line '${line}' duplicate arcs between elements are not allowed!`);
            }
            const arc = new Arc(arcId, srcDest.source, srcDest.destination, weight);
            net.addArc(arc);
        });
    }
    extractSourceAndDestination(sourceId, destinationId, line, net) {
        let source = net.getPlace(sourceId);
        let destination = net.getTransition(destinationId);
        if (!!source && !!destination) {
            return { source, destination };
        }
        source = net.getTransition(sourceId);
        destination = net.getPlace(destinationId);
        if (!!source && !!destination) {
            return { source, destination };
        }
        throw new Error(`line '${line}' arc source or destination is invalid! Arc must reference existing net elements and connect a place with a transition or a transition with a place!`);
    }
}
PetriNetParserService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetParserService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetParserService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetParserService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetParserService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class Event {
    constructor(id, label) {
        this._id = id;
        this._label = label;
        this._nextEvents = new Set();
        this._previousEvents = new Set();
    }
    get id() {
        return this._id;
    }
    get label() {
        return this._label;
    }
    get nextEvents() {
        return this._nextEvents;
    }
    get previousEvents() {
        return this._previousEvents;
    }
    get transition() {
        return this._transition;
    }
    set transition(value) {
        this._transition = value;
    }
    get localMarking() {
        return this._localMarking;
    }
    addNextEvent(event) {
        this._nextEvents.add(event);
        event.addPreviousEvent(this);
    }
    addPreviousEvent(event) {
        this._previousEvents.add(event);
    }
    initializeLocalMarking(size) {
        this._localMarking = new Array(size).fill(0);
    }
}

class PartialOrder {
    constructor() {
        this._events = new Map();
        this._initialEvents = new Set();
        this._finalEvents = new Set();
    }
    get initialEvents() {
        return this._initialEvents;
    }
    get finalEvents() {
        return this._finalEvents;
    }
    get events() {
        return Array.from(this._events.values());
    }
    getEvent(id) {
        return this._events.get(id);
    }
    addEvent(event) {
        if (this._events.has(event.id)) {
            throw new Error(`An event with id '${event.id}' already exists in this partial order!`);
        }
        this._events.set(event.id, event);
    }
    determineInitialAndFinalEvents() {
        this._initialEvents.clear();
        this._finalEvents.clear();
        for (const e of this._events.values()) {
            if (e.previousEvents.size === 0) {
                this._initialEvents.add(e);
            }
            if (e.nextEvents.size === 0) {
                this._finalEvents.add(e);
            }
        }
    }
    clone() {
        const result = new PartialOrder();
        for (const e of this._events.values()) {
            result.addEvent(new Event(e.id, e.label));
        }
        for (const e of this._events.values()) {
            const cloneE = result.getEvent(e.id);
            for (const nextE of e.nextEvents) {
                cloneE.addNextEvent(result.getEvent(nextE.id));
            }
        }
        result.determineInitialAndFinalEvents();
        return result;
    }
}

var BlockType;
(function (BlockType) {
    BlockType["EVENTS"] = ".events";
    BlockType["ARCS"] = ".arcs";
})(BlockType || (BlockType = {}));

class PartialOrderParserService extends AbstractBlockParser {
    constructor() {
        super(['run', 'po', 'ps', 'log'], [BlockType.EVENTS, BlockType.ARCS]);
    }
    parse(text) {
        const po = super.parse(text);
        if (po !== undefined) {
            po.determineInitialAndFinalEvents();
        }
        return po;
    }
    newResult() {
        return new PartialOrder();
    }
    resolveBlockParser(block) {
        switch (block) {
            case BlockType.EVENTS:
                return (lines, result) => this.parseEvents(lines, result);
            case BlockType.ARCS:
                return (lines, result) => this.parseArcs(lines, result);
            default:
                return undefined;
        }
    }
    parseEvents(lines, partialOrder) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length !== 2) {
                throw new Error(`line ${line} does not have the correct number of elements! Event definitions must consist of exactly two elements!`);
            }
            partialOrder.addEvent(new Event(parts[0], parts[1]));
        });
    }
    parseArcs(lines, partialOrder) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length !== 2) {
                throw new Error(`line ${line} does not have the correct number of elements! Arc definitions must consist of exactly two elements!`);
            }
            if (parts[0] === parts[1]) {
                throw new Error(`line ${line} specifies a reflexive arc! Partial order must be ireflexive!`);
            }
            const first = partialOrder.getEvent(parts[0]);
            const second = partialOrder.getEvent(parts[1]);
            if (first === undefined || second === undefined) {
                throw new Error(`line ${line} specifies an arc between at least one event that does not exist in the partial order!`);
            }
            first.addNextEvent(second);
        });
    }
}
PartialOrderParserService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderParserService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PartialOrderParserService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderParserService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderParserService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class Trace {
    constructor() {
        this.events = [];
    }
    get eventNames() {
        return this.events.map(e => e.name);
    }
    appendEvent(event) {
        this.events.push(event);
    }
    get(i) {
        return this.events[i].name;
    }
    set(i, value) {
        this.events[i].name = value;
    }
    length() {
        return this.events.length;
    }
    clone() {
        const clone = new Trace();
        clone.name = this.name;
        clone.description = this.description;
        clone.events = [...this.events];
        return clone;
    }
    equals(other) {
        if (this.length() !== other.length()) {
            return false;
        }
        for (let i = 0; i < this.length(); i++) {
            if (this.get(i) !== other.get(i)) {
                return false;
            }
        }
        return true;
    }
}

class LogEvent {
    constructor(name) {
        this.name = name;
        this._attributes = new Map();
    }
    getAttribute(name) {
        return this._attributes.get(name);
    }
    setAttribute(name, value) {
        this._attributes.set(name, value);
    }
    setPairEvent(pair) {
        this._pair = pair;
    }
    getPairEvent() {
        return this._pair;
    }
}

var Lifecycle;
(function (Lifecycle) {
    Lifecycle["START"] = "start";
    Lifecycle["COMPLETE"] = "complete";
})(Lifecycle || (Lifecycle = {}));

class XesLogParserService {
    constructor() {
    }
    parse(text) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        return this.parseTraces(xml.getElementsByTagName('trace'));
    }
    parseTraces(traceElements) {
        const result = [];
        for (let i = 0; i < traceElements.length; i++) {
            result.push(this.parseTrace(traceElements.item(i)));
        }
        return result;
    }
    parseTrace(element) {
        const trace = this.createTrace(element.querySelectorAll('trace > string'));
        const events = element.getElementsByTagName("event");
        for (let i = 0; i < events.length; i++) {
            trace.appendEvent(this.parseEvent(events.item(i)));
        }
        return trace;
    }
    createTrace(traceAttributes) {
        const trace = new Trace();
        const attributes = this.parseKeyValue(traceAttributes);
        this.setIfPresent('concept:name', attributes, name => {
            trace.name = name;
        });
        this.setIfPresent('description', attributes, description => {
            trace.description = description;
        });
        for (const key of attributes.keys()) {
            console.debug(`unknown xml attribute key '${key}'`, traceAttributes);
        }
        return trace;
    }
    parseEvent(element) {
        const stringAttributes = this.parseKeyValue(element.getElementsByTagName('string'));
        const name = this.getAndRemove('concept:name', stringAttributes);
        if (name === undefined) {
            console.debug(element);
            throw new Error(`Event name is not defined!`);
        }
        const event = new LogEvent(name);
        this.setIfPresent('org:resource', stringAttributes, resource => {
            event.resource = resource;
        });
        this.setIfPresent('lifecycle:transition', stringAttributes, lifecycle => {
            event.lifecycle = lifecycle;
        });
        for (const [key, value] of stringAttributes.entries()) {
            event.setAttribute(key, value);
        }
        const dateAttributes = this.parseKeyValue(element.getElementsByTagName('date'));
        this.setIfPresent('time:timestamp', dateAttributes, timestamp => {
            event.timestamp = new Date(timestamp);
        });
        for (const [key, value] of dateAttributes.entries()) {
            event.setAttribute(key, value);
        }
        return event;
    }
    parseKeyValue(attributes) {
        const result = new Map();
        for (let i = 0; i < attributes.length; i++) {
            const element = attributes.item(i);
            const elementAttributes = element.attributes;
            const valueAttribute = elementAttributes.getNamedItem('value');
            if (valueAttribute === null) {
                console.debug(`xml element has no attribute 'value'`, element);
                continue;
            }
            const value = valueAttribute.value;
            const keyAttribute = elementAttributes.getNamedItem('key');
            if (keyAttribute === null) {
                console.debug(`xml element has no attribute 'key'`, element);
                continue;
            }
            const key = keyAttribute.value;
            result.set(key, value);
        }
        return result;
    }
    getAndRemove(key, map) {
        const result = map.get(key);
        map.delete(key);
        return result;
    }
    setIfPresent(key, map, setter) {
        const value = this.getAndRemove(key, map);
        if (value !== undefined) {
            setter(value);
        }
    }
}
XesLogParserService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: XesLogParserService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
XesLogParserService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: XesLogParserService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: XesLogParserService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

function iterate(iterable, consumer) {
    const iterator = iterable[Symbol.iterator]();
    let it = iterator.next();
    while (!it.done) {
        consumer(it.value);
        it = iterator.next();
    }
}

class Relabeler {
    constructor() {
        this._existingLabels = new Set();
        this._labelCounter = new IncrementingCounter();
        this._labelMapping = new Map();
        this._labelOrder = new Map();
        this._nonUniqueIdentities = new Set();
        this._labelOrderIndex = new Map();
    }
    clone() {
        const result = new Relabeler();
        this._existingLabels.forEach(l => {
            result._existingLabels.add(l);
        });
        result._labelCounter.setCurrentValue(this._labelCounter.current());
        this._labelMapping.forEach((v, k) => {
            result._labelMapping.set(k, v);
        });
        this._labelOrder.forEach((v, k) => {
            result._labelOrder.set(k, [...v]);
        });
        this._nonUniqueIdentities.forEach(nui => {
            result._nonUniqueIdentities.add(nui);
        });
        return result;
    }
    getNewUniqueLabel(oldLabel) {
        return this.getNewLabel(oldLabel, false);
    }
    getNewLabelPreserveNonUniqueIdentities(oldLabel) {
        return this.getNewLabel(oldLabel, true);
    }
    getNewLabel(oldLabel, preserveNonUniqueIdentities) {
        if (!this._existingLabels.has(oldLabel)) {
            // label encountered for the first time
            this._existingLabels.add(oldLabel);
            this._labelMapping.set(oldLabel, oldLabel);
            if (preserveNonUniqueIdentities) {
                this._nonUniqueIdentities.add(oldLabel);
            }
            else {
                this._labelOrder.set(oldLabel, [oldLabel]);
                this._labelOrderIndex.set(oldLabel, 1);
            }
            return oldLabel;
        }
        else {
            // relabeling required
            let newLabelIndex = this._labelOrderIndex.get(oldLabel);
            if (newLabelIndex === undefined) {
                newLabelIndex = 0;
            }
            let relabelingOrder = this._labelOrder.get(oldLabel);
            if (relabelingOrder === undefined) {
                // relabeling collision or non-unique identity
                if (preserveNonUniqueIdentities && this._nonUniqueIdentities.has(oldLabel)) {
                    return oldLabel;
                }
                relabelingOrder = [];
                this._labelOrder.set(oldLabel, relabelingOrder);
                newLabelIndex = 0;
            }
            if (newLabelIndex >= relabelingOrder.length) {
                // new label must be generated
                const newLabel = createUniqueString(oldLabel, this._existingLabels, this._labelCounter);
                this._existingLabels.add(newLabel);
                relabelingOrder.push(newLabel);
                this._labelMapping.set(newLabel, oldLabel);
            }
            this._labelOrderIndex.set(oldLabel, newLabelIndex + 1);
            return relabelingOrder[newLabelIndex];
        }
    }
    restartSequence() {
        this._labelOrderIndex.clear();
    }
    getLabelMapping() {
        return this._labelMapping;
    }
    getLabelOrder() {
        return this._labelOrder;
    }
    uniquelyRelabelSequence(sequence) {
        this.relabel(sequence, false);
    }
    uniquelyRelabelSequences(sequences) {
        iterate(sequences, s => {
            this.uniquelyRelabelSequence(s);
        });
    }
    relabelSequencePreserveNonUniqueIdentities(sequence) {
        this.relabel(sequence, true);
    }
    relabelSequencesPreserveNonUniqueIdentities(sequences) {
        iterate(sequences, s => {
            this.relabelSequencePreserveNonUniqueIdentities(s);
        });
    }
    relabel(sequence, preserveIdentities) {
        this.restartSequence();
        for (let i = 0; i < sequence.length(); i++) {
            sequence.set(i, this.getNewLabel(sequence.get(i), preserveIdentities));
        }
    }
    undoSequenceLabeling(sequence) {
        for (let i = 0; i < sequence.length(); i++) {
            sequence.set(i, this.undoLabel(sequence.get(i)));
        }
    }
    undoSequencesLabeling(sequences) {
        iterate(sequences, s => {
            this.undoSequenceLabeling(s);
        });
    }
    undoLabel(label) {
        var _a;
        return (_a = this._labelMapping.get(label)) !== null && _a !== void 0 ? _a : label;
    }
}

var OccurenceMatrixType;
(function (OccurenceMatrixType) {
    OccurenceMatrixType[OccurenceMatrixType["UNIQUE"] = 0] = "UNIQUE";
    OccurenceMatrixType[OccurenceMatrixType["WILDCARD"] = 1] = "WILDCARD";
})(OccurenceMatrixType || (OccurenceMatrixType = {}));
class OccurrenceMatrix {
    constructor(_type) {
        this._type = _type;
        this._matrix = {};
        this._keys = new Set();
    }
    get keys() {
        return this._keys;
    }
    get type() {
        return this._type;
    }
    add(e1, e2) {
        var _a;
        const row = this._matrix[e1];
        if (row === undefined) {
            this._matrix[e1] = { [e2]: 1 };
        }
        else {
            row[e2] = ((_a = row[e2]) !== null && _a !== void 0 ? _a : 0) + 1;
        }
        this._keys.add(e1);
        this._keys.add(e2);
    }
    get(e1, e2) {
        const row = this._matrix[e1];
        if (row === undefined) {
            return false;
        }
        return !!row[e2];
    }
    getOccurrenceFrequency(e1, e2) {
        var _a, _b;
        return (_b = (_a = this._matrix) === null || _a === void 0 ? void 0 : _a[e1]) === null || _b === void 0 ? void 0 : _b[e2];
    }
}

class ConcurrencyRelation {
    constructor(relabeler) {
        this._uniqueConcurrencyMatrix = {};
        this._wildcardConcurrencyMatrix = {};
        this._mixedConcurrencyMatrix = {};
        this._wildCardLabels = new Set();
        this._relabeler = relabeler.clone();
    }
    static noConcurrency() {
        return new ConcurrencyRelation(new Relabeler());
    }
    static fromOccurrenceMatrix(matrix, relabeler) {
        const result = new ConcurrencyRelation(relabeler);
        const keys = Array.from(matrix.keys);
        for (let i = 0; i < keys.length; i++) {
            const k1 = keys[i];
            for (let j = i + 1; j < keys.length; j++) {
                const k2 = keys[j];
                if (matrix.get(k1, k2) && matrix.get(k2, k1)) {
                    switch (matrix.type) {
                        case OccurenceMatrixType.UNIQUE:
                            result.setUniqueConcurrent(k1, k2, matrix.getOccurrenceFrequency(k1, k2), matrix.getOccurrenceFrequency(k2, k1));
                            break;
                        case OccurenceMatrixType.WILDCARD:
                            result.setWildcardConcurrent(k1, k2, matrix.getOccurrenceFrequency(k1, k2), matrix.getOccurrenceFrequency(k2, k1));
                            break;
                    }
                }
            }
        }
        return result;
    }
    isConcurrent(labelA, labelB) {
        const unique = this.read(this._uniqueConcurrencyMatrix, labelA, labelB);
        if (unique) {
            return true;
        }
        const wildcardA = this.getWildcard(labelA);
        const wildcardB = this.getWildcard(labelB);
        if (!wildcardA && !wildcardB) {
            return false;
        }
        else if (wildcardA && wildcardB) {
            return this.read(this._wildcardConcurrencyMatrix, wildcardA, wildcardB);
        }
        else if (wildcardA && !wildcardB) {
            return this.read(this._mixedConcurrencyMatrix, wildcardA, labelB);
        }
        else {
            return this.read(this._mixedConcurrencyMatrix, wildcardB, labelA);
        }
    }
    setUniqueConcurrent(uniqueLabelA, uniqueLabelB, value = true, frequencyBA) {
        if (typeof value === 'boolean') {
            this.set(this._uniqueConcurrencyMatrix, uniqueLabelA, uniqueLabelB, value);
            this.set(this._uniqueConcurrencyMatrix, uniqueLabelB, uniqueLabelA, value);
        }
        else {
            this.set(this._uniqueConcurrencyMatrix, uniqueLabelA, uniqueLabelB, value);
            this.set(this._uniqueConcurrencyMatrix, uniqueLabelB, uniqueLabelA, frequencyBA);
        }
    }
    setWildcardConcurrent(wildcardLabelA, wildcardLabelB, value = true, frequencyBA) {
        if (typeof value === 'boolean') {
            this.set(this._wildcardConcurrencyMatrix, wildcardLabelA, wildcardLabelB, value);
            this.set(this._wildcardConcurrencyMatrix, wildcardLabelB, wildcardLabelA, value);
        }
        else {
            this.set(this._wildcardConcurrencyMatrix, wildcardLabelA, wildcardLabelB, value);
            this.set(this._wildcardConcurrencyMatrix, wildcardLabelB, wildcardLabelA, frequencyBA);
        }
        this._wildCardLabels.add(wildcardLabelA);
        this._wildCardLabels.add(wildcardLabelB);
    }
    setMixedConcurrent(wildcardLabel, uniqueLabel, concurrency = true) {
        this.set(this._mixedConcurrencyMatrix, wildcardLabel, uniqueLabel, concurrency);
        this._wildCardLabels.add(wildcardLabel);
    }
    set(matrix, uniqueLabelA, uniqueLabelB, value = true) {
        const row = matrix[uniqueLabelA];
        if (row === undefined) {
            matrix[uniqueLabelA] = { [uniqueLabelB]: value };
            return;
        }
        row[uniqueLabelB] = value;
    }
    read(matrix, row, column) {
        const matrixRow = matrix[row];
        if (matrixRow === undefined) {
            return false;
        }
        return !!matrixRow[column];
    }
    getWildcard(label) {
        const undone = this.relabeler.undoLabel(label);
        if (this._wildCardLabels.has(undone)) {
            return undone;
        }
        return undefined;
    }
    get relabeler() {
        return this._relabeler;
    }
    cloneConcurrencyMatrices() {
        return {
            unique: this.cloneMatrix(this._uniqueConcurrencyMatrix),
            wildcard: this.cloneMatrix(this._wildcardConcurrencyMatrix),
            mixed: this.cloneMatrix(this._mixedConcurrencyMatrix)
        };
    }
    cloneMatrix(matrix) {
        const result = {};
        for (const row of Object.keys(matrix)) {
            for (const column of Object.keys(matrix[row])) {
                if (!matrix[row][column]) {
                    continue;
                }
                this.set(result, row, column, matrix[row][column]);
            }
        }
        return result;
    }
}

class ConcurrencySerialisationService {
    constructor() {
    }
    serialise(concurrency) {
        let result = `${AbstractParser.TYPE_BLOCK} concurrency\n`;
        const relabeler = concurrency.relabeler;
        const cachedUniqueLabels = new Map();
        const matrices = concurrency.cloneConcurrencyMatrices();
        this.iterateConcurrentEntries(matrices.unique, true, (labelA, labelB, fab, fba) => {
            const originalA = this.getOriginalLabel(labelA, cachedUniqueLabels, relabeler);
            const originalB = this.getOriginalLabel(labelB, cachedUniqueLabels, relabeler);
            result += this.formatConcurrencyEntry(this.formatUniqueLabel(originalA), this.formatUniqueLabel(originalB), fab, fba);
        });
        this.iterateConcurrentEntries(matrices.wildcard, true, (labelA, labelB, fab, fba) => {
            // TODO unmapping of wildcard labels might be needed
            result += this.formatConcurrencyEntry(labelA, labelB, fab, fba);
        });
        this.iterateConcurrentEntries(matrices.mixed, false, (wildcardLabel, uniqueLabel) => {
            // TODO unmapping of wildcard labels might be needed
            const uniqueOriginal = this.getOriginalLabel(uniqueLabel, cachedUniqueLabels, relabeler);
            result += this.formatConcurrencyEntry(wildcardLabel, this.formatUniqueLabel(uniqueOriginal));
        });
        return result;
    }
    iterateConcurrentEntries(matrix, symmetric, consumer) {
        if (!symmetric) {
            for (const labelA of Object.keys(matrix)) {
                for (const labelB of Object.keys(matrix[labelA])) {
                    this.processMatrixEntry(matrix, labelA, labelB, consumer);
                }
            }
        }
        else {
            const keys = Object.keys(matrix);
            for (let i = 0; i < keys.length; i++) {
                const labelA = keys[i];
                for (let j = i + 1; j < keys.length; j++) {
                    const labelB = keys[j];
                    this.processMatrixEntry(matrix, labelA, labelB, consumer);
                }
            }
        }
    }
    processMatrixEntry(matrix, labelA, labelB, consumer) {
        if (!matrix[labelA][labelB]) {
            return;
        }
        if (typeof matrix[labelA][labelB] === 'boolean') {
            consumer(labelA, labelB);
        }
        else {
            consumer(labelA, labelB, matrix[labelA][labelB], matrix[labelB][labelA]);
        }
    }
    getOriginalLabel(label, cachedUniqueLabels, relabeler) {
        const m = cachedUniqueLabels.get(label);
        if (m !== undefined) {
            return m;
        }
        const original = relabeler.getLabelMapping().get(label);
        if (original === undefined) {
            console.debug(relabeler);
            console.debug(label);
            throw new Error('Unique concurrency matrix contains an entry unknown to the relabeling function!');
        }
        const order = relabeler.getLabelOrder().get(original).findIndex(l => l === label);
        if (order === -1) {
            console.debug(relabeler);
            console.debug(label);
            throw new Error('Unique concurrency matrix contains an entry outside of the relabeling order of the relabeling function!');
        }
        cachedUniqueLabels.set(label, { original, order });
        return cachedUniqueLabels.get(label);
    }
    formatConcurrencyEntry(formattedLabelA, formattedLabelB, frequencyAB, frequencyBA) {
        if (frequencyAB === undefined && frequencyBA === undefined) {
            return `${formattedLabelA}${ConcurrencySerialisationService.PARALLEL_SYMBOL}${formattedLabelB}\n`;
        }
        else {
            return `${formattedLabelA}${ConcurrencySerialisationService.PARALLEL_SYMBOL}${formattedLabelB} #${frequencyAB} ${frequencyBA}\n`;
        }
    }
    formatUniqueLabel(label) {
        return `${label.original}[${label.order + 1}]`;
    }
}
ConcurrencySerialisationService.PARALLEL_SYMBOL = '∥';
ConcurrencySerialisationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ConcurrencySerialisationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ConcurrencySerialisationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ConcurrencySerialisationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ConcurrencySerialisationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class ConcurrencyParserService extends AbstractParser {
    constructor() {
        super('concurrency');
    }
    processFileLines(lines) {
        const result = ConcurrencyRelation.noConcurrency();
        const relabeler = result.relabeler;
        for (const line of lines) {
            if (line.trimEnd().length === 0) {
                continue;
            }
            const match = line.match(ConcurrencyParserService.LINE_REGEX);
            if (match === null) {
                console.debug(line);
                console.debug('line could not be matched with regex');
                continue;
            }
            const eventA = this.getUniqueLabel(match[1], parseInt(match[2]), relabeler);
            const eventB = this.getUniqueLabel(match[3], parseInt(match[4]), relabeler);
            if (!eventA.isWildcard && !eventB.isWildcard) {
                result.setUniqueConcurrent(eventA.label, eventB.label);
            }
            else if (eventA.isWildcard && eventB.isWildcard) {
                result.setWildcardConcurrent(eventA.label, eventB.label);
            }
            else if (eventA.isWildcard && !eventB.isWildcard) {
                result.setMixedConcurrent(eventA.label, eventB.label);
            }
            else {
                result.setMixedConcurrent(eventB.label, eventA.label);
            }
        }
        relabeler.restartSequence();
        return result;
    }
    getUniqueLabel(label, oneBasedOrder, relabeler) {
        if (isNaN(oneBasedOrder)) {
            return {
                isWildcard: true,
                label
            };
        }
        const storedOrder = relabeler.getLabelOrder().get(label);
        const storedLabel = storedOrder === null || storedOrder === void 0 ? void 0 : storedOrder[oneBasedOrder - 1];
        if (storedLabel !== undefined) {
            return {
                label: storedLabel
            };
        }
        let missingCount;
        if (storedOrder === undefined) {
            missingCount = oneBasedOrder;
        }
        else {
            missingCount = oneBasedOrder - storedOrder.length;
        }
        let missingLabel;
        for (let i = 0; i < missingCount; i++) {
            missingLabel = relabeler.getNewUniqueLabel(label);
        }
        return {
            label: missingLabel
        };
    }
}
ConcurrencyParserService.LINE_REGEX = /^(.+?)(?:\[([1-9]\d*)\])?(?:\|\||∥)(.+?)(?:\[([1-9]\d*)\])?(?: #\d+ \d+)?$/;
ConcurrencyParserService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ConcurrencyParserService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ConcurrencyParserService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ConcurrencyParserService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ConcurrencyParserService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class MultisetMap {
    constructor() {
        this._map = new Map();
    }
    put(value) {
        const hash = this.hashKey(value.multiset);
        const mapped = this._map.get(hash);
        if (mapped === undefined) {
            this._map.set(hash, [value]);
        }
        else {
            const equivalent = mapped.find(ms => ms.equals(value.multiset));
            if (equivalent === undefined) {
                mapped.push(value);
            }
            else {
                equivalent.merge(value);
            }
        }
    }
    get(key) {
        const mapped = this._map.get(this.hashKey(key));
        if (mapped === undefined) {
            return undefined;
        }
        return mapped.find(ms => ms.equals(key));
    }
    hashKey(key) {
        return objectHash.sha1(key);
    }
    values() {
        return Array.from(this._map.values()).flat();
    }
}

class MultisetEquivalent {
    constructor(_multiset) {
        this._multiset = _multiset;
    }
    get multiset() {
        return this._multiset;
    }
    equals(ms) {
        const keys = Object.keys(this._multiset);
        if (keys.length !== Object.keys(ms).length) {
            return false;
        }
        for (const key of keys) {
            if (this._multiset[key] !== ms[key]) {
                return false;
            }
        }
        return true;
    }
}

function addToMultiset(multiset, value) {
    if (multiset[value] === undefined) {
        multiset[value] = 1;
    }
    else {
        multiset[value] += 1;
    }
}
function cloneMultiset(multiset) {
    return Object.assign({}, multiset);
}
function mapMultiset(multiset, mappingFunction) {
    return Object.entries(multiset).map(entry => mappingFunction(entry[0], entry[1]));
}

class MultisetEquivalentTraces extends MultisetEquivalent {
    constructor(multiset) {
        super(multiset);
        this.traces = [];
        this.count = 0;
    }
    addTrace(trace) {
        this.traces.push(trace);
        this.incrementCount();
    }
    incrementCount() {
        this.count++;
    }
    merge(ms) {
        this.traces.push(...ms.traces);
    }
}

class PrefixGraphNode {
    constructor(content) {
        this._children = new Map();
        this.content = content;
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this._content = value;
    }
    getChild(key) {
        return this._children.get(key);
    }
    addChild(key, content) {
        let child;
        if (content instanceof PrefixGraphNode) {
            child = content;
        }
        else {
            child = new PrefixGraphNode(content);
        }
        this._children.set(key, child);
        return child;
    }
    hasChildren() {
        return this._children.size !== 0;
    }
}

class MultisetEquivalentWrapper extends MultisetEquivalent {
    constructor(wrapped) {
        super(wrapped.multiset);
        this.wrapped = wrapped;
    }
    merge(ms) {
        this.wrapped.merge(ms);
    }
}
class PrefixMultisetStateGraph {
    constructor(rootContent) {
        this._root = new PrefixGraphNode(rootContent);
        this._stateMap = new MultisetMap();
    }
    insert(path, newStepNode, newEdgeReaction = () => { }, finalNodeReaction = () => { }, stepReaction = () => { }) {
        let currentNode = this._root;
        const prefix = [];
        for (let i = 0; i < path.length(); i++) {
            const step = path.get(i);
            stepReaction(prefix, step);
            let child = currentNode.getChild(step);
            if (child !== undefined) {
                currentNode = child;
                prefix.push(step);
                continue;
            }
            const nextMultiset = this.stepState(currentNode.content.multiset, step);
            let nextState = this._stateMap.get(nextMultiset);
            if (nextState === undefined) {
                nextState = new MultisetEquivalentWrapper(newStepNode(step, nextMultiset, currentNode.content));
                this._stateMap.put(nextState);
            }
            newEdgeReaction(step, currentNode.content);
            let nextNode = nextState.node;
            if (nextNode === undefined) {
                nextNode = currentNode.addChild(step, nextState.wrapped);
                nextState.node = nextNode;
            }
            else {
                currentNode.addChild(step, nextNode);
            }
            currentNode = nextNode;
            prefix.push(step);
        }
        finalNodeReaction(currentNode.content);
    }
    stepState(currentState, step) {
        const clone = cloneMultiset(currentState);
        addToMultiset(clone, step);
        return clone;
    }
    getGraphStates() {
        return this._stateMap.values().map(w => w.wrapped);
    }
}

function cleanLog(log) {
    return log.map(t => cleanTrace(t));
}
function cleanTrace(trace) {
    const result = new Trace();
    result.name = trace.name;
    result.description = trace.description;
    result.events = trace.events.filter(e => e.lifecycle === undefined || e.lifecycle.toLowerCase() === Lifecycle.COMPLETE);
    return result;
}

class TraceMultisetEquivalentStateTraverser {
    /**
     * Traverses the state diagram defined by the list of traces.
     * Where each state is represented by the multiset of events contained in the prefix closure of each trace.
     *
     * Whenever a state is reached for the first time the `newEdgeReaction` method is called,
     * with the previous state as well as the event that caused the transition as arguments.
     *
     * @param traces a list of traces - an event log
     * @param newEdgeReaction a method that is called whenever a new state is reached
     * @param stepReaction a method that is called whenever a step in the state graph is made
     * @returns a list of all final states. Each state contains the traces that terminate in it.
     */
    traverseMultisetEquivalentStates(traces, newEdgeReaction = () => { }, stepReaction = () => { }) {
        const multisetStateGraph = new PrefixMultisetStateGraph(new MultisetEquivalentTraces({}));
        for (const t of traces) {
            const trace = cleanTrace(t);
            multisetStateGraph.insert(trace, (_, newState) => {
                return new MultisetEquivalentTraces(newState);
            }, (step, previousNode) => {
                newEdgeReaction(previousNode.multiset, step);
            }, node => {
                node.addTrace(trace);
            }, (prefix, step) => {
                stepReaction(prefix, step);
            });
        }
        return multisetStateGraph.getGraphStates().filter(s => s.count > 0);
    }
}

class PrefixTree {
    constructor(rootContent) {
        this._root = new PrefixGraphNode(rootContent);
    }
    insert(path, newNodeContent, updateNodeContent, stepReaction = () => { }, newStepNode = () => undefined) {
        let currentNode = this._root;
        const prefix = [];
        for (let i = 0; i < path.length(); i++) {
            const step = path.get(i);
            stepReaction(step, currentNode.content, currentNode);
            let child = currentNode.getChild(step);
            if (child === undefined) {
                currentNode = currentNode.addChild(step, newStepNode(step, [...prefix], currentNode.content));
            }
            else {
                currentNode = child;
            }
            prefix.push(step);
        }
        if (currentNode.content !== undefined) {
            updateNodeContent(currentNode.content, currentNode);
        }
        else {
            currentNode.content = newNodeContent(currentNode);
        }
    }
}

function arraify(a) {
    return Array.isArray(a) ? a : [a];
}

class ConstraintsWithNewVariables {
    constructor(constraints, binaryVariables, integerVariables) {
        this._constraints = Array.isArray(constraints) ? constraints : [constraints];
        if (binaryVariables !== undefined) {
            this._binaryVariables = arraify(binaryVariables);
        }
        else {
            this._binaryVariables = [];
        }
        if (integerVariables !== undefined) {
            this._integerVariables = arraify(integerVariables);
        }
        else {
            this._integerVariables = [];
        }
    }
    get binaryVariables() {
        return this._binaryVariables;
    }
    get integerVariables() {
        return this._integerVariables;
    }
    get constraints() {
        return this._constraints;
    }
    static combine(...constraints) {
        return new ConstraintsWithNewVariables(constraints.reduce((a, v) => {
            a.push(...v.constraints);
            return a;
        }, []), constraints.reduce((a, v) => {
            a.push(...v.binaryVariables);
            return a;
        }, []), constraints.reduce((a, v) => {
            a.push(...v.integerVariables);
            return a;
        }, []));
    }
    static combineAndIntroduceVariables(newBinaryVariables, newIntegerVariables, ...constraints) {
        return ConstraintsWithNewVariables.combine(new ConstraintsWithNewVariables([], newBinaryVariables, newIntegerVariables), ...constraints);
    }
}

/**
 * All constants copied from the `glpk.js` library for better usability
 */
var Goal;
(function (Goal) {
    /**
     * GLP_MIN
     */
    Goal[Goal["MINIMUM"] = 1] = "MINIMUM";
    /**
     * GLP_MAX
     */
    Goal[Goal["MAXIMUM"] = 2] = "MAXIMUM";
})(Goal || (Goal = {}));
var Constraint;
(function (Constraint) {
    /**
     * GLP_FR
     */
    Constraint[Constraint["FREE_VARIABLE"] = 1] = "FREE_VARIABLE";
    /**
     * GLP_LO
     */
    Constraint[Constraint["LOWER_BOUND"] = 2] = "LOWER_BOUND";
    /**
     * GLP_UP
     */
    Constraint[Constraint["UPPER_BOUND"] = 3] = "UPPER_BOUND";
    /**
     * GLP_DB
     */
    Constraint[Constraint["DOUBLE_BOUND"] = 4] = "DOUBLE_BOUND";
    /**
     * GLP_FX
     */
    Constraint[Constraint["FIXED_VARIABLE"] = 5] = "FIXED_VARIABLE";
})(Constraint || (Constraint = {}));
var MessageLevel;
(function (MessageLevel) {
    /**
     * GLP_MSG_OFF
     */
    MessageLevel[MessageLevel["OFF"] = 0] = "OFF";
    /**
     * GLP_MSG_ERR
     */
    MessageLevel[MessageLevel["ERROR"] = 1] = "ERROR";
    /**
     * GLP_MSG_ON
     */
    MessageLevel[MessageLevel["STANDARD"] = 2] = "STANDARD";
    /**
     * GLP_MSG_ALL
     */
    MessageLevel[MessageLevel["ALL"] = 3] = "ALL";
    /**
     * GLP_MSG_DBG
     */
    MessageLevel[MessageLevel["DEBUG"] = 4] = "DEBUG";
})(MessageLevel || (MessageLevel = {}));
var Solution;
(function (Solution) {
    /**
     * GLP_UNDEF
     */
    Solution[Solution["UNDEFINED"] = 1] = "UNDEFINED";
    /**
     * GLP_FEAS
     */
    Solution[Solution["FEASIBLE"] = 2] = "FEASIBLE";
    /**
     * GLP_INFEAS
     */
    Solution[Solution["INFEASIBLE"] = 3] = "INFEASIBLE";
    /**
     * GLP_NOFEAS
     */
    Solution[Solution["NO_SOLUTION"] = 4] = "NO_SOLUTION";
    /**
     * GLP_OPT
     */
    Solution[Solution["OPTIMAL"] = 5] = "OPTIMAL";
    /**
     * GLP_UNBND
     */
    Solution[Solution["UNBOUNDED"] = 6] = "UNBOUNDED";
})(Solution || (Solution = {}));

class IlpSolver {
    constructor(_solver$) {
        this._solver$ = _solver$;
        this._constraintCounter = new IncrementingCounter();
        this._variableCounter = new IncrementingCounter();
        this._allVariables = new Set();
    }
    applyConstraints(ilp, constraints) {
        if (ilp.subjectTo === undefined) {
            ilp.subjectTo = [];
        }
        ilp.subjectTo.push(...constraints.constraints);
        if (ilp.binaries === undefined) {
            ilp.binaries = [];
        }
        ilp.binaries.push(...constraints.binaryVariables);
        if (ilp.generals === undefined) {
            ilp.generals = [];
        }
        ilp.generals.push(...constraints.integerVariables);
    }
    combineCoefficients(variables) {
        const map = new Map();
        for (const variable of variables) {
            const coef = map.get(variable.name);
            if (coef !== undefined) {
                map.set(variable.name, coef + variable.coef);
            }
            else {
                map.set(variable.name, variable.coef);
            }
        }
        const result = [];
        for (const [name, coef] of map) {
            if (coef === 0) {
                continue;
            }
            result.push(this.variable(name, coef));
        }
        return result;
    }
    createVariablesFromPlaceIds(placeIds, coefficient) {
        return placeIds.map(id => this.variable(id, coefficient));
    }
    helperVariableName(prefix = 'y') {
        let helpVariableName;
        do {
            helpVariableName = `${prefix}${this._variableCounter.next()}`;
        } while (this._allVariables.has(helpVariableName));
        this._allVariables.add(helpVariableName);
        return helpVariableName;
    }
    xAbsoluteOfSum(x, sum) {
        /*
         * As per https://blog.adamfurmanek.pl/2015/09/19/ilp-part-5/
         *
         * x >= 0
         * (x + sum is 0) or (x - sum is 0) = 1
         *
         */
        const y = this.helperVariableName('yAbsSum'); // x + sum is 0
        const z = this.helperVariableName('zAbsSum'); // x - sym is 0
        const w = this.helperVariableName('wAbsSum'); // y or z
        return ConstraintsWithNewVariables.combineAndIntroduceVariables(w, undefined, 
        // x >= 0
        this.greaterEqualThan(this.variable(x), 0), 
        // w is y or z
        this.xAorB(w, y, z), 
        // w is true
        this.equal(this.variable(w), 1), 
        // x + sum is 0
        this.xWhenAEqualsB(y, [this.variable(x), ...sum.map(a => this.createOrCopyVariable(a))], 0), 
        // x - sum is 0
        this.xWhenAEqualsB(z, [this.variable(x), ...sum.map(a => this.createOrCopyVariable(a, -1))], 0));
    }
    xWhenAEqualsB(x, a, b) {
        /*
             As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/

             x is a equals b <=> a greater equal than b and a less equal than b
         */
        const y = this.helperVariableName('yWhenEquals');
        const z = this.helperVariableName('zWhenEquals');
        const aGreaterEqualB = this.xWhenAGreaterEqualB(y, a, b);
        const aLessEqualB = this.xWhenALessEqualB(z, a, b);
        return ConstraintsWithNewVariables.combineAndIntroduceVariables([x, y], undefined, aGreaterEqualB, aLessEqualB, this.xAandB(x, y, z));
    }
    yWhenAGreaterEqualB(a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/ and https://blog.adamfurmanek.pl/2015/08/22/ilp-part-1/
            x = a >= b can be defined as !(b > a)
            the negation for binary variables can be expressed as (for x = !y both binary) x = 1 - y
            the 1 - y form can be extracted and added to the constraint that puts all help variables together, therefore we only need to express y = b > a
            for |a|,|b| <= k and K = 2k + 1
            y = b > a can be expressed as:
            a - b + Ky >= 0
            a - b + Ky <= K-1

            in our case b is always a constant given by the solution (region)
            therefore we only have a and y as our variables which gives:
            a + Ky >= b
            a + Ky <= K-1 + b
         */
        const y = this.helperVariableName();
        if (b > IlpSolver.k) {
            console.debug("b", b);
            console.debug("k", IlpSolver.k);
            throw new Error("b > k. This implementation can only handle solutions that are at most k");
        }
        return ConstraintsWithNewVariables.combineAndIntroduceVariables([y], undefined, this.greaterEqualThan([this.variable(a), this.variable(y, IlpSolver.K)], b), this.lessEqualThan([this.variable(a), this.variable(y, IlpSolver.K)], IlpSolver.K - 1 + b));
    }
    xWhenAGreaterEqualB(x, a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/

            a is greater equal b <=> not a less than b
         */
        const z = this.helperVariableName('zALessB');
        return ConstraintsWithNewVariables.combineAndIntroduceVariables(z, undefined, 
        // z when a less than b
        this.xWhenALessB(z, a, b), 
        // x not z
        this.xNotA(x, z));
    }
    xWhenALessEqualB(x, a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/

            a is less equal b <=> not a greater than b
         */
        const z = this.helperVariableName('zAGreaterB');
        return ConstraintsWithNewVariables.combineAndIntroduceVariables(z, undefined, 
        // z when a greater than b
        this.xWhenAGreaterB(z, a, b), 
        // x not z
        this.xNotA(x, z));
    }
    xWhenAGreaterB(x, a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/
            a,b integer
            |a|,|b| <= k
            k = 2^n - 1, n natural
            K = 2k + 1
            x binary

            0 <= b - a + Kx <= K - 1
         */
        let aIsVariable = false;
        let bIsVariable = false;
        if (typeof a === 'string' || Array.isArray(a)) {
            aIsVariable = true;
            if (typeof a === 'string') {
                a = arraify(a);
            }
        }
        if (typeof b === 'string' || Array.isArray(b)) {
            bIsVariable = true;
            if (typeof b === 'string') {
                b = arraify(b);
            }
        }
        if (aIsVariable && bIsVariable) {
            return ConstraintsWithNewVariables.combine(
            // b - a + Kx >= 0
            this.greaterEqualThan([
                ...b.map(b => this.createOrCopyVariable(b)),
                ...a.map(a => this.createOrCopyVariable(a, -1)),
                this.variable(x, IlpSolver.K)
            ], 0), 
            // b - a + Kx <= K - 1
            this.lessEqualThan([
                ...b.map(b => this.createOrCopyVariable(b)),
                ...a.map(a => this.createOrCopyVariable(a, -1)),
                this.variable(x, IlpSolver.K)
            ], IlpSolver.K - 1));
        }
        else if (aIsVariable && !bIsVariable) {
            return ConstraintsWithNewVariables.combine(
            // -a + Kx >= -b
            this.greaterEqualThan([
                ...a.map(a => this.createOrCopyVariable(a, -1)),
                this.variable(x, IlpSolver.K)
            ], -b), 
            // -a + Kx <= K - b - 1
            this.lessEqualThan([
                ...a.map(a => this.createOrCopyVariable(a, -1)),
                this.variable(x, IlpSolver.K)
            ], IlpSolver.K - b - 1));
        }
        else if (!aIsVariable && bIsVariable) {
            return ConstraintsWithNewVariables.combine(
            // b + Kx >= a
            this.greaterEqualThan([
                ...b.map(b => this.createOrCopyVariable(b)),
                this.variable(x, IlpSolver.K)
            ], a), 
            // b + Kx <= K + a - 1
            this.lessEqualThan([
                ...b.map(b => this.createOrCopyVariable(b)),
                this.variable(x, IlpSolver.K)
            ], IlpSolver.K + a - 1));
        }
        else {
            throw new Error(`unsupported comparison! x when ${a} > ${b}`);
        }
    }
    xWhenALessB(x, a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/

            a is less than b <=> b is greater than a
         */
        return this.xWhenAGreaterB(x, b, a);
    }
    xAandB(x, a, b) {
        /*
            As per http://blog.adamfurmanek.pl/2015/08/22/ilp-part-1/
            a,b,x binary

            0 <= a + b - 2x <= 1
         */
        return ConstraintsWithNewVariables.combine(
        // a + b -2x >= 0
        this.greaterEqualThan([this.variable(a), this.variable(b), this.variable(x, -2)], 0), 
        // a + b -2x <= 1
        this.lessEqualThan([this.variable(a), this.variable(b), this.variable(x, -2)], 1));
    }
    xAorB(x, a, b) {
        /*
            As per http://blog.adamfurmanek.pl/2015/08/22/ilp-part-1/
            a,b,x binary

            -1 <= a + b - 2x <= 0
         */
        return ConstraintsWithNewVariables.combine(
        // a + b -2x >= -1
        this.greaterEqualThan([this.variable(a), this.variable(b), this.variable(x, -2)], -1), 
        // a + b -2x <= 0
        this.lessEqualThan([this.variable(a), this.variable(b), this.variable(x, -2)], 0));
    }
    xNotA(x, a) {
        /*
            As per http://blog.adamfurmanek.pl/2015/08/22/ilp-part-1/
            a,x binary

            x = 1 - a
         */
        // x + a = 1
        return this.equal([this.variable(x), this.variable(a)], 1);
    }
    createOrCopyVariable(original, coefficient = 1) {
        if (typeof original === 'string') {
            return this.variable(original, coefficient);
        }
        else {
            return this.variable(original.name, original.coef * coefficient);
        }
    }
    variable(name, coefficient = 1) {
        return { name, coef: coefficient };
    }
    equal(variables, value) {
        console.debug(`${this.formatVariableList(variables)} = ${value}`);
        return new ConstraintsWithNewVariables(this.constrain(arraify(variables), { type: Constraint.FIXED_VARIABLE, ub: value, lb: value }));
    }
    greaterEqualThan(variables, lowerBound) {
        console.debug(`${this.formatVariableList(variables)} >= ${lowerBound}`);
        return new ConstraintsWithNewVariables(this.constrain(arraify(variables), { type: Constraint.LOWER_BOUND, ub: 0, lb: lowerBound }));
    }
    lessEqualThan(variables, upperBound) {
        console.debug(`${this.formatVariableList(variables)} <= ${upperBound}`);
        return new ConstraintsWithNewVariables(this.constrain(arraify(variables), { type: Constraint.UPPER_BOUND, ub: upperBound, lb: 0 }));
    }
    sumEqualsZero(...variables) {
        return this.equal(variables, 0);
    }
    sumGreaterThan(variables, lowerBound) {
        return this.greaterEqualThan(variables, lowerBound + 1);
    }
    constrain(vars, bnds) {
        return {
            name: this.constraintName(),
            vars,
            bnds
        };
    }
    constraintName() {
        return 'c' + this._constraintCounter.next();
    }
    solveILP(ilp) {
        const result$ = new ReplaySubject();
        this._solver$.pipe(take(1)).subscribe(glpk => {
            const res = glpk.solve(ilp, {
                msglev: MessageLevel.ERROR,
            });
            res.then((solution) => {
                result$.next({ ilp, solution });
                result$.complete();
            });
        });
        return result$.asObservable();
    }
    formatVariableList(variables) {
        return arraify(variables).map(v => `${v.coef > 0 ? '+' : ''}${v.coef === -1 ? '-' : (v.coef === 1 ? '' : v.coef)}${v.name}`).join(' ');
    }
}
// k and K defined as per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/
// for some reason k = 2^19 while not large enough to cause precision problems in either doubles or integers
// has caused the iterative algorithm to loop indefinitely, presumably because of some precision error in the implementation of the solver
IlpSolver.k = (1 << 10) - 1; // 2^10 - 1
IlpSolver.K = 2 * IlpSolver.k + 1;

class IlpSolverService {
    constructor() {
        this._solver$ = new ReplaySubject(1);
        // get the solver object
        const promise = import('glpk.js');
        promise.then(result => {
            // @ts-ignore
            result.default().then(glpk => {
                this._solver$.next(glpk);
            });
        });
    }
    ngOnDestroy() {
        this._solver$.complete();
    }
}
IlpSolverService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpSolverService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
IlpSolverService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpSolverService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpSolverService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class AlgorithmResult {
    constructor(algorithmName, startTimeMs, endTimeMs) {
        this._algorithmName = algorithmName;
        if (startTimeMs !== undefined && endTimeMs !== undefined) {
            this._runtimeMs = endTimeMs - startTimeMs;
        }
        this._output = [];
    }
    addOutputLine(outputLine) {
        this._output.push(outputLine);
    }
    serialise() {
        let result = `${AbstractParser.TYPE_BLOCK} ${AlgorithmResult.RESULT_TYPE}
${this._algorithmName}`;
        if (this._runtimeMs !== undefined) {
            result = result.concat(`
${AlgorithmResult.RUNTIME_BLOCK}
${this._runtimeMs.toFixed(3)} ms`);
        }
        result = result.concat(`\n${AlgorithmResult.OUTPUT_BLOCK}`);
        this._output.forEach(line => {
            result = result.concat(`\n${line}`);
        });
        return result;
    }
    toDropFile(fileName, suffix) {
        return new DropFile(fileName, this.serialise(), suffix);
    }
}
AlgorithmResult.RESULT_TYPE = 'result';
AlgorithmResult.RUNTIME_BLOCK = '.runtime';
AlgorithmResult.OUTPUT_BLOCK = '.output';

class MapSet {
    constructor() {
        this._map = new Map();
    }
    add(key, value) {
        if (this._map.has(key)) {
            this._map.get(key).add(value);
        }
        else {
            this._map.set(key, new Set([value]));
        }
    }
    addAll(key, values) {
        if (this._map.has(key)) {
            const set = this._map.get(key);
            iterate(values, v => {
                set.add(v);
            });
        }
        else {
            this._map.set(key, new Set(values));
        }
    }
    has(key, value) {
        return this._map.has(key) && this._map.get(key).has(value);
    }
    get(key) {
        const set = this._map.get(key);
        if (set === undefined) {
            return new Set();
        }
        return set;
    }
    entries() {
        return this._map.entries();
    }
}

class EditableStringSequenceWrapper {
    constructor(array) {
        this._array = array;
    }
    get(i) {
        return this._array[i].getString();
    }
    length() {
        return this._array.length;
    }
    set(i, value) {
        this._array[i].setString(value);
    }
}

class DirectlyFollowsExtractor {
    constructor() {
        this._directlyFollows = new MapSet();
    }
    /**
     * Adds a pair to the directly follows relation.
     *
     * @param follows the event that directly follows the predecessor
     * @param predecessor
     */
    add(follows, predecessor) {
        this._directlyFollows.add(follows, predecessor);
    }
    /**
     * Extracts all pairs from the directly follows relation, that only appear in one direction.
     *
     * @returns an array of pairs, where the first element precedes the second element
     * and the two elements don't appear in the opposite order in the relation
     */
    oneWayDirectlyFollows() {
        const oneWayDirectlyFollowsPairs = [];
        for (const entry of this._directlyFollows.entries()) {
            const second = entry[0];
            for (const first of entry[1]) {
                if (!this._directlyFollows.has(first, second)) {
                    oneWayDirectlyFollowsPairs.push([first, second]);
                }
            }
        }
        return oneWayDirectlyFollowsPairs;
    }
}

class RegionIlpSolver extends IlpSolver {
    constructor(_regionTransformer, _solver$) {
        super(_solver$);
        this._regionTransformer = _regionTransformer;
        this._placeVariables = new Set();
    }
    computeRegions(nets, config) {
        const regions$ = new ReplaySubject();
        const combined = this.combineInputNets(nets);
        const ilp$ = new BehaviorSubject(this.setUpInitialILP(combined, config));
        ilp$.pipe(switchMap(ilp => this.solveILP(ilp))).subscribe((ps) => {
            var _a;
            if (ps.solution.result.status === Solution.OPTIMAL) {
                const region = this._regionTransformer.displayRegionInNet(ps.solution, combined.net);
                // TODO check if the region is new and we are not trapped in a loop
                const nonEmptyInputSet = (_a = combined.inputs.find(inputs => inputs.size > 0)) !== null && _a !== void 0 ? _a : [];
                regions$.next({ net: region, inputs: Array.from(nonEmptyInputSet) });
                ilp$.next(this.addConstraintsToILP(ps));
            }
            else {
                // we are done, there are no more regions
                console.debug('final non-optimal result', ps.solution);
                regions$.complete();
                ilp$.complete();
            }
        });
        return regions$.asObservable();
    }
    combineInputNets(nets) {
        if (nets.length === 0) {
            throw new Error('Synthesis must be performed on at least one input net!');
        }
        let result = nets[0];
        const inputs = [result.inputPlaces];
        const outputs = [result.outputPlaces];
        for (let i = 1; i < nets.length; i++) {
            const union = PetriNet.netUnion(result, nets[i]);
            result = union.net;
            inputs.push(union.inputPlacesB);
            outputs.push(union.outputPlacesB);
        }
        return { net: result, inputs, outputs };
    }
    setUpInitialILP(combined, config) {
        const net = combined.net;
        this._placeVariables = new Set(net.getPlaces().map(p => p.getId()));
        this._allVariables = new Set(this._placeVariables);
        const initial = {
            name: 'ilp',
            objective: {
                name: 'region',
                direction: Goal.MINIMUM,
                vars: net.getPlaces().map(p => this.variable(p.getId())),
            },
            subjectTo: [],
        };
        initial[config.oneBoundRegions ? 'binaries' : 'generals'] = Array.from(this._placeVariables);
        this.applyConstraints(initial, this.createInitialConstraints(combined, config));
        return initial;
    }
    createInitialConstraints(combined, config) {
        const net = combined.net;
        const result = [];
        // only non-negative solutions
        result.push(...net.getPlaces().map(p => this.greaterEqualThan(this.variable(p.getId()), 0)));
        // non-zero solutions
        result.push(this.greaterEqualThan(net.getPlaces().map(p => this.variable(p.getId())), 1));
        // initial markings must be the same
        if (combined.inputs.length > 1) {
            const nonemptyInputs = combined.inputs.filter(inputs => inputs.size !== 0);
            const inputsA = Array.from(nonemptyInputs[0]);
            for (let i = 1; i < nonemptyInputs.length; i++) {
                const inputsB = Array.from(nonemptyInputs[i]);
                result.push(this.sumEqualsZero(...inputsA.map(id => this.variable(id, 1)), ...inputsB.map(id => this.variable(id, -1))));
            }
        }
        // places with no post-set should be empty
        if (config.noOutputPlaces) {
            result.push(...net.getPlaces().filter(p => p.outgoingArcs.length === 0).map(p => this.lessEqualThan(this.variable(p.getId()), 0)));
        }
        // gradient constraints
        const labels = this.collectTransitionByLabel(net);
        const riseSumVariables = [];
        const absoluteRiseSumVariables = [];
        for (const [key, transitions] of labels.entries()) {
            const transitionsWithSameLabel = transitions.length;
            const t1 = transitions.splice(0, 1)[0];
            if (config.obtainPartialOrders) {
                // t1 post-set
                riseSumVariables.push(...this.createVariablesFromPlaceIds(t1.outgoingArcs.map((a) => a.destinationId), 1));
                // t1 pre-set
                riseSumVariables.push(...this.createVariablesFromPlaceIds(t1.ingoingArcs.map((a) => a.sourceId), -1));
                const singleRiseVariables = this.createVariablesFromPlaceIds(t1.outgoingArcs.map((a) => a.destinationId), 1);
                singleRiseVariables.push(...this.createVariablesFromPlaceIds(t1.ingoingArcs.map((a) => a.sourceId), -1));
                const singleRise = this.combineCoefficients(singleRiseVariables);
                const abs = this.helperVariableName('abs');
                const absoluteRise = this.xAbsoluteOfSum(abs, singleRise);
                absoluteRiseSumVariables.push(abs);
                result.push(ConstraintsWithNewVariables.combineAndIntroduceVariables(undefined, abs, absoluteRise));
            }
            if (transitionsWithSameLabel === 1) {
                continue;
            }
            for (const t2 of transitions) {
                // t1 post-set
                let variables = this.createVariablesFromPlaceIds(t1.outgoingArcs.map((a) => a.destinationId), 1);
                // t1 pre-set
                variables.push(...this.createVariablesFromPlaceIds(t1.ingoingArcs.map((a) => a.sourceId), -1));
                // t2 post-set
                variables.push(...this.createVariablesFromPlaceIds(t2.outgoingArcs.map((a) => a.destinationId), -1));
                // t2 pre-set
                variables.push(...this.createVariablesFromPlaceIds(t2.ingoingArcs.map((a) => a.sourceId), 1));
                variables = this.combineCoefficients(variables);
                result.push(this.sumEqualsZero(...variables));
            }
        }
        if (config.obtainPartialOrders) {
            /*
                Sum of rises should be 0 AND Sum of absolute rises should be 2 (internal places)
                OR
                Sum of absolute rises should be 1 (initial and final places)
             */
            // sum of rises is 0
            const riseSumIsZero = this.helperVariableName('riseEqualZero');
            result.push(this.xWhenAEqualsB(riseSumIsZero, this.combineCoefficients(riseSumVariables), 0));
            // sum of absolute values of rises is 2
            const absRiseSumIsTwo = this.helperVariableName('absRiseSumTwo');
            result.push(this.xWhenAEqualsB(absRiseSumIsTwo, absoluteRiseSumVariables, 2));
            // sum is 0 AND sum absolute is 2
            const internalPlace = this.helperVariableName('placeIsInternal');
            result.push(ConstraintsWithNewVariables.combineAndIntroduceVariables([riseSumIsZero, absRiseSumIsTwo], undefined, this.xAandB(internalPlace, riseSumIsZero, absRiseSumIsTwo)));
            // sum of absolute values of rise is 1
            const absRiseSumIsOne = this.helperVariableName('absRiseSumOne');
            result.push(this.xWhenAEqualsB(absRiseSumIsOne, absoluteRiseSumVariables, 1));
            // place is internal OR place is initial/final
            const internalOrFinal = this.helperVariableName('internalOrFinal');
            result.push(ConstraintsWithNewVariables.combineAndIntroduceVariables([internalPlace, absRiseSumIsOne, internalOrFinal], undefined, this.xAorB(internalOrFinal, internalPlace, absRiseSumIsOne)));
            // place is internal OR place is initial/final must be true
            result.push(this.equal(this.variable(internalOrFinal), 1));
        }
        return ConstraintsWithNewVariables.combine(...result);
    }
    addConstraintsToILP(ps) {
        const ilp = ps.ilp;
        // no region that contains the new solution as subset
        const region = ps.solution.result.vars;
        const regionPlaces = Object.entries(region).filter(([k, v]) => v != 0 && this._placeVariables.has(k));
        const additionalConstraints = regionPlaces.map(([k, v]) => this.yWhenAGreaterEqualB(k, v));
        const yVariables = additionalConstraints
            .reduce((arr, constraint) => {
            arr.push(...constraint.binaryVariables);
            return arr;
        }, [])
            .map(y => this.variable(y));
        /*
            Sum of x-es should be less than their number
            x = 1 - y
            Therefore sum of y should be greater than 0
         */
        additionalConstraints.push(this.sumGreaterThan(yVariables, 0));
        this.applyConstraints(ilp, ConstraintsWithNewVariables.combine(...additionalConstraints));
        console.debug('solution', ps.solution.result.vars);
        console.debug('non-zero', regionPlaces);
        console.debug('additional constraint', ilp.subjectTo[ilp.subjectTo.length - 1]);
        return ilp;
    }
    collectTransitionByLabel(net) {
        const result = new Map();
        for (const t of net.getTransitions()) {
            if (t.label === undefined) {
                throw new Error(`Transition with id '${t.id}' has no label! All transitions must be labeled in the input net!`);
            }
            const array = result.get(t.label);
            if (array === undefined) {
                result.set(t.label, [t]);
            }
            else {
                array.push(t);
            }
        }
        return result;
    }
}

class PetriNetRegionTransformerService {
    constructor() {
    }
    displayRegionInNet(solution, net) {
        const result = net.clone();
        Object.entries(solution.result.vars).forEach(([id, marking]) => {
            const place = result.getPlace(id);
            if (place === undefined) {
                return; // continue
            }
            place.marking = marking;
        });
        return result;
    }
}
PetriNetRegionTransformerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionTransformerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetRegionTransformerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionTransformerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionTransformerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class PetriNetRegionsService extends IlpSolverService {
    constructor(_regionTransformer) {
        super();
        this._regionTransformer = _regionTransformer;
    }
    computeRegions(nets, config) {
        return new RegionIlpSolver(this._regionTransformer, this._solver$.asObservable()).computeRegions(nets, config);
    }
}
PetriNetRegionsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionsService, deps: [{ token: PetriNetRegionTransformerService }], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetRegionsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: PetriNetRegionTransformerService }]; } });

class SynthesisResult {
    constructor(input, result, fileName = "") {
        this.input = input;
        this.result = result;
        this.fileName = fileName;
    }
}

class RegionSynthesiser {
    constructor() {
        this._regions = [];
        this._counter = new IncrementingCounter();
    }
    addRegion(region) {
        this._regions.push(region);
    }
    synthesise() {
        if (this._regions.length === 0) {
            throw new Error(`You must provide regions via the 'addRegion' method before you can run the synthesis!`);
        }
        const region = this._regions[0].net;
        const uniqueTransitionLabels = new Set();
        for (const t of region.getTransitions()) {
            const label = t.label;
            if (label === undefined) {
                throw new Error('All transitions in Petri net regions must be labeled!');
            }
            uniqueTransitionLabels.add(label);
        }
        // extract transitions from regions
        const result = new PetriNet();
        for (const label of uniqueTransitionLabels) {
            result.addTransition(this.transition(label));
        }
        // extract places and arcs from regions
        for (const region of this._regions) {
            const place = new Place(region.inputs.reduce((sum, id) => sum + region.net.getPlace(id).marking, 0));
            const gradients = new Map();
            for (const t of region.net.getTransitions()) {
                const gradient = this.computeGradient(t);
                const label = t.label;
                const existingGradient = gradients.get(label);
                if (existingGradient !== undefined && gradient !== existingGradient) {
                    console.debug(region);
                    throw new Error(`The provided Petri net is not a valid region! The gradient of label '${label}' of transition with id '${t.id}' is ${gradient}, but a different transition with the same label has a gradient of ${existingGradient}!`);
                }
                else {
                    gradients.set(t.label, gradient);
                }
            }
            if (!this.isEquivalentPlaceInNet(gradients, result)) {
                result.addPlace(place);
                for (const [label, gradient] of gradients) {
                    this.addArc(label, place, gradient, result);
                }
            }
        }
        return result;
    }
    transition(label) {
        return new Transition(label, 0, 0, label);
    }
    computeGradient(transition) {
        let gradient = 0;
        for (const a of transition.outgoingArcs) {
            gradient += a.destination.marking;
        }
        for (const a of transition.ingoingArcs) {
            gradient -= a.source.marking;
        }
        return gradient;
    }
    addArc(label, place, gradient, net) {
        if (gradient === 0) {
            return;
        }
        const transition = net.getTransition(label);
        if (gradient > 0) {
            net.addArc(transition, place, gradient);
        }
        else {
            net.addArc(place, transition, -gradient);
        }
    }
    // TODO improve this
    isEquivalentPlaceInNet(gradients, net) {
        if (net.getPlaces().length === 0) {
            return false;
        }
        return net.getPlaces().some(existingPlace => {
            for (const [label, gradient] of gradients) {
                if (gradient === 0) {
                    continue;
                }
                if (gradient < 0) {
                    if (existingPlace.outgoingArcWeights.get(label) !== -gradient) {
                        return false;
                    }
                }
                else if (existingPlace.ingoingArcWeights.get(label) !== gradient) {
                    return false;
                }
            }
            return true;
        });
    }
}

class PetriNetRegionSynthesisService {
    constructor(_regionService, _serializer) {
        this._regionService = _regionService;
        this._serializer = _serializer;
    }
    synthesise(input, config = {}, fileName = 'result') {
        const result$ = new ReplaySubject(1);
        const synthesiser = new RegionSynthesiser();
        const arrayInput = Array.isArray(input) ? input : [input];
        this._regionService.computeRegions(arrayInput, config).subscribe({
            next: region => {
                synthesiser.addRegion(region);
                console.debug(this._serializer.serialise(region.net));
            },
            complete: () => {
                result$.next(new SynthesisResult(arrayInput, synthesiser.synthesise(), fileName));
                result$.complete();
            }
        });
        return result$.asObservable();
    }
}
PetriNetRegionSynthesisService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionSynthesisService, deps: [{ token: PetriNetRegionsService }, { token: PetriNetSerialisationService }], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetRegionSynthesisService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionSynthesisService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionSynthesisService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: PetriNetRegionsService }, { type: PetriNetSerialisationService }]; } });

class MaxFlowPreflowN3 {
    constructor(n) {
        this.n = n;
        this.cap = [];
        for (let i = 0; i < n; i++) {
            this.cap.push(new Array(n).fill(0));
        }
    }
    setCap(i, j, cap) {
        this.cap[i][j] = cap;
    }
    setUnbounded(i, j) {
        this.setCap(i, j, 20000);
    }
    getCap(i, j) {
        return this.cap[i][j];
    }
    maxFlow(s, t) {
        const h = new Array(this.n).fill(0);
        h[s] = this.n - 1;
        const maxh = new Array(this.n).fill(0);
        const f = [];
        for (let i = 0; i < this.n; i++) {
            f.push(new Array(this.n).fill(0));
        }
        const e = new Array(this.n).fill(0);
        for (let i = 0; i < this.n; i++) {
            f[s][i] = this.cap[s][i];
            f[i][s] = -f[s][i];
            e[i] = this.cap[s][i];
        }
        for (let sz = 0;;) {
            if (sz === 0) {
                for (let i = 0; i < this.n; i++) {
                    if (i !== s && i !== t && e[i] > 0) {
                        if (sz !== 0 && h[i] > h[maxh[0]]) {
                            sz = 0;
                        }
                        maxh[sz++] = i;
                    }
                }
            }
            if (sz === 0) {
                break;
            }
            while (sz !== 0) {
                let i = maxh[sz - 1];
                let pushed = false;
                for (let j = 0; j < this.n && e[i] !== 0; j++) {
                    if (h[i] === h[j] + 1 && this.cap[i][j] - f[i][j] > 0) {
                        const df = Math.min(this.cap[i][j] - f[i][j], e[i]);
                        f[i][j] += df;
                        f[j][i] -= df;
                        e[i] -= df;
                        e[j] += df;
                        if (e[i] === 0) {
                            sz--;
                        }
                        pushed = true;
                    }
                }
                if (!pushed) {
                    h[i] = 20000;
                    for (let j = 0; j < this.n; j++) {
                        if (h[i] > h[j] + 1 && this.cap[i][j] - f[i][j] > 0) {
                            h[i] = h[j] + 1;
                        }
                    }
                    if (h[i] > h[maxh[0]]) {
                        sz = 0;
                        break;
                    }
                }
            }
        }
        let flow = 0;
        for (let i = 0; i < this.n; i++) {
            flow += f[s][i];
        }
        return flow;
    }
}

class LpoValidator {
    constructor(petriNet, lpo) {
        this._petriNet = petriNet;
        this._lpo = lpo.clone();
        this.modifyLPO();
    }
    modifyLPO() {
        for (const e of this._lpo.events) {
            for (const t of this._petriNet.getTransitions()) {
                if (e.label === t.label) {
                    if (e.transition !== undefined) {
                        throw new Error(`The algorithm does not support label-splitted nets`);
                    }
                    e.transition = t;
                }
            }
            if (e.transition === undefined) {
                throw new Error(`The net does not contain a transition with the label '${e.label}' of the event '${e.id}'`);
            }
        }
        const initial = new Event('initial marking', undefined);
        const final = new Event('final marking', undefined);
        for (const e of this._lpo.initialEvents) {
            initial.addNextEvent(e);
        }
        for (const e of this._lpo.finalEvents) {
            e.addNextEvent(final);
        }
        this._lpo.addEvent(initial);
        this._lpo.addEvent(final);
    }
}

class ValidationResult {
    constructor(valid, phase) {
        this.valid = valid;
        this.phase = phase;
    }
}
var ValidationPhase;
(function (ValidationPhase) {
    ValidationPhase["FLOW"] = "flow";
    ValidationPhase["FORWARDS"] = "forwards";
    ValidationPhase["BACKWARDS"] = "backwards";
})(ValidationPhase || (ValidationPhase = {}));

class LpoFlowValidator extends LpoValidator {
    constructor(petriNet, lpo) {
        super(petriNet, lpo);
    }
    validate() {
        const flow = [];
        const places = this._petriNet.getPlaces();
        const events = this._lpo.events;
        for (let i = 0; i < places.length; i++) {
            const place = places[i];
            flow[i] = new ValidationResult(this.checkFlowForPlace(place, events), ValidationPhase.FLOW);
        }
        return flow;
    }
    checkFlowForPlace(place, events) {
        const n = events.length * 2 + 2;
        const SOURCE = 0;
        const SINK = n - 1;
        const network = new MaxFlowPreflowN3(n);
        for (let eIndex = 0; eIndex < events.length; eIndex++) {
            network.setUnbounded(this.eventStart(eIndex), this.eventEnd(eIndex));
            const event = events[eIndex];
            if (event.transition === undefined) {
                if (place.marking > 0) {
                    network.setCap(SOURCE, this.eventEnd(eIndex), place.marking);
                }
            }
            else {
                for (const outArc of event.transition.outgoingArcs) {
                    const postPlace = outArc.destination;
                    if (postPlace === place) {
                        network.setCap(SOURCE, this.eventEnd(eIndex), outArc.weight);
                    }
                }
                for (const inArc of event.transition.ingoingArcs) {
                    const prePlace = inArc.source;
                    if (prePlace === place) {
                        network.setCap(this.eventStart(eIndex), SINK, inArc.weight);
                    }
                }
            }
            for (const postEvent of event.nextEvents) {
                network.setUnbounded(this.eventEnd(eIndex), this.eventStart(events.findIndex(e => e === postEvent)));
            }
        }
        let need = 0;
        for (let ii = 0; ii < n; ii++) {
            need += network.getCap(ii, SINK);
        }
        const f = network.maxFlow(SOURCE, SINK);
        console.debug(`flow ${place.id} ${f}`);
        console.debug(`need ${place.id} ${need}`);
        return need === f;
    }
    eventStart(eventIndex) {
        return eventIndex * 2 + 1;
    }
    eventEnd(eventIndex) {
        return eventIndex * 2 + 2;
    }
}

class LpoFireValidator extends LpoFlowValidator {
    constructor(petriNet, lpo) {
        super(petriNet, lpo);
        this._places = this._petriNet.getPlaces();
    }
    modifyLPO() {
        super.modifyLPO();
        this._lpo.determineInitialAndFinalEvents();
    }
    validate() {
        const totalOrder = this.buildTotalOrdering();
        totalOrder.forEach(e => e.initializeLocalMarking(this._places.length));
        // build start event
        const initialEvent = totalOrder[0];
        for (let i = 0; i < this._places.length; i++) {
            initialEvent.localMarking[i] = this._places[i].marking;
        }
        const validPlaces = this.newBoolArray(true);
        const complexPlaces = this.newBoolArray(false);
        const notValidPlaces = this.newBoolArray(false);
        // TODO timing
        let queue = [...totalOrder];
        this.fireForwards(queue, validPlaces, complexPlaces);
        // not valid places
        const finalEvent = [...this._lpo.finalEvents][0];
        for (let i = 0; i < this._places.length; i++) {
            notValidPlaces[i] = finalEvent.localMarking[i] < 0;
        }
        // Don't fire all backwards!
        queue = [finalEvent];
        for (let i = totalOrder.length - 2; i >= 0; i--) {
            totalOrder[i].initializeLocalMarking(this._places.length);
            queue.push(totalOrder[i]);
        }
        const backwardsValidPlaces = this.newBoolArray(true);
        const backwardsComplexPlaces = this.newBoolArray(false);
        // TODO timing 2
        // Is the final marking > 0 ?
        for (let i = 0; i < this._places.length; i++) {
            if (finalEvent.localMarking[i] < 0) {
                backwardsValidPlaces[i] = false;
            }
        }
        this.fireBackwards(queue, backwardsValidPlaces, backwardsComplexPlaces);
        // Rest with flow
        const flow = this.newBoolArray(false);
        for (let i = 0; i < this._places.length; i++) {
            if (!validPlaces[i] && complexPlaces[i] && !notValidPlaces[i] && !backwardsValidPlaces[i]) {
                flow[i] = this.checkFlowForPlace(this._places[i], this._lpo.events);
            }
        }
        // TODO timing 3
        // TODO stats?
        return this._places.map((p, i) => {
            if (validPlaces[i]) {
                return new ValidationResult(true, ValidationPhase.FORWARDS);
            }
            else if (backwardsValidPlaces[i]) {
                return new ValidationResult(true, ValidationPhase.BACKWARDS);
            }
            else if (flow[i]) {
                return new ValidationResult(true, ValidationPhase.FLOW);
            }
            else if (notValidPlaces[i]) {
                return new ValidationResult(false, ValidationPhase.FORWARDS);
            }
            else {
                return new ValidationResult(false, ValidationPhase.FLOW);
            }
        });
    }
    buildTotalOrdering() {
        const ordering = [...this._lpo.initialEvents];
        const contained = new Set(this._lpo.initialEvents);
        const examineLater = [...this._lpo.events];
        while (examineLater.length > 0) {
            const e = examineLater.shift();
            if (contained.has(e)) {
                continue;
            }
            let add = true;
            for (const pre of e.previousEvents) {
                if (!contained.has(pre)) {
                    add = false;
                    break;
                }
            }
            if (add) {
                ordering.push(e);
                contained.add(e);
            }
            else {
                examineLater.push(e);
            }
        }
        return ordering;
    }
    fireForwards(queue, validPlaces, complexPlaces) {
        this.fire(queue, validPlaces, complexPlaces, (t) => t.ingoingArcs, (a) => a.source, (t) => t.outgoingArcs, (a) => a.destination, (e) => e.nextEvents);
    }
    fireBackwards(queue, validPlaces, complexPlaces) {
        this.fire(queue, validPlaces, complexPlaces, (t) => t.outgoingArcs, (a) => a.destination, (t) => t.ingoingArcs, (a) => a.source, (e) => e.previousEvents);
    }
    fire(firingOrder, validPlaces, complexPlaces, preArcs, prePlace, postArcs, postPlace, nextEvents) {
        while (firingOrder.length > 0) {
            const e = firingOrder.shift();
            // can fire?
            if (e.transition !== undefined) {
                // fire
                for (const arc of preArcs(e.transition)) {
                    const pIndex = this.getPIndex(prePlace(arc));
                    e.localMarking[pIndex] = e.localMarking[pIndex] - arc.weight;
                    if (e.localMarking[pIndex] < 0) {
                        validPlaces[pIndex] = false;
                    }
                }
                for (const arc of postArcs(e.transition)) {
                    const pIndex = this.getPIndex(postPlace(arc));
                    e.localMarking[pIndex] = e.localMarking[pIndex] + arc.weight;
                }
            }
            // push to first later and check for complex places
            if (nextEvents(e).size > 0) {
                for (let i = 0; i < this._places.length; i++) {
                    if (nextEvents(e).size > 1 && e.localMarking[i] > 0) {
                        complexPlaces[i] = true;
                    }
                    const firstLater = [...nextEvents(e)][0];
                    firstLater.localMarking[i] = firstLater.localMarking[i] + e.localMarking[i];
                }
            }
        }
    }
    getPIndex(p) {
        return this._places.findIndex(pp => pp === p);
    }
    newBoolArray(fill) {
        return new Array(this._places.length).fill(fill);
    }
}

/**
 * A single net in the Prime miner result sequence.
 */
class PrimeMinerResult {
    constructor(net, supportedPoIndices, containedTraces) {
        this.net = net;
        this.supportedPoIndices = supportedPoIndices;
        this.containedTraces = containedTraces;
    }
}

class PrimeMinerInput extends PartialOrderNetWithContainedTraces {
    constructor(net, containedTraces) {
        super(net, containedTraces);
    }
    static fromPartialOrder(po, changed = false) {
        const r = new PrimeMinerInput(po.net, po.containedTraces);
        r.lastIterationChangedModel = changed;
        return r;
    }
}

class MappingCounter {
    constructor(mappedId, maximum) {
        this.mappedId = mappedId;
        this._maximum = maximum;
        this._currentChoice = 0;
    }
    current() {
        return this._currentChoice;
    }
    next() {
        this._currentChoice += 1;
        if (this._currentChoice > this._maximum) {
            this._currentChoice = 0;
        }
        return this._currentChoice;
    }
    isLastOption() {
        return this._currentChoice === this._maximum;
    }
}

class MappingManager {
    constructor(possibleMappings) {
        this._mappingCounters = [];
        for (const [id, mappableIds] of possibleMappings.entries()) {
            this._mappingCounters.push(new MappingCounter(id, mappableIds.size - 1));
        }
        this._mappingOrder = new Map(this._mappingCounters.map(choice => [choice.mappedId, Array.from(possibleMappings.get(choice.mappedId))]));
    }
    getCurrentMapping() {
        return new Map(this._mappingCounters.map(choice => [choice.mappedId, this._mappingOrder.get(choice.mappedId)[choice.current()]]));
    }
    /**
     * Increments the current mapping to the next possibility.
     *
     * @returns `true` if the final mapping was passed. `false` otherwise.
     */
    moveToNextMapping() {
        let incrementedIndex = 0;
        while (incrementedIndex < this._mappingCounters.length) {
            const carry = this._mappingCounters[incrementedIndex].isLastOption();
            this._mappingCounters[incrementedIndex].next();
            if (carry) {
                incrementedIndex++;
            }
            else {
                break;
            }
        }
        return incrementedIndex === this._mappingCounters.length;
    }
}

class PetriNetToPartialOrderTransformerService {
    constructor() {
    }
    transform(net) {
        var _a;
        const badPlace = net.getPlaces().find(p => p.ingoingArcs.length > 1 || p.outgoingArcs.length > 1 || (p.ingoingArcs.length === 1 && p.outgoingArcs.length === 1 && p.ingoingArcs[0].sourceId === p.outgoingArcs[0].destinationId));
        if (badPlace !== undefined) {
            throw new Error(`The given Petri net is not a partial order! The place with id '${badPlace.id}' has too many in-/outgoing arcs or is part of a self-loop.`);
        }
        const badTransition = net.getTransitions().find(t => t.ingoingArcs.length === 0 || t.outgoingArcs.length === 0 || t.label === undefined);
        if (badTransition !== undefined) {
            throw new Error(`The given Petri net is not a partial order! The transition with id '${badTransition.id}' has an empty pre-/post-set or is unlabeled`);
        }
        const result = new PartialOrder();
        for (const t of net.getTransitions()) {
            result.addEvent(new Event(t.id, t.label));
        }
        for (const t of net.getTransitions()) {
            const event = result.getEvent(t.id);
            for (const arc of t.outgoingArcs) {
                const nextTransitionId = (_a = arc.destination.outgoingArcs[0]) === null || _a === void 0 ? void 0 : _a.destinationId;
                if (nextTransitionId !== undefined) {
                    event.addNextEvent(result.getEvent(nextTransitionId));
                }
            }
        }
        return result;
    }
}
PetriNetToPartialOrderTransformerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetToPartialOrderTransformerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetToPartialOrderTransformerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetToPartialOrderTransformerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetToPartialOrderTransformerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class IsomorphismCandidate {
    constructor(target, candidates) {
        this.target = target;
        this.candidates = candidates;
    }
}

class PartialOrderIsomorphismService {
    constructor() {
    }
    arePartialOrdersIsomorphic(partialOrderA, partialOrderB) {
        partialOrderA.determineInitialAndFinalEvents();
        partialOrderB.determineInitialAndFinalEvents();
        const unsolved = [];
        for (const initialEvent of partialOrderA.initialEvents) {
            unsolved.push(new IsomorphismCandidate(initialEvent, Array.from(partialOrderB.initialEvents)));
        }
        const mappingAB = new Map();
        const mappingBA = new Map();
        const pushedToBack = new Set();
        while (unsolved.length > 0) {
            const problem = unsolved.shift();
            if (mappingAB.has(problem.target.id)) {
                continue;
            }
            const previous = Array.from(problem.target.previousEvents);
            if (previous.some(p => !mappingAB.has(p.id))) {
                // pre-set was not yet determined, we have to wait
                if (pushedToBack.has(problem)) {
                    return false;
                }
                pushedToBack.add(problem);
                unsolved.push(problem);
                continue;
            }
            problem.candidates = problem.candidates.filter(c => !mappingBA.has(c.id));
            const match = problem.candidates.find(c => {
                const sameLabel = c.label === problem.target.label;
                if (!sameLabel) {
                    return false;
                }
                if (c.previousEvents.size !== problem.target.previousEvents.size) {
                    return false;
                }
                if (c.nextEvents.size !== problem.target.nextEvents.size) {
                    return false;
                }
                const previousLabels = new Set(Array.from(c.previousEvents).map(p => p.label));
                for (const p of problem.target.previousEvents) {
                    if (!previousLabels.has(p.label)) {
                        return false;
                    }
                    previousLabels.delete(p.label);
                }
                return true;
            });
            if (match === undefined) {
                return false;
            }
            pushedToBack.clear();
            mappingAB.set(problem.target.id, match);
            mappingBA.set(match.id, problem.target);
            for (const next of problem.target.nextEvents) {
                unsolved.push(new IsomorphismCandidate(next, Array.from(match.nextEvents)));
            }
        }
        return true;
    }
}
PartialOrderIsomorphismService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderIsomorphismService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PartialOrderIsomorphismService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderIsomorphismService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderIsomorphismService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class PetriNetIsomorphismService {
    constructor(_pnToPoTransformer, _poIsomorphism) {
        this._pnToPoTransformer = _pnToPoTransformer;
        this._poIsomorphism = _poIsomorphism;
    }
    arePartialOrderPetriNetsIsomorphic(partialOrderA, partialOrderB) {
        if (!this.compareBasicNetProperties(partialOrderA, partialOrderB)) {
            return false;
        }
        return this._poIsomorphism.arePartialOrdersIsomorphic(this._pnToPoTransformer.transform(partialOrderA), this._pnToPoTransformer.transform(partialOrderB));
    }
    arePetriNetsIsomorphic(netA, netB) {
        return !!this.getIsomorphicPetriNetMapping(netA, netB);
    }
    getIsomorphicPetriNetMapping(netA, netB) {
        if (!this.compareBasicNetProperties(netA, netB)) {
            return undefined;
        }
        const transitionMapping = this.determinePossibleTransitionMappings(netA, netB);
        if (transitionMapping === undefined) {
            return undefined;
        }
        const placeMapping = this.determinePossiblePlaceMappings(netA, netB);
        if (placeMapping === undefined) {
            return undefined;
        }
        const transitionMappingManager = new MappingManager(transitionMapping);
        const placeMappingManager = new MappingManager(placeMapping);
        let done = false;
        do {
            const transitionMapping = transitionMappingManager.getCurrentMapping();
            const uniqueTransitionsMapped = new Set(transitionMapping.values());
            if (transitionMapping.size === uniqueTransitionsMapped.size) { // bijective transition mapping
                const placeMapping = placeMappingManager.getCurrentMapping();
                const uniquePlacesMapped = new Set(placeMapping.values());
                if (placeMapping.size === uniquePlacesMapped.size // bijective place mapping
                    && this.isMappingAPetriNetIsomorphism(netA, netB, transitionMapping, placeMapping)) {
                    return {
                        placeMapping,
                        transitionMapping
                    };
                }
            }
            const carry = transitionMappingManager.moveToNextMapping();
            if (carry) {
                done = placeMappingManager.moveToNextMapping();
            }
        } while (!done);
        return undefined;
    }
    compareBasicNetProperties(netA, netB) {
        return netA.getTransitionCount() === netB.getTransitionCount()
            && netA.getPlaceCount() === netB.getPlaceCount()
            && netA.getArcCount() === netB.getArcCount()
            && netA.inputPlaces.size === netB.inputPlaces.size
            && netA.outputPlaces.size === netB.outputPlaces.size;
    }
    determinePossibleTransitionMappings(netA, netB) {
        const transitionMapping = new MapSet();
        for (const tA of netA.getTransitions()) {
            let wasMapped = false;
            for (const tB of netB.getTransitions()) {
                if (tA.label === tB.label
                    && tA.ingoingArcs.length === tB.ingoingArcs.length
                    && tA.outgoingArcs.length === tB.outgoingArcs.length) {
                    wasMapped = true;
                    transitionMapping.add(tA.getId(), tB.getId());
                }
            }
            if (!wasMapped) {
                return undefined;
            }
        }
        return transitionMapping;
    }
    determinePossiblePlaceMappings(netA, netB) {
        const placeMapping = new MapSet();
        for (const pA of netA.getPlaces()) {
            let wasMapped = false;
            for (const pB of netB.getPlaces()) {
                if (pA.marking === pB.marking
                    && pA.ingoingArcs.length === pB.ingoingArcs.length
                    && pA.outgoingArcs.length === pB.outgoingArcs.length) {
                    wasMapped = true;
                    placeMapping.add(pA.getId(), pB.getId());
                }
            }
            if (!wasMapped) {
                return undefined;
            }
        }
        return placeMapping;
    }
    isMappingAPartialOrderIsomorphism(partialOrderA, partialOrderB, transitionMapping) {
        const unmappedArcs = partialOrderB.getPlaces().filter(p => p.ingoingArcs.length !== 0 && p.outgoingArcs.length !== 0);
        for (const arc of partialOrderA.getPlaces()) {
            if (arc.ingoingArcs.length === 0 || arc.outgoingArcs.length === 0) {
                continue;
            }
            const preTransitionB = transitionMapping.get(arc.ingoingArcs[0].sourceId);
            const postTransitionB = transitionMapping.get(arc.outgoingArcs[0].destinationId);
            const fittingArcIndex = unmappedArcs.findIndex(unmapped => unmapped.ingoingArcs[0].sourceId === preTransitionB && unmapped.outgoingArcs[0].destinationId === postTransitionB);
            if (fittingArcIndex === -1) {
                return false;
            }
            unmappedArcs.splice(fittingArcIndex, 1);
        }
        return true;
    }
    isMappingAPetriNetIsomorphism(netA, netB, transitionMapping, placeMapping) {
        const unmappedArcs = netB.getArcs();
        for (const arc of netA.getArcs()) {
            let arcSourceId;
            let arcDestinationId;
            if (arc.source instanceof Transition) {
                arcSourceId = transitionMapping.get(arc.sourceId);
                arcDestinationId = placeMapping.get(arc.destinationId);
            }
            else {
                arcSourceId = placeMapping.get(arc.sourceId);
                arcDestinationId = transitionMapping.get(arc.destinationId);
            }
            // TODO arc weight is not considered when creating possible mappings. Inclusion of this property might make the algorithm more efficient
            const fittingArcIndex = unmappedArcs.findIndex(unmapped => unmapped.sourceId === arcSourceId && unmapped.destinationId === arcDestinationId && unmapped.weight === arc.weight);
            if (fittingArcIndex === -1) {
                return false;
            }
            unmappedArcs.splice(fittingArcIndex, 1);
        }
        return true;
    }
}
PetriNetIsomorphismService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetIsomorphismService, deps: [{ token: PetriNetToPartialOrderTransformerService }, { token: PartialOrderIsomorphismService }], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetIsomorphismService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetIsomorphismService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetIsomorphismService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: PetriNetToPartialOrderTransformerService }, { type: PartialOrderIsomorphismService }]; } });

class CoverabilityTree {
    constructor(omegaMarking, ancestors = []) {
        this._omegaMarking = omegaMarking;
        this._ancestors = ancestors;
        this._children = new Map();
    }
    get omegaMarking() {
        return this._omegaMarking;
    }
    get ancestors() {
        return this._ancestors;
    }
    getChildren() {
        return Array.from(this._children.values());
    }
    getChildrenMap() {
        return new Map(this._children);
    }
    addChild(label, marking) {
        const child = new CoverabilityTree(marking, [...this._ancestors, this]);
        this._children.set(label, child);
        return child;
    }
}

class PetriNetCoverabilityService {
    constructor() {
    }
    getCoverabilityTree(net) {
        const tree = new CoverabilityTree(net.getInitialMarking());
        const statesToExplore = [tree];
        whileLoop: while (statesToExplore.length !== 0) {
            const state = statesToExplore.shift();
            const ancestors = state.ancestors;
            for (const a of ancestors) {
                if (a.omegaMarking.equals(state.omegaMarking)) {
                    continue whileLoop;
                }
            }
            const enabledTransitions = PetriNet.getAllEnabledTransitions(net, state.omegaMarking);
            for (const t of enabledTransitions) {
                const nextMarking = PetriNet.fireTransitionInMarking(net, t.id, state.omegaMarking);
                const nextOmegaMarking = this.computeNextOmegaMarking(nextMarking, ancestors);
                const newState = state.addChild(t.label, nextOmegaMarking);
                statesToExplore.push(newState);
            }
        }
        return tree;
    }
    computeNextOmegaMarking(nextMarking, ancestors) {
        const runningOmega = new Marking(nextMarking);
        for (const a of ancestors) {
            runningOmega.introduceOmegas(a.omegaMarking);
        }
        return runningOmega;
    }
}
PetriNetCoverabilityService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetCoverabilityService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetCoverabilityService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetCoverabilityService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetCoverabilityService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class ImplicitPlaceRemoverService {
    constructor(_coverabilityTreeService) {
        this._coverabilityTreeService = _coverabilityTreeService;
    }
    /**
     * @param net a labeled Petri Net containing implicit places with no label-splitting
     * @returns a copy of the input Petri net without the implicit places
     */
    removeImplicitPlaces(net) {
        const reachableMarkings = this.generateReachableMarkings(net);
        const placeOrdering = net.getPlaces().map(p => p.id);
        const removedPlaceIds = new Set();
        const result = net.clone();
        p1For: for (const p1 of placeOrdering) {
            if (removedPlaceIds.has(p1)) {
                continue;
            }
            p2For: for (const p2 of placeOrdering) {
                if (removedPlaceIds.has(p2)) {
                    continue;
                }
                if (p1 === p2) {
                    continue;
                }
                let isGreater = false;
                for (const marking of reachableMarkings.values()) {
                    if (marking.get(p1) < marking.get(p2)) {
                        continue p2For;
                    }
                    else if (marking.get(p1) > marking.get(p2)) {
                        isGreater = true;
                    }
                }
                if (isGreater) {
                    // p1 is > than some other place p2 => p1 is an implicit place and can be removed from the net
                    removedPlaceIds.add(p1);
                    result.removePlace(p1);
                    continue p1For;
                }
            }
        }
        return result;
    }
    generateReachableMarkings(net) {
        const reachableMarkings = new Map();
        const toExplore = [this._coverabilityTreeService.getCoverabilityTree(net)];
        const placeOrdering = toExplore[0].omegaMarking.getKeys();
        while (toExplore.length > 0) {
            const next = toExplore.shift();
            toExplore.push(...next.getChildren());
            const m = next.omegaMarking;
            reachableMarkings.set(this.stringifyMarking(m, placeOrdering), m);
        }
        return reachableMarkings;
    }
    getLabelMapping(net) {
        const result = new Map();
        for (const t of net.getTransitions()) {
            if (t.label === undefined) {
                throw new Error(`Silent transitions are unsupported! The transition with id '${t.id}' has no label`);
            }
            if (result.has(t.label)) {
                throw new Error(`Label splitting is not supported! The label '${t.label}' is shared by at least two transitions`);
            }
            result.set(t.label, t.id);
        }
        return result;
    }
    stringifyMarking(marking, placeOrdering) {
        return placeOrdering.map(pid => marking.get(pid)).join(',');
    }
}
ImplicitPlaceRemoverService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ImplicitPlaceRemoverService, deps: [{ token: PetriNetCoverabilityService }], target: i0.ɵɵFactoryTarget.Injectable });
ImplicitPlaceRemoverService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ImplicitPlaceRemoverService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ImplicitPlaceRemoverService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: PetriNetCoverabilityService }]; } });

class PrimeMinerService {
    constructor(_synthesisService, _isomorphismService, _implicitPlaceRemover, _pnToPoTransformer) {
        this._synthesisService = _synthesisService;
        this._isomorphismService = _isomorphismService;
        this._implicitPlaceRemover = _implicitPlaceRemover;
        this._pnToPoTransformer = _pnToPoTransformer;
    }
    mine(minerInputs, config = {}) {
        if (minerInputs.length === 0) {
            console.error('Miner input must be non empty');
            return EMPTY;
        }
        minerInputs.sort((a, b) => { var _a, _b, _c, _d; return ((_b = (_a = b.net) === null || _a === void 0 ? void 0 : _a.frequency) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = a.net) === null || _c === void 0 ? void 0 : _c.frequency) !== null && _d !== void 0 ? _d : 0); });
        let bestResult = new PrimeMinerResult(new PetriNet(), [], []);
        let nextInputIndex = 1;
        const minerInput$ = new BehaviorSubject(PrimeMinerInput.fromPartialOrder(minerInputs[0], true));
        return minerInput$.pipe(concatMap(nextInput => {
            let mustSynthesise = nextInput.lastIterationChangedModel;
            if (!nextInput.lastIterationChangedModel) {
                const po = this._pnToPoTransformer.transform(nextInput.net);
                try {
                    const validator = new LpoFireValidator(bestResult.net, po);
                    mustSynthesise = validator.validate().some(r => !r.valid);
                }
                catch (e) {
                    mustSynthesise = true;
                }
            }
            if (mustSynthesise) {
                return this._synthesisService.synthesise([bestResult.net, nextInput.net], config).pipe(map(result => ({
                    result,
                    containedTraces: [...bestResult.containedTraces, ...nextInput.containedTraces]
                })));
            }
            else {
                return of({
                    result: new SynthesisResult([bestResult.net], bestResult.net),
                    containedTraces: bestResult.containedTraces,
                    unchanged: true
                });
            }
        }), map((result) => {
            console.debug(`Iteration ${nextInputIndex} completed`, result);
            const synthesisedNet = result.result.result;
            const r = [];
            let changed = !result.unchanged;
            if (changed && (config.skipConnectivityCheck || this.isConnected(synthesisedNet))) {
                let noImplicit = this._implicitPlaceRemover.removeImplicitPlaces(synthesisedNet);
                changed = !this._isomorphismService.arePetriNetsIsomorphic(bestResult.net, noImplicit);
                if (changed && !bestResult.net.isEmpty()) {
                    r.push(bestResult);
                }
                bestResult = new PrimeMinerResult(noImplicit, [...bestResult.supportedPoIndices, nextInputIndex], result.containedTraces);
            }
            if (nextInputIndex === minerInputs.length) {
                r.push(bestResult);
            }
            if (nextInputIndex < minerInputs.length) {
                minerInput$.next(PrimeMinerInput.fromPartialOrder(minerInputs[nextInputIndex], changed));
                nextInputIndex++;
            }
            else {
                minerInput$.complete();
            }
            console.debug('best running result', bestResult);
            return r;
        }), filter(a => a.length > 0), concatMap(a => from(a)));
    }
    isConnected(net) {
        return net.getTransitions().every(t => t.ingoingArcs.length > 0);
    }
}
PrimeMinerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PrimeMinerService, deps: [{ token: PetriNetRegionSynthesisService }, { token: PetriNetIsomorphismService }, { token: ImplicitPlaceRemoverService }, { token: PetriNetToPartialOrderTransformerService }], target: i0.ɵɵFactoryTarget.Injectable });
PrimeMinerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PrimeMinerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PrimeMinerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: PetriNetRegionSynthesisService }, { type: PetriNetIsomorphismService }, { type: ImplicitPlaceRemoverService }, { type: PetriNetToPartialOrderTransformerService }]; } });

var VariableName;
(function (VariableName) {
    VariableName["INITIAL_MARKING"] = "m0";
    VariableName["OUTGOING_ARC_WEIGHT_PREFIX"] = "x";
    VariableName["INGOING_ARC_WEIGHT_PREFIX"] = "y";
})(VariableName || (VariableName = {}));

var VariableType;
(function (VariableType) {
    VariableType[VariableType["INITIAL_MARKING"] = 0] = "INITIAL_MARKING";
    VariableType[VariableType["INGOING_WEIGHT"] = 1] = "INGOING_WEIGHT";
    VariableType[VariableType["OUTGOING_WEIGHT"] = 2] = "OUTGOING_WEIGHT";
})(VariableType || (VariableType = {}));

class ArcWeightIlpSolver extends IlpSolver {
    constructor(solver$) {
        super(solver$);
        this._labelVariableMapIngoing = new Map();
        this._labelVariableMapOutgoing = new Map();
        this._inverseLabelVariableMapIngoing = new Map();
        this._inverseLabelVariableMapOutgoing = new Map();
    }
    transitionVariableName(label, prefix) {
        let map, inverseMap;
        if (prefix === VariableName.INGOING_ARC_WEIGHT_PREFIX) {
            map = this._labelVariableMapIngoing;
            inverseMap = this._inverseLabelVariableMapIngoing;
        }
        else {
            map = this._labelVariableMapOutgoing;
            inverseMap = this._inverseLabelVariableMapOutgoing;
        }
        const saved = map.get(label);
        if (saved !== undefined) {
            return saved;
        }
        const name = this.helperVariableName(prefix);
        map.set(label, name);
        inverseMap.set(name, label);
        return name;
    }
    getInverseVariableMapping(variable) {
        if (variable === VariableName.INITIAL_MARKING) {
            return {
                label: VariableName.INITIAL_MARKING,
                type: VariableType.INITIAL_MARKING
            };
        }
        else if (variable.startsWith(VariableName.INGOING_ARC_WEIGHT_PREFIX)) {
            const label = this._inverseLabelVariableMapIngoing.get(variable);
            if (label === undefined) {
                throw new Error(`ILP variable '${variable}' could not be resolved to an ingoing transition label!`);
            }
            return {
                label,
                type: VariableType.INGOING_WEIGHT
            };
        }
        else {
            const label = this._inverseLabelVariableMapOutgoing.get(variable);
            if (label === undefined) {
                throw new Error(`ILP variable '${variable}' could not be resolved to an outgoing transition label!`);
            }
            return {
                label,
                type: VariableType.OUTGOING_WEIGHT
            };
        }
    }
}

class IlpMinerIlpSolver extends ArcWeightIlpSolver {
    constructor(solver$) {
        super(solver$);
    }
    findSolutions(log) {
        const baseIlpConstraints = [];
        const directlyFollowsExtractor = new DirectlyFollowsExtractor();
        const traverser = new TraceMultisetEquivalentStateTraverser();
        traverser.traverseMultisetEquivalentStates(log, (prefix, step) => {
            baseIlpConstraints.push(...this.firingRule(prefix, step));
        }, (prefix, step) => {
            if (prefix.length === 0) {
                return;
            }
            directlyFollowsExtractor.add(step, prefix[prefix.length - 1]);
        });
        const oneWayDirectlyFollowsPairs = directlyFollowsExtractor.oneWayDirectlyFollows();
        const baseIlp = this.setUpBaseIlp();
        const problems = oneWayDirectlyFollowsPairs.map(pair => ({
            baseIlpConstraints,
            baseIlp,
            pair
        }));
        return from(problems).pipe(concatMap(problem => {
            return this.solveILP(this.populateIlp(problem.baseIlp, problem.baseIlpConstraints, problem.pair));
        }), toArray());
    }
    firingRule(prefix, step) {
        let foundStep = false;
        const variables = mapMultiset(prefix, (name, cardinality) => {
            const result = [this.variable(this.transitionVariableName(name, VariableName.OUTGOING_ARC_WEIGHT_PREFIX), cardinality)];
            let c = cardinality;
            if (name === step) {
                c += 1;
                foundStep = true;
            }
            result.push(this.variable(this.transitionVariableName(name, VariableName.INGOING_ARC_WEIGHT_PREFIX), -c));
            return result;
        }).reduce((accumulator, value) => accumulator.concat(value), []);
        if (!foundStep) {
            variables.push(this.variable(this.transitionVariableName(step, VariableName.INGOING_ARC_WEIGHT_PREFIX), -1));
        }
        variables.push(this.variable(VariableName.INITIAL_MARKING));
        return this.greaterEqualThan(variables, 0).constraints;
    }
    setUpBaseIlp() {
        const allVariables = Array.from(this._allVariables).concat(VariableName.INITIAL_MARKING);
        return {
            name: 'ilp',
            objective: {
                name: 'goal',
                direction: Goal.MINIMUM,
                vars: allVariables.map(v => {
                    let coef;
                    if (v.startsWith(VariableName.INITIAL_MARKING)) {
                        coef = 30;
                    }
                    else if (v.startsWith(VariableName.OUTGOING_ARC_WEIGHT_PREFIX)) {
                        coef = 10;
                    }
                    else {
                        coef = -1;
                    }
                    return this.variable(v, coef);
                })
            },
            subjectTo: [],
            // TODO enable arc weights with a config setting?
            binaries: allVariables
        };
    }
    populateIlp(baseIlp, baseConstraints, causalPair) {
        const result = Object.assign({}, baseIlp);
        result.subjectTo = [...baseConstraints];
        result.subjectTo = result.subjectTo.concat(this.greaterEqualThan(this.variable(this.transitionVariableName(causalPair[0], VariableName.OUTGOING_ARC_WEIGHT_PREFIX)), 1).constraints);
        result.subjectTo = result.subjectTo.concat(this.greaterEqualThan(this.variable(this.transitionVariableName(causalPair[1], VariableName.INGOING_ARC_WEIGHT_PREFIX)), 1).constraints);
        return result;
    }
}

class DuplicatePlaceRemoverService {
    constructor() {
    }
    /**
     * @param net a labeled Petri Net containing duplicate places
     * @returns a copy of the input Petri net without the duplicate places
     */
    removeDuplicatePlaces(net) {
        const clone = net.clone();
        const places = clone.getPlaces();
        for (let i = 0; i < places.length - 1; i++) {
            const p1 = places[i];
            for (let j = i + 1; j < places.length; j++) {
                const p2 = places[j];
                if (this.arePlacesTheSame(p1, p2)) {
                    clone.removePlace(p1);
                    break;
                }
            }
        }
        return clone;
    }
    arePlacesTheSame(p1, p2) {
        return this.compareArcs(p1.ingoingArcWeights, p2.ingoingArcWeights) && this.compareArcs(p1.outgoingArcWeights, p2.outgoingArcWeights);
    }
    compareArcs(a1, a2) {
        if (a1.size !== a2.size) {
            return false;
        }
        for (const [tid, weight] of a1.entries()) {
            if (a2.get(tid) !== weight) {
                return false;
            }
        }
        return true;
    }
}
DuplicatePlaceRemoverService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: DuplicatePlaceRemoverService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
DuplicatePlaceRemoverService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: DuplicatePlaceRemoverService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: DuplicatePlaceRemoverService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class IlpMinerService extends IlpSolverService {
    constructor(_duplicatePlaceRemover) {
        super();
        this._duplicatePlaceRemover = _duplicatePlaceRemover;
    }
    mine(log) {
        const cleanedLog = cleanLog(log);
        const solver = new IlpMinerIlpSolver(this._solver$.asObservable());
        return solver.findSolutions(cleanedLog).pipe(map(solutions => {
            const net = new PetriNet();
            const transitionMap = new Map();
            for (const placeSolution of solutions) {
                const place = new Place();
                net.addPlace(place);
                Object.entries(placeSolution.solution.result.vars).forEach(([variable, value]) => {
                    const decoded = solver.getInverseVariableMapping(variable);
                    let t;
                    if (value === 0) {
                        return;
                    }
                    switch (decoded.type) {
                        case VariableType.INITIAL_MARKING:
                            place.marking = value;
                            return;
                        case VariableType.INGOING_WEIGHT:
                            t = this.getTransition(decoded.label, net, transitionMap);
                            net.addArc(place, t, value);
                            return;
                        case VariableType.OUTGOING_WEIGHT:
                            t = this.getTransition(decoded.label, net, transitionMap);
                            net.addArc(t, place, value);
                            return;
                    }
                });
            }
            for (const t of net.getTransitions()) {
                if (t.ingoingArcs.length === 0) {
                    const p = new Place(1);
                    net.addPlace(p);
                    net.addArc(p, t);
                }
                if (t.outgoingArcs.length === 0) {
                    const p = new Place();
                    net.addPlace(p);
                    net.addArc(t, p);
                }
            }
            return {
                net: this._duplicatePlaceRemover.removeDuplicatePlaces(net),
                report: [`number of inequalities: ${solutions[0].ilp.subjectTo.length - 2}`, `number of variables: ${solutions[0].ilp.binaries.length}`]
            };
        }));
    }
    getTransition(label, net, map) {
        let t = map.get(label);
        if (t !== undefined) {
            return t;
        }
        t = new Transition(label);
        net.addTransition(t);
        map.set(label, t);
        return t;
    }
}
IlpMinerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpMinerService, deps: [{ token: DuplicatePlaceRemoverService }], target: i0.ɵɵFactoryTarget.Injectable });
IlpMinerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpMinerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpMinerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: DuplicatePlaceRemoverService }]; } });

class Ilp2MinerIlpSolver extends ArcWeightIlpSolver {
    constructor(solver$) {
        super(solver$);
        this._directlyFollowsExtractor = new DirectlyFollowsExtractor();
        this._poVariableNames = new Set();
    }
    findSolutions(pos) {
        const baseIlpConstraints = [];
        if (Array.isArray(pos)) {
            // creates tokenflow system with unique variables for each partial order
            for (let i = 0; i < pos.length; i++) {
                const events = pos[i].events;
                for (const e of events) {
                    baseIlpConstraints.push(...this.firingRule(e, i));
                    baseIlpConstraints.push(...this.tokenFlow(e, i));
                }
                baseIlpConstraints.push(...this.initialMarking(events, i));
            }
        }
        else {
            // uses the combined branching process to reduce the number of unique variables
            const events = pos.getTransitions();
            for (const e of events) {
                baseIlpConstraints.push(...this.branchingProcessFiringRule(e));
                baseIlpConstraints.push(...this.branchingProcessTokenFlow(e));
            }
        }
        const baseIlp = this.setUpBaseIlp();
        const problems = this._directlyFollowsExtractor.oneWayDirectlyFollows().map(pair => ({
            baseIlpConstraints,
            baseIlp,
            pair
        }));
        return from(problems).pipe(concatMap(problem => {
            return this.solveILP(this.populateIlp(problem.baseIlp, problem.baseIlpConstraints, problem.pair));
        }), toArray());
    }
    firingRule(event, i) {
        const variables = [this.variable(this.getPoEventId(event.id, i))];
        for (const pre of event.previousEvents) {
            variables.push(this.variable(this.getPoArcId(pre.id, event.id, i)));
            this._directlyFollowsExtractor.add(event.label, pre.label);
        }
        variables.push(this.variable(this.transitionVariableName(event.label, VariableName.INGOING_ARC_WEIGHT_PREFIX), -1));
        return this.greaterEqualThan(variables, 0).constraints;
    }
    tokenFlow(event, i) {
        const variables = [this.variable(this.getPoEventId(event.id, i))];
        for (const pre of event.previousEvents) {
            variables.push(this.variable(this.getPoArcId(pre.id, event.id, i)));
        }
        for (const post of event.nextEvents) {
            variables.push(this.variable(this.getPoArcId(event.id, post.id, i), -1));
        }
        if (event.nextEvents.size === 0) {
            variables.push(this.variable(this.getPoArcId(event.id, Ilp2MinerIlpSolver.FINAL_MARKING, i), -1));
        }
        variables.push(this.variable(this.transitionVariableName(event.label, VariableName.INGOING_ARC_WEIGHT_PREFIX), -1));
        variables.push(this.variable(this.transitionVariableName(event.label, VariableName.OUTGOING_ARC_WEIGHT_PREFIX)));
        return this.equal(variables, 0).constraints;
    }
    initialMarking(events, i) {
        const variables = events.map(e => this.variable(this.getPoEventId(e.id, i), -1));
        variables.push(this.variable(VariableName.INITIAL_MARKING));
        return this.equal(variables, 0).constraints;
    }
    getPoEventId(id, i) {
        const d = `${i}${Ilp2MinerIlpSolver.PO_ARC_SEPARATOR}${id}`;
        this._poVariableNames.add(d);
        return d;
    }
    getPoArcId(sourceId, destinationId, i) {
        const id = `${i}${Ilp2MinerIlpSolver.PO_ARC_SEPARATOR}${sourceId}${Ilp2MinerIlpSolver.PO_ARC_SEPARATOR}${destinationId}`;
        this._poVariableNames.add(id);
        return id;
    }
    branchingProcessFiringRule(event) {
        const variables = event.ingoingArcs.map(a => {
            const p = a.source;
            for (const aa of p.ingoingArcs) {
                let source = aa.source;
                this._directlyFollowsExtractor.add(event.label, source.label);
            }
            return this.variable(this.getPlaceVariable(p));
        });
        variables.push(this.variable(this.transitionVariableName(event.label, VariableName.INGOING_ARC_WEIGHT_PREFIX), -1));
        return this.greaterEqualThan(variables, 0).constraints;
    }
    branchingProcessTokenFlow(event) {
        const variables = event.ingoingArcs.map(a => this.variable(this.getPlaceVariable(a.source)));
        variables.push(this.variable(this.transitionVariableName(event.label, VariableName.INGOING_ARC_WEIGHT_PREFIX), -1));
        variables.push(this.variable(this.transitionVariableName(event.label, VariableName.OUTGOING_ARC_WEIGHT_PREFIX)));
        variables.push(...event.outgoingArcs.map(a => this.variable(this.getPlaceVariable(a.destination), -1)));
        return this.equal(variables, 0).constraints;
    }
    getPlaceVariable(place) {
        if (place.ingoingArcs.length === 0) {
            return VariableName.INITIAL_MARKING;
        }
        this._poVariableNames.add(place.id);
        return place.id;
    }
    setUpBaseIlp() {
        const goalVariables = Array.from(this._allVariables).concat(VariableName.INITIAL_MARKING);
        return {
            name: 'ilp',
            objective: {
                name: 'goal',
                direction: Goal.MINIMUM,
                // vars: goalVariables.map(v => {
                //     let coef;
                //     if (v.startsWith(VariableName.INITIAL_MARKING)) {
                //         coef = 30;
                //     } else if (v.startsWith(VariableName.OUTGOING_ARC_WEIGHT_PREFIX)) {
                //         coef = 10;
                //     } else {
                //         coef = -1;
                //     }
                //     return this.variable(v, coef);
                // })
                vars: Array.from(this._poVariableNames).map(v => {
                    return this.variable(v, 1);
                })
            },
            subjectTo: [],
            // TODO enable arc weights with a config setting?
            binaries: goalVariables,
            generals: Array.from(this._poVariableNames)
        };
    }
    populateIlp(baseIlp, baseConstraints, causalPair) {
        const result = Object.assign({}, baseIlp);
        result.subjectTo = [...baseConstraints];
        result.subjectTo = result.subjectTo.concat(this.greaterEqualThan(this.variable(this.transitionVariableName(causalPair[0], VariableName.OUTGOING_ARC_WEIGHT_PREFIX)), 1).constraints);
        result.subjectTo = result.subjectTo.concat(this.greaterEqualThan(this.variable(this.transitionVariableName(causalPair[1], VariableName.INGOING_ARC_WEIGHT_PREFIX)), 1).constraints);
        return result;
    }
}
Ilp2MinerIlpSolver.PO_ARC_SEPARATOR = '#';
Ilp2MinerIlpSolver.FINAL_MARKING = 'mf';

var LogSymbol;
(function (LogSymbol) {
    LogSymbol["START"] = "\u25B6";
    LogSymbol["STOP"] = "\u25A0";
})(LogSymbol || (LogSymbol = {}));

class Ilp2MinerService extends IlpSolverService {
    constructor(_duplicatePlaceRemover) {
        super();
        this._duplicatePlaceRemover = _duplicatePlaceRemover;
    }
    mine(pos) {
        const solver = new Ilp2MinerIlpSolver(this._solver$.asObservable());
        return solver.findSolutions(pos).pipe(map(solutions => {
            let net = new PetriNet();
            const transitionMap = new Map();
            for (const placeSolution of solutions) {
                const place = new Place();
                net.addPlace(place);
                // TODO fix the hack, if the goal variables become generals
                const goalVariables = placeSolution.ilp.binaries;
                Object.entries(placeSolution.solution.result.vars).forEach(([variable, value]) => {
                    if (!goalVariables.some(g => g === variable)) {
                        return;
                    }
                    const decoded = solver.getInverseVariableMapping(variable);
                    let t;
                    if (value === 0) {
                        return;
                    }
                    switch (decoded.type) {
                        case VariableType.INITIAL_MARKING:
                            place.marking = value;
                            return;
                        case VariableType.INGOING_WEIGHT:
                            t = this.getTransition(decoded.label, net, transitionMap);
                            net.addArc(place, t, value);
                            return;
                        case VariableType.OUTGOING_WEIGHT:
                            t = this.getTransition(decoded.label, net, transitionMap);
                            net.addArc(t, place, value);
                            return;
                    }
                });
            }
            for (const t of net.getTransitions()) {
                if (t.ingoingArcs.length === 0) {
                    const p = new Place(1);
                    net.addPlace(p);
                    net.addArc(p, t);
                }
                if (t.outgoingArcs.length === 0) {
                    const p = new Place();
                    net.addPlace(p);
                    net.addArc(t, p);
                }
            }
            net = this._duplicatePlaceRemover.removeDuplicatePlaces(net);
            this.removeArtificialStartTransition(net);
            return {
                net,
                report: [`number of inequalities: ${solutions[0].ilp.subjectTo.length - 2}`, `number of variables: ${solutions[0].ilp.binaries.length + solutions[0].ilp.generals.length}`]
            };
        }));
    }
    getTransition(label, net, map) {
        let t = map.get(label);
        if (t !== undefined) {
            return t;
        }
        t = new Transition(label);
        net.addTransition(t);
        map.set(label, t);
        return t;
    }
    removeArtificialStartTransition(net) {
        const start = net.getTransitions().find(t => t.label === LogSymbol.START);
        if (start === undefined) {
            return;
        }
        for (const outA of start.outgoingArcs) {
            const p = outA.destination;
            p.marking += p.marking + outA.weight;
        }
        for (const inA of start.ingoingArcs) {
            const p = inA.source;
            net.removePlace(p);
        }
        net.removeTransition(start);
    }
}
Ilp2MinerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: Ilp2MinerService, deps: [{ token: DuplicatePlaceRemoverService }], target: i0.ɵɵFactoryTarget.Injectable });
Ilp2MinerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: Ilp2MinerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: Ilp2MinerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: DuplicatePlaceRemoverService }]; } });

class TraceConversionResult {
    constructor(nets, labelMapping) {
        this.nets = nets;
        this.labelMapping = labelMapping;
    }
}

class AbelOracleService {
    constructor(_regionSynthesisService) {
        this._regionSynthesisService = _regionSynthesisService;
    }
    determineConcurrency(log) {
        const multisetEquivalentTraces = this.obtainMultisetEquivalentTraces(log);
        return forkJoin(multisetEquivalentTraces.map(traces => this.computePartialOrderFromEquivalentTraces(traces)));
    }
    obtainMultisetEquivalentTraces(log) {
        const explorer = new TraceMultisetEquivalentStateTraverser();
        return explorer.traverseMultisetEquivalentStates(log);
    }
    computePartialOrderFromEquivalentTraces(traces) {
        const conversionResult = this.convertTracesToPetriNets(traces.traces);
        return this._regionSynthesisService.synthesise(conversionResult.nets, { obtainPartialOrders: true, oneBoundRegions: true }).pipe(map(r => {
            const net = this.relabelNet(r.result, conversionResult.labelMapping);
            net.frequency = traces.count;
            return net;
        }));
    }
    convertTracesToPetriNets(traces) {
        const relabeler = new Relabeler();
        const nets = traces.map(trace => {
            const net = new PetriNet();
            let lastPlace = new Place();
            net.addPlace(lastPlace);
            for (const event of trace.events) {
                const t = new Transition(relabeler.getNewUniqueLabel(event.name));
                net.addTransition(t);
                net.addArc(lastPlace, t);
                lastPlace = new Place();
                net.addPlace(lastPlace);
                net.addArc(t, lastPlace);
            }
            relabeler.restartSequence();
            return net;
        });
        return new TraceConversionResult(nets, relabeler.getLabelMapping());
    }
    relabelNet(net, labelMapping) {
        net.getTransitions().forEach(t => {
            t.label = labelMapping.get(t.label);
        });
        return net;
    }
}
AbelOracleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AbelOracleService, deps: [{ token: PetriNetRegionSynthesisService }], target: i0.ɵɵFactoryTarget.Injectable });
AbelOracleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AbelOracleService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AbelOracleService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: PetriNetRegionSynthesisService }]; } });

class AlphaOracleService {
    determineConcurrency(log, config = {}) {
        if (log.length === 0) {
            return ConcurrencyRelation.noConcurrency();
        }
        const cleanedLog = cleanLog(log);
        const relabeler = new Relabeler();
        if (!!config.distinguishSameLabels) {
            relabeler.uniquelyRelabelSequences(cleanedLog);
        }
        else {
            relabeler.relabelSequencesPreserveNonUniqueIdentities(cleanedLog);
        }
        const matrix = this.computeOccurrenceMatrix(cleanedLog, config.lookAheadDistance, config.distinguishSameLabels ? OccurenceMatrixType.UNIQUE : OccurenceMatrixType.WILDCARD);
        return ConcurrencyRelation.fromOccurrenceMatrix(matrix, relabeler);
    }
    computeOccurrenceMatrix(log, lookAheadDistance = 1, matrixType = OccurenceMatrixType.UNIQUE, shouldCleanLog = false) {
        const matrix = new OccurrenceMatrix(matrixType);
        if (shouldCleanLog) {
            log = cleanLog(log);
        }
        for (const trace of log) {
            const prefix = [];
            for (const step of trace.eventNames) {
                if (prefix.length > lookAheadDistance) {
                    prefix.shift();
                }
                for (const e of prefix) {
                    matrix.add(e, step);
                }
                prefix.push(step);
            }
        }
        console.debug(matrix);
        return matrix;
    }
}
AlphaOracleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AlphaOracleService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AlphaOracleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AlphaOracleService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AlphaOracleService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class TimestampOracleService {
    determineConcurrency(log, config = {}) {
        if (log.length === 0) {
            return ConcurrencyRelation.noConcurrency();
        }
        log.forEach(t => {
            this.filterTraceAndPairStartCompleteEvents(t);
        });
        const relabeler = new Relabeler();
        if (config.distinguishSameLabels) {
            this.relabelPairedLog(log, relabeler);
        }
        else {
            relabeler.relabelSequencesPreserveNonUniqueIdentities(log);
        }
        const matrix = this.constructOccurrenceMatrix(log, !!config.distinguishSameLabels);
        return ConcurrencyRelation.fromOccurrenceMatrix(matrix, relabeler);
    }
    filterTraceAndPairStartCompleteEvents(trace) {
        const startedEvents = new Map();
        for (const e of trace.events) {
            switch (e.lifecycle) {
                case Lifecycle.START:
                    if (startedEvents.has(e.name)) {
                        throw new Error('TimestampOracle does not currently support auto-concurrency in the log!');
                    }
                    startedEvents.set(e.name, e);
                    break;
                case Lifecycle.COMPLETE:
                    if (startedEvents.has(e.name)) {
                        const pair = startedEvents.get(e.name);
                        e.setPairEvent(pair);
                        pair.setPairEvent(e);
                        startedEvents.delete(e.name);
                    }
                    break;
            }
        }
        if (startedEvents.size > 0) {
            // unpaired start events exist
            const unpaired = Array.from(startedEvents.values());
            trace.events = trace.events.filter(e => !unpaired.includes(e));
        }
    }
    relabelPairedLog(log, relabeler) {
        const filteredLog = cleanLog(log);
        relabeler.uniquelyRelabelSequences(filteredLog);
        for (const trace of filteredLog) {
            for (const event of trace.events) {
                const pair = event.getPairEvent();
                if (pair !== undefined) {
                    pair.name = event.name;
                }
            }
        }
    }
    constructOccurrenceMatrix(log, unique) {
        const matrix = new OccurrenceMatrix(unique ? OccurenceMatrixType.UNIQUE : OccurenceMatrixType.WILDCARD);
        for (const trace of log) {
            const startedEvents = new Set();
            for (const event of trace.events) {
                switch (event.lifecycle) {
                    case Lifecycle.START:
                        this.addAllInProgressToMatrix(event.name, startedEvents, matrix);
                        startedEvents.add(event.name);
                        break;
                    case Lifecycle.COMPLETE:
                        if (startedEvents.has(event.name)) {
                            startedEvents.delete(event.name);
                        }
                        else {
                            // standalone
                            this.addAllInProgressToMatrix(event.name, startedEvents, matrix);
                        }
                        break;
                }
            }
        }
        return matrix;
    }
    addAllInProgressToMatrix(started, inProgress, matrix) {
        for (const progress of inProgress) {
            matrix.add(started, progress);
            matrix.add(progress, started);
        }
    }
}
TimestampOracleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: TimestampOracleService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
TimestampOracleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: TimestampOracleService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: TimestampOracleService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class PetriNetSequence {
    constructor() {
        this._net = new PetriNet();
        this._lastPlace = new Place();
        this._net.addPlace(this._lastPlace);
        this._trace = new Trace();
    }
    get net() {
        return this._net;
    }
    get trace() {
        return this._trace;
    }
    clone() {
        const clone = new PetriNetSequence();
        clone._net = this._net.clone();
        clone._lastPlace = clone._net.getPlace(this._lastPlace.getId());
        clone._trace = this._trace.clone();
        return clone;
    }
    appendEvent(label) {
        this._trace.events.push(new LogEvent(label));
        this.appendTransition(label);
    }
    appendTransition(label) {
        const t = new Transition(label);
        this._net.addTransition(t);
        this._net.addArc(this._lastPlace, t);
        this._lastPlace = new Place();
        this._net.addPlace(this._lastPlace);
        this._net.addArc(t, this._lastPlace);
    }
}

class LogToPartialOrderTransformerService {
    constructor(_pnIsomorphismService) {
        this._pnIsomorphismService = _pnIsomorphismService;
    }
    transformToPartialOrders(log, concurrencyRelation, config = {}) {
        if (log.length === 0) {
            return [];
        }
        if (!!config.cleanLog) {
            log = cleanLog(log);
        }
        else {
            console.warn(`relabeling a log with both 'start' and 'complete' events will result in unexpected label associations!`);
        }
        concurrencyRelation.relabeler.relabelSequencesPreserveNonUniqueIdentities(log);
        const sequences = this.convertLogToPetriNetSequences(log, !!config.discardPrefixes);
        // transitive reduction requires all places to be internal => always add start/stop and remove later
        sequences.forEach(seq => {
            this.addStartAndStopEvent(seq);
        });
        const partialOrders = this.convertSequencesToPartialOrders(sequences, concurrencyRelation);
        this.removeTransitiveDependencies(partialOrders);
        if (!config.addStartStopEvent) {
            partialOrders.forEach(po => {
                this.removeStartAndStopEvent(po);
            });
        }
        const result = this.filterAndCombinePartialOrderNets(partialOrders);
        concurrencyRelation.relabeler.undoSequencesLabeling(result.map(po => new EditableStringSequenceWrapper(po.net.getTransitions())));
        return result;
    }
    convertLogToPetriNetSequences(log, discardPrefixes) {
        const netSequences = new Set();
        const tree = new PrefixTree();
        for (const trace of log) {
            const sequence = new PetriNetSequence();
            tree.insert(trace, treeNode => {
                if (discardPrefixes && treeNode.hasChildren()) {
                    return undefined;
                }
                sequence.net.frequency = 1;
                netSequences.add(sequence);
                return sequence;
            }, (node, treeNode) => {
                if (!discardPrefixes || !treeNode.hasChildren()) {
                    node.net.frequency = node.net.frequency === undefined ? 1 : node.net.frequency + 1;
                }
            }, (label, previousNode) => {
                sequence.appendEvent(label);
                if (discardPrefixes && previousNode !== undefined) {
                    netSequences.delete(previousNode);
                }
            });
        }
        return Array.from(netSequences);
    }
    addStartAndStopEvent(sequence) {
        // add events to net
        const sequenceNet = sequence.net;
        const firstLast = sequenceNet.getPlaces().filter(p => p.ingoingArcs.length === 0 || p.outgoingArcs.length === 0);
        if (firstLast.length !== 2) {
            console.debug(sequenceNet);
            throw new Error('Illegal state. A sequence must have one start and one end place.');
        }
        let first, last;
        if (firstLast[0].ingoingArcs.length === 0) {
            first = firstLast[0];
            last = firstLast[1];
        }
        else {
            first = firstLast[1];
            last = firstLast[0];
        }
        const preStart = new Place();
        const start = new Transition(LogSymbol.START);
        sequenceNet.addPlace(preStart);
        sequenceNet.addTransition(start);
        sequenceNet.addArc(preStart, start);
        sequenceNet.addArc(start, first);
        const stop = new Transition(LogSymbol.STOP);
        const postStop = new Place();
        sequenceNet.addTransition(stop);
        sequenceNet.addPlace(postStop);
        sequenceNet.addArc(last, stop);
        sequenceNet.addArc(stop, postStop);
        // add events to trace
        sequence.trace.events.unshift(new LogEvent(LogSymbol.START));
        sequence.trace.events.push(new LogEvent(LogSymbol.STOP));
    }
    removeStartAndStopEvent(partialOrder) {
        // remove from net
        const partialOrderNet = partialOrder.net;
        if (partialOrderNet.inputPlaces.size !== 1 || partialOrderNet.outputPlaces.size !== 1) {
            console.debug(partialOrderNet);
            throw new Error('illegal state');
        }
        let startTransition = undefined;
        partialOrderNet.inputPlaces.forEach(id => {
            const inPlace = partialOrderNet.getPlace(id);
            startTransition = inPlace.outgoingArcs[0].destination;
            partialOrderNet.removePlace(id);
        });
        if (startTransition === undefined || startTransition.label !== LogSymbol.START) {
            throw new Error('illegal state');
        }
        partialOrderNet.removeTransition(startTransition);
        let stopTransition = undefined;
        partialOrderNet.outputPlaces.forEach(id => {
            const outPlace = partialOrderNet.getPlace(id);
            stopTransition = outPlace.ingoingArcs[0].source;
            partialOrderNet.removePlace(id);
        });
        if (stopTransition === undefined || stopTransition.label !== LogSymbol.STOP) {
            throw new Error('illegal state');
        }
        partialOrderNet.removeTransition(stopTransition);
        // remove from trace
        partialOrder.containedTraces[0].events.shift();
        partialOrder.containedTraces[0].events.pop();
    }
    convertSequencesToPartialOrders(sequences, concurrencyRelation) {
        return sequences.map(seq => this.convertSequenceToPartialOrder(seq, concurrencyRelation));
    }
    convertSequenceToPartialOrder(sequence, concurrencyRelation) {
        const net = sequence.net;
        const placeQueue = net.getPlaces();
        while (placeQueue.length > 0) {
            const place = placeQueue.shift();
            if (place.ingoingArcs.length === 0 || place.outgoingArcs.length === 0) {
                continue;
            }
            if (place.ingoingArcs.length > 1 || place.outgoingArcs.length > 1) {
                console.debug(place);
                console.debug(sequence);
                throw new Error('Illegal state. The processed net is not a partial order!');
            }
            const preEvent = place.ingoingArcs[0].source;
            const postEvent = place.outgoingArcs[0].destination;
            if (preEvent.label === postEvent.label // no auto-concurrency
                || !concurrencyRelation.isConcurrent(preEvent.label, postEvent.label)
                || !concurrencyRelation.isConcurrent(postEvent.label, preEvent.label)) {
                continue;
            }
            net.removePlace(place);
            for (const a of preEvent.ingoingArcs) {
                const inPlace = a.source;
                if (inPlace.ingoingArcs.length === 0 && postEvent.ingoingArcs.some(a => a.source.ingoingArcs.length === 0)) {
                    continue;
                }
                if (inPlace.ingoingArcs.length > 0) {
                    const inTransId = inPlace.ingoingArcs[0].sourceId;
                    if (postEvent.ingoingArcs.some(a => { var _a; return ((_a = a.source.ingoingArcs[0]) === null || _a === void 0 ? void 0 : _a.sourceId) === inTransId; })) {
                        continue;
                    }
                }
                const clone = new Place();
                net.addPlace(clone);
                placeQueue.push(clone);
                if (inPlace.ingoingArcs.length > 0) {
                    net.addArc(inPlace.ingoingArcs[0].source, clone);
                }
                net.addArc(clone, postEvent);
            }
            for (const a of postEvent.outgoingArcs) {
                const outPlace = a.destination;
                if (outPlace.outgoingArcs.length === 0 && preEvent.outgoingArcs.some(a => a.destination.outgoingArcs.length === 0)) {
                    continue;
                }
                if (outPlace.outgoingArcs.length > 0) {
                    const outTransId = outPlace.outgoingArcs[0].destinationId;
                    if (preEvent.outgoingArcs.some(a => { var _a; return ((_a = a.destination.outgoingArcs[0]) === null || _a === void 0 ? void 0 : _a.destinationId) === outTransId; })) {
                        continue;
                    }
                }
                const clone = new Place();
                net.addPlace(clone);
                placeQueue.push(clone);
                if (outPlace.outgoingArcs.length > 0) {
                    net.addArc(clone, outPlace.outgoingArcs[0].destination);
                }
                net.addArc(preEvent, clone);
            }
        }
        return new PartialOrderNetWithContainedTraces(net, [sequence.trace]);
    }
    removeTransitiveDependencies(pos) {
        pos.forEach(po => this.performTransitiveReduction(po.net));
    }
    performTransitiveReduction(partialOrder) {
        // algorithm based on "Algorithm A" from https://www.sciencedirect.com/science/article/pii/0304397588900321
        // the paper itself offers an improvement over this Algorithm - might be useful if A proves to be too slow
        const reverseTransitionOrder = this.reverseTopologicalTransitionOrdering(partialOrder);
        const reverseOrder = new Map(reverseTransitionOrder.map((t, i) => [t.getId(), i]));
        const transitiveDescendants = new MapSet();
        const reducedDescendants = new MapSet();
        for (const t of reverseTransitionOrder) {
            transitiveDescendants.add(t.getId(), t.getId());
            const childrenIds = this.getChildIds(t).sort((id1, id2) => reverseOrder.get(id2) - reverseOrder.get(id1));
            for (const childId of childrenIds) {
                if (!transitiveDescendants.has(t.getId(), childId)) {
                    transitiveDescendants.addAll(t.getId(), transitiveDescendants.get(childId));
                    reducedDescendants.add(t.getId(), childId);
                }
            }
        }
        // remove transitive connections (places)
        for (const t of partialOrder.getTransitions()) {
            if (t.label === LogSymbol.STOP) {
                continue;
            }
            for (const a of t.outgoingArcs) {
                if (!reducedDescendants.has(t.getId(), a.destination.outgoingArcs[0].destinationId)) {
                    partialOrder.removePlace(a.destinationId);
                }
            }
        }
    }
    getChildIds(transition) {
        return transition.outgoingArcs.flatMap(a => a.destination.outgoingArcs.map(ta => ta.destination.getId()));
    }
    /**
     * Returns an array containing the transitions of the given net. The result is in reverse-topological order i.e.
     * transitions at the front of the Array appear later in the net.
     *
     * Implementation based on https://www.geeksforgeeks.org/topological-sorting/3
     * @param net a Petri Net representation of a partial order
     */
    reverseTopologicalTransitionOrdering(net) {
        const resultStack = [];
        const visited = new Set();
        for (const t of net.getTransitions()) {
            if (visited.has(t.getId())) {
                continue;
            }
            this.topologicalOrderingUtil(t, visited, resultStack);
        }
        return resultStack;
    }
    topologicalOrderingUtil(t, visited, resultStack) {
        var _a;
        visited.add(t.getId());
        for (const a of t.outgoingArcs) {
            const nextTransition = (_a = a.destination.outgoingArcs[0]) === null || _a === void 0 ? void 0 : _a.destination;
            if (nextTransition === undefined) {
                continue;
            }
            if (visited.has(nextTransition.getId())) {
                continue;
            }
            this.topologicalOrderingUtil(nextTransition, visited, resultStack);
        }
        resultStack.push(t);
    }
    filterAndCombinePartialOrderNets(partialOrders) {
        const unique = [partialOrders.shift()];
        for (const uncheckedOrder of partialOrders) {
            let discard = false;
            for (const uniqueOrder of unique) {
                if (this._pnIsomorphismService.arePartialOrderPetriNetsIsomorphic(uncheckedOrder.net, uniqueOrder.net)) {
                    discard = true;
                    uniqueOrder.net.frequency = uniqueOrder.net.frequency + uncheckedOrder.net.frequency;
                    uniqueOrder.containedTraces.push(...uncheckedOrder.containedTraces);
                    break;
                }
            }
            if (!discard) {
                unique.push(uncheckedOrder);
            }
        }
        return unique;
    }
}
LogToPartialOrderTransformerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: LogToPartialOrderTransformerService, deps: [{ token: PetriNetIsomorphismService }], target: i0.ɵɵFactoryTarget.Injectable });
LogToPartialOrderTransformerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: LogToPartialOrderTransformerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: LogToPartialOrderTransformerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: PetriNetIsomorphismService }]; } });

var FoldingStatus;
(function (FoldingStatus) {
    FoldingStatus[FoldingStatus["FOLDED"] = 1] = "FOLDED";
    FoldingStatus[FoldingStatus["CONFLICT"] = 2] = "CONFLICT";
    FoldingStatus[FoldingStatus["PENDING"] = 3] = "PENDING";
})(FoldingStatus || (FoldingStatus = {}));

class BranchingProcessFoldingService {
    constructor() {
    }
    foldPartialOrders(pos) {
        if (pos.length === 0) {
            return new PetriNet();
        }
        const result = pos[0].clone();
        this.addStartEvent(result);
        for (let i = 1; i < pos.length; i++) {
            this.addPoToBranchingProcess(pos[i], result);
        }
        return result;
    }
    addStartEvent(po) {
        const start = new Transition(LogSymbol.START);
        po.addTransition(start);
        for (const p of po.getInputPlaces()) {
            po.addArc(start, p);
        }
        const initial = new Place();
        po.addPlace(initial);
        po.addArc(initial, start);
    }
    addPoToBranchingProcess(po, result) {
        var _a;
        po = po.clone();
        this.addStartEvent(po);
        const conflictQueue = [{
                target: result.getInputPlaces()[0],
                conflict: po.getInputPlaces()[0]
            }];
        conflictResolution: while (conflictQueue.length > 0) {
            const problem = conflictQueue.shift();
            if (problem.conflict.foldingStatus === FoldingStatus.FOLDED) {
                continue;
            }
            if (problem.conflict.foldingStatus === FoldingStatus.CONFLICT) {
                conflictQueue.push(...this.addConflict(problem, result));
                continue;
            }
            const followingEvent = (_a = problem.conflict.outgoingArcs[0]) === null || _a === void 0 ? void 0 : _a.destination;
            if (followingEvent === undefined) {
                // the conflicting place has no following event => there is no conflict to resolve
                continue;
            }
            if (followingEvent.ingoingArcs.length > 1) {
                for (const a of followingEvent.ingoingArcs) {
                    const p = a.source;
                    if (p === problem.conflict) {
                        continue;
                    }
                    if (p.foldingStatus === FoldingStatus.CONFLICT) {
                        conflictQueue.push(problem);
                        problem.conflict.foldingStatus = FoldingStatus.CONFLICT;
                        continue conflictResolution;
                    }
                    if (p.foldingStatus === undefined) {
                        problem.conflict.foldingStatus = FoldingStatus.PENDING;
                        conflictQueue.push(problem);
                        continue conflictResolution;
                    }
                }
            }
            conflictQueue.push(...this.fold(problem.conflict, problem.target, followingEvent, po, result));
        }
        return result;
    }
    fold(conflict, target, followingEvent, po, result) {
        let folding;
        for (const a of target.outgoingArcs) {
            const foldedEvent = a.destination;
            if (foldedEvent.label !== followingEvent.label) {
                continue;
            }
            folding = this.attemptEventFolding(followingEvent, foldedEvent);
            if (folding !== undefined) {
                break;
            }
        }
        if (folding !== undefined) {
            // the conflict can be resolved and the target place can be folded => move the conflict to the following places
            conflict.foldingStatus = FoldingStatus.FOLDED;
            conflict.foldedPair = target;
            if (followingEvent.ingoingArcs.length > 1) {
                for (const a of followingEvent.ingoingArcs) {
                    const p = a.source;
                    if (p === conflict) {
                        continue;
                    }
                    if (p.foldingStatus !== FoldingStatus.FOLDED) {
                        return [];
                    }
                }
            }
            const r = [];
            for (const [conflictId, targetId] of folding.entries()) {
                r.push({
                    target: result.getPlace(targetId),
                    conflict: po.getPlace(conflictId)
                });
            }
            return r;
        }
        else {
            // the conflict cannot be resolved => add conflict to the folded net
            conflict.foldingStatus = FoldingStatus.CONFLICT;
            return [{ conflict, target }];
        }
    }
    attemptEventFolding(following, folded) {
        if (folded.outgoingArcs.length !== following.outgoingArcs.length) {
            return undefined;
        }
        const mapping = new Map();
        const mapped = new Set();
        const unmapped = following.outgoingArcs.map(a => a.destination);
        while (unmapped.length > 0) {
            const p = unmapped.shift();
            if (p.outgoingArcs.length === 0) {
                if (unmapped.length !== 0) {
                    unmapped.push(p);
                    continue;
                }
                else {
                    for (const af of folded.outgoingArcs) {
                        const pf = af.destination;
                        if (mapped.has(pf.id)) {
                            continue;
                        }
                        mapping.set(p.id, pf.id);
                        break;
                    }
                    break;
                }
            }
            const followLabel = p.outgoingArcs[0].destination.label;
            mappingFor: for (const af of folded.outgoingArcs) {
                const pf = af.destination;
                if (mapped.has(pf.id)) {
                    continue;
                }
                for (const ap of pf.outgoingArcs) {
                    if (ap.destination.label === followLabel) {
                        mapping.set(p.id, pf.id);
                        mapped.add(pf.id);
                        break mappingFor;
                    }
                }
            }
            if (!mapping.has(p.id)) {
                return undefined;
            }
        }
        return mapping;
    }
    addConflict(problem, folded) {
        if (problem.conflict.outgoingArcs.length === 0) {
            return [];
        }
        const original = problem.conflict.outgoingArcs[0].destination;
        let following = original.foldedPair;
        if (following === undefined) {
            following = new Transition(original.label);
            folded.addTransition(following);
        }
        folded.addArc(problem.target, following);
        if (original.foldedPair === undefined) {
            const newConflicts = [];
            for (const out of original.outgoingArcs) {
                const p = new Place();
                folded.addPlace(p);
                folded.addArc(following, p);
                newConflicts.push({ conflict: out.destination, target: p });
            }
            original.foldedPair = following;
            return newConflicts;
        }
        return [];
    }
}
BranchingProcessFoldingService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: BranchingProcessFoldingService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
BranchingProcessFoldingService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: BranchingProcessFoldingService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: BranchingProcessFoldingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

/*
 * Public API Surface of ilpn-components
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AbelOracleService, AbstractBlockParser, AlgorithmResult, AlphaOracleService, Arc, BranchingProcessFoldingService, ConcurrencyParserService, ConcurrencyRelation, ConcurrencySerialisationService, DescriptiveLinkComponent, DirectlyFollowsExtractor, DropFile, EditableStringSequenceWrapper, Event, FD_BPMN, FD_CONCURRENCY, FD_LOG, FD_PARTIAL_ORDER, FD_PETRI_NET, FD_TRANSITION_SYSTEM, FileDownloadComponent, FileReaderService, FileUploadComponent, FoldingStatus, FooterComponent, Ilp2MinerService, IlpMinerService, IlpSolver, IlpSolverService, IlpnComponentsModule, ImplicitPlaceRemoverService, IncrementingCounter, InfoCardComponent, Lifecycle, LogEvent, LogSymbol, LogToPartialOrderTransformerService, LpoFireValidator, LpoFlowValidator, MapSet, Marking, MaxFlowPreflowN3, MultisetEquivalent, MultisetEquivalentTraces, MultisetMap, OccurenceMatrixType, OccurrenceMatrix, PageLayoutComponent, PartialOrder, PartialOrderIsomorphismService, PartialOrderNetWithContainedTraces, PartialOrderParserService, PetriNet, PetriNetCoverabilityService, PetriNetIsomorphismService, PetriNetParserService, PetriNetRegionSynthesisService, PetriNetRegionTransformerService, PetriNetRegionsService, PetriNetSerialisationService, PetriNetToPartialOrderTransformerService, Place, PrefixTree, PrimeMinerResult, PrimeMinerService, Relabeler, SynthesisResult, TimestampOracleService, Trace, TraceMultisetEquivalentStateTraverser, Transition, ValidationPhase, ValidationResult, XesLogParserService, addToMultiset, arraify, cleanLog, cleanTrace, cloneMultiset, createUniqueString, mapMultiset };
//# sourceMappingURL=ilpn-components.mjs.map
