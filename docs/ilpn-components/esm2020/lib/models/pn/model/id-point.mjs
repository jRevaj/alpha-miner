import { takeUntil } from 'rxjs';
import { Identifiable } from '../../../utility/get-by-id';
export class IdPoint extends Identifiable {
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
        const off = offset ?? this._svgOffset;
        this._element.setAttribute(this.svgX(), '' + (this.x + off.x));
        this._element.setAttribute(this.svgY(), '' + (this.y + off.y));
    }
    svgOffset() {
        if (this._element === undefined) {
            throw new Error('Element not set. SVG offset cannot be computed!');
        }
        return {
            x: parseInt(this._element.getAttribute(this.svgX()) ?? '0') - this.x,
            y: parseInt(this._element.getAttribute(this.svgY()) ?? '0') - this.y
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWQtcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvbW9kZWxzL3BuL21vZGVsL2lkLXBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBc0IsU0FBUyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBR3BELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUV4RCxNQUFNLE9BQU8sT0FBUSxTQUFRLFlBQVk7SUFlckMsWUFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEVBQVc7UUFDekMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBWk4sY0FBUyxHQUFHLEtBQUssQ0FBQztRQWF0QixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDLEtBQWE7UUFDZixJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxJQUFJLENBQUMsQ0FBQyxLQUFhO1FBQ2YsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE9BQU8sRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxVQUFVLENBQUMsV0FBZ0MsRUFBRSxRQUE2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QUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVyQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDdEMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLENBQUM7UUFFckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztRQUU1QixTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTyxNQUFNO1FBQ1YsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3hCO0lBQ0wsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0LCB0YWtlVW50aWx9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge01vdXNlTGlzdGVuZXJ9IGZyb20gJy4vbW91c2UtbGlzdGVuZXInO1xyXG5pbXBvcnQge1BvaW50fSBmcm9tICcuL3BvaW50JztcclxuaW1wb3J0IHtJZGVudGlmaWFibGV9IGZyb20gJy4uLy4uLy4uL3V0aWxpdHkvZ2V0LWJ5LWlkJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJZFBvaW50IGV4dGVuZHMgSWRlbnRpZmlhYmxlIGltcGxlbWVudHMgUG9pbnQsIE1vdXNlTGlzdGVuZXIge1xyXG4gICAgcHJpdmF0ZSBfeDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfeTogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgX2RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9sYXN0UG9pbnQ6IFBvaW50IHwgdW5kZWZpbmVkO1xyXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogU1ZHRWxlbWVudCB8IHVuZGVmaW5lZDtcclxuICAgIHByaXZhdGUgX3ByZURyYWdQb3NpdGlvbjogUG9pbnQ7XHJcbiAgICBwcml2YXRlIF9zdmdPZmZzZXQ6IFBvaW50IHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIHByaXZhdGUgX2xheWVyTm9kZXM6IEFycmF5PElkUG9pbnQ+IHwgdW5kZWZpbmVkO1xyXG4gICAgcHJpdmF0ZSBfbGF5ZXJJbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIHByaXZhdGUgX3JlZHJhdyQ6IFN1YmplY3Q8dm9pZD4gfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIGlkPzogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoaWQpO1xyXG4gICAgICAgIHRoaXMuX3ggPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5O1xyXG4gICAgICAgIHRoaXMuX3ByZURyYWdQb3NpdGlvbiA9IHt4LCB5fTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl94ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgeSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjZW50ZXIoKTogUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB7eDogdGhpcy54LCB5OiB0aGlzLnl9O1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmRFdmVudHMobW91c2VNb3ZlZCQ6IFN1YmplY3Q8TW91c2VFdmVudD4sIG1vdXNlVXAkOiBTdWJqZWN0PE1vdXNlRXZlbnQ+LCBraWxsJDogT2JzZXJ2YWJsZTx2b2lkPiwgcmVkcmF3JDogU3ViamVjdDx2b2lkPik6IHZvaWQge1xyXG4gICAgICAgIG1vdXNlTW92ZWQkLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZVVudGlsKGtpbGwkKSkuc3Vic2NyaWJlKGUgPT4gdGhpcy5wcm9jZXNzTW91c2VNb3ZlZChlKSk7XHJcbiAgICAgICAgbW91c2VVcCQuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlVW50aWwoa2lsbCQpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5wcm9jZXNzTW91c2VVcCgpKTtcclxuICAgICAgICB0aGlzLl9yZWRyYXckID0gcmVkcmF3JDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2Vzc01vdXNlRG93bihldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9lbGVtZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLl9kcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fcHJlRHJhZ1Bvc2l0aW9uID0ge3g6IHRoaXMueCwgeTogdGhpcy55fTtcclxuICAgICAgICB0aGlzLl9zdmdPZmZzZXQgPSB0aGlzLnN2Z09mZnNldCgpO1xyXG4gICAgICAgIHRoaXMuX2xhc3RQb2ludCA9IHt4OiBldmVudC54LCB5OiBldmVudC55fTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2Vzc01vdXNlVXAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQgPT09IHVuZGVmaW5lZCB8fCAhdGhpcy5fZHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9sYXN0UG9pbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy5fcHJlRHJhZ1Bvc2l0aW9uLng7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy5fcHJlRHJhZ1Bvc2l0aW9uLnk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTVkcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2Vzc01vdXNlTW92ZWQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2RyYWdnaW5nIHx8IHRoaXMuX2VsZW1lbnQgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl9sYXN0UG9pbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnkgKz0gZXZlbnQueSAtIHRoaXMuX2xhc3RQb2ludC55O1xyXG4gICAgICAgIHRoaXMuX2xhc3RQb2ludC54ID0gZXZlbnQueDtcclxuICAgICAgICB0aGlzLl9sYXN0UG9pbnQueSA9IGV2ZW50Lnk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTVkcoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2xheWVyTm9kZXMgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl9sYXllckluZGV4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzdGVwID0gTWF0aC5zaWduKHRoaXMueSAtIHRoaXMuX3ByZURyYWdQb3NpdGlvbi55KTtcclxuICAgICAgICBpZiAoc3RlcCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG5laWdoYm91ckluZGV4ID0gdGhpcy5fbGF5ZXJJbmRleCArIHN0ZXA7XHJcbiAgICAgICAgaWYgKG5laWdoYm91ckluZGV4IDwgMCB8fCBuZWlnaGJvdXJJbmRleCA+PSB0aGlzLl9sYXllck5vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgKHN0ZXAgPCAwICYmIHRoaXMueSA8IHRoaXMuX2xheWVyTm9kZXNbbmVpZ2hib3VySW5kZXhdLnkpXHJcbiAgICAgICAgICAgIHx8IChzdGVwID4gMCAmJiB0aGlzLnkgPiB0aGlzLl9sYXllck5vZGVzW25laWdoYm91ckluZGV4XS55KVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLnN3YXAobmVpZ2hib3VySW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckVsZW1lbnQoZWxlbWVudDogU1ZHRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQub25tb3VzZWRvd24gPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTW91c2VEb3duKGV2ZW50KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckxheWVyKGxheWVyOiBBcnJheTxJZFBvaW50PiwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2xheWVyTm9kZXMgPSBsYXllcjtcclxuICAgICAgICB0aGlzLl9sYXllckluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHN2Z1goKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ3gnO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzdmdZKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICd5JztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNWRyhvZmZzZXQ/OiBQb2ludCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9lbGVtZW50ID09PSB1bmRlZmluZWQgfHwgKHRoaXMuX3N2Z09mZnNldCA9PT0gdW5kZWZpbmVkICYmIG9mZnNldCA9PT0gdW5kZWZpbmVkKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG9mZiA9IG9mZnNldCA/PyB0aGlzLl9zdmdPZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5zdmdYKCksICcnICsgKHRoaXMueCArIChvZmYgYXMgUG9pbnQpLngpKVxyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKHRoaXMuc3ZnWSgpLCAnJyArICh0aGlzLnkgKyAob2ZmIGFzIFBvaW50KS55KSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN2Z09mZnNldCgpOiBQb2ludCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IHNldC4gU1ZHIG9mZnNldCBjYW5ub3QgYmUgY29tcHV0ZWQhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IHBhcnNlSW50KHRoaXMuX2VsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMuc3ZnWCgpKSA/PyAnMCcpIC0gdGhpcy54LFxyXG4gICAgICAgICAgICB5OiBwYXJzZUludCh0aGlzLl9lbGVtZW50LmdldEF0dHJpYnV0ZSh0aGlzLnN2Z1koKSkgPz8gJzAnKSAtIHRoaXMueVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzd2FwKG5ld0luZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fbGF5ZXJOb2RlcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX2xheWVySW5kZXggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZWlnaGJvdXIgPSB0aGlzLl9sYXllck5vZGVzW25ld0luZGV4XTtcclxuICAgICAgICBjb25zdCBuZWlnaGJvdXJQb3MgPSB7eDogbmVpZ2hib3VyLngsIHk6IG5laWdoYm91ci55fTtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSBuZWlnaGJvdXIuc3ZnT2Zmc2V0KCk7XHJcblxyXG4gICAgICAgIG5laWdoYm91ci54ID0gdGhpcy5fcHJlRHJhZ1Bvc2l0aW9uLng7XHJcbiAgICAgICAgbmVpZ2hib3VyLnkgPSB0aGlzLl9wcmVEcmFnUG9zaXRpb24ueTtcclxuICAgICAgICB0aGlzLl9wcmVEcmFnUG9zaXRpb24gPSBuZWlnaGJvdXJQb3M7XHJcblxyXG4gICAgICAgIHRoaXMuX2xheWVyTm9kZXNbdGhpcy5fbGF5ZXJJbmRleF0gPSBuZWlnaGJvdXI7XHJcbiAgICAgICAgdGhpcy5fbGF5ZXJOb2Rlc1tuZXdJbmRleF0gPSB0aGlzO1xyXG4gICAgICAgIG5laWdoYm91ci5fbGF5ZXJJbmRleCA9IHRoaXMuX2xheWVySW5kZXg7XHJcbiAgICAgICAgdGhpcy5fbGF5ZXJJbmRleCA9IG5ld0luZGV4O1xyXG5cclxuICAgICAgICBuZWlnaGJvdXIudXBkYXRlU1ZHKG9mZnNldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWRyYXcoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JlZHJhdyQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWRyYXckLm5leHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19