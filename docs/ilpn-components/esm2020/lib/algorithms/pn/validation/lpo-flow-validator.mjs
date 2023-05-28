import { MaxFlowPreflowN3 } from '../../flow-network/max-flow-preflow-n3';
import { LpoValidator } from './classes/lpo-validator';
import { ValidationPhase, ValidationResult } from './classes/validation-result';
export class LpoFlowValidator extends LpoValidator {
    constructor(petriNet, lpo) {
        super(petriNet, lpo);
    }
    validate() {
        const flow = [];
        const places = this._petriNet.getPlaces();
        const events = this._lpo.events;
        for (let i = 0; i < places.length; i++) {
            const place = places[i];
            flow[i] = new ValidationResult(this.checkFlowForPlace(place, events), ValidationPhase.FLOW);
        }
        return flow;
    }
    checkFlowForPlace(place, events) {
        const n = events.length * 2 + 2;
        const SOURCE = 0;
        const SINK = n - 1;
        const network = new MaxFlowPreflowN3(n);
        for (let eIndex = 0; eIndex < events.length; eIndex++) {
            network.setUnbounded(this.eventStart(eIndex), this.eventEnd(eIndex));
            const event = events[eIndex];
            if (event.transition === undefined) {
                if (place.marking > 0) {
                    network.setCap(SOURCE, this.eventEnd(eIndex), place.marking);
                }
            }
            else {
                for (const outArc of event.transition.outgoingArcs) {
                    const postPlace = outArc.destination;
                    if (postPlace === place) {
                        network.setCap(SOURCE, this.eventEnd(eIndex), outArc.weight);
                    }
                }
                for (const inArc of event.transition.ingoingArcs) {
                    const prePlace = inArc.source;
                    if (prePlace === place) {
                        network.setCap(this.eventStart(eIndex), SINK, inArc.weight);
                    }
                }
            }
            for (const postEvent of event.nextEvents) {
                network.setUnbounded(this.eventEnd(eIndex), this.eventStart(events.findIndex(e => e === postEvent)));
            }
        }
        let need = 0;
        for (let ii = 0; ii < n; ii++) {
            need += network.getCap(ii, SINK);
        }
        const f = network.maxFlow(SOURCE, SINK);
        console.debug(`flow ${place.id} ${f}`);
        console.debug(`need ${place.id} ${need}`);
        return need === f;
    }
    eventStart(eventIndex) {
        return eventIndex * 2 + 1;
    }
    eventEnd(eventIndex) {
        return eventIndex * 2 + 2;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHBvLWZsb3ctdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2FsZ29yaXRobXMvcG4vdmFsaWRhdGlvbi9scG8tZmxvdy12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFHeEUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUc5RSxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsWUFBWTtJQUU5QyxZQUFZLFFBQWtCLEVBQUUsR0FBaUI7UUFDN0MsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUTtRQUNKLE1BQU0sSUFBSSxHQUE0QixFQUFFLENBQUM7UUFFekMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMxQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRVMsaUJBQWlCLENBQUMsS0FB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QUFDO0lBQzlCLENBQUM7SUFFTyxRQUFRLENBQUMsVUFBa0I7UUFDL0IsT0FBTyxVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0NBRUoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGV0cmktbmV0JztcclxuaW1wb3J0IHtQYXJ0aWFsT3JkZXJ9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wby9tb2RlbC9wYXJ0aWFsLW9yZGVyJztcclxuaW1wb3J0IHtNYXhGbG93UHJlZmxvd04zfSBmcm9tICcuLi8uLi9mbG93LW5ldHdvcmsvbWF4LWZsb3ctcHJlZmxvdy1uMyc7XHJcbmltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3RyYW5zaXRpb24nO1xyXG5pbXBvcnQge1BsYWNlfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGxhY2UnO1xyXG5pbXBvcnQge0xwb1ZhbGlkYXRvcn0gZnJvbSAnLi9jbGFzc2VzL2xwby12YWxpZGF0b3InO1xyXG5pbXBvcnQge1ZhbGlkYXRpb25QaGFzZSwgVmFsaWRhdGlvblJlc3VsdH0gZnJvbSAnLi9jbGFzc2VzL3ZhbGlkYXRpb24tcmVzdWx0JztcclxuaW1wb3J0IHtFdmVudH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvL21vZGVsL2V2ZW50JztcclxuXHJcbmV4cG9ydCBjbGFzcyBMcG9GbG93VmFsaWRhdG9yIGV4dGVuZHMgTHBvVmFsaWRhdG9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwZXRyaU5ldDogUGV0cmlOZXQsIGxwbzogUGFydGlhbE9yZGVyKSB7XHJcbiAgICAgICAgc3VwZXIocGV0cmlOZXQsIGxwbyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGUoKTogQXJyYXk8VmFsaWRhdGlvblJlc3VsdD4ge1xyXG4gICAgICAgIGNvbnN0IGZsb3c6IEFycmF5PFZhbGlkYXRpb25SZXN1bHQ+ID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYWNlcyA9IHRoaXMuX3BldHJpTmV0LmdldFBsYWNlcygpO1xyXG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IHRoaXMuX2xwby5ldmVudHM7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxhY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlID0gcGxhY2VzW2ldO1xyXG4gICAgICAgICAgICBmbG93W2ldID0gbmV3IFZhbGlkYXRpb25SZXN1bHQodGhpcy5jaGVja0Zsb3dGb3JQbGFjZShwbGFjZSwgZXZlbnRzKSwgVmFsaWRhdGlvblBoYXNlLkZMT1cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZsb3c7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNoZWNrRmxvd0ZvclBsYWNlKHBsYWNlOiBQbGFjZSwgZXZlbnRzOiBBcnJheTxFdmVudD4pOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBuID0gZXZlbnRzLmxlbmd0aCAqIDIgKyAyO1xyXG4gICAgICAgIGNvbnN0IFNPVVJDRSA9IDA7XHJcbiAgICAgICAgY29uc3QgU0lOSyA9IG4gLSAxO1xyXG5cclxuICAgICAgICBjb25zdCBuZXR3b3JrID0gbmV3IE1heEZsb3dQcmVmbG93TjMobik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGVJbmRleCA9IDA7IGVJbmRleCA8IGV2ZW50cy5sZW5ndGg7IGVJbmRleCsrKSB7XHJcbiAgICAgICAgICAgIG5ldHdvcmsuc2V0VW5ib3VuZGVkKHRoaXMuZXZlbnRTdGFydChlSW5kZXgpLCB0aGlzLmV2ZW50RW5kKGVJbmRleCkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBldmVudHNbZUluZGV4XTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnRyYW5zaXRpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlLm1hcmtpbmcgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV0d29yay5zZXRDYXAoU09VUkNFLCB0aGlzLmV2ZW50RW5kKGVJbmRleCksIHBsYWNlLm1hcmtpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdXRBcmMgb2YgKGV2ZW50LnRyYW5zaXRpb24gYXMgdW5rbm93biBhcyBUcmFuc2l0aW9uKS5vdXRnb2luZ0FyY3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3N0UGxhY2UgPSBvdXRBcmMuZGVzdGluYXRpb24gYXMgUGxhY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc3RQbGFjZSA9PT0gcGxhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV0d29yay5zZXRDYXAoU09VUkNFLCB0aGlzLmV2ZW50RW5kKGVJbmRleCksIG91dEFyYy53ZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW5BcmMgb2YgKGV2ZW50LnRyYW5zaXRpb24gYXMgdW5rbm93biBhcyBUcmFuc2l0aW9uKS5pbmdvaW5nQXJjcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZVBsYWNlID0gaW5BcmMuc291cmNlIGFzIFBsYWNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmVQbGFjZSA9PT0gcGxhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV0d29yay5zZXRDYXAodGhpcy5ldmVudFN0YXJ0KGVJbmRleCksIFNJTkssIGluQXJjLndlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcG9zdEV2ZW50IG9mIGV2ZW50Lm5leHRFdmVudHMpIHtcclxuICAgICAgICAgICAgICAgIG5ldHdvcmsuc2V0VW5ib3VuZGVkKHRoaXMuZXZlbnRFbmQoZUluZGV4KSwgdGhpcy5ldmVudFN0YXJ0KGV2ZW50cy5maW5kSW5kZXgoZSA9PiBlID09PSBwb3N0RXZlbnQpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBuZWVkID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgbjsgaWkrKykge1xyXG4gICAgICAgICAgICBuZWVkICs9IG5ldHdvcmsuZ2V0Q2FwKGlpLCBTSU5LKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZiA9IG5ldHdvcmsubWF4RmxvdyhTT1VSQ0UsIFNJTkspO1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYGZsb3cgJHtwbGFjZS5pZH0gJHtmfWApO1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYG5lZWQgJHtwbGFjZS5pZH0gJHtuZWVkfWApO1xyXG4gICAgICAgIHJldHVybiBuZWVkID09PSBmO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXZlbnRTdGFydChldmVudEluZGV4OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBldmVudEluZGV4ICogMiArIDE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBldmVudEVuZChldmVudEluZGV4OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBldmVudEluZGV4ICogMiArIDI7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==