import { createUniqueString, IncrementingCounter } from './incrementing-counter';
import { iterate } from './iterate';
export class Relabeler {
    constructor() {
        this._existingLabels = new Set();
        this._labelCounter = new IncrementingCounter();
        this._labelMapping = new Map();
        this._labelOrder = new Map();
        this._nonUniqueIdentities = new Set();
        this._labelOrderIndex = new Map();
    }
    clone() {
        const result = new Relabeler();
        this._existingLabels.forEach(l => {
            result._existingLabels.add(l);
        });
        result._labelCounter.setCurrentValue(this._labelCounter.current());
        this._labelMapping.forEach((v, k) => {
            result._labelMapping.set(k, v);
        });
        this._labelOrder.forEach((v, k) => {
            result._labelOrder.set(k, [...v]);
        });
        this._nonUniqueIdentities.forEach(nui => {
            result._nonUniqueIdentities.add(nui);
        });
        return result;
    }
    getNewUniqueLabel(oldLabel) {
        return this.getNewLabel(oldLabel, false);
    }
    getNewLabelPreserveNonUniqueIdentities(oldLabel) {
        return this.getNewLabel(oldLabel, true);
    }
    getNewLabel(oldLabel, preserveNonUniqueIdentities) {
        if (!this._existingLabels.has(oldLabel)) {
            // label encountered for the first time
            this._existingLabels.add(oldLabel);
            this._labelMapping.set(oldLabel, oldLabel);
            if (preserveNonUniqueIdentities) {
                this._nonUniqueIdentities.add(oldLabel);
            }
            else {
                this._labelOrder.set(oldLabel, [oldLabel]);
                this._labelOrderIndex.set(oldLabel, 1);
            }
            return oldLabel;
        }
        else {
            // relabeling required
            let newLabelIndex = this._labelOrderIndex.get(oldLabel);
            if (newLabelIndex === undefined) {
                newLabelIndex = 0;
            }
            let relabelingOrder = this._labelOrder.get(oldLabel);
            if (relabelingOrder === undefined) {
                // relabeling collision or non-unique identity
                if (preserveNonUniqueIdentities && this._nonUniqueIdentities.has(oldLabel)) {
                    return oldLabel;
                }
                relabelingOrder = [];
                this._labelOrder.set(oldLabel, relabelingOrder);
                newLabelIndex = 0;
            }
            if (newLabelIndex >= relabelingOrder.length) {
                // new label must be generated
                const newLabel = createUniqueString(oldLabel, this._existingLabels, this._labelCounter);
                this._existingLabels.add(newLabel);
                relabelingOrder.push(newLabel);
                this._labelMapping.set(newLabel, oldLabel);
            }
            this._labelOrderIndex.set(oldLabel, newLabelIndex + 1);
            return relabelingOrder[newLabelIndex];
        }
    }
    restartSequence() {
        this._labelOrderIndex.clear();
    }
    getLabelMapping() {
        return this._labelMapping;
    }
    getLabelOrder() {
        return this._labelOrder;
    }
    uniquelyRelabelSequence(sequence) {
        this.relabel(sequence, false);
    }
    uniquelyRelabelSequences(sequences) {
        iterate(sequences, s => {
            this.uniquelyRelabelSequence(s);
        });
    }
    relabelSequencePreserveNonUniqueIdentities(sequence) {
        this.relabel(sequence, true);
    }
    relabelSequencesPreserveNonUniqueIdentities(sequences) {
        iterate(sequences, s => {
            this.relabelSequencePreserveNonUniqueIdentities(s);
        });
    }
    relabel(sequence, preserveIdentities) {
        this.restartSequence();
        for (let i = 0; i < sequence.length(); i++) {
            sequence.set(i, this.getNewLabel(sequence.get(i), preserveIdentities));
        }
    }
    undoSequenceLabeling(sequence) {
        for (let i = 0; i < sequence.length(); i++) {
            sequence.set(i, this.undoLabel(sequence.get(i)));
        }
    }
    undoSequencesLabeling(sequences) {
        iterate(sequences, s => {
            this.undoSequenceLabeling(s);
        });
    }
    undoLabel(label) {
        return this._labelMapping.get(label) ?? label;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYWJlbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL3V0aWxpdHkvcmVsYWJlbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRS9FLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEMsTUFBTSxPQUFPLFNBQVM7SUFVbEI7UUFDSSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7UUFDekMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztRQUMvQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO1FBQ3BELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBRTlDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUN0RCxDQUFDO0lBRU0sS0FBSztRQUNSLE1BQU0sTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEMsTUFBTSxDQUFD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QUFDLEVBQUUsRUFBRTtZQUN4QyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1NBQzFFO0lBQ0wsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFFBQWdDO1FBQ3hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRDtJQUNMLENBQUM7SUFFTSxxQkFBcUIsQ0FBQyxTQUEyQztRQUNwRSxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxTQUFTLENBQUMsS0FBYTtRQUMxQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQTtJQUNqRCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NyZWF0ZVVuaXF1ZVN0cmluZywgSW5jcmVtZW50aW5nQ291bnRlcn0gZnJvbSAnLi9pbmNyZW1lbnRpbmctY291bnRlcic7XHJcbmltcG9ydCB7RWRpdGFibGVTdHJpbmdTZXF1ZW5jZX0gZnJvbSAnLi9zdHJpbmctc2VxdWVuY2UnO1xyXG5pbXBvcnQge2l0ZXJhdGV9IGZyb20gJy4vaXRlcmF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVsYWJlbGVyIHtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9leGlzdGluZ0xhYmVsczogU2V0PHN0cmluZz47XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9sYWJlbENvdW50ZXI6IEluY3JlbWVudGluZ0NvdW50ZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9sYWJlbE1hcHBpbmc6IE1hcDxzdHJpbmcsIHN0cmluZz47XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9sYWJlbE9yZGVyOiBNYXA8c3RyaW5nLCBBcnJheTxzdHJpbmc+PjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX25vblVuaXF1ZUlkZW50aXRpZXM6IFNldDxzdHJpbmc+O1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xhYmVsT3JkZXJJbmRleDogTWFwPHN0cmluZywgbnVtYmVyPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9leGlzdGluZ0xhYmVscyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMuX2xhYmVsQ291bnRlciA9IG5ldyBJbmNyZW1lbnRpbmdDb3VudGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbGFiZWxNYXBwaW5nID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLl9sYWJlbE9yZGVyID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PHN0cmluZz4+KCk7XHJcbiAgICAgICAgdGhpcy5fbm9uVW5pcXVlSWRlbnRpdGllcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG5cclxuICAgICAgICB0aGlzLl9sYWJlbE9yZGVySW5kZXggPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9uZSgpOiBSZWxhYmVsZXIge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBSZWxhYmVsZXIoKTtcclxuICAgICAgICB0aGlzLl9leGlzdGluZ0xhYmVscy5mb3JFYWNoKGwgPT4ge1xyXG4gICAgICAgICAgICByZXN1bHQuX2V4aXN0aW5nTGFiZWxzLmFkZChsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXN1bHQuX2xhYmVsQ291bnRlci5zZXRDdXJyZW50VmFsdWUodGhpcy5fbGFiZWxDb3VudGVyLmN1cnJlbnQoKSk7XHJcbiAgICAgICAgdGhpcy5fbGFiZWxNYXBwaW5nLmZvckVhY2goKHYsIGspID0+IHtcclxuICAgICAgICAgICAgcmVzdWx0Ll9sYWJlbE1hcHBpbmcuc2V0KGssIHYpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2xhYmVsT3JkZXIuZm9yRWFjaCgodiwgaykgPT4ge1xyXG4gICAgICAgICAgICByZXN1bHQuX2xhYmVsT3JkZXIuc2V0KGssIFsuLi52XSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fbm9uVW5pcXVlSWRlbnRpdGllcy5mb3JFYWNoKG51aSA9PiB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5fbm9uVW5pcXVlSWRlbnRpdGllcy5hZGQobnVpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE5ld1VuaXF1ZUxhYmVsKG9sZExhYmVsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldE5ld0xhYmVsKG9sZExhYmVsLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE5ld0xhYmVsUHJlc2VydmVOb25VbmlxdWVJZGVudGl0aWVzKG9sZExhYmVsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldE5ld0xhYmVsKG9sZExhYmVsLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0TmV3TGFiZWwob2xkTGFiZWw6IHN0cmluZywgcHJlc2VydmVOb25VbmlxdWVJZGVudGl0aWVzOiBib29sZWFuKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2V4aXN0aW5nTGFiZWxzLmhhcyhvbGRMYWJlbCkpIHtcclxuICAgICAgICAgICAgLy8gbGFiZWwgZW5jb3VudGVyZWQgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgICAgIHRoaXMuX2V4aXN0aW5nTGFiZWxzLmFkZChvbGRMYWJlbCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhYmVsTWFwcGluZy5zZXQob2xkTGFiZWwsIG9sZExhYmVsKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcmVzZXJ2ZU5vblVuaXF1ZUlkZW50aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25vblVuaXF1ZUlkZW50aXRpZXMuYWRkKG9sZExhYmVsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhYmVsT3JkZXIuc2V0KG9sZExhYmVsLCBbb2xkTGFiZWxdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhYmVsT3JkZXJJbmRleC5zZXQob2xkTGFiZWwsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gb2xkTGFiZWw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcmVsYWJlbGluZyByZXF1aXJlZFxyXG4gICAgICAgICAgICBsZXQgbmV3TGFiZWxJbmRleCA9IHRoaXMuX2xhYmVsT3JkZXJJbmRleC5nZXQob2xkTGFiZWwpO1xyXG4gICAgICAgICAgICBpZiAobmV3TGFiZWxJbmRleCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdMYWJlbEluZGV4ID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHJlbGFiZWxpbmdPcmRlciA9IHRoaXMuX2xhYmVsT3JkZXIuZ2V0KG9sZExhYmVsKTtcclxuICAgICAgICAgICAgaWYgKHJlbGFiZWxpbmdPcmRlciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZWxhYmVsaW5nIGNvbGxpc2lvbiBvciBub24tdW5pcXVlIGlkZW50aXR5XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlc2VydmVOb25VbmlxdWVJZGVudGl0aWVzICYmIHRoaXMuX25vblVuaXF1ZUlkZW50aXRpZXMuaGFzKG9sZExhYmVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbGRMYWJlbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlbGFiZWxpbmdPcmRlciA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFiZWxPcmRlci5zZXQob2xkTGFiZWwsIHJlbGFiZWxpbmdPcmRlcik7XHJcbiAgICAgICAgICAgICAgICBuZXdMYWJlbEluZGV4ID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG5ld0xhYmVsSW5kZXggPj0gcmVsYWJlbGluZ09yZGVyLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbmV3IGxhYmVsIG11c3QgYmUgZ2VuZXJhdGVkXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdMYWJlbCA9IGNyZWF0ZVVuaXF1ZVN0cmluZyhvbGRMYWJlbCwgdGhpcy5fZXhpc3RpbmdMYWJlbHMsIHRoaXMuX2xhYmVsQ291bnRlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9leGlzdGluZ0xhYmVscy5hZGQobmV3TGFiZWwpO1xyXG4gICAgICAgICAgICAgICAgcmVsYWJlbGluZ09yZGVyLnB1c2gobmV3TGFiZWwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFiZWxNYXBwaW5nLnNldChuZXdMYWJlbCwgb2xkTGFiZWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9sYWJlbE9yZGVySW5kZXguc2V0KG9sZExhYmVsLCBuZXdMYWJlbEluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZWxhYmVsaW5nT3JkZXJbbmV3TGFiZWxJbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXN0YXJ0U2VxdWVuY2UoKSB7XHJcbiAgICAgICAgdGhpcy5fbGFiZWxPcmRlckluZGV4LmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldExhYmVsTWFwcGluZygpOiBNYXA8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWxNYXBwaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMYWJlbE9yZGVyKCk6IE1hcDxzdHJpbmcsIEFycmF5PHN0cmluZz4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWxPcmRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5pcXVlbHlSZWxhYmVsU2VxdWVuY2Uoc2VxdWVuY2U6IEVkaXRhYmxlU3RyaW5nU2VxdWVuY2UpIHtcclxuICAgICAgICB0aGlzLnJlbGFiZWwoc2VxdWVuY2UsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5pcXVlbHlSZWxhYmVsU2VxdWVuY2VzKHNlcXVlbmNlczogSXRlcmFibGU8RWRpdGFibGVTdHJpbmdTZXF1ZW5jZT4pIHtcclxuICAgICAgICBpdGVyYXRlKHNlcXVlbmNlcywgcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudW5pcXVlbHlSZWxhYmVsU2VxdWVuY2Uocyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbGFiZWxTZXF1ZW5jZVByZXNlcnZlTm9uVW5pcXVlSWRlbnRpdGllcyhzZXF1ZW5jZTogRWRpdGFibGVTdHJpbmdTZXF1ZW5jZSkge1xyXG4gICAgICAgIHRoaXMucmVsYWJlbChzZXF1ZW5jZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbGFiZWxTZXF1ZW5jZXNQcmVzZXJ2ZU5vblVuaXF1ZUlkZW50aXRpZXMoc2VxdWVuY2VzOiBJdGVyYWJsZTxFZGl0YWJsZVN0cmluZ1NlcXVlbmNlPikge1xyXG4gICAgICAgIGl0ZXJhdGUoc2VxdWVuY2VzLCBzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZWxhYmVsU2VxdWVuY2VQcmVzZXJ2ZU5vblVuaXF1ZUlkZW50aXRpZXMocyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlbGFiZWwoc2VxdWVuY2U6IEVkaXRhYmxlU3RyaW5nU2VxdWVuY2UsIHByZXNlcnZlSWRlbnRpdGllczogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMucmVzdGFydFNlcXVlbmNlKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXF1ZW5jZS5sZW5ndGgoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHNlcXVlbmNlLnNldChpLCB0aGlzLmdldE5ld0xhYmVsKHNlcXVlbmNlLmdldChpKSwgcHJlc2VydmVJZGVudGl0aWVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvU2VxdWVuY2VMYWJlbGluZyhzZXF1ZW5jZTogRWRpdGFibGVTdHJpbmdTZXF1ZW5jZSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VxdWVuY2UubGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICAgICAgICBzZXF1ZW5jZS5zZXQoaSwgdGhpcy51bmRvTGFiZWwoc2VxdWVuY2UuZ2V0KGkpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvU2VxdWVuY2VzTGFiZWxpbmcoc2VxdWVuY2VzOiBJdGVyYWJsZTxFZGl0YWJsZVN0cmluZ1NlcXVlbmNlPikge1xyXG4gICAgICAgIGl0ZXJhdGUoc2VxdWVuY2VzLCBzID0+IHtcclxuICAgICAgICAgICAgdGhpcy51bmRvU2VxdWVuY2VMYWJlbGluZyhzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb0xhYmVsKGxhYmVsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sYWJlbE1hcHBpbmcuZ2V0KGxhYmVsKSA/PyBsYWJlbFxyXG4gICAgfVxyXG59XHJcbiJdfQ==