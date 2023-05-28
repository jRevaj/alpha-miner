import { IdPoint } from './id-point';
import { getById } from '../../../utility/get-by-id';
export class Node extends IdPoint {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9tb2RlbHMvcG4vbW9kZWwvbm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUVuRCxNQUFNLE9BQU8sSUFBSyxTQUFRLE9BQU87SUFRN0IsWUFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEVBQVc7UUFDekMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO1FBQzNDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQztRQUM1QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFDcEQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO0lBQ3pELENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDWCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDWixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxJQUFJLGlCQUFpQjtRQUNqQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBSSxrQkFBa0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUM7SUFDcEMsQ0FBQztJQUVNLGNBQWMsQ0FBQyxHQUFRO1FBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTSxhQUFhLENBQUMsR0FBUTtRQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU0sU0FBUyxDQUFDLEdBQWlCO1FBQzlCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUNqQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUNqQixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzlDO0lBQ0wsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBcmN9IGZyb20gJy4vYXJjJztcclxuaW1wb3J0IHtJZFBvaW50fSBmcm9tICcuL2lkLXBvaW50JztcclxuaW1wb3J0IHtnZXRCeUlkfSBmcm9tICcuLi8uLi8uLi91dGlsaXR5L2dldC1ieS1pZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTm9kZSBleHRlbmRzIElkUG9pbnQge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2luZ29pbmdBcmNzOiBNYXA8c3RyaW5nLCBBcmM+O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfb3V0Z29pbmdBcmNzOiBNYXA8c3RyaW5nLCBBcmM+O1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2luZ29pbmdBcmNXZWlnaHRzOiBNYXA8c3RyaW5nLCBudW1iZXI+O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfb3V0Z29pbmdBcmNXZWlnaHRzOiBNYXA8c3RyaW5nLCBudW1iZXI+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCBpZD86IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHgsIHksIGlkKTtcclxuICAgICAgICB0aGlzLl9pbmdvaW5nQXJjcyA9IG5ldyBNYXA8c3RyaW5nLCBBcmM+KCk7XHJcbiAgICAgICAgdGhpcy5fb3V0Z29pbmdBcmNzID0gbmV3IE1hcDxzdHJpbmcsIEFyYz4oKTtcclxuICAgICAgICB0aGlzLl9pbmdvaW5nQXJjV2VpZ2h0cyA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XHJcbiAgICAgICAgdGhpcy5fb3V0Z29pbmdBcmNXZWlnaHRzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW5nb2luZ0FyY3MoKTogQXJyYXk8QXJjPiB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5faW5nb2luZ0FyY3MudmFsdWVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBvdXRnb2luZ0FyY3MoKTogQXJyYXk8QXJjPiB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fb3V0Z29pbmdBcmNzLnZhbHVlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW5nb2luZ0FyY1dlaWdodHMoKTogTWFwPHN0cmluZywgbnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luZ29pbmdBcmNXZWlnaHRzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBvdXRnb2luZ0FyY1dlaWdodHMoKTogTWFwPHN0cmluZywgbnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX291dGdvaW5nQXJjV2VpZ2h0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkT3V0Z29pbmdBcmMoYXJjOiBBcmMpIHtcclxuICAgICAgICB0aGlzLl9vdXRnb2luZ0FyY3Muc2V0KGFyYy5nZXRJZCgpLCBhcmMpO1xyXG4gICAgICAgIHRoaXMuX291dGdvaW5nQXJjV2VpZ2h0cy5zZXQoYXJjLmRlc3RpbmF0aW9uSWQsIGFyYy53ZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRJbmdvaW5nQXJjKGFyYzogQXJjKSB7XHJcbiAgICAgICAgdGhpcy5faW5nb2luZ0FyY3Muc2V0KGFyYy5nZXRJZCgpLCBhcmMpO1xyXG4gICAgICAgIHRoaXMuX2luZ29pbmdBcmNXZWlnaHRzLnNldChhcmMuc291cmNlSWQsIGFyYy53ZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVBcmMoYXJjOiBBcmMgfCBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgYSA9IGdldEJ5SWQodGhpcy5faW5nb2luZ0FyY3MsIGFyYyk7XHJcbiAgICAgICAgaWYgKGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbmdvaW5nQXJjcy5kZWxldGUoYS5nZXRJZCgpKTtcclxuICAgICAgICAgICAgdGhpcy5faW5nb2luZ0FyY1dlaWdodHMuZGVsZXRlKGEuZ2V0SWQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGEgPSBnZXRCeUlkKHRoaXMuX291dGdvaW5nQXJjcywgYXJjKTtcclxuICAgICAgICBpZiAoYSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGdvaW5nQXJjcy5kZWxldGUoYS5nZXRJZCgpKTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0Z29pbmdBcmNXZWlnaHRzLmRlbGV0ZShhLmdldElkKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=