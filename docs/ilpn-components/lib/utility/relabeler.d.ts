import { EditableStringSequence } from './string-sequence';
export declare class Relabeler {
    private readonly _existingLabels;
    private readonly _labelCounter;
    private readonly _labelMapping;
    private readonly _labelOrder;
    private readonly _nonUniqueIdentities;
    private readonly _labelOrderIndex;
    constructor();
    clone(): Relabeler;
    getNewUniqueLabel(oldLabel: string): string;
    getNewLabelPreserveNonUniqueIdentities(oldLabel: string): string;
    protected getNewLabel(oldLabel: string, preserveNonUniqueIdentities: boolean): string;
    restartSequence(): void;
    getLabelMapping(): Map<string, string>;
    getLabelOrder(): Map<string, Array<string>>;
    uniquelyRelabelSequence(sequence: EditableStringSequence): void;
    uniquelyRelabelSequences(sequences: Iterable<EditableStringSequence>): void;
    relabelSequencePreserveNonUniqueIdentities(sequence: EditableStringSequence): void;
    relabelSequencesPreserveNonUniqueIdentities(sequences: Iterable<EditableStringSequence>): void;
    protected relabel(sequence: EditableStringSequence, preserveIdentities: boolean): void;
    undoSequenceLabeling(sequence: EditableStringSequence): void;
    undoSequencesLabeling(sequences: Iterable<EditableStringSequence>): void;
    undoLabel(label: string): string;
}
