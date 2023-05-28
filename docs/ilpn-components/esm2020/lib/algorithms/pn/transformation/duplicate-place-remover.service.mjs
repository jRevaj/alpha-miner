import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class DuplicatePlaceRemoverService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVwbGljYXRlLXBsYWNlLXJlbW92ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9hbGdvcml0aG1zL3BuL3RyYW5zZm9ybWF0aW9uL2R1cGxpY2F0ZS1wbGFjZS1yZW1vdmVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFRekMsTUFBTSxPQUFPLDRCQUE0QjtJQUVyQztJQUNBLENBQUM7SUFFRDs7O09BR0c7SUFDSSxxQkFBcUIsQ0FBQyxHQUFhO1FBQ3RDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3hDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO29CQUMvQixLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN0QixNQUFNO2lCQUNUO2FBQ0o7U0FDSjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxFQUFTLEVBQUUsRUFBUztRQUN6QyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzFJLENBQUM7SUFFTyxXQUFXLENBQUMsRUFBdUIsRUFBRSxFQUF1QjtRQUNoRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRTtZQUNyQixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDdEMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sRUFBRTtnQkFDeEIsT0FBTyxLQUFLLENBQUM7YUFDaEI7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7O3lIQTFDUSw0QkFBNEI7NkhBQTVCLDRCQUE0QixjQUZ6QixNQUFNOzJGQUVULDRCQUE0QjtrQkFIeEMsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGV0cmktbmV0JztcclxuaW1wb3J0IHtQbGFjZX0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BsYWNlJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIER1cGxpY2F0ZVBsYWNlUmVtb3ZlclNlcnZpY2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIG5ldCBhIGxhYmVsZWQgUGV0cmkgTmV0IGNvbnRhaW5pbmcgZHVwbGljYXRlIHBsYWNlc1xyXG4gICAgICogQHJldHVybnMgYSBjb3B5IG9mIHRoZSBpbnB1dCBQZXRyaSBuZXQgd2l0aG91dCB0aGUgZHVwbGljYXRlIHBsYWNlc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlRHVwbGljYXRlUGxhY2VzKG5ldDogUGV0cmlOZXQpOiBQZXRyaU5ldCB7XHJcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXQuY2xvbmUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxhY2VzID0gY2xvbmUuZ2V0UGxhY2VzKCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxhY2VzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwMSA9IHBsYWNlc1tpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgcGxhY2VzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwMiA9IHBsYWNlc1tqXTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFyZVBsYWNlc1RoZVNhbWUocDEsIHAyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsb25lLnJlbW92ZVBsYWNlKHAxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXJlUGxhY2VzVGhlU2FtZShwMTogUGxhY2UsIHAyOiBQbGFjZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmVBcmNzKHAxLmluZ29pbmdBcmNXZWlnaHRzLCBwMi5pbmdvaW5nQXJjV2VpZ2h0cykgJiYgdGhpcy5jb21wYXJlQXJjcyhwMS5vdXRnb2luZ0FyY1dlaWdodHMsIHAyLm91dGdvaW5nQXJjV2VpZ2h0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb21wYXJlQXJjcyhhMTogTWFwPHN0cmluZywgbnVtYmVyPiwgYTI6IE1hcDxzdHJpbmcsIG51bWJlcj4pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoYTEuc2l6ZSAhPT0gYTIuc2l6ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3QgW3RpZCwgd2VpZ2h0XSBvZiBhMS5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgaWYgKGEyLmdldCh0aWQpICE9PSB3ZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19