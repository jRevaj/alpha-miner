import {Component} from '@angular/core';
import {
    FD_LOG,
    FD_PETRI_NET,
} from '../../../components/src/lib/components/layout/file-display';
import {DropFile} from 'dist/ilpn-components/public-api';
import {Trace} from '../../../components/src/lib/models/log/model/trace';
import {XesLogParserService} from '../../../components/src/lib/models/log/parser/xes-log-parser.service';
import {
    PetriNetSerialisationService
} from '../../../components/src/lib/models/pn/parser/petri-net-serialisation.service';
import {PetriNet} from '../../../components/src/lib/models/pn/model/petri-net';
import * as _ from "lodash";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public fdLog = FD_LOG;
    public fdPn = FD_PETRI_NET;
    public log: Array<Trace> = [];
    public result: DropFile | undefined = undefined;
    public report: DropFile | undefined = undefined;
    public processing = false;
    public pn: PetriNet | undefined;

    private allActivities: Array<string> | undefined;
    private initActivities: Array<string> | undefined;
    private endActivities: Array<string> = [];
    private taskSequences: string[][] = [];
    private casualRelations: string[][] = [];
    private parallelActivities: string[][] = [];
    private nonDirectCasualRelations: string[][] = [];
    private xl: Array<any> = [];
    private yl: Array<any> = [];
    private to: Array<String> = [];

    constructor(
        private parser: XesLogParserService,
        private serializer: PetriNetSerialisationService
    ) {
    }

    public processLog(files: Array<DropFile>) {
        this.processing = true;
        this.result = undefined;

        this.log = this.parser.parse(files[0].content);

        // filter out start events
        this.log.map((trace) => {
            for (let i = 0; i < trace.events.length; i++) {
                let event = trace.events[i];
                if (event.lifecycle != "complete") {
                    trace.events.splice(i, 1);
                }
            }
        })

        console.log("filtered log: ", this.log);

        // count num of traces
        const iterations = `number of traces: ${this.log.length}`;
        console.log(iterations);

        this.mine();
    }

    public mine() {
        this.allActivities = this.findAllActivities();
        console.log("all activities: ", this.allActivities);
        this.initActivities = this.findInitActivities();
        console.log("init activities: ", this.initActivities);
        this.endActivities = this.findEndActivities();
        console.log("end activities: ", this.endActivities);
        this.taskSequences = this.findTaskSequences();
        console.log("task sequences: ", this.taskSequences);
        this.casualRelations = this.findCasualRelations();
        console.log("casual relations: ", this.casualRelations);
        this.parallelActivities = this.findParallelActivities();
        console.log("parallel activities: ", this.parallelActivities)
        this.nonDirectCasualRelations = this.findNonDirectCasualRelations();
        console.log("non-direct casual relations: ", this.nonDirectCasualRelations);
        this.xl = this.generateXlSet();
        console.log("xl set: ", this.xl);
        this.yl = this.generateYlSet();
        console.log("yl set: ", this.yl);
        this.to = this.getClearToSet();
        console.log("to set: ", this.to);
        // TODO: generate start place
        // TODO: generate end place
        // TODO: generate transitions
        // TODO: generate places
    }

    private findAllActivities(): Array<string> {
        let all = new Array<string>();
        this.log.map((trace) => {
            for (const event of trace.events) {
                if (!all.includes(event.name)) {
                    all.push(event.name)
                }
            }
        })
        return all;
    }

    private findInitActivities(): Array<string> {
        let init = new Array<string>();
        this.log.map((trace) => {
            if (!init.includes(trace.events[0].name)) {
                init.push(trace.events[0].name)
            }
        });
        return init;
    }

    private findEndActivities(): Array<string> {
        let end = new Array<string>();
        this.log.map((trace) => {
            if (!end.includes(trace.events[trace.events.length - 1].name)) {
                end.push(trace.events[trace.events.length - 1].name)
            }
        });
        return end;
    }

    private findTaskSequences(): string[][] {
        let allEvents: string[] = [];
        let sequences: string[][] = [];
        this.log.map((trace) => {
            for (let event of trace.events) {
                // if (allEvents[allEvents.length - 1] !== event.name) {
                //     allEvents.push(event.name)
                // }
                allEvents.push(event.name);
            }
        });
        for (let i = 0; i < allEvents.length - 1; i++) {
            let currentSequence = [allEvents[i], allEvents[i + 1]]
            sequences.push(currentSequence)
        }
        sequences = _.uniqWith(sequences, _.isEqual);
        return sequences;
    }

    private findCasualRelations(): string[][] {
        let sequences = this.taskSequences
        let casual: string[][] = []
        sequences.map((sequence) => {
            let hasReverseSequence: boolean = false;
            for (let testSeq of sequences) {
                let reverseTestSeq = [testSeq[1], testSeq[0]]
                if (_.isEqual(reverseTestSeq, sequence)) {
                    hasReverseSequence = true;
                }
            }
            if (!hasReverseSequence) {
                casual.push(sequence)
            }
        })
        return casual;
    }

    private findParallelActivities(): string[][] {
        let sequences = this.taskSequences
        let parallel: string[][] = []
        sequences.map((sequence) => {
            for (let testSeq of sequences) {
                let reverseTestSeq = [testSeq[1], testSeq[0]]
                if (_.isEqual(reverseTestSeq, sequence)) {
                    if (!(_.find(parallel, sequence)) && !(_.find(parallel, testSeq))) {
                        parallel.push(sequence)
                    }
                }
            }
        })
        return parallel
    }

    private findNonDirectCasualRelations(): string[][] {
        let sequences = this.taskSequences
        let nonDirect: string[][] = []
        for (let trace of this.log) {
            trace.events.map((event) => {
                for (let second_event of trace.events) {
                    let foundInNonDirect = _.find(nonDirect, _.matches([event.name, second_event.name]));
                    let foundInNonDirectReverse = _.find(nonDirect, _.matches([second_event.name, event.name]));
                    if (!foundInNonDirect && !foundInNonDirectReverse) {
                        let foundInSequences = _.find(sequences, _.matches([event.name, second_event.name]));
                        let foundInSequencesReverse = _.find(sequences, _.matches([second_event.name, event.name]));
                        if (!foundInSequences && !foundInSequencesReverse) {
                            nonDirect.push([event.name, second_event.name]);
                        }
                    }
                }
            })
        }
        return nonDirect
    }

    private generateXlSet(): Array<any> {
        let xl: Array<any> = _.cloneDeep(this.casualRelations);
        for (let parallel of this.parallelActivities) {
            for (let casual of this.casualRelations) {
                let containsFF = _.find(this.casualRelations, _.matches([casual[0], parallel[0]]));
                let containsFS = _.find(this.casualRelations, _.matches([casual[0], parallel[1]]));
                let reverseContainsFS = _.find(this.casualRelations, _.matches([parallel[0], casual[1]]));
                let reverseContainsSS = _.find(this.casualRelations, _.matches([parallel[1], casual[1]]));
                if (containsFF && containsFS) {
                    xl.push([casual[0], parallel]);
                }
                if (reverseContainsFS && reverseContainsSS) {
                    xl.push([parallel, casual[1]]);
                }
            }
        }
        xl = _.uniqWith(xl, _.isEqual);
        return xl;
    }

    private generateYlSet(): Array<any> {
        let toRemove: Array<any> = [];
        for (let sequence of this.xl) {
            let a: any;
            let b: any;
            if (_.isArray(sequence[0])) {
                a = sequence[0];
            } else {
                a = [sequence[0]];
            }

            if (_.isArray(sequence[1])) {
                b = sequence[1];
            } else {
                b = [sequence[1]];
            }

            for (let secondSequence of this.xl) {
                let secondSequenceA: any;
                let secondSequenceB: any;

                if (_.isArray(secondSequence[0])) {
                    secondSequenceA = secondSequence[0];
                } else {
                    secondSequenceA = [secondSequence[0]];
                }

                if (_.isArray(secondSequence[1])) {
                    secondSequenceB = secondSequence[1];
                } else {
                    secondSequenceB = [secondSequence[1]];
                }

                let intersection1 = _.intersection(a, secondSequenceA);
                let intersection2 = _.intersection(b, secondSequenceB);
                if ((intersection1.length > 0) && (intersection2.length > 0)) {
                    if (!_.isEqual(sequence, secondSequence)) {
                        toRemove.push(sequence);
                    }
                }
            }
        }
        toRemove = _.uniqWith(toRemove, _.isEqual);
        let result = _.cloneDeep(this.xl);
        toRemove.map((sequence) => {
            for (let i = 0; i < result.length; i++) {
                if (_.isEqual(result[i], sequence)) {
                    result.splice(i, 1);
                }
            }
        })
        return result;
    }

    private getClearToSet(): Array<string> {
        let toRemove: Array<string> = [];
        for (let activity of this.endActivities) {
            for (let x of this.xl) {
                if (activity == x[0]) {
                    toRemove.push(activity);
                }
            }
        }
        toRemove = _.uniqWith(toRemove, _.isEqual);
        let result = _.cloneDeep(this.endActivities);
        toRemove.map((activity) => {
            for (let i = 0; i < result.length; i++) {
                if (_.isEqual(result[i], activity)) {
                    result.splice(i, 1);
                }
            }
        })
        return result;
    }
}
