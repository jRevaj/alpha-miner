import { IdPoint } from './id-point';
export class DragPoint extends IdPoint {
    constructor(x, y, id) {
        super(x, y, id);
    }
    addArcRef(arc) {
        this._arc = arc;
    }
    svgX() {
        return 'cx';
    }
    svgY() {
        return 'cy';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1wb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9tb2RlbHMvcG4vbW9kZWwvZHJhZy1wb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBR25DLE1BQU0sT0FBTyxTQUFVLFNBQVEsT0FBTztJQUlsQyxZQUFZLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBVztRQUN6QyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRU0sU0FBUyxDQUFDLEdBQVE7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDcEIsQ0FBQztJQUVrQixJQUFJO1FBQ25CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFa0IsSUFBSTtRQUNuQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lkUG9pbnR9IGZyb20gJy4vaWQtcG9pbnQnO1xyXG5pbXBvcnQge0FyY30gZnJvbSAnLi9hcmMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERyYWdQb2ludCBleHRlbmRzIElkUG9pbnQge1xyXG5cclxuICAgIHByaXZhdGUgX2FyYzogQXJjIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCBpZD86IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHgsIHksIGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQXJjUmVmKGFyYzogQXJjKSB7XHJcbiAgICAgICAgdGhpcy5fYXJjID0gYXJjO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBzdmdYKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdjeCc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIHN2Z1koKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ2N5JztcclxuICAgIH1cclxufVxyXG4iXX0=