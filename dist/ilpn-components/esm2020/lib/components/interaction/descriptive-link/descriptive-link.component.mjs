import { Component, Inject, Input } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "../info-card/info-card.component";
import * as i2 from "@angular/common";
export class DescriptiveLinkComponent {
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
DescriptiveLinkComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: DescriptiveLinkComponent, selector: "ilpn-descriptive-link", inputs: { squareContent: "squareContent", title: "title", description: "description", fileDisplay: "fileDisplay", disabled: "disabled", descriptionLines: "descriptionLines", link: "link", download: "download" }, ngImport: i0, template: "<!-- single link -->\r\n<ng-template [ngIf]=\"type() === 'anchor'\">\r\n    <a class=\"link\" [href]=\"resolveAnchorLink()\" [attr.download]=\"download ? '' : null\">\r\n        <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                        [squareContent]=\"squareContent\"\r\n                        [description]=\"description\"\r\n                        [title]=\"title\"\r\n                        [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n    </a>\r\n</ng-template>\r\n\r\n<!-- multiple links -->\r\n<ng-template [ngIf]=\"type() === 'button'\">\r\n    <button class=\"buttonStyle\" (click)=\"buttonClick()\">\r\n        <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                        [squareContent]=\"squareContent\"\r\n                        [description]=\"description\"\r\n                        [title]=\"title\"\r\n                        [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n    </button>\r\n</ng-template>\r\n\r\n<!-- descriptive link disabled -->\r\n<ng-template [ngIf]=\"type() === 'disabled'\">\r\n    <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                    [squareContent]=\"squareContent\"\r\n                    [description]=\"description\"\r\n                    [title]=\"title\"\r\n                    [disabled]=\"true\"\r\n                    [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n</ng-template>\r\n", styles: [".link{color:#000}.buttonStyle{border:none;background:none;font-family:inherit;cursor:pointer;padding:0}\n"], components: [{ type: i1.InfoCardComponent, selector: "ilpn-info-card", inputs: ["squareContent", "title", "description", "fileDisplay", "disabled", "descriptionLines"] }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: DescriptiveLinkComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ilpn-descriptive-link', template: "<!-- single link -->\r\n<ng-template [ngIf]=\"type() === 'anchor'\">\r\n    <a class=\"link\" [href]=\"resolveAnchorLink()\" [attr.download]=\"download ? '' : null\">\r\n        <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                        [squareContent]=\"squareContent\"\r\n                        [description]=\"description\"\r\n                        [title]=\"title\"\r\n                        [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n    </a>\r\n</ng-template>\r\n\r\n<!-- multiple links -->\r\n<ng-template [ngIf]=\"type() === 'button'\">\r\n    <button class=\"buttonStyle\" (click)=\"buttonClick()\">\r\n        <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                        [squareContent]=\"squareContent\"\r\n                        [description]=\"description\"\r\n                        [title]=\"title\"\r\n                        [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n    </button>\r\n</ng-template>\r\n\r\n<!-- descriptive link disabled -->\r\n<ng-template [ngIf]=\"type() === 'disabled'\">\r\n    <ilpn-info-card [fileDisplay]=\"fileDisplay\"\r\n                    [squareContent]=\"squareContent\"\r\n                    [description]=\"description\"\r\n                    [title]=\"title\"\r\n                    [disabled]=\"true\"\r\n                    [descriptionLines]=\"descriptionLines\"></ilpn-info-card>\r\n</ng-template>\r\n", styles: [".link{color:#000}.buttonStyle{border:none;background:none;font-family:inherit;cursor:pointer;padding:0}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [APP_BASE_HREF]
                }] }]; }, propDecorators: { squareContent: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzY3JpcHRpdmUtbGluay5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvY29tcG9uZW50cy9pbnRlcmFjdGlvbi9kZXNjcmlwdGl2ZS1saW5rL2Rlc2NyaXB0aXZlLWxpbmsuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2NvbXBvbmVudHMvaW50ZXJhY3Rpb24vZGVzY3JpcHRpdmUtbGluay9kZXNjcmlwdGl2ZS1saW5rLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7QUFROUMsTUFBTSxPQUFPLHdCQUF3QjtJQVlqQyxZQUEwQyxRQUFnQjtRQUFoQixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBVmpELGtCQUFhLEdBQVcsR0FBRyxDQUFDO1FBQzVCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFFekIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixxQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFHckIsYUFBUSxHQUFHLEtBQUssQ0FBQztJQUcxQixDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLE9BQU8sVUFBVSxDQUFDO1NBQ3JCO1FBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDakIsT0FBTyxRQUFRLENBQUM7U0FDbkI7YUFBTTtZQUNILE9BQU8sUUFBUSxDQUFDO1NBQ25CO0lBRUwsQ0FBQztJQUVELGlCQUFpQjtRQUNiLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFjLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQzVDLE9BQU87U0FDVjtRQUVELE1BQU0sS0FBSyxHQUFJLElBQUksQ0FBQyxJQUFzQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9FLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQztJQUNMLENBQUM7SUFFTyxRQUFRO1FBQ1osT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxJQUFZO1FBQ2xDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QixPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBRU8sa0JBQWtCLENBQUMsSUFBWTtRQUNuQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN6QixDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNWLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLENBQUM7O3FIQTlEUSx3QkFBd0Isa0JBWWIsYUFBYTt5R0FaeEIsd0JBQXdCLGlSQ1RyQyxvNUNBK0JBOzJGRHRCYSx3QkFBd0I7a0JBTHBDLFNBQVM7K0JBQ0ksdUJBQXVCOzswQkFnQnBCLE1BQU07MkJBQUMsYUFBYTs0Q0FWeEIsYUFBYTtzQkFBckIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEluamVjdCwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0FQUF9CQVNFX0hSRUZ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7RmlsZURpc3BsYXl9IGZyb20gJy4uLy4uL2xheW91dC9maWxlLWRpc3BsYXknO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2lscG4tZGVzY3JpcHRpdmUtbGluaycsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vZGVzY3JpcHRpdmUtbGluay5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9kZXNjcmlwdGl2ZS1saW5rLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIERlc2NyaXB0aXZlTGlua0NvbXBvbmVudCB7XHJcblxyXG4gICAgQElucHV0KCkgc3F1YXJlQ29udGVudDogc3RyaW5nID0gJz8nO1xyXG4gICAgQElucHV0KCkgdGl0bGU6IHN0cmluZyA9ICcnO1xyXG4gICAgQElucHV0KCkgZGVzY3JpcHRpb246IHN0cmluZyA9ICcnO1xyXG4gICAgQElucHV0KCkgZmlsZURpc3BsYXk6IEZpbGVEaXNwbGF5IHwgdW5kZWZpbmVkO1xyXG4gICAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIGRlc2NyaXB0aW9uTGluZXMgPSAzO1xyXG5cclxuICAgIEBJbnB1dCgpIGxpbms6IEFycmF5PHN0cmluZz4gfCBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBASW5wdXQoKSBkb3dubG9hZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoQVBQX0JBU0VfSFJFRikgcHVibGljIGJhc2VIcmVmOiBzdHJpbmcpIHtcclxuICAgIH1cclxuXHJcbiAgICB0eXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdkaXNhYmxlZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzQW5jaG9yKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdhbmNob3InO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnYnV0dG9uJztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVBbmNob3JMaW5rKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZVNpbmdsZUxpbmsodGhpcy5saW5rIGFzIHN0cmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgYnV0dG9uQ2xpY2soKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGluayA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuaXNBbmNob3IoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsaW5rcyA9ICh0aGlzLmxpbmsgYXMgQXJyYXk8c3RyaW5nPikubWFwKGwgPT4gdGhpcy5yZXNvbHZlU2luZ2xlTGluayhsKSk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgbGluayBvZiBsaW5rcykge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZURvd25sb2FkTGluayhsaW5rKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc0FuY2hvcigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5saW5rICE9PSB1bmRlZmluZWQgJiYgIUFycmF5LmlzQXJyYXkodGhpcy5saW5rKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc29sdmVTaW5nbGVMaW5rKGxpbms6IHN0cmluZykge1xyXG4gICAgICAgIGlmIChsaW5rLnN0YXJ0c1dpdGgoJ2h0dHAnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGluaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZUhyZWYgKyBsaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlRG93bmxvYWRMaW5rKGxpbms6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGEuaHJlZiA9IGxpbms7XHJcbiAgICAgICAgYS5kb3dubG9hZCA9ICcnO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgYS5jbGljaygpO1xyXG4gICAgICAgIGEucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIjwhLS0gc2luZ2xlIGxpbmsgLS0+XHJcbjxuZy10ZW1wbGF0ZSBbbmdJZl09XCJ0eXBlKCkgPT09ICdhbmNob3InXCI+XHJcbiAgICA8YSBjbGFzcz1cImxpbmtcIiBbaHJlZl09XCJyZXNvbHZlQW5jaG9yTGluaygpXCIgW2F0dHIuZG93bmxvYWRdPVwiZG93bmxvYWQgPyAnJyA6IG51bGxcIj5cclxuICAgICAgICA8aWxwbi1pbmZvLWNhcmQgW2ZpbGVEaXNwbGF5XT1cImZpbGVEaXNwbGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3NxdWFyZUNvbnRlbnRdPVwic3F1YXJlQ29udGVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl09XCJkZXNjcmlwdGlvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFt0aXRsZV09XCJ0aXRsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbkxpbmVzXT1cImRlc2NyaXB0aW9uTGluZXNcIj48L2lscG4taW5mby1jYXJkPlxyXG4gICAgPC9hPlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPCEtLSBtdWx0aXBsZSBsaW5rcyAtLT5cclxuPG5nLXRlbXBsYXRlIFtuZ0lmXT1cInR5cGUoKSA9PT0gJ2J1dHRvbidcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b25TdHlsZVwiIChjbGljayk9XCJidXR0b25DbGljaygpXCI+XHJcbiAgICAgICAgPGlscG4taW5mby1jYXJkIFtmaWxlRGlzcGxheV09XCJmaWxlRGlzcGxheVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzcXVhcmVDb250ZW50XT1cInNxdWFyZUNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dPVwiZGVzY3JpcHRpb25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbdGl0bGVdPVwidGl0bGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25MaW5lc109XCJkZXNjcmlwdGlvbkxpbmVzXCI+PC9pbHBuLWluZm8tY2FyZD5cclxuICAgIDwvYnV0dG9uPlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPCEtLSBkZXNjcmlwdGl2ZSBsaW5rIGRpc2FibGVkIC0tPlxyXG48bmctdGVtcGxhdGUgW25nSWZdPVwidHlwZSgpID09PSAnZGlzYWJsZWQnXCI+XHJcbiAgICA8aWxwbi1pbmZvLWNhcmQgW2ZpbGVEaXNwbGF5XT1cImZpbGVEaXNwbGF5XCJcclxuICAgICAgICAgICAgICAgICAgICBbc3F1YXJlQ29udGVudF09XCJzcXVhcmVDb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dPVwiZGVzY3JpcHRpb25cIlxyXG4gICAgICAgICAgICAgICAgICAgIFt0aXRsZV09XCJ0aXRsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbkxpbmVzXT1cImRlc2NyaXB0aW9uTGluZXNcIj48L2lscG4taW5mby1jYXJkPlxyXG48L25nLXRlbXBsYXRlPlxyXG4iXX0=