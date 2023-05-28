import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/flex";
import * as i2 from "@angular/flex-layout/extended";
import * as i3 from "@angular/common";
export class FileDisplayComponent {
    constructor() {
        this.bold = false;
        this.hover = false;
    }
    resolveSquareContent() {
        if (this.fileDisplay !== undefined) {
            return this.fileDisplay.icon;
        }
        return this.squareContent ?? '?';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1kaXNwbGF5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9jb21wb25lbnRzL2ludGVyYWN0aW9uL2ZpbGUtZGlzcGxheS9maWxlLWRpc3BsYXkuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2NvbXBvbmVudHMvaW50ZXJhY3Rpb24vZmlsZS1kaXNwbGF5L2ZpbGUtZGlzcGxheS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFRL0MsTUFBTSxPQUFPLG9CQUFvQjtJQUU3QjtRQUdTLFNBQUksR0FBd0IsS0FBSyxDQUFDO1FBR2xDLFVBQUssR0FBWSxLQUFLLENBQUM7SUFMaEMsQ0FBQztJQU9ELG9CQUFvQjtRQUNoQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7U0FDaEM7UUFDRCxPQUFPLElBQUksQ0FBQyxhQUFhLElBQUksR0FBRyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7U0FDakM7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsSUFBSSxNQUFNLENBQUM7UUFDWCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQ2hDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztTQUVsQzthQUFNO1lBQ0gsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDdEI7UUFDRCxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDdEMsQ0FBQzs7aUhBakNRLG9CQUFvQjtxR0FBcEIsb0JBQW9CLCtKQ1JqQyxrU0FPQTsyRkRDYSxvQkFBb0I7a0JBTGhDLFNBQVM7K0JBQ0ksbUJBQW1COzBFQVNwQixJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7RmlsZURpc3BsYXl9IGZyb20gJy4uLy4uL2xheW91dC9maWxlLWRpc3BsYXknO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2lscG4tZmlsZS1kaXNwbGF5JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9maWxlLWRpc3BsYXkuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vZmlsZS1kaXNwbGF5LmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEZpbGVEaXNwbGF5Q29tcG9uZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKSBib2xkOiBib29sZWFuIHwgdW5kZWZpbmVkID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKSBzcXVhcmVDb250ZW50OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBASW5wdXQoKSBmaWxlRGlzcGxheTogRmlsZURpc3BsYXkgfCB1bmRlZmluZWQ7XHJcbiAgICBASW5wdXQoKSBob3ZlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHJlc29sdmVTcXVhcmVDb250ZW50KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlsZURpc3BsYXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlRGlzcGxheS5pY29uO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5zcXVhcmVDb250ZW50ID8/ICc/JztcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlU3F1YXJlQ29sb3IoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5maWxlRGlzcGxheSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVEaXNwbGF5LmNvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJ2JsYWNrJztcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlRm9udFdlaWdodCgpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBpc0JvbGQ7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlsZURpc3BsYXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpc0JvbGQgPSB0aGlzLmZpbGVEaXNwbGF5LmJvbGQ7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlzQm9sZCA9IHRoaXMuYm9sZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzQm9sZCA/ICdib2xkJyA6ICdub3JtYWwnO1xyXG4gICAgfVxyXG59XHJcbiIsIjxkaXYgY2xhc3M9XCJpbnRlcmFjdGl2ZS1zcXVhcmUgbGFyZ2VyLWljb25cIlxyXG4gICAgIGZ4TGF5b3V0PVwicm93XCJcclxuICAgICBmeExheW91dEFsaWduPVwiY2VudGVyIGNlbnRlclwiXHJcbiAgICAgW25nU3R5bGVdPVwieydjb2xvcic6IHJlc29sdmVTcXVhcmVDb2xvcigpLCAnZm9udC13ZWlnaHQnOiByZXNvbHZlRm9udFdlaWdodCgpfVwiXHJcbiAgICAgW25nQ2xhc3NdPVwieydob3Zlcic6IGhvdmVyfVwiPlxyXG4gICAge3tyZXNvbHZlU3F1YXJlQ29udGVudCgpfX1cclxuPC9kaXY+XHJcbiJdfQ==