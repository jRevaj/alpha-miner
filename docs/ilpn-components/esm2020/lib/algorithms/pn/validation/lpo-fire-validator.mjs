import { ValidationPhase, ValidationResult } from './classes/validation-result';
import { LpoFlowValidator } from './lpo-flow-validator';
export class LpoFireValidator extends LpoFlowValidator {
    constructor(petriNet, lpo) {
        super(petriNet, lpo);
        this._places = this._petriNet.getPlaces();
    }
    modifyLPO() {
        super.modifyLPO();
        this._lpo.determineInitialAndFinalEvents();
    }
    validate() {
        const totalOrder = this.buildTotalOrdering();
        totalOrder.forEach(e => e.initializeLocalMarking(this._places.length));
        // build start event
        const initialEvent = totalOrder[0];
        for (let i = 0; i < this._places.length; i++) {
            initialEvent.localMarking[i] = this._places[i].marking;
        }
        const validPlaces = this.newBoolArray(true);
        const complexPlaces = this.newBoolArray(false);
        const notValidPlaces = this.newBoolArray(false);
        // TODO timing
        let queue = [...totalOrder];
        this.fireForwards(queue, validPlaces, complexPlaces);
        // not valid places
        const finalEvent = [...this._lpo.finalEvents][0];
        for (let i = 0; i < this._places.length; i++) {
            notValidPlaces[i] = finalEvent.localMarking[i] < 0;
        }
        // Don't fire all backwards!
        queue = [finalEvent];
        for (let i = totalOrder.length - 2; i >= 0; i--) {
            totalOrder[i].initializeLocalMarking(this._places.length);
            queue.push(totalOrder[i]);
        }
        const backwardsValidPlaces = this.newBoolArray(true);
        const backwardsComplexPlaces = this.newBoolArray(false);
        // TODO timing 2
        // Is the final marking > 0 ?
        for (let i = 0; i < this._places.length; i++) {
            if (finalEvent.localMarking[i] < 0) {
                backwardsValidPlaces[i] = false;
            }
        }
        this.fireBackwards(queue, backwardsValidPlaces, backwardsComplexPlaces);
        // Rest with flow
        const flow = this.newBoolArray(false);
        for (let i = 0; i < this._places.length; i++) {
            if (!validPlaces[i] && complexPlaces[i] && !notValidPlaces[i] && !backwardsValidPlaces[i]) {
                flow[i] = this.checkFlowForPlace(this._places[i], this._lpo.events);
            }
        }
        // TODO timing 3
        // TODO stats?
        return this._places.map((p, i) => {
            if (validPlaces[i]) {
                return new ValidationResult(true, ValidationPhase.FORWARDS);
            }
            else if (backwardsValidPlaces[i]) {
                return new ValidationResult(true, ValidationPhase.BACKWARDS);
            }
            else if (flow[i]) {
                return new ValidationResult(true, ValidationPhase.FLOW);
            }
            else if (notValidPlaces[i]) {
                return new ValidationResult(false, ValidationPhase.FORWARDS);
            }
            else {
                return new ValidationResult(false, ValidationPhase.FLOW);
            }
        });
    }
    buildTotalOrdering() {
        const ordering = [...this._lpo.initialEvents];
        const contained = new Set(this._lpo.initialEvents);
        const examineLater = [...this._lpo.events];
        while (examineLater.length > 0) {
            const e = examineLater.shift();
            if (contained.has(e)) {
                continue;
            }
            let add = true;
            for (const pre of e.previousEvents) {
                if (!contained.has(pre)) {
                    add = false;
                    break;
                }
            }
            if (add) {
                ordering.push(e);
                contained.add(e);
            }
            else {
                examineLater.push(e);
            }
        }
        return ordering;
    }
    fireForwards(queue, validPlaces, complexPlaces) {
        this.fire(queue, validPlaces, complexPlaces, (t) => t.ingoingArcs, (a) => a.source, (t) => t.outgoingArcs, (a) => a.destination, (e) => e.nextEvents);
    }
    fireBackwards(queue, validPlaces, complexPlaces) {
        this.fire(queue, validPlaces, complexPlaces, (t) => t.outgoingArcs, (a) => a.destination, (t) => t.ingoingArcs, (a) => a.source, (e) => e.previousEvents);
    }
    fire(firingOrder, validPlaces, complexPlaces, preArcs, prePlace, postArcs, postPlace, nextEvents) {
        while (firingOrder.length > 0) {
            const e = firingOrder.shift();
            // can fire?
            if (e.transition !== undefined) {
                // fire
                for (const arc of preArcs(e.transition)) {
                    const pIndex = this.getPIndex(prePlace(arc));
                    e.localMarking[pIndex] = e.localMarking[pIndex] - arc.weight;
                    if (e.localMarking[pIndex] < 0) {
                        validPlaces[pIndex] = false;
                    }
                }
                for (const arc of postArcs(e.transition)) {
                    const pIndex = this.getPIndex(postPlace(arc));
                    e.localMarking[pIndex] = e.localMarking[pIndex] + arc.weight;
                }
            }
            // push to first later and check for complex places
            if (nextEvents(e).size > 0) {
                for (let i = 0; i < this._places.length; i++) {
                    if (nextEvents(e).size > 1 && e.localMarking[i] > 0) {
                        complexPlaces[i] = true;
                    }
                    const firstLater = [...nextEvents(e)][0];
                    firstLater.localMarking[i] = firstLater.localMarking[i] + e.localMarking[i];
                }
            }
        }
    }
    getPIndex(p) {
        return this._places.findIndex(pp => pp === p);
    }
    newBoolArray(fill) {
        return new Array(this._places.length).fill(fill);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHBvLWZpcmUtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2FsZ29yaXRobXMvcG4vdmFsaWRhdGlvbi9scG8tZmlyZS12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxFQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBRzlFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXRELE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxnQkFBZ0I7SUFJbEQsWUFBWSxRQUFrQixFQUFFLEdBQWlCO1FBQzdDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzlDLENBQUM7SUFFa0IsU0FBUztRQUN4QixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFUSxRQUFRO1FBQ2IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDN0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFdkUsb0JBQW9CO1FBQ3BCLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUMsWUFBWSxDQUFDLFlBQWEs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dGVudCI6WyJpbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGV0cmktbmV0JztcclxuaW1wb3J0IHtQYXJ0aWFsT3JkZXJ9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wby9tb2RlbC9wYXJ0aWFsLW9yZGVyJztcclxuaW1wb3J0IHtFdmVudH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvL21vZGVsL2V2ZW50JztcclxuaW1wb3J0IHtQbGFjZX0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BsYWNlJztcclxuaW1wb3J0IHtWYWxpZGF0aW9uUGhhc2UsIFZhbGlkYXRpb25SZXN1bHR9IGZyb20gJy4vY2xhc3Nlcy92YWxpZGF0aW9uLXJlc3VsdCc7XHJcbmltcG9ydCB7QXJjfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvYXJjJztcclxuaW1wb3J0IHtUcmFuc2l0aW9ufSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvdHJhbnNpdGlvbic7XHJcbmltcG9ydCB7THBvRmxvd1ZhbGlkYXRvcn0gZnJvbSAnLi9scG8tZmxvdy12YWxpZGF0b3InO1xyXG5cclxuZXhwb3J0IGNsYXNzIExwb0ZpcmVWYWxpZGF0b3IgZXh0ZW5kcyBMcG9GbG93VmFsaWRhdG9yIHtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9wbGFjZXM6IEFycmF5PFBsYWNlPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwZXRyaU5ldDogUGV0cmlOZXQsIGxwbzogUGFydGlhbE9yZGVyKSB7XHJcbiAgICAgICAgc3VwZXIocGV0cmlOZXQsIGxwbyk7XHJcbiAgICAgICAgdGhpcy5fcGxhY2VzID0gdGhpcy5fcGV0cmlOZXQuZ2V0UGxhY2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIG1vZGlmeUxQTygpIHtcclxuICAgICAgICBzdXBlci5tb2RpZnlMUE8oKTtcclxuICAgICAgICB0aGlzLl9scG8uZGV0ZXJtaW5lSW5pdGlhbEFuZEZpbmFsRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3ZlcnJpZGUgdmFsaWRhdGUoKTogQXJyYXk8VmFsaWRhdGlvblJlc3VsdD4ge1xyXG4gICAgICAgIGNvbnN0IHRvdGFsT3JkZXIgPSB0aGlzLmJ1aWxkVG90YWxPcmRlcmluZygpO1xyXG4gICAgICAgIHRvdGFsT3JkZXIuZm9yRWFjaChlID0+IGUuaW5pdGlhbGl6ZUxvY2FsTWFya2luZyh0aGlzLl9wbGFjZXMubGVuZ3RoKSk7XHJcblxyXG4gICAgICAgIC8vIGJ1aWxkIHN0YXJ0IGV2ZW50XHJcbiAgICAgICAgY29uc3QgaW5pdGlhbEV2ZW50ID0gdG90YWxPcmRlclswXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3BsYWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpbml0aWFsRXZlbnQubG9jYWxNYXJraW5nIVtpXSA9IHRoaXMuX3BsYWNlc1tpXS5tYXJraW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdmFsaWRQbGFjZXMgPSB0aGlzLm5ld0Jvb2xBcnJheSh0cnVlKTtcclxuICAgICAgICBjb25zdCBjb21wbGV4UGxhY2VzID0gdGhpcy5uZXdCb29sQXJyYXkoZmFsc2UpO1xyXG4gICAgICAgIGNvbnN0IG5vdFZhbGlkUGxhY2VzID0gdGhpcy5uZXdCb29sQXJyYXkoZmFsc2UpO1xyXG5cclxuICAgICAgICAvLyBUT0RPIHRpbWluZ1xyXG5cclxuICAgICAgICBsZXQgcXVldWUgPSBbLi4udG90YWxPcmRlcl07XHJcbiAgICAgICAgdGhpcy5maXJlRm9yd2FyZHMocXVldWUsIHZhbGlkUGxhY2VzLCBjb21wbGV4UGxhY2VzKTtcclxuXHJcbiAgICAgICAgLy8gbm90IHZhbGlkIHBsYWNlc1xyXG4gICAgICAgIGNvbnN0IGZpbmFsRXZlbnQgPSBbLi4udGhpcy5fbHBvLmZpbmFsRXZlbnRzXVswXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3BsYWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBub3RWYWxpZFBsYWNlc1tpXSA9IGZpbmFsRXZlbnQubG9jYWxNYXJraW5nIVtpXSA8IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEb24ndCBmaXJlIGFsbCBiYWNrd2FyZHMhXHJcbiAgICAgICAgcXVldWUgPSBbZmluYWxFdmVudF07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRvdGFsT3JkZXIubGVuZ3RoIC0gMjsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgdG90YWxPcmRlcltpXS5pbml0aWFsaXplTG9jYWxNYXJraW5nKHRoaXMuX3BsYWNlcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBxdWV1ZS5wdXNoKHRvdGFsT3JkZXJbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYmFja3dhcmRzVmFsaWRQbGFjZXMgPSB0aGlzLm5ld0Jvb2xBcnJheSh0cnVlKTtcclxuICAgICAgICBjb25zdCBiYWNrd2FyZHNDb21wbGV4UGxhY2VzID0gdGhpcy5uZXdCb29sQXJyYXkoZmFsc2UpO1xyXG5cclxuICAgICAgICAvLyBUT0RPIHRpbWluZyAyXHJcblxyXG4gICAgICAgIC8vIElzIHRoZSBmaW5hbCBtYXJraW5nID4gMCA/XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9wbGFjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGZpbmFsRXZlbnQubG9jYWxNYXJraW5nIVtpXSA8IDApIHtcclxuICAgICAgICAgICAgICAgIGJhY2t3YXJkc1ZhbGlkUGxhY2VzW2ldID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmlyZUJhY2t3YXJkcyhxdWV1ZSwgYmFja3dhcmRzVmFsaWRQbGFjZXMsIGJhY2t3YXJkc0NvbXBsZXhQbGFjZXMpO1xyXG5cclxuICAgICAgICAvLyBSZXN0IHdpdGggZmxvd1xyXG4gICAgICAgIGNvbnN0IGZsb3cgPSB0aGlzLm5ld0Jvb2xBcnJheShmYWxzZSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9wbGFjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF2YWxpZFBsYWNlc1tpXSAmJiBjb21wbGV4UGxhY2VzW2ldICYmICFub3RWYWxpZFBsYWNlc1tpXSAmJiAhYmFja3dhcmRzVmFsaWRQbGFjZXNbaV0pIHtcclxuICAgICAgICAgICAgICAgIGZsb3dbaV0gPSB0aGlzLmNoZWNrRmxvd0ZvclBsYWNlKHRoaXMuX3BsYWNlc1tpXSwgdGhpcy5fbHBvLmV2ZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE8gdGltaW5nIDNcclxuXHJcbiAgICAgICAgLy8gVE9ETyBzdGF0cz9cclxuICAgICAgICByZXR1cm4gdGhpcy5fcGxhY2VzLm1hcCgocCwgaSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodmFsaWRQbGFjZXNbaV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdCh0cnVlLCBWYWxpZGF0aW9uUGhhc2UuRk9SV0FSRFMpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhY2t3YXJkc1ZhbGlkUGxhY2VzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQodHJ1ZSwgVmFsaWRhdGlvblBoYXNlLkJBQ0tXQVJEUyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmxvd1tpXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KHRydWUsIFZhbGlkYXRpb25QaGFzZS5GTE9XKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChub3RWYWxpZFBsYWNlc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGZhbHNlLCBWYWxpZGF0aW9uUGhhc2UuRk9SV0FSRFMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGZhbHNlLCBWYWxpZGF0aW9uUGhhc2UuRkxPVyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJ1aWxkVG90YWxPcmRlcmluZygpOiBBcnJheTxFdmVudD4ge1xyXG4gICAgICAgIGNvbnN0IG9yZGVyaW5nOiBBcnJheTxFdmVudD4gPSBbLi4udGhpcy5fbHBvLmluaXRpYWxFdmVudHNdO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lZDogU2V0PEV2ZW50PiA9IG5ldyBTZXQ8RXZlbnQ+KHRoaXMuX2xwby5pbml0aWFsRXZlbnRzKTtcclxuXHJcbiAgICAgICAgY29uc3QgZXhhbWluZUxhdGVyOiBBcnJheTxFdmVudD4gPSBbLi4udGhpcy5fbHBvLmV2ZW50c107XHJcbiAgICAgICAgd2hpbGUgKGV4YW1pbmVMYXRlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGUgPSBleGFtaW5lTGF0ZXIuc2hpZnQoKSBhcyBFdmVudDtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lZC5oYXMoZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBwcmUgb2YgZS5wcmV2aW91c0V2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjb250YWluZWQuaGFzKHByZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYWRkKSB7XHJcbiAgICAgICAgICAgICAgICBvcmRlcmluZy5wdXNoKGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVkLmFkZChlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV4YW1pbmVMYXRlci5wdXNoKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3JkZXJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaXJlRm9yd2FyZHMocXVldWU6IEFycmF5PEV2ZW50PiwgdmFsaWRQbGFjZXM6IEFycmF5PGJvb2xlYW4+LCBjb21wbGV4UGxhY2VzOiBBcnJheTxib29sZWFuPikge1xyXG4gICAgICAgIHRoaXMuZmlyZShxdWV1ZSwgdmFsaWRQbGFjZXMsIGNvbXBsZXhQbGFjZXMsXHJcbiAgICAgICAgICAgICh0KSA9PiB0LmluZ29pbmdBcmNzLFxyXG4gICAgICAgICAgICAoYSkgPT4gYS5zb3VyY2UgYXMgUGxhY2UsXHJcbiAgICAgICAgICAgICh0KSA9PiB0Lm91dGdvaW5nQXJjcyxcclxuICAgICAgICAgICAgKGEpID0+IGEuZGVzdGluYXRpb24gYXMgUGxhY2UsXHJcbiAgICAgICAgICAgIChlKSA9PiBlLm5leHRFdmVudHNcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlyZUJhY2t3YXJkcyhxdWV1ZTogQXJyYXk8RXZlbnQ+LCB2YWxpZFBsYWNlczogQXJyYXk8Ym9vbGVhbj4sIGNvbXBsZXhQbGFjZXM6IEFycmF5PGJvb2xlYW4+KSB7XHJcbiAgICAgICAgdGhpcy5maXJlKHF1ZXVlLCB2YWxpZFBsYWNlcywgY29tcGxleFBsYWNlcyxcclxuICAgICAgICAgICAgKHQpID0+IHQub3V0Z29pbmdBcmNzLFxyXG4gICAgICAgICAgICAoYSkgPT4gYS5kZXN0aW5hdGlvbiBhcyBQbGFjZSxcclxuICAgICAgICAgICAgKHQpID0+IHQuaW5nb2luZ0FyY3MsXHJcbiAgICAgICAgICAgIChhKSA9PiBhLnNvdXJjZSBhcyBQbGFjZSxcclxuICAgICAgICAgICAgKGUpID0+IGUucHJldmlvdXNFdmVudHNcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlyZShmaXJpbmdPcmRlcjogQXJyYXk8RXZlbnQ+LCB2YWxpZFBsYWNlczogQXJyYXk8Ym9vbGVhbj4sIGNvbXBsZXhQbGFjZXM6IEFycmF5PGJvb2xlYW4+LFxyXG4gICAgICAgICAgICAgICAgIHByZUFyY3M6ICh0OiBUcmFuc2l0aW9uKSA9PiBBcnJheTxBcmM+LCBwcmVQbGFjZTogKGE6IEFyYykgPT4gUGxhY2UsXHJcbiAgICAgICAgICAgICAgICAgcG9zdEFyY3M6ICh0OiBUcmFuc2l0aW9uKSA9PiBBcnJheTxBcmM+LCBwb3N0UGxhY2U6IChhOiBBcmMpID0+IFBsYWNlLFxyXG4gICAgICAgICAgICAgICAgIG5leHRFdmVudHM6IChlOiBFdmVudCkgPT4gU2V0PEV2ZW50Pikge1xyXG4gICAgICAgIHdoaWxlIChmaXJpbmdPcmRlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGUgPSBmaXJpbmdPcmRlci5zaGlmdCgpIGFzIEV2ZW50O1xyXG5cclxuICAgICAgICAgICAgLy8gY2FuIGZpcmU/XHJcbiAgICAgICAgICAgIGlmIChlLnRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmlyZVxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBhcmMgb2YgcHJlQXJjcyhlLnRyYW5zaXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcEluZGV4ID0gdGhpcy5nZXRQSW5kZXgocHJlUGxhY2UoYXJjKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5sb2NhbE1hcmtpbmchW3BJbmRleF0gPSBlLmxvY2FsTWFya2luZyFbcEluZGV4XSAtIGFyYy53ZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubG9jYWxNYXJraW5nIVtwSW5kZXhdIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZFBsYWNlc1twSW5kZXhdID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXJjIG9mIHBvc3RBcmNzKGUudHJhbnNpdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwSW5kZXggPSB0aGlzLmdldFBJbmRleChwb3N0UGxhY2UoYXJjKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5sb2NhbE1hcmtpbmchW3BJbmRleF0gPSBlLmxvY2FsTWFya2luZyFbcEluZGV4XSArIGFyYy53ZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHB1c2ggdG8gZmlyc3QgbGF0ZXIgYW5kIGNoZWNrIGZvciBjb21wbGV4IHBsYWNlc1xyXG4gICAgICAgICAgICBpZiAobmV4dEV2ZW50cyhlKS5zaXplID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9wbGFjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEV2ZW50cyhlKS5zaXplID4gMSAmJiBlLmxvY2FsTWFya2luZyFbaV0gPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXhQbGFjZXNbaV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaXJzdExhdGVyID0gWy4uLm5leHRFdmVudHMoZSldWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0TGF0ZXIubG9jYWxNYXJraW5nIVtpXSA9IGZpcnN0TGF0ZXIubG9jYWxNYXJraW5nIVtpXSArIGUubG9jYWxNYXJraW5nIVtpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFBJbmRleChwOiBQbGFjZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wbGFjZXMuZmluZEluZGV4KHBwID0+IHBwID09PSBwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG5ld0Jvb2xBcnJheShmaWxsOiBib29sZWFuKTogQXJyYXk8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXk8Ym9vbGVhbj4odGhpcy5fcGxhY2VzLmxlbmd0aCkuZmlsbChmaWxsKTtcclxuICAgIH1cclxufVxyXG4iXX0=