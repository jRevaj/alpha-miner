import { Component, Input } from '@angular/core';
import { saveAs } from 'file-saver';
import { downloadZip } from 'client-zip';
import * as i0 from "@angular/core";
import * as i1 from "../file-display/file-display.component";
import * as i2 from "@angular/flex-layout/flex";
export class FileDownloadComponent {
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
FileDownloadComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: FileDownloadComponent, selector: "ilpn-file-download", inputs: { descriptionText: "descriptionText", squareContent: "squareContent", showText: "showText", disabled: "disabled", files: "files", zipFileName: "zipFileName", fileDisplay: "fileDisplay", bold: "bold" }, ngImport: i0, template: "<div fxLayout=\"column\" fxLayoutAlign=\"start center\" class=\"bottom-margin\">\r\n    <span [class.hidden]=\"!showText || disabled\">{{descriptionText}}</span>\r\n    <ilpn-file-display [hover]=\"isHovered && !disabled\"\r\n                       [class.disabled]=\"disabled\"\r\n                       [fileDisplay]=\"fileDisplay\"\r\n                       [squareContent]=\"squareContent\"\r\n                       [bold]=\"bold\"\r\n                       (click)=\"download()\"\r\n                       (mouseenter)=\"hoverStart($event)\"\r\n                       (mouseleave)=\"hoverEnd($event)\">\r\n    </ilpn-file-display>\r\n</div>\r\n", styles: [".hidden{-webkit-user-select:none;user-select:none;color:#0000}.disabled{color:#d3d3d3;border-color:#d3d3d3}.bottom-margin{margin-bottom:8px}\n"], components: [{ type: i1.FileDisplayComponent, selector: "ilpn-file-display", inputs: ["bold", "squareContent", "fileDisplay", "hover"] }], directives: [{ type: i2.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { type: i2.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1kb3dubG9hZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvY29tcG9uZW50cy9pbnRlcmFjdGlvbi9maWxlLWRvd25sb2FkL2ZpbGUtZG93bmxvYWQuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2NvbXBvbmVudHMvaW50ZXJhY3Rpb24vZmlsZS1kb3dubG9hZC9maWxlLWRvd25sb2FkLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRS9DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFlBQVksQ0FBQzs7OztBQVF2QyxNQUFNLE9BQU8scUJBQXFCO0lBYTlCO1FBWFMsb0JBQWUsR0FBVyxFQUFFLENBQUM7UUFFN0IsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLFVBQUssR0FBMkMsRUFBRSxDQUFDO1FBQ25ELGdCQUFXLEdBQUcsU0FBUyxDQUFDO1FBSWpDLGNBQVMsR0FBRyxLQUFLLENBQUM7SUFHbEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUFRO1FBQ1osQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsVUFBVSxDQUFDLENBQVE7UUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBYSxFQUFFLElBQUksR0FBRyxLQUFLO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixPQUFPO1NBQ1Y7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzFCLE9BQU87U0FDVjtRQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3RELE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkQsU0FBUztZQUNULE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3BFLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hGLE9BQU87U0FDVjtRQUNELGlCQUFpQjtRQUNqQixXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdkYsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7a0hBbkRRLHFCQUFxQjtzR0FBckIscUJBQXFCLDRRQ1hsQyw0b0JBWUE7MkZERGEscUJBQXFCO2tCQUxqQyxTQUFTOytCQUNJLG9CQUFvQjswRUFNckIsZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7RHJvcEZpbGV9IGZyb20gJy4uLy4uLy4uL3V0aWxpdHkvZHJvcC1maWxlJztcclxuaW1wb3J0IHtzYXZlQXN9IGZyb20gJ2ZpbGUtc2F2ZXInO1xyXG5pbXBvcnQge2Rvd25sb2FkWmlwfSBmcm9tICdjbGllbnQtemlwJztcclxuaW1wb3J0IHtGaWxlRGlzcGxheX0gZnJvbSAnLi4vLi4vbGF5b3V0L2ZpbGUtZGlzcGxheSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnaWxwbi1maWxlLWRvd25sb2FkJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9maWxlLWRvd25sb2FkLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL2ZpbGUtZG93bmxvYWQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZURvd25sb2FkQ29tcG9uZW50IHtcclxuXHJcbiAgICBASW5wdXQoKSBkZXNjcmlwdGlvblRleHQ6IHN0cmluZyA9ICcnO1xyXG4gICAgQElucHV0KCkgc3F1YXJlQ29udGVudDogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgQElucHV0KCkgc2hvd1RleHQgPSB0cnVlO1xyXG4gICAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIGZpbGVzOiB1bmRlZmluZWQgfCBEcm9wRmlsZSB8IEFycmF5PERyb3BGaWxlPiA9IFtdO1xyXG4gICAgQElucHV0KCkgemlwRmlsZU5hbWUgPSAncmVzdWx0cyc7XHJcbiAgICBASW5wdXQoKSBmaWxlRGlzcGxheTogRmlsZURpc3BsYXkgfCB1bmRlZmluZWQ7XHJcbiAgICBASW5wdXQoKSBib2xkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGlzSG92ZXJlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHByZXZlbnQoZTogRXZlbnQpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBob3ZlclN0YXJ0KGU6IEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5wcmV2ZW50KGUpO1xyXG4gICAgICAgIHRoaXMuaXNIb3ZlcmVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBob3ZlckVuZChlOiBNb3VzZUV2ZW50LCBkcm9wID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLnByZXZlbnQoZSk7XHJcbiAgICAgICAgdGhpcy5pc0hvdmVyZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkb3dubG9hZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmZpbGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmZpbGVzKSAmJiB0aGlzLmZpbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLmZpbGVzKSB8fCB0aGlzLmZpbGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAvLyAxIGZpbGVcclxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IEFycmF5LmlzQXJyYXkodGhpcy5maWxlcykgPyB0aGlzLmZpbGVzWzBdIDogdGhpcy5maWxlcztcclxuICAgICAgICAgICAgc2F2ZUFzKG5ldyBCbG9iKFtmaWxlLmNvbnRlbnRdLCB7dHlwZTogJ3RleHQvcGxhaW47Y2hhcnNldD11dGYtOCd9KSwgZmlsZS5uYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtdWx0aXBsZSBmaWxlc1xyXG4gICAgICAgIGRvd25sb2FkWmlwKHRoaXMuZmlsZXMubWFwKGYgPT4gKHtuYW1lOiBmLm5hbWUsIGlucHV0OiBmLmNvbnRlbnR9KSkpLmJsb2IoKS50aGVuKGNvbnRlbnQgPT4ge1xyXG4gICAgICAgICAgICBzYXZlQXMoY29udGVudCwgYCR7dGhpcy56aXBGaWxlTmFtZX0uemlwYCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIjxkaXYgZnhMYXlvdXQ9XCJjb2x1bW5cIiBmeExheW91dEFsaWduPVwic3RhcnQgY2VudGVyXCIgY2xhc3M9XCJib3R0b20tbWFyZ2luXCI+XHJcbiAgICA8c3BhbiBbY2xhc3MuaGlkZGVuXT1cIiFzaG93VGV4dCB8fCBkaXNhYmxlZFwiPnt7ZGVzY3JpcHRpb25UZXh0fX08L3NwYW4+XHJcbiAgICA8aWxwbi1maWxlLWRpc3BsYXkgW2hvdmVyXT1cImlzSG92ZXJlZCAmJiAhZGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgW2ZpbGVEaXNwbGF5XT1cImZpbGVEaXNwbGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICBbc3F1YXJlQ29udGVudF09XCJzcXVhcmVDb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICBbYm9sZF09XCJib2xkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiZG93bmxvYWQoKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwiaG92ZXJTdGFydCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJob3ZlckVuZCgkZXZlbnQpXCI+XHJcbiAgICA8L2lscG4tZmlsZS1kaXNwbGF5PlxyXG48L2Rpdj5cclxuIl19