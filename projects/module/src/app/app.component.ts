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

    private allActivities: Array<String> | undefined;
    private initActivities: Array<String> | undefined;
    private endActivities: Array<String> | undefined;
    private taskSequences: string[][] = [];
    private casualRelations: string[][] = [];
    private parallelActivities: string[][] = [];
    private nonDirectCasualRelations: string[][] = [];
    private xl: Array<Trace> | undefined;
    private yl: Array<Trace> | undefined;

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
        // TODO: xl set
        // TODO: yl set
        // TODO: to set - check for deviations
        // TODO: generate start place
        // TODO: generate end place
        // TODO: generate transitions
        // TODO: generate places
    }

    private findAllActivities(): Array<String> {
        let all = new Array<String>();
        this.log.map((trace) => {
            for (const event of trace.events) {
                if (!all.includes(event.name)) {
                    all.push(event.name)
                }
            }
        })
        return all;
    }

    private findInitActivities(): Array<String> {
        let init = new Array<String>();
        this.log.map((trace) => {
            if (!init.includes(trace.events[0].name)) {
                init.push(trace.events[0].name)
            }
        });
        return init;
    }

    private findEndActivities(): Array<String> {
        let end = new Array<String>();
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
        // TODO: debug
        let log = this.log
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
}
