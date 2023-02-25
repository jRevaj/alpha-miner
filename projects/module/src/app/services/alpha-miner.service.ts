import {Injectable} from '@angular/core';
import {cleanLog} from "../../../../components/src/lib/algorithms/log/clean-log";
import {Trace} from "../../../../components/src/lib/models/log/model/trace";
import {
    DuplicatePlaceRemoverService
} from "../../../../components/src/lib/algorithms/pn/transformation/duplicate-place-remover.service";
import {NetAndReport} from "../../../../components/src/lib/algorithms/pn/synthesis/model/net-and-report";
import {AlphaMinerSolver} from "../models/alpha-miner-solver";

@Injectable({
    providedIn: 'root'
})
export class AlphaMinerService {
    public loopsL2: boolean = true;

    constructor(private _duplicatePlaceRemover: DuplicatePlaceRemoverService) {
    }

    public mine(log: Array<Trace>): NetAndReport {
        const cleanedLog = cleanLog(log);
        const alphaSolver = new AlphaMinerSolver();
        return {
            net: this._duplicatePlaceRemover.removeDuplicatePlaces(alphaSolver.discoverWFNet(cleanedLog)),
            report: ["test"]
        }
    }
}
