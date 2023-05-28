import { Identifiable } from '../../../utility/get-by-id';
export class Arc extends Identifiable {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL21vZGVscy9wbi9tb2RlbC9hcmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBRXhELE1BQU0sT0FBTyxHQUFJLFNBQVEsWUFBWTtJQU1qQyxZQUFZLEVBQVUsRUFBRSxNQUFZLEVBQUUsV0FBaUIsRUFBRSxTQUFpQixDQUFDO1FBQ3ZFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNWLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksYUFBYTtRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDWCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFhO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDZCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2YsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMvQjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2QsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMxRDtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sYUFBYSxDQUFDLEtBQWdCO1FBQ2pDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELFVBQVUsQ0FBQyxXQUFnQyxFQUFFLFFBQTZCLEVBQUUsS0FBdUIsRUFBRSxPQUFzQjtRQUN2SCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6QixDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOb2RlfSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQge0RyYWdQb2ludH0gZnJvbSAnLi9kcmFnLXBvaW50JztcclxuaW1wb3J0IHtNb3VzZUxpc3RlbmVyfSBmcm9tICcuL21vdXNlLWxpc3RlbmVyJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtJZGVudGlmaWFibGV9IGZyb20gJy4uLy4uLy4uL3V0aWxpdHkvZ2V0LWJ5LWlkJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBcmMgZXh0ZW5kcyBJZGVudGlmaWFibGUgaW1wbGVtZW50cyBNb3VzZUxpc3RlbmVyIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NvdXJjZTogTm9kZTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3RpbmF0aW9uOiBOb2RlO1xyXG4gICAgcHJpdmF0ZSBfd2VpZ2h0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9icmVha3BvaW50czogQXJyYXk8RHJhZ1BvaW50PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBzb3VyY2U6IE5vZGUsIGRlc3RpbmF0aW9uOiBOb2RlLCB3ZWlnaHQ6IG51bWJlciA9IDEpIHtcclxuICAgICAgICBzdXBlcihpZCk7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuX2Rlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XHJcbiAgICAgICAgdGhpcy5fd2VpZ2h0ID0gd2VpZ2h0O1xyXG4gICAgICAgIHRoaXMuX2JyZWFrcG9pbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5fc291cmNlLmFkZE91dGdvaW5nQXJjKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2Rlc3RpbmF0aW9uLmFkZEluZ29pbmdBcmModGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNvdXJjZUlkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZS5nZXRJZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkZXN0aW5hdGlvbklkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc3RpbmF0aW9uLmdldElkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNvdXJjZSgpOiBOb2RlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkZXN0aW5hdGlvbigpOiBOb2RlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGVzdGluYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdlaWdodCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93ZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGJyZWFrcG9pbnRzKCk6IEFycmF5PERyYWdQb2ludD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9icmVha3BvaW50cztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgd2VpZ2h0KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93ZWlnaHQgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGFzQnJlYWtwb2ludHMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JyZWFrcG9pbnRzLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZpcnN0QnJlYWtwb2ludCgpOiBEcmFnUG9pbnQge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0JyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9icmVha3BvaW50c1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmMgaGFzIG5vIGJyZWFrcG9pbnRzIScpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsYXN0QnJlYWtwb2ludCgpOiBEcmFnUG9pbnQge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0JyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9icmVha3BvaW50c1t0aGlzLl9icmVha3BvaW50cy5sZW5ndGggLSAxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmMgaGFzIG5vIGJyZWFrcG9pbnRzIScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRCcmVha3BvaW50KHBvaW50OiBEcmFnUG9pbnQpIHtcclxuICAgICAgICB0aGlzLl9icmVha3BvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICBwb2ludC5hZGRBcmNSZWYodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYmluZEV2ZW50cyhtb3VzZU1vdmVkJDogU3ViamVjdDxNb3VzZUV2ZW50PiwgbW91c2VVcCQ6IFN1YmplY3Q8TW91c2VFdmVudD4sIGtpbGwkOiBPYnNlcnZhYmxlPHZvaWQ+LCByZWRyYXckOiBTdWJqZWN0PHZvaWQ+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5icmVha3BvaW50cy5mb3JFYWNoKGIgPT4ge1xyXG4gICAgICAgICAgICBiLmJpbmRFdmVudHMobW91c2VNb3ZlZCQsIG1vdXNlVXAkLCBraWxsJCwgcmVkcmF3JCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG4iXX0=