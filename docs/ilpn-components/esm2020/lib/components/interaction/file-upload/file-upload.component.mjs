import { Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../../../utility/file-reader.service";
import * as i2 from "../file-display/file-display.component";
import * as i3 from "@angular/flex-layout/flex";
export class FileUploadComponent {
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
        this.hoverEnd(e, true);
        this._fileReader.processFileUpload(e.dataTransfer?.files).pipe(take(1)).subscribe(result => {
            if (result.length > 0) {
                this.fileContentEmitter.emit(result);
            }
        });
    }
}
FileUploadComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileUploadComponent, deps: [{ token: i1.FileReaderService }], target: i0.ɵɵFactoryTarget.Component });
FileUploadComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: FileUploadComponent, selector: "ilpn-file-upload", inputs: { descriptionText: "descriptionText", squareContent: "squareContent", showText: "showText", fileDisplay: "fileDisplay", bold: "bold" }, outputs: { fileContentEmitter: "fileContent" }, ngImport: i0, template: "<div fxLayout=\"column\" fxLayoutAlign=\"start center\" class=\"bottom-margin\">\r\n    <span [class.hidden]=\"!showText && !isHovered\">{{descriptionText}}</span>\r\n    <ilpn-file-display [hover]=\"isHovered\"\r\n                       [fileDisplay]=\"fileDisplay\"\r\n                       [squareContent]=\"squareContent\"\r\n                       [bold]=\"bold\"\r\n                       (drag)=\"prevent($event)\"\r\n                       (dragstart)=\"prevent($event)\"\r\n                       (dragover)=\"hoverStart($event)\"\r\n                       (dragenter)=\"hoverStart($event)\"\r\n                       (dragleave)=\"hoverEnd($event)\"\r\n                       (dragend)=\"hoverEnd($event)\"\r\n                       (drop)=\"fileDrop($event)\">\r\n    </ilpn-file-display>\r\n</div>\r\n", styles: [".hidden{-webkit-user-select:none;user-select:none;color:#0000}.bottom-margin{margin-bottom:8px}\n"], components: [{ type: i2.FileDisplayComponent, selector: "ilpn-file-display", inputs: ["bold", "squareContent", "fileDisplay", "hover"] }], directives: [{ type: i3.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { type: i3.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileUploadComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ilpn-file-upload', template: "<div fxLayout=\"column\" fxLayoutAlign=\"start center\" class=\"bottom-margin\">\r\n    <span [class.hidden]=\"!showText && !isHovered\">{{descriptionText}}</span>\r\n    <ilpn-file-display [hover]=\"isHovered\"\r\n                       [fileDisplay]=\"fileDisplay\"\r\n                       [squareContent]=\"squareContent\"\r\n                       [bold]=\"bold\"\r\n                       (drag)=\"prevent($event)\"\r\n                       (dragstart)=\"prevent($event)\"\r\n                       (dragover)=\"hoverStart($event)\"\r\n                       (dragenter)=\"hoverStart($event)\"\r\n                       (dragleave)=\"hoverEnd($event)\"\r\n                       (dragend)=\"hoverEnd($event)\"\r\n                       (drop)=\"fileDrop($event)\">\r\n    </ilpn-file-display>\r\n</div>\r\n", styles: [".hidden{-webkit-user-select:none;user-select:none;color:#0000}.bottom-margin{margin-bottom:8px}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.FileReaderService }]; }, propDecorators: { fileContentEmitter: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS11cGxvYWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2NvbXBvbmVudHMvaW50ZXJhY3Rpb24vZmlsZS11cGxvYWQvZmlsZS11cGxvYWQuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2NvbXBvbmVudHMvaW50ZXJhY3Rpb24vZmlsZS11cGxvYWQvZmlsZS11cGxvYWQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVoRixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7OztBQVMxQixNQUFNLE9BQU8sbUJBQW1CO0lBWTVCLFlBQW9CLFdBQThCO1FBQTlCLGdCQUFXLEdBQVgsV0FBVyxDQUFtQjtRQVJ6QyxvQkFBZSxHQUFXLEVBQUUsQ0FBQztRQUU3QixhQUFRLEdBQUcsSUFBSSxDQUFDO1FBSXpCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFHZCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7SUFDbEUsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUFRO1FBQ1osQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsVUFBVSxDQUFDLENBQVE7UUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBYSxFQUFFLElBQUksR0FBRyxLQUFLO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVELFFBQVEsQ0FBQyxDQUFZO1FBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3ZGLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDeEM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7O2dIQTFDUSxtQkFBbUI7b0dBQW5CLG1CQUFtQix3UENYaEMsZ3pCQWVBOzJGREphLG1CQUFtQjtrQkFML0IsU0FBUzsrQkFDSSxrQkFBa0I7d0dBTUwsa0JBQWtCO3NCQUF4QyxNQUFNO3VCQUFDLGFBQWE7Z0JBRVosZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0ZpbGVSZWFkZXJTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi91dGlsaXR5L2ZpbGUtcmVhZGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge0Ryb3BGaWxlfSBmcm9tICcuLi8uLi8uLi91dGlsaXR5L2Ryb3AtZmlsZSc7XHJcbmltcG9ydCB7RmlsZURpc3BsYXl9IGZyb20gJy4uLy4uL2xheW91dC9maWxlLWRpc3BsYXknO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2lscG4tZmlsZS11cGxvYWQnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2ZpbGUtdXBsb2FkLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL2ZpbGUtdXBsb2FkLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEZpbGVVcGxvYWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xyXG5cclxuICAgIEBPdXRwdXQoJ2ZpbGVDb250ZW50JykgZmlsZUNvbnRlbnRFbWl0dGVyOiBFdmVudEVtaXR0ZXI8QXJyYXk8RHJvcEZpbGU+PjtcclxuXHJcbiAgICBASW5wdXQoKSBkZXNjcmlwdGlvblRleHQ6IHN0cmluZyA9ICcnO1xyXG4gICAgQElucHV0KCkgc3F1YXJlQ29udGVudDogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgQElucHV0KCkgc2hvd1RleHQgPSB0cnVlO1xyXG4gICAgQElucHV0KCkgZmlsZURpc3BsYXk6IEZpbGVEaXNwbGF5IHwgdW5kZWZpbmVkO1xyXG4gICAgQElucHV0KCkgYm9sZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBpc0hvdmVyZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9maWxlUmVhZGVyOiBGaWxlUmVhZGVyU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuZmlsZUNvbnRlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxEcm9wRmlsZT4+KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5maWxlQ29udGVudEVtaXR0ZXIuY29tcGxldGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmV2ZW50KGU6IEV2ZW50KSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaG92ZXJTdGFydChlOiBFdmVudCkge1xyXG4gICAgICAgIHRoaXMucHJldmVudChlKTtcclxuICAgICAgICB0aGlzLmlzSG92ZXJlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaG92ZXJFbmQoZTogTW91c2VFdmVudCwgZHJvcCA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy5wcmV2ZW50KGUpO1xyXG4gICAgICAgIHRoaXMuaXNIb3ZlcmVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsZURyb3AoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5ob3ZlckVuZChlLCB0cnVlKTtcclxuICAgICAgICB0aGlzLl9maWxlUmVhZGVyLnByb2Nlc3NGaWxlVXBsb2FkKGUuZGF0YVRyYW5zZmVyPy5maWxlcykucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVDb250ZW50RW1pdHRlci5lbWl0KHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCI8ZGl2IGZ4TGF5b3V0PVwiY29sdW1uXCIgZnhMYXlvdXRBbGlnbj1cInN0YXJ0IGNlbnRlclwiIGNsYXNzPVwiYm90dG9tLW1hcmdpblwiPlxyXG4gICAgPHNwYW4gW2NsYXNzLmhpZGRlbl09XCIhc2hvd1RleHQgJiYgIWlzSG92ZXJlZFwiPnt7ZGVzY3JpcHRpb25UZXh0fX08L3NwYW4+XHJcbiAgICA8aWxwbi1maWxlLWRpc3BsYXkgW2hvdmVyXT1cImlzSG92ZXJlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgW2ZpbGVEaXNwbGF5XT1cImZpbGVEaXNwbGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICBbc3F1YXJlQ29udGVudF09XCJzcXVhcmVDb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICBbYm9sZF09XCJib2xkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAoZHJhZyk9XCJwcmV2ZW50KCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgIChkcmFnc3RhcnQpPVwicHJldmVudCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAoZHJhZ292ZXIpPVwiaG92ZXJTdGFydCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAoZHJhZ2VudGVyKT1cImhvdmVyU3RhcnQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgKGRyYWdsZWF2ZSk9XCJob3ZlckVuZCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAoZHJhZ2VuZCk9XCJob3ZlckVuZCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAoZHJvcCk9XCJmaWxlRHJvcCgkZXZlbnQpXCI+XHJcbiAgICA8L2lscG4tZmlsZS1kaXNwbGF5PlxyXG48L2Rpdj5cclxuIl19