import { Node } from './node';
export class Transition extends Node {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNpdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9tb2RlbHMvcG4vbW9kZWwvdHJhbnNpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBSTVCLE1BQU0sT0FBTyxVQUFXLFNBQVEsSUFBSTtJQUtoQyxZQUFZLEtBQWMsRUFBRSxJQUFZLENBQUMsRUFBRSxJQUFZLENBQUMsRUFBRSxFQUFXO1FBQ2pFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUM7SUFDckMsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQXlCO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDVixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksVUFBVSxDQUFDLEtBQTZCO1FBQ3hDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFFRCxTQUFTO1FBQ0wsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQWE7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOb2RlfSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQge0VkaXRhYmxlU3RyaW5nfSBmcm9tICcuLi8uLi8uLi91dGlsaXR5L3N0cmluZy1zZXF1ZW5jZSc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zaXRpb24gZXh0ZW5kcyBOb2RlIGltcGxlbWVudHMgRWRpdGFibGVTdHJpbmcge1xyXG5cclxuICAgIHByaXZhdGUgX2xhYmVsOiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBwcml2YXRlIF9mb2xkZWRQYWlyPzogVHJhbnNpdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihsYWJlbD86IHN0cmluZywgeDogbnVtYmVyID0gMCwgeTogbnVtYmVyID0gMCwgaWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcih4LCB5LCBpZCk7XHJcbiAgICAgICAgdGhpcy5fbGFiZWwgPSBsYWJlbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGFiZWwoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzU2lsZW50KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sYWJlbCA9PT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsYWJlbCh2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5fbGFiZWwgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZm9sZGVkUGFpcigpOiBUcmFuc2l0aW9uIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9sZGVkUGFpcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZm9sZGVkUGFpcih2YWx1ZTogVHJhbnNpdGlvbiB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuX2ZvbGRlZFBhaXIgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBsID0gdGhpcy5sYWJlbDtcclxuICAgICAgICBpZiAobCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJhbnNpdGlvbiBsYWJlbCBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3RyaW5nKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxhYmVsID0gdmFsdWU7XHJcbiAgICB9XHJcbn1cclxuIl19