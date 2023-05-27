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
/**
 * Service acting as a wrapper for Alpha Miner algorithm
 */
export class AlphaMinerService {

    constructor(private _duplicatePlaceRemover: DuplicatePlaceRemoverService) {
    }

    /**
     * Method that cleans event log and discovers Petri net using Alpha Miner algorithm
     * @param log - event log
     * @returns discovered Petri net and report
     */
    public mine(log: Array<Trace>): NetAndReport {
        const cleanedLog: Trace[] = cleanLog(log);
        const alphaSolver: AlphaMinerSolver = new AlphaMinerSolver(false, false);
        return {
            net: this._duplicatePlaceRemover.removeDuplicatePlaces(alphaSolver.discoverWFNet(cleanedLog)),
            report: alphaSolver.runtimeLogs
        }
    }
}
