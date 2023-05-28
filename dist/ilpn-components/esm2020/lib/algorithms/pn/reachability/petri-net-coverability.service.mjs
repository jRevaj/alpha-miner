import { Injectable } from '@angular/core';
import { PetriNet } from '../../../models/pn/model/petri-net';
import { CoverabilityTree } from './model/coverability-tree';
import { Marking } from '../../../models/pn/model/marking';
import * as i0 from "@angular/core";
export class PetriNetCoverabilityService {
    constructor() {
    }
    getCoverabilityTree(net) {
        const tree = new CoverabilityTree(net.getInitialMarking());
        const statesToExplore = [tree];
        whileLoop: while (statesToExplore.length !== 0) {
            const state = statesToExplore.shift();
            const ancestors = state.ancestors;
            for (const a of ancestors) {
                if (a.omegaMarking.equals(state.omegaMarking)) {
                    continue whileLoop;
                }
            }
            const enabledTransitions = PetriNet.getAllEnabledTransitions(net, state.omegaMarking);
            for (const t of enabledTransitions) {
                const nextMarking = PetriNet.fireTransitionInMarking(net, t.id, state.omegaMarking);
                const nextOmegaMarking = this.computeNextOmegaMarking(nextMarking, ancestors);
                const newState = state.addChild(t.label, nextOmegaMarking);
                statesToExplore.push(newState);
            }
        }
        return tree;
    }
    computeNextOmegaMarking(nextMarking, ancestors) {
        const runningOmega = new Marking(nextMarking);
        for (const a of ancestors) {
            runningOmega.introduceOmegas(a.omegaMarking);
        }
        return runningOmega;
    }
}
PetriNetCoverabilityService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetCoverabilityService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetCoverabilityService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetCoverabilityService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetCoverabilityService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LWNvdmVyYWJpbGl0eS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2FsZ29yaXRobXMvcG4vcmVhY2hhYmlsaXR5L3BldHJpLW5ldC1jb3ZlcmFiaWxpdHkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sa0NBQWtDLENBQUM7O0FBS3pELE1BQU0sT0FBTywyQkFBMkI7SUFFcEM7SUFDQSxDQUFDO0lBRU0sbUJBQW1CLENBQUMsR0FBYTtRQUNwQyxNQUFNLElBQUksR0FBRyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7UUFDM0QsTUFBTSxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUvQixTQUFTLEVBQ1QsT0FBTyxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNqQyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFHLENBQUM7WUFDdkMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUVsQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLFNBQVMsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQzNDLFNBQVMsU0FBUyxDQUFDO2lCQUN0QjthQUNKO1lBRUQsTUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsd0JBQXdCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN0RixLQUFLLE1BQU0sQ0FBQyxJQUFJLGtCQUFrQixFQUFFO2dCQUNoQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFHLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNyRixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQzlFLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM1RCxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2xDO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRVMsdUJBQXVCLENBQUMsV0FBb0IsRUFBRSxTQUFrQztRQUN0RixNQUFNLFlBQVksR0FBRyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM5QyxLQUFLLE1BQU0sQ0FBQyxJQUFJLFNBQVMsRUFBRTtZQUN2QixZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNoRDtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7O3dIQXRDUSwyQkFBMkI7NEhBQTNCLDJCQUEyQixjQUZ4QixNQUFNOzJGQUVULDJCQUEyQjtrQkFIdkMsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGV0cmktbmV0JztcclxuaW1wb3J0IHtDb3ZlcmFiaWxpdHlUcmVlfSBmcm9tICcuL21vZGVsL2NvdmVyYWJpbGl0eS10cmVlJztcclxuaW1wb3J0IHtNYXJraW5nfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvbWFya2luZyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFBldHJpTmV0Q292ZXJhYmlsaXR5U2VydmljZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvdmVyYWJpbGl0eVRyZWUobmV0OiBQZXRyaU5ldCk6IENvdmVyYWJpbGl0eVRyZWUge1xyXG4gICAgICAgIGNvbnN0IHRyZWUgPSBuZXcgQ292ZXJhYmlsaXR5VHJlZShuZXQuZ2V0SW5pdGlhbE1hcmtpbmcoKSk7XHJcbiAgICAgICAgY29uc3Qgc3RhdGVzVG9FeHBsb3JlID0gW3RyZWVdO1xyXG5cclxuICAgICAgICB3aGlsZUxvb3A6XHJcbiAgICAgICAgd2hpbGUgKHN0YXRlc1RvRXhwbG9yZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBzdGF0ZXNUb0V4cGxvcmUuc2hpZnQoKSE7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuY2VzdG9ycyA9IHN0YXRlLmFuY2VzdG9ycztcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBvZiBhbmNlc3RvcnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhLm9tZWdhTWFya2luZy5lcXVhbHMoc3RhdGUub21lZ2FNYXJraW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIHdoaWxlTG9vcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZW5hYmxlZFRyYW5zaXRpb25zID0gUGV0cmlOZXQuZ2V0QWxsRW5hYmxlZFRyYW5zaXRpb25zKG5ldCwgc3RhdGUub21lZ2FNYXJraW5nKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCB0IG9mIGVuYWJsZWRUcmFuc2l0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dE1hcmtpbmcgPSBQZXRyaU5ldC5maXJlVHJhbnNpdGlvbkluTWFya2luZyhuZXQsIHQuaWQhLCBzdGF0ZS5vbWVnYU1hcmtpbmcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dE9tZWdhTWFya2luZyA9IHRoaXMuY29tcHV0ZU5leHRPbWVnYU1hcmtpbmcobmV4dE1hcmtpbmcsIGFuY2VzdG9ycyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IHN0YXRlLmFkZENoaWxkKHQubGFiZWwhLCBuZXh0T21lZ2FNYXJraW5nKTtcclxuICAgICAgICAgICAgICAgIHN0YXRlc1RvRXhwbG9yZS5wdXNoKG5ld1N0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRyZWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbXB1dGVOZXh0T21lZ2FNYXJraW5nKG5leHRNYXJraW5nOiBNYXJraW5nLCBhbmNlc3RvcnM6IEFycmF5PENvdmVyYWJpbGl0eVRyZWU+KTogTWFya2luZyB7XHJcbiAgICAgICAgY29uc3QgcnVubmluZ09tZWdhID0gbmV3IE1hcmtpbmcobmV4dE1hcmtpbmcpO1xyXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhbmNlc3RvcnMpIHtcclxuICAgICAgICAgICAgcnVubmluZ09tZWdhLmludHJvZHVjZU9tZWdhcyhhLm9tZWdhTWFya2luZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBydW5uaW5nT21lZ2E7XHJcbiAgICB9XHJcbn1cclxuIl19