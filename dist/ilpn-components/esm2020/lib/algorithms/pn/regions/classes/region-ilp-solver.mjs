import { IncrementingCounter } from '../../../../utility/incrementing-counter';
import { BehaviorSubject, ReplaySubject, switchMap, take } from 'rxjs';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { Constraint, Goal, MessageLevel, Solution } from '../../../../models/glpk/glpk-constants';
import { ConstraintsWithNewVariables } from './constraints-with-new-variables';
import { arraify } from '../../../../utility/arraify';
export class RegionIlpSolver {
    constructor(_regionTransformer, _solver$) {
        this._regionTransformer = _regionTransformer;
        this._solver$ = _solver$;
        this._constraintCounter = new IncrementingCounter();
        this._variableCounter = new IncrementingCounter();
        this._allVariables = new Set();
        this._placeVariables = new Set();
    }
    computeRegions(nets, config) {
        const regions$ = new ReplaySubject();
        const combined = this.combineInputNets(nets);
        const ilp$ = new BehaviorSubject(this.setUpInitialILP(combined, config));
        ilp$.pipe(switchMap(ilp => this.solveILP(ilp))).subscribe((ps) => {
            if (ps.solution.result.status === Solution.OPTIMAL) {
                const region = this._regionTransformer.displayRegionInNet(ps.solution, combined.net);
                // TODO check if the region is new and we are not trapped in a loop
                const nonEmptyInputSet = combined.inputs.find(inputs => inputs.size > 0) ?? [];
                regions$.next({ net: region, inputs: Array.from(nonEmptyInputSet) });
                ilp$.next(this.addConstraintsToILP(ps));
            }
            else {
                // we are done, there are no more regions
                console.debug('final non-optimal result', ps.solution);
                regions$.complete();
                ilp$.complete();
            }
        });
        return regions$.asObservable();
    }
    combineInputNets(nets) {
        if (nets.length === 0) {
            throw new Error('Synthesis must be performed on at least one input net!');
        }
        let result = nets[0];
        const inputs = [result.inputPlaces];
        const outputs = [result.outputPlaces];
        for (let i = 1; i < nets.length; i++) {
            const union = PetriNet.netUnion(result, nets[i]);
            result = union.net;
            inputs.push(union.inputPlacesB);
            outputs.push(union.outputPlacesB);
        }
        return { net: result, inputs, outputs };
    }
    setUpInitialILP(combined, config) {
        const net = combined.net;
        this._placeVariables = new Set(net.getPlaces().map(p => p.getId()));
        this._allVariables = new Set(this._placeVariables);
        const initial = {
            name: 'ilp',
            objective: {
                name: 'region',
                direction: Goal.MINIMUM,
                vars: net.getPlaces().map(p => this.variable(p.getId())),
            },
            subjectTo: [],
        };
        initial[config.oneBoundRegions ? 'binaries' : 'generals'] = Array.from(this._placeVariables);
        this.applyConstraints(initial, this.createInitialConstraints(combined, config));
        return initial;
    }
    applyConstraints(ilp, constraints) {
        if (ilp.subjectTo === undefined) {
            ilp.subjectTo = [];
        }
        ilp.subjectTo.push(...constraints.constraints);
        if (ilp.binaries === undefined) {
            ilp.binaries = [];
        }
        ilp.binaries.push(...constraints.binaryVariables);
        if (ilp.generals === undefined) {
            ilp.generals = [];
        }
        ilp.generals.push(...constraints.integerVariables);
    }
    createInitialConstraints(combined, config) {
        const net = combined.net;
        const result = [];
        // only non-negative solutions
        result.push(...net.getPlaces().map(p => this.greaterEqualThan(this.variable(p.getId()), 0)));
        // non-zero solutions
        result.push(this.greaterEqualThan(net.getPlaces().map(p => this.variable(p.getId())), 1));
        // initial markings must be the same
        if (combined.inputs.length > 1) {
            const nonemptyInputs = combined.inputs.filter(inputs => inputs.size !== 0);
            const inputsA = Array.from(nonemptyInputs[0]);
            for (let i = 1; i < nonemptyInputs.length; i++) {
                const inputsB = Array.from(nonemptyInputs[i]);
                result.push(this.sumEqualsZero(...inputsA.map(id => this.variable(id, 1)), ...inputsB.map(id => this.variable(id, -1))));
            }
        }
        // places with no post-set should be empty
        if (config.noOutputPlaces) {
            result.push(...net.getPlaces().filter(p => p.outgoingArcs.length === 0).map(p => this.lessEqualThan(this.variable(p.getId()), 0)));
        }
        // gradient constraints
        const labels = this.collectTransitionByLabel(net);
        const riseSumVariables = [];
        const absoluteRiseSumVariables = [];
        for (const [key, transitions] of labels.entries()) {
            const transitionsWithSameLabel = transitions.length;
            const t1 = transitions.splice(0, 1)[0];
            if (config.obtainPartialOrders) {
                // t1 post-set
                riseSumVariables.push(...this.createVariablesFromPlaceIds(t1.outgoingArcs.map((a) => a.destinationId), 1));
                // t1 pre-set
                riseSumVariables.push(...this.createVariablesFromPlaceIds(t1.ingoingArcs.map((a) => a.sourceId), -1));
                const singleRiseVariables = this.createVariablesFromPlaceIds(t1.outgoingArcs.map((a) => a.destinationId), 1);
                singleRiseVariables.push(...this.createVariablesFromPlaceIds(t1.ingoingArcs.map((a) => a.sourceId), -1));
                const singleRise = this.combineCoefficients(singleRiseVariables);
                const abs = this.helperVariableName('abs');
                const absoluteRise = this.xAbsoluteOfSum(abs, singleRise);
                absoluteRiseSumVariables.push(abs);
                result.push(ConstraintsWithNewVariables.combineAndIntroduceVariables(undefined, abs, absoluteRise));
            }
            if (transitionsWithSameLabel === 1) {
                continue;
            }
            for (const t2 of transitions) {
                // t1 post-set
                let variables = this.createVariablesFromPlaceIds(t1.outgoingArcs.map((a) => a.destinationId), 1);
                // t1 pre-set
                variables.push(...this.createVariablesFromPlaceIds(t1.ingoingArcs.map((a) => a.sourceId), -1));
                // t2 post-set
                variables.push(...this.createVariablesFromPlaceIds(t2.outgoingArcs.map((a) => a.destinationId), -1));
                // t2 pre-set
                variables.push(...this.createVariablesFromPlaceIds(t2.ingoingArcs.map((a) => a.sourceId), 1));
                variables = this.combineCoefficients(variables);
                result.push(this.sumEqualsZero(...variables));
            }
        }
        if (config.obtainPartialOrders) {
            /*
                Sum of rises should be 0 AND Sum of absolute rises should be 2 (internal places)
                OR
                Sum of absolute rises should be 1 (initial and final places)
             */
            // sum of rises is 0
            const riseSumIsZero = this.helperVariableName('riseEqualZero');
            result.push(this.xWhenAEqualsB(riseSumIsZero, this.combineCoefficients(riseSumVariables), 0));
            // sum of absolute values of rises is 2
            const absRiseSumIsTwo = this.helperVariableName('absRiseSumTwo');
            result.push(this.xWhenAEqualsB(absRiseSumIsTwo, absoluteRiseSumVariables, 2));
            // sum is 0 AND sum absolute is 2
            const internalPlace = this.helperVariableName('placeIsInternal');
            result.push(ConstraintsWithNewVariables.combineAndIntroduceVariables([riseSumIsZero, absRiseSumIsTwo], undefined, this.xAandB(internalPlace, riseSumIsZero, absRiseSumIsTwo)));
            // sum of absolute values of rise is 1
            const absRiseSumIsOne = this.helperVariableName('absRiseSumOne');
            result.push(this.xWhenAEqualsB(absRiseSumIsOne, absoluteRiseSumVariables, 1));
            // place is internal OR place is initial/final
            const internalOrFinal = this.helperVariableName('internalOrFinal');
            result.push(ConstraintsWithNewVariables.combineAndIntroduceVariables([internalPlace, absRiseSumIsOne, internalOrFinal], undefined, this.xAorB(internalOrFinal, internalPlace, absRiseSumIsOne)));
            // place is internal OR place is initial/final must be true
            result.push(this.equal(this.variable(internalOrFinal), 1));
        }
        return ConstraintsWithNewVariables.combine(...result);
    }
    addConstraintsToILP(ps) {
        const ilp = ps.ilp;
        // no region that contains the new solution as subset
        const region = ps.solution.result.vars;
        const regionPlaces = Object.entries(region).filter(([k, v]) => v != 0 && this._placeVariables.has(k));
        const additionalConstraints = regionPlaces.map(([k, v]) => this.yWhenAGreaterEqualB(k, v));
        const yVariables = additionalConstraints
            .reduce((arr, constraint) => {
            arr.push(...constraint.binaryVariables);
            return arr;
        }, [])
            .map(y => this.variable(y));
        /*
            Sum of x-es should be less than their number
            x = 1 - y
            Therefore sum of y should be greater than 0
         */
        additionalConstraints.push(this.sumGreaterThan(yVariables, 0));
        this.applyConstraints(ilp, ConstraintsWithNewVariables.combine(...additionalConstraints));
        console.debug('solution', ps.solution.result.vars);
        console.debug('non-zero', regionPlaces);
        console.debug('additional constraint', ilp.subjectTo[ilp.subjectTo.length - 1]);
        return ilp;
    }
    collectTransitionByLabel(net) {
        const result = new Map();
        for (const t of net.getTransitions()) {
            if (t.label === undefined) {
                throw new Error(`Transition with id '${t.id}' has no label! All transitions must be labeled in the input net!`);
            }
            const array = result.get(t.label);
            if (array === undefined) {
                result.set(t.label, [t]);
            }
            else {
                array.push(t);
            }
        }
        return result;
    }
    createVariablesFromPlaceIds(placeIds, coefficient) {
        return placeIds.map(id => this.variable(id, coefficient));
    }
    combineCoefficients(variables) {
        const map = new Map();
        for (const variable of variables) {
            const coef = map.get(variable.name);
            if (coef !== undefined) {
                map.set(variable.name, coef + variable.coef);
            }
            else {
                map.set(variable.name, variable.coef);
            }
        }
        const result = [];
        for (const [name, coef] of map) {
            if (coef === 0) {
                continue;
            }
            result.push(this.variable(name, coef));
        }
        return result;
    }
    helperVariableName(prefix = 'y') {
        let helpVariableName;
        do {
            helpVariableName = `${prefix}${this._variableCounter.next()}`;
        } while (this._allVariables.has(helpVariableName));
        this._allVariables.add(helpVariableName);
        return helpVariableName;
    }
    xAbsoluteOfSum(x, sum) {
        /*
         * As per https://blog.adamfurmanek.pl/2015/09/19/ilp-part-5/
         *
         * x >= 0
         * (x + sum is 0) or (x - sum is 0) = 1
         *
         */
        const y = this.helperVariableName('yAbsSum'); // x + sum is 0
        const z = this.helperVariableName('zAbsSum'); // x - sym is 0
        const w = this.helperVariableName('wAbsSum'); // y or z
        return ConstraintsWithNewVariables.combineAndIntroduceVariables(w, undefined, 
        // x >= 0
        this.greaterEqualThan(this.variable(x), 0), 
        // w is y or z
        this.xAorB(w, y, z), 
        // w is true
        this.equal(this.variable(w), 1), 
        // x + sum is 0
        this.xWhenAEqualsB(y, [this.variable(x), ...sum.map(a => this.createOrCopyVariable(a))], 0), 
        // x - sum is 0
        this.xWhenAEqualsB(z, [this.variable(x), ...sum.map(a => this.createOrCopyVariable(a, -1))], 0));
    }
    xWhenAEqualsB(x, a, b) {
        /*
             As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/

             x is a equals b <=> a greater equal than b and a less equal than b
         */
        const y = this.helperVariableName('yWhenEquals');
        const z = this.helperVariableName('zWhenEquals');
        const aGreaterEqualB = this.xWhenAGreaterEqualB(y, a, b);
        const aLessEqualB = this.xWhenALessEqualB(z, a, b);
        return ConstraintsWithNewVariables.combineAndIntroduceVariables([x, y], undefined, aGreaterEqualB, aLessEqualB, this.xAandB(x, y, z));
    }
    yWhenAGreaterEqualB(a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/ and https://blog.adamfurmanek.pl/2015/08/22/ilp-part-1/
            x = a >= b can be defined as !(b > a)
            the negation for binary variables can be expressed as (for x = !y both binary) x = 1 - y
            the 1 - y form can be extracted and added to the constraint that puts all help variables together, therefore we only need to express y = b > a
            for |a|,|b| <= k and K = 2k + 1
            y = b > a can be expressed as:
            a - b + Ky >= 0
            a - b + Ky <= K-1

            in our case b is always a constant given by the solution (region)
            therefore we only have a and y as our variables which gives:
            a + Ky >= b
            a + Ky <= K-1 + b
         */
        const y = this.helperVariableName();
        if (b > RegionIlpSolver.k) {
            console.debug("b", b);
            console.debug("k", RegionIlpSolver.k);
            throw new Error("b > k. This implementation can only handle solutions that are at most k");
        }
        return ConstraintsWithNewVariables.combineAndIntroduceVariables([y], undefined, this.greaterEqualThan([this.variable(a), this.variable(y, RegionIlpSolver.K)], b), this.lessEqualThan([this.variable(a), this.variable(y, RegionIlpSolver.K)], RegionIlpSolver.K - 1 + b));
    }
    xWhenAGreaterEqualB(x, a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/

            a is greater equal b <=> not a less than b
         */
        const z = this.helperVariableName('zALessB');
        return ConstraintsWithNewVariables.combineAndIntroduceVariables(z, undefined, 
        // z when a less than b
        this.xWhenALessB(z, a, b), 
        // x not z
        this.xNotA(x, z));
    }
    xWhenALessEqualB(x, a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/

            a is less equal b <=> not a greater than b
         */
        const z = this.helperVariableName('zAGreaterB');
        return ConstraintsWithNewVariables.combineAndIntroduceVariables(z, undefined, 
        // z when a greater than b
        this.xWhenAGreaterB(z, a, b), 
        // x not z
        this.xNotA(x, z));
    }
    xWhenAGreaterB(x, a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/
            a,b integer
            |a|,|b| <= k
            k = 2^n - 1, n natural
            K = 2k + 1
            x binary

            0 <= b - a + Kx <= K - 1
         */
        let aIsVariable = false;
        let bIsVariable = false;
        if (typeof a === 'string' || Array.isArray(a)) {
            aIsVariable = true;
            if (typeof a === 'string') {
                a = arraify(a);
            }
        }
        if (typeof b === 'string' || Array.isArray(b)) {
            bIsVariable = true;
            if (typeof b === 'string') {
                b = arraify(b);
            }
        }
        if (aIsVariable && bIsVariable) {
            return ConstraintsWithNewVariables.combine(
            // b - a + Kx >= 0
            this.greaterEqualThan([
                ...b.map(b => this.createOrCopyVariable(b)),
                ...a.map(a => this.createOrCopyVariable(a, -1)),
                this.variable(x, RegionIlpSolver.K)
            ], 0), 
            // b - a + Kx <= K - 1
            this.lessEqualThan([
                ...b.map(b => this.createOrCopyVariable(b)),
                ...a.map(a => this.createOrCopyVariable(a, -1)),
                this.variable(x, RegionIlpSolver.K)
            ], RegionIlpSolver.K - 1));
        }
        else if (aIsVariable && !bIsVariable) {
            return ConstraintsWithNewVariables.combine(
            // -a + Kx >= -b
            this.greaterEqualThan([
                ...a.map(a => this.createOrCopyVariable(a, -1)),
                this.variable(x, RegionIlpSolver.K)
            ], -b), 
            // -a + Kx <= K - b - 1
            this.lessEqualThan([
                ...a.map(a => this.createOrCopyVariable(a, -1)),
                this.variable(x, RegionIlpSolver.K)
            ], RegionIlpSolver.K - b - 1));
        }
        else if (!aIsVariable && bIsVariable) {
            return ConstraintsWithNewVariables.combine(
            // b + Kx >= a
            this.greaterEqualThan([
                ...b.map(b => this.createOrCopyVariable(b)),
                this.variable(x, RegionIlpSolver.K)
            ], a), 
            // b + Kx <= K + a - 1
            this.lessEqualThan([
                ...b.map(b => this.createOrCopyVariable(b)),
                this.variable(x, RegionIlpSolver.K)
            ], RegionIlpSolver.K + a - 1));
        }
        else {
            throw new Error(`unsupported comparison! x when ${a} > ${b}`);
        }
    }
    xWhenALessB(x, a, b) {
        /*
            As per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/

            a is less than b <=> b is greater than a
         */
        return this.xWhenAGreaterB(x, b, a);
    }
    xAandB(x, a, b) {
        /*
            As per http://blog.adamfurmanek.pl/2015/08/22/ilp-part-1/
            a,b,x binary

            0 <= a + b - 2x <= 1
         */
        return ConstraintsWithNewVariables.combine(
        // a + b -2x >= 0
        this.greaterEqualThan([this.variable(a), this.variable(b), this.variable(x, -2)], 0), 
        // a + b -2x <= 1
        this.lessEqualThan([this.variable(a), this.variable(b), this.variable(x, -2)], 1));
    }
    xAorB(x, a, b) {
        /*
            As per http://blog.adamfurmanek.pl/2015/08/22/ilp-part-1/
            a,b,x binary

            -1 <= a + b - 2x <= 0
         */
        return ConstraintsWithNewVariables.combine(
        // a + b -2x >= -1
        this.greaterEqualThan([this.variable(a), this.variable(b), this.variable(x, -2)], -1), 
        // a + b -2x <= 0
        this.lessEqualThan([this.variable(a), this.variable(b), this.variable(x, -2)], 0));
    }
    xNotA(x, a) {
        /*
            As per http://blog.adamfurmanek.pl/2015/08/22/ilp-part-1/
            a,x binary

            x = 1 - a
         */
        // x + a = 1
        return this.equal([this.variable(x), this.variable(a)], 1);
    }
    createOrCopyVariable(original, coefficient = 1) {
        if (typeof original === 'string') {
            return this.variable(original, coefficient);
        }
        else {
            return this.variable(original.name, original.coef * coefficient);
        }
    }
    variable(name, coefficient = 1) {
        return { name, coef: coefficient };
    }
    equal(variables, value) {
        console.debug(`${this.formatVariableList(variables)} = ${value}`);
        return new ConstraintsWithNewVariables(this.constrain(arraify(variables), { type: Constraint.FIXED_VARIABLE, ub: value, lb: value }));
    }
    greaterEqualThan(variables, lowerBound) {
        console.debug(`${this.formatVariableList(variables)} >= ${lowerBound}`);
        return new ConstraintsWithNewVariables(this.constrain(arraify(variables), { type: Constraint.LOWER_BOUND, ub: 0, lb: lowerBound }));
    }
    lessEqualThan(variables, upperBound) {
        console.debug(`${this.formatVariableList(variables)} <= ${upperBound}`);
        return new ConstraintsWithNewVariables(this.constrain(arraify(variables), { type: Constraint.UPPER_BOUND, ub: upperBound, lb: 0 }));
    }
    sumEqualsZero(...variables) {
        return this.equal(variables, 0);
    }
    sumGreaterThan(variables, lowerBound) {
        return this.greaterEqualThan(variables, lowerBound + 1);
    }
    constrain(vars, bnds) {
        return {
            name: this.constraintName(),
            vars,
            bnds
        };
    }
    constraintName() {
        return 'c' + this._constraintCounter.next();
    }
    solveILP(ilp) {
        const result$ = new ReplaySubject();
        this._solver$.pipe(take(1)).subscribe(glpk => {
            const res = glpk.solve(ilp, {
                msglev: MessageLevel.ERROR,
            });
            res.then((solution) => {
                result$.next({ ilp, solution });
                result$.complete();
            });
        });
        return result$.asObservable();
    }
    formatVariableList(variables) {
        return arraify(variables).map(v => `${v.coef > 0 ? '+' : ''}${v.coef === -1 ? '-' : (v.coef === 1 ? '' : v.coef)}${v.name}`).join(' ');
    }
}
// k and K defined as per https://blog.adamfurmanek.pl/2015/09/12/ilp-part-4/
// for some reason k = 2^19 while not large enough to cause precision problems in either doubles or integers
// has caused the iterative algorithm to loop indefinitely, presumably because of some precision error in the implementation of the solver
RegionIlpSolver.k = (1 << 10) - 1; // 2^10 - 1
RegionIlpSolver.K = 2 * RegionIlpSolver.k + 1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9uLWlscC1zb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvYWxnb3JpdGhtcy9wbi9yZWdpb25zL2NsYXNzZXMvcmVnaW9uLWlscC1zb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDN0UsT0FBTyxFQUFDLGVBQWUsRUFBYyxhQUFhLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUVqRixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFFL0QsT0FBTyxFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBS2hHLE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBTTdFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUVwRCxNQUFNLE9BQU8sZUFBZTtJQWF4QixZQUFvQixrQkFBb0QsRUFBVSxRQUEwQjtRQUF4Rix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQWtDO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDeEcsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ2xELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFDN0MsQ0FBQztJQUVNLGNBQWMsQ0FBQyxJQUFxQixFQUFFLE1BQTRCO1FBRXJFLE1BQU0sUUFBUSxHQUFHLElBQUksYUFBYSxFQUFVLENB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QUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVPLGtCQUFrQixDQUFDLFNBQXFDO1FBQzVELE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNJLENBQUM7O0FBM21CRCw2RUFBNkU7QUFDN0UsNEdBQTRHO0FBQzVHLDBJQUEwSTtBQUNsSCxpQkFBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDLFdBQVc7QUFDN0IsaUJBQUMsR0FBRyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luY3JlbWVudGluZ0NvdW50ZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdHkvaW5jcmVtZW50aW5nLWNvdW50ZXInO1xyXG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgUmVwbGF5U3ViamVjdCwgc3dpdGNoTWFwLCB0YWtlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtHTFBLLCBMUCwgUmVzdWx0fSBmcm9tICdnbHBrLmpzJztcclxuaW1wb3J0IHtQZXRyaU5ldH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BldHJpLW5ldCc7XHJcbmltcG9ydCB7UHJvYmxlbVNvbHV0aW9ufSBmcm9tICcuL3Byb2JsZW0tc29sdXRpb24nO1xyXG5pbXBvcnQge0NvbnN0cmFpbnQsIEdvYWwsIE1lc3NhZ2VMZXZlbCwgU29sdXRpb259IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9nbHBrL2dscGstY29uc3RhbnRzJztcclxuaW1wb3J0IHtTdWJqZWN0VG99IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9nbHBrL3N1YmplY3QtdG8nO1xyXG5pbXBvcnQge0FyY30gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL2FyYyc7XHJcbmltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3RyYW5zaXRpb24nO1xyXG5pbXBvcnQge1ZhcmlhYmxlfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvZ2xway92YXJpYWJsZSc7XHJcbmltcG9ydCB7Q29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzfSBmcm9tICcuL2NvbnN0cmFpbnRzLXdpdGgtbmV3LXZhcmlhYmxlcyc7XHJcbmltcG9ydCB7Qm91bmR9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9nbHBrL2JvdW5kJztcclxuaW1wb3J0IHtQZXRyaU5ldFJlZ2lvblRyYW5zZm9ybWVyU2VydmljZX0gZnJvbSAnLi4vcGV0cmktbmV0LXJlZ2lvbi10cmFuc2Zvcm1lci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDb21iaW5hdGlvblJlc3VsdH0gZnJvbSAnLi9jb21iaW5hdGlvbi1yZXN1bHQnO1xyXG5pbXBvcnQge1JlZ2lvbn0gZnJvbSAnLi9yZWdpb24nO1xyXG5pbXBvcnQge1JlZ2lvbnNDb25maWd1cmF0aW9ufSBmcm9tICcuL3JlZ2lvbnMtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7YXJyYWlmeX0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0eS9hcnJhaWZ5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWdpb25JbHBTb2x2ZXIge1xyXG5cclxuICAgIC8vIGsgYW5kIEsgZGVmaW5lZCBhcyBwZXIgaHR0cHM6Ly9ibG9nLmFkYW1mdXJtYW5lay5wbC8yMDE1LzA5LzEyL2lscC1wYXJ0LTQvXHJcbiAgICAvLyBmb3Igc29tZSByZWFzb24gayA9IDJeMTkgd2hpbGUgbm90IGxhcmdlIGVub3VnaCB0byBjYXVzZSBwcmVjaXNpb24gcHJvYmxlbXMgaW4gZWl0aGVyIGRvdWJsZXMgb3IgaW50ZWdlcnNcclxuICAgIC8vIGhhcyBjYXVzZWQgdGhlIGl0ZXJhdGl2ZSBhbGdvcml0aG0gdG8gbG9vcCBpbmRlZmluaXRlbHksIHByZXN1bWFibHkgYmVjYXVzZSBvZiBzb21lIHByZWNpc2lvbiBlcnJvciBpbiB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhlIHNvbHZlclxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgayA9ICgxIDw8IDEwKSAtIDEgLy8gMl4xMCAtIDFcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEsgPSAyICogUmVnaW9uSWxwU29sdmVyLmsgKyAxO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2NvbnN0cmFpbnRDb3VudGVyOiBJbmNyZW1lbnRpbmdDb3VudGVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdmFyaWFibGVDb3VudGVyOiBJbmNyZW1lbnRpbmdDb3VudGVyO1xyXG4gICAgcHJpdmF0ZSBfYWxsVmFyaWFibGVzOiBTZXQ8c3RyaW5nPjtcclxuICAgIHByaXZhdGUgX3BsYWNlVmFyaWFibGVzOiBTZXQ8c3RyaW5nPjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZWdpb25UcmFuc2Zvcm1lcjogUGV0cmlOZXRSZWdpb25UcmFuc2Zvcm1lclNlcnZpY2UsIHByaXZhdGUgX3NvbHZlciQ6IE9ic2VydmFibGU8R0xQSz4pIHtcclxuICAgICAgICB0aGlzLl9jb25zdHJhaW50Q291bnRlciA9IG5ldyBJbmNyZW1lbnRpbmdDb3VudGVyKCk7XHJcbiAgICAgICAgdGhpcy5fdmFyaWFibGVDb3VudGVyID0gbmV3IEluY3JlbWVudGluZ0NvdW50ZXIoKTtcclxuICAgICAgICB0aGlzLl9hbGxWYXJpYWJsZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLl9wbGFjZVZhcmlhYmxlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb21wdXRlUmVnaW9ucyhuZXRzOiBBcnJheTxQZXRyaU5ldD4sIGNvbmZpZzogUmVnaW9uc0NvbmZpZ3VyYXRpb24pOiBPYnNlcnZhYmxlPFJlZ2lvbj4ge1xyXG5cclxuICAgICAgICBjb25zdCByZWdpb25zJCA9IG5ldyBSZXBsYXlTdWJqZWN0PFJlZ2lvbj4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29tYmluZWQgPSB0aGlzLmNvbWJpbmVJbnB1dE5ldHMobmV0cyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGlscCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHRoaXMuc2V0VXBJbml0aWFsSUxQKGNvbWJpbmVkLCBjb25maWcpKTtcclxuICAgICAgICBpbHAkLnBpcGUoc3dpdGNoTWFwKGlscCA9PiB0aGlzLnNvbHZlSUxQKGlscCkpKS5zdWJzY3JpYmUoKHBzOiBQcm9ibGVtU29sdXRpb24pID0+IHtcclxuICAgICAgICAgICAgaWYgKHBzLnNvbHV0aW9uLnJlc3VsdC5zdGF0dXMgPT09IFNvbHV0aW9uLk9QVElNQUwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IHRoaXMuX3JlZ2lvblRyYW5zZm9ybWVyLmRpc3BsYXlSZWdpb25Jbk5ldChwcy5zb2x1dGlvbiwgY29tYmluZWQubmV0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPIGNoZWNrIGlmIHRoZSByZWdpb24gaXMgbmV3IGFuZCB3ZSBhcmUgbm90IHRyYXBwZWQgaW4gYSBsb29wXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9uRW1wdHlJbnB1dFNldCA9IGNvbWJpbmVkLmlucHV0cy5maW5kKGlucHV0cyA9PiBpbnB1dHMuc2l6ZSA+IDApID8/IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlZ2lvbnMkLm5leHQoe25ldDogcmVnaW9uLCBpbnB1dHM6IEFycmF5LmZyb20obm9uRW1wdHlJbnB1dFNldCl9KTtcclxuICAgICAgICAgICAgICAgIGlscCQubmV4dCh0aGlzLmFkZENvbnN0cmFpbnRzVG9JTFAocHMpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHdlIGFyZSBkb25lLCB0aGVyZSBhcmUgbm8gbW9yZSByZWdpb25zXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdmaW5hbCBub24tb3B0aW1hbCByZXN1bHQnLCBwcy5zb2x1dGlvbik7XHJcbiAgICAgICAgICAgICAgICByZWdpb25zJC5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWxwJC5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZWdpb25zJC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbWJpbmVJbnB1dE5ldHMobmV0czogQXJyYXk8UGV0cmlOZXQ+KTogQ29tYmluYXRpb25SZXN1bHQge1xyXG4gICAgICAgIGlmIChuZXRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N5bnRoZXNpcyBtdXN0IGJlIHBlcmZvcm1lZCBvbiBhdCBsZWFzdCBvbmUgaW5wdXQgbmV0IScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldHNbMF07XHJcbiAgICAgICAgY29uc3QgaW5wdXRzOiBBcnJheTxTZXQ8c3RyaW5nPj4gPSBbcmVzdWx0LmlucHV0UGxhY2VzXTtcclxuICAgICAgICBjb25zdCBvdXRwdXRzOiBBcnJheTxTZXQ8c3RyaW5nPj4gPSBbcmVzdWx0Lm91dHB1dFBsYWNlc107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbmV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1bmlvbiA9IFBldHJpTmV0Lm5ldFVuaW9uKHJlc3VsdCwgbmV0c1tpXSk7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuaW9uLm5ldDtcclxuICAgICAgICAgICAgaW5wdXRzLnB1c2godW5pb24uaW5wdXRQbGFjZXNCKTtcclxuICAgICAgICAgICAgb3V0cHV0cy5wdXNoKHVuaW9uLm91dHB1dFBsYWNlc0IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtuZXQ6IHJlc3VsdCwgaW5wdXRzLCBvdXRwdXRzfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFVwSW5pdGlhbElMUChjb21iaW5lZDogQ29tYmluYXRpb25SZXN1bHQsIGNvbmZpZzogUmVnaW9uc0NvbmZpZ3VyYXRpb24pOiBMUCB7XHJcbiAgICAgICAgY29uc3QgbmV0ID0gY29tYmluZWQubmV0O1xyXG5cclxuICAgICAgICB0aGlzLl9wbGFjZVZhcmlhYmxlcyA9IG5ldyBTZXQobmV0LmdldFBsYWNlcygpLm1hcChwID0+IHAuZ2V0SWQoKSkpO1xyXG4gICAgICAgIHRoaXMuX2FsbFZhcmlhYmxlcyA9IG5ldyBTZXQ8c3RyaW5nPih0aGlzLl9wbGFjZVZhcmlhYmxlcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGluaXRpYWw6IExQID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnaWxwJyxcclxuICAgICAgICAgICAgb2JqZWN0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVnaW9uJyxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogR29hbC5NSU5JTVVNLFxyXG4gICAgICAgICAgICAgICAgdmFyczogbmV0LmdldFBsYWNlcygpLm1hcChwID0+IHRoaXMudmFyaWFibGUocC5nZXRJZCgpKSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1YmplY3RUbzogW10sXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbml0aWFsW2NvbmZpZy5vbmVCb3VuZFJlZ2lvbnMgPyAnYmluYXJpZXMnIDogJ2dlbmVyYWxzJ10gPSBBcnJheS5mcm9tKHRoaXMuX3BsYWNlVmFyaWFibGVzKTtcclxuICAgICAgICB0aGlzLmFwcGx5Q29uc3RyYWludHMoaW5pdGlhbCwgdGhpcy5jcmVhdGVJbml0aWFsQ29uc3RyYWludHMoY29tYmluZWQsIGNvbmZpZykpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5pdGlhbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFwcGx5Q29uc3RyYWludHMoaWxwOiBMUCwgY29uc3RyYWludHM6IENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcykge1xyXG4gICAgICAgIGlmIChpbHAuc3ViamVjdFRvID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWxwLnN1YmplY3RUbyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbHAuc3ViamVjdFRvLnB1c2goLi4uY29uc3RyYWludHMuY29uc3RyYWludHMpO1xyXG5cclxuICAgICAgICBpZiAoaWxwLmJpbmFyaWVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWxwLmJpbmFyaWVzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlscC5iaW5hcmllcy5wdXNoKC4uLmNvbnN0cmFpbnRzLmJpbmFyeVZhcmlhYmxlcyk7XHJcblxyXG4gICAgICAgIGlmIChpbHAuZ2VuZXJhbHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpbHAuZ2VuZXJhbHMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWxwLmdlbmVyYWxzLnB1c2goLi4uY29uc3RyYWludHMuaW50ZWdlclZhcmlhYmxlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVJbml0aWFsQ29uc3RyYWludHMoY29tYmluZWQ6IENvbWJpbmF0aW9uUmVzdWx0LCBjb25maWc6IFJlZ2lvbnNDb25maWd1cmF0aW9uKTogQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzIHtcclxuICAgICAgICBjb25zdCBuZXQgPSBjb21iaW5lZC5uZXQ7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBBcnJheTxDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXM+ID0gW107XHJcblxyXG4gICAgICAgIC8vIG9ubHkgbm9uLW5lZ2F0aXZlIHNvbHV0aW9uc1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLm5ldC5nZXRQbGFjZXMoKS5tYXAocCA9PiB0aGlzLmdyZWF0ZXJFcXVhbFRoYW4odGhpcy52YXJpYWJsZShwLmdldElkKCkpLCAwKSkpO1xyXG5cclxuICAgICAgICAvLyBub24temVybyBzb2x1dGlvbnNcclxuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmdyZWF0ZXJFcXVhbFRoYW4obmV0LmdldFBsYWNlcygpLm1hcChwID0+IHRoaXMudmFyaWFibGUocC5nZXRJZCgpKSksIDEpKTtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbCBtYXJraW5ncyBtdXN0IGJlIHRoZSBzYW1lXHJcbiAgICAgICAgaWYgKGNvbWJpbmVkLmlucHV0cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vbmVtcHR5SW5wdXRzID0gY29tYmluZWQuaW5wdXRzLmZpbHRlcihpbnB1dHMgPT4gaW5wdXRzLnNpemUgIT09IDApO1xyXG4gICAgICAgICAgICBjb25zdCBpbnB1dHNBID0gQXJyYXkuZnJvbShub25lbXB0eUlucHV0c1swXSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbm9uZW1wdHlJbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0c0IgPSBBcnJheS5mcm9tKG5vbmVtcHR5SW5wdXRzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuc3VtRXF1YWxzWmVybyguLi5pbnB1dHNBLm1hcChpZCA9PiB0aGlzLnZhcmlhYmxlKGlkLCAxKSksIC4uLmlucHV0c0IubWFwKGlkID0+IHRoaXMudmFyaWFibGUoaWQsIC0xKSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcGxhY2VzIHdpdGggbm8gcG9zdC1zZXQgc2hvdWxkIGJlIGVtcHR5XHJcbiAgICAgICAgaWYgKGNvbmZpZy5ub091dHB1dFBsYWNlcykge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCguLi5uZXQuZ2V0UGxhY2VzKCkuZmlsdGVyKHAgPT4gcC5vdXRnb2luZ0FyY3MubGVuZ3RoID09PSAwKS5tYXAocCA9PiB0aGlzLmxlc3NFcXVhbFRoYW4odGhpcy52YXJpYWJsZShwLmdldElkKCkpLCAwKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZ3JhZGllbnQgY29uc3RyYWludHNcclxuICAgICAgICBjb25zdCBsYWJlbHMgPSB0aGlzLmNvbGxlY3RUcmFuc2l0aW9uQnlMYWJlbChuZXQpO1xyXG4gICAgICAgIGNvbnN0IHJpc2VTdW1WYXJpYWJsZXM6IEFycmF5PFZhcmlhYmxlPiA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGFic29sdXRlUmlzZVN1bVZhcmlhYmxlczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHRyYW5zaXRpb25zXSBvZiBsYWJlbHMuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb25zV2l0aFNhbWVMYWJlbCA9IHRyYW5zaXRpb25zLmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgdDEgPSB0cmFuc2l0aW9ucy5zcGxpY2UoMCwgMSlbMF07XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnLm9idGFpblBhcnRpYWxPcmRlcnMpIHtcclxuICAgICAgICAgICAgICAgIC8vIHQxIHBvc3Qtc2V0XHJcbiAgICAgICAgICAgICAgICByaXNlU3VtVmFyaWFibGVzLnB1c2goLi4udGhpcy5jcmVhdGVWYXJpYWJsZXNGcm9tUGxhY2VJZHModDEub3V0Z29pbmdBcmNzLm1hcCgoYTogQXJjKSA9PiBhLmRlc3RpbmF0aW9uSWQpLCAxKSk7XHJcbiAgICAgICAgICAgICAgICAvLyB0MSBwcmUtc2V0XHJcbiAgICAgICAgICAgICAgICByaXNlU3VtVmFyaWFibGVzLnB1c2goLi4udGhpcy5jcmVhdGVWYXJpYWJsZXNGcm9tUGxhY2VJZHModDEuaW5nb2luZ0FyY3MubWFwKChhOiBBcmMpID0+IGEuc291cmNlSWQpLCAtMSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNpbmdsZVJpc2VWYXJpYWJsZXMgPSB0aGlzLmNyZWF0ZVZhcmlhYmxlc0Zyb21QbGFjZUlkcyh0MS5vdXRnb2luZ0FyY3MubWFwKChhOiBBcmMpID0+IGEuZGVzdGluYXRpb25JZCksIDEpO1xyXG4gICAgICAgICAgICAgICAgc2luZ2xlUmlzZVZhcmlhYmxlcy5wdXNoKC4uLnRoaXMuY3JlYXRlVmFyaWFibGVzRnJvbVBsYWNlSWRzKHQxLmluZ29pbmdBcmNzLm1hcCgoYTogQXJjKSA9PiBhLnNvdXJjZUlkKSwgLTEpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaW5nbGVSaXNlID0gdGhpcy5jb21iaW5lQ29lZmZpY2llbnRzKHNpbmdsZVJpc2VWYXJpYWJsZXMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWJzID0gdGhpcy5oZWxwZXJWYXJpYWJsZU5hbWUoJ2FicycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWJzb2x1dGVSaXNlID0gdGhpcy54QWJzb2x1dGVPZlN1bShhYnMsIHNpbmdsZVJpc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIGFic29sdXRlUmlzZVN1bVZhcmlhYmxlcy5wdXNoKGFicyk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMuY29tYmluZUFuZEludHJvZHVjZVZhcmlhYmxlcyhcclxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsIGFicyxcclxuICAgICAgICAgICAgICAgICAgICBhYnNvbHV0ZVJpc2UpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodHJhbnNpdGlvbnNXaXRoU2FtZUxhYmVsID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCB0MiBvZiB0cmFuc2l0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgLy8gdDEgcG9zdC1zZXRcclxuICAgICAgICAgICAgICAgIGxldCB2YXJpYWJsZXMgPSB0aGlzLmNyZWF0ZVZhcmlhYmxlc0Zyb21QbGFjZUlkcyh0MS5vdXRnb2luZ0FyY3MubWFwKChhOiBBcmMpID0+IGEuZGVzdGluYXRpb25JZCksIDEpO1xyXG4gICAgICAgICAgICAgICAgLy8gdDEgcHJlLXNldFxyXG4gICAgICAgICAgICAgICAgdmFyaWFibGVzLnB1c2goLi4udGhpcy5jcmVhdGVWYXJpYWJsZXNGcm9tUGxhY2VJZHModDEuaW5nb2luZ0FyY3MubWFwKChhOiBBcmMpID0+IGEuc291cmNlSWQpLCAtMSkpO1xyXG4gICAgICAgICAgICAgICAgLy8gdDIgcG9zdC1zZXRcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlcy5wdXNoKC4uLnRoaXMuY3JlYXRlVmFyaWFibGVzRnJvbVBsYWNlSWRzKHQyLm91dGdvaW5nQXJjcy5tYXAoKGE6IEFyYykgPT4gYS5kZXN0aW5hdGlvbklkKSwgLTEpKTtcclxuICAgICAgICAgICAgICAgIC8vIHQyIHByZS1zZXRcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlcy5wdXNoKC4uLnRoaXMuY3JlYXRlVmFyaWFibGVzRnJvbVBsYWNlSWRzKHQyLmluZ29pbmdBcmNzLm1hcCgoYTogQXJjKSA9PiBhLnNvdXJjZUlkKSwgMSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlcyA9IHRoaXMuY29tYmluZUNvZWZmaWNpZW50cyh2YXJpYWJsZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuc3VtRXF1YWxzWmVybyguLi52YXJpYWJsZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZy5vYnRhaW5QYXJ0aWFsT3JkZXJzKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBTdW0gb2YgcmlzZXMgc2hvdWxkIGJlIDAgQU5EIFN1bSBvZiBhYnNvbHV0ZSByaXNlcyBzaG91bGQgYmUgMiAoaW50ZXJuYWwgcGxhY2VzKVxyXG4gICAgICAgICAgICAgICAgT1JcclxuICAgICAgICAgICAgICAgIFN1bSBvZiBhYnNvbHV0ZSByaXNlcyBzaG91bGQgYmUgMSAoaW5pdGlhbCBhbmQgZmluYWwgcGxhY2VzKVxyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIC8vIHN1bSBvZiByaXNlcyBpcyAwXHJcbiAgICAgICAgICAgIGNvbnN0IHJpc2VTdW1Jc1plcm8gPSB0aGlzLmhlbHBlclZhcmlhYmxlTmFtZSgncmlzZUVxdWFsWmVybycpO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnhXaGVuQUVxdWFsc0IocmlzZVN1bUlzWmVybywgdGhpcy5jb21iaW5lQ29lZmZpY2llbnRzKHJpc2VTdW1WYXJpYWJsZXMpLCAwKSk7XHJcbiAgICAgICAgICAgIC8vIHN1bSBvZiBhYnNvbHV0ZSB2YWx1ZXMgb2YgcmlzZXMgaXMgMlxyXG4gICAgICAgICAgICBjb25zdCBhYnNSaXNlU3VtSXNUd28gPSB0aGlzLmhlbHBlclZhcmlhYmxlTmFtZSgnYWJzUmlzZVN1bVR3bycpO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnhXaGVuQUVxdWFsc0IoYWJzUmlzZVN1bUlzVHdvLCBhYnNvbHV0ZVJpc2VTdW1WYXJpYWJsZXMsIDIpKTtcclxuICAgICAgICAgICAgLy8gc3VtIGlzIDAgQU5EIHN1bSBhYnNvbHV0ZSBpcyAyXHJcbiAgICAgICAgICAgIGNvbnN0IGludGVybmFsUGxhY2UgPSB0aGlzLmhlbHBlclZhcmlhYmxlTmFtZSgncGxhY2VJc0ludGVybmFsJyk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcy5jb21iaW5lQW5kSW50cm9kdWNlVmFyaWFibGVzKFxyXG4gICAgICAgICAgICAgICAgW3Jpc2VTdW1Jc1plcm8sIGFic1Jpc2VTdW1Jc1R3b10sIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIHRoaXMueEFhbmRCKGludGVybmFsUGxhY2UsIHJpc2VTdW1Jc1plcm8sIGFic1Jpc2VTdW1Jc1R3bylcclxuICAgICAgICAgICAgKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBzdW0gb2YgYWJzb2x1dGUgdmFsdWVzIG9mIHJpc2UgaXMgMVxyXG4gICAgICAgICAgICBjb25zdCBhYnNSaXNlU3VtSXNPbmUgPSB0aGlzLmhlbHBlclZhcmlhYmxlTmFtZSgnYWJzUmlzZVN1bU9uZScpO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnhXaGVuQUVxdWFsc0IoYWJzUmlzZVN1bUlzT25lLCBhYnNvbHV0ZVJpc2VTdW1WYXJpYWJsZXMsIDEpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHBsYWNlIGlzIGludGVybmFsIE9SIHBsYWNlIGlzIGluaXRpYWwvZmluYWxcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJuYWxPckZpbmFsID0gdGhpcy5oZWxwZXJWYXJpYWJsZU5hbWUoJ2ludGVybmFsT3JGaW5hbCcpO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMuY29tYmluZUFuZEludHJvZHVjZVZhcmlhYmxlcyhcclxuICAgICAgICAgICAgICAgIFtpbnRlcm5hbFBsYWNlLCBhYnNSaXNlU3VtSXNPbmUsIGludGVybmFsT3JGaW5hbF0sIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIHRoaXMueEFvckIoaW50ZXJuYWxPckZpbmFsLCBpbnRlcm5hbFBsYWNlLCBhYnNSaXNlU3VtSXNPbmUpXHJcbiAgICAgICAgICAgICkpO1xyXG5cclxuICAgICAgICAgICAgLy8gcGxhY2UgaXMgaW50ZXJuYWwgT1IgcGxhY2UgaXMgaW5pdGlhbC9maW5hbCBtdXN0IGJlIHRydWVcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5lcXVhbCh0aGlzLnZhcmlhYmxlKGludGVybmFsT3JGaW5hbCksIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMuY29tYmluZSguLi5yZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkQ29uc3RyYWludHNUb0lMUChwczogUHJvYmxlbVNvbHV0aW9uKTogTFAge1xyXG4gICAgICAgIGNvbnN0IGlscCA9IHBzLmlscDtcclxuXHJcbiAgICAgICAgLy8gbm8gcmVnaW9uIHRoYXQgY29udGFpbnMgdGhlIG5ldyBzb2x1dGlvbiBhcyBzdWJzZXRcclxuICAgICAgICBjb25zdCByZWdpb24gPSBwcy5zb2x1dGlvbi5yZXN1bHQudmFycztcclxuICAgICAgICBjb25zdCByZWdpb25QbGFjZXMgPSBPYmplY3QuZW50cmllcyhyZWdpb24pLmZpbHRlcigoW2ssIHZdKSA9PiB2ICE9IDAgJiYgdGhpcy5fcGxhY2VWYXJpYWJsZXMuaGFzKGspKTtcclxuICAgICAgICBjb25zdCBhZGRpdGlvbmFsQ29uc3RyYWludHMgPSByZWdpb25QbGFjZXMubWFwKChbaywgdl0pID0+IHRoaXMueVdoZW5BR3JlYXRlckVxdWFsQihrLCB2KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHlWYXJpYWJsZXMgPVxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsQ29uc3RyYWludHNcclxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoXHJcbiAgICAgICAgICAgICAgICAgICAgKGFyciwgY29uc3RyYWludCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCguLi5jb25zdHJhaW50LmJpbmFyeVZhcmlhYmxlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgW10gYXMgQXJyYXk8c3RyaW5nPilcclxuICAgICAgICAgICAgICAgIC5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgeSA9PiB0aGlzLnZhcmlhYmxlKHkpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgIFN1bSBvZiB4LWVzIHNob3VsZCBiZSBsZXNzIHRoYW4gdGhlaXIgbnVtYmVyXHJcbiAgICAgICAgICAgIHggPSAxIC0geVxyXG4gICAgICAgICAgICBUaGVyZWZvcmUgc3VtIG9mIHkgc2hvdWxkIGJlIGdyZWF0ZXIgdGhhbiAwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYWRkaXRpb25hbENvbnN0cmFpbnRzLnB1c2godGhpcy5zdW1HcmVhdGVyVGhhbih5VmFyaWFibGVzLCAwKSk7XHJcbiAgICAgICAgdGhpcy5hcHBseUNvbnN0cmFpbnRzKGlscCwgQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzLmNvbWJpbmUoLi4uYWRkaXRpb25hbENvbnN0cmFpbnRzKSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3NvbHV0aW9uJywgcHMuc29sdXRpb24ucmVzdWx0LnZhcnMpO1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ25vbi16ZXJvJywgcmVnaW9uUGxhY2VzKTtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdhZGRpdGlvbmFsIGNvbnN0cmFpbnQnLCBpbHAuc3ViamVjdFRvW2lscC5zdWJqZWN0VG8ubGVuZ3RoIC0gMV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gaWxwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29sbGVjdFRyYW5zaXRpb25CeUxhYmVsKG5ldDogUGV0cmlOZXQpOiBNYXA8c3RyaW5nLCBBcnJheTxUcmFuc2l0aW9uPj4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXA8c3RyaW5nLCBBcnJheTxUcmFuc2l0aW9uPj4oKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgbmV0LmdldFRyYW5zaXRpb25zKCkpIHtcclxuICAgICAgICAgICAgaWYgKHQubGFiZWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcmFuc2l0aW9uIHdpdGggaWQgJyR7dC5pZH0nIGhhcyBubyBsYWJlbCEgQWxsIHRyYW5zaXRpb25zIG11c3QgYmUgbGFiZWxlZCBpbiB0aGUgaW5wdXQgbmV0IWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gcmVzdWx0LmdldCh0LmxhYmVsKTtcclxuICAgICAgICAgICAgaWYgKGFycmF5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5zZXQodC5sYWJlbCwgW3RdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2godCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVZhcmlhYmxlc0Zyb21QbGFjZUlkcyhwbGFjZUlkczogQXJyYXk8c3RyaW5nPiwgY29lZmZpY2llbnQ6IG51bWJlcik6IEFycmF5PFZhcmlhYmxlPiB7XHJcbiAgICAgICAgcmV0dXJuIHBsYWNlSWRzLm1hcChpZCA9PiB0aGlzLnZhcmlhYmxlKGlkLCBjb2VmZmljaWVudCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29tYmluZUNvZWZmaWNpZW50cyh2YXJpYWJsZXM6IEFycmF5PFZhcmlhYmxlPik6IEFycmF5PFZhcmlhYmxlPiB7XHJcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHZhcmlhYmxlIG9mIHZhcmlhYmxlcykge1xyXG4gICAgICAgICAgICBjb25zdCBjb2VmID0gbWFwLmdldCh2YXJpYWJsZS5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKGNvZWYgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbWFwLnNldCh2YXJpYWJsZS5uYW1lLCBjb2VmICsgdmFyaWFibGUuY29lZik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXAuc2V0KHZhcmlhYmxlLm5hbWUsIHZhcmlhYmxlLmNvZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQ6IEFycmF5PFZhcmlhYmxlPiA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIGNvZWZdIG9mIG1hcCkge1xyXG4gICAgICAgICAgICBpZiAoY29lZiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy52YXJpYWJsZShuYW1lLCBjb2VmKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoZWxwZXJWYXJpYWJsZU5hbWUocHJlZml4ID0gJ3knKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgaGVscFZhcmlhYmxlTmFtZTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGhlbHBWYXJpYWJsZU5hbWUgPSBgJHtwcmVmaXh9JHt0aGlzLl92YXJpYWJsZUNvdW50ZXIubmV4dCgpfWA7XHJcbiAgICAgICAgfSB3aGlsZSAodGhpcy5fYWxsVmFyaWFibGVzLmhhcyhoZWxwVmFyaWFibGVOYW1lKSk7XHJcbiAgICAgICAgdGhpcy5fYWxsVmFyaWFibGVzLmFkZChoZWxwVmFyaWFibGVOYW1lKTtcclxuICAgICAgICByZXR1cm4gaGVscFZhcmlhYmxlTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHhBYnNvbHV0ZU9mU3VtKHg6IHN0cmluZywgc3VtOiBBcnJheTxWYXJpYWJsZT4pOiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogQXMgcGVyIGh0dHBzOi8vYmxvZy5hZGFtZnVybWFuZWsucGwvMjAxNS8wOS8xOS9pbHAtcGFydC01L1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogeCA+PSAwXHJcbiAgICAgICAgICogKHggKyBzdW0gaXMgMCkgb3IgKHggLSBzdW0gaXMgMCkgPSAxXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuaGVscGVyVmFyaWFibGVOYW1lKCd5QWJzU3VtJyk7IC8vIHggKyBzdW0gaXMgMFxyXG4gICAgICAgIGNvbnN0IHogPSB0aGlzLmhlbHBlclZhcmlhYmxlTmFtZSgnekFic1N1bScpOyAvLyB4IC0gc3ltIGlzIDBcclxuICAgICAgICBjb25zdCB3ID0gdGhpcy5oZWxwZXJWYXJpYWJsZU5hbWUoJ3dBYnNTdW0nKTsgLy8geSBvciB6XHJcblxyXG4gICAgICAgIHJldHVybiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMuY29tYmluZUFuZEludHJvZHVjZVZhcmlhYmxlcyhcclxuICAgICAgICAgICAgdywgdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAvLyB4ID49IDBcclxuICAgICAgICAgICAgdGhpcy5ncmVhdGVyRXF1YWxUaGFuKHRoaXMudmFyaWFibGUoeCksIDApLFxyXG4gICAgICAgICAgICAvLyB3IGlzIHkgb3IgelxyXG4gICAgICAgICAgICB0aGlzLnhBb3JCKHcsIHksIHopLFxyXG4gICAgICAgICAgICAvLyB3IGlzIHRydWVcclxuICAgICAgICAgICAgdGhpcy5lcXVhbCh0aGlzLnZhcmlhYmxlKHcpLCAxKSxcclxuICAgICAgICAgICAgLy8geCArIHN1bSBpcyAwXHJcbiAgICAgICAgICAgIHRoaXMueFdoZW5BRXF1YWxzQih5LCBbdGhpcy52YXJpYWJsZSh4KSwgLi4uc3VtLm1hcChhID0+IHRoaXMuY3JlYXRlT3JDb3B5VmFyaWFibGUoYSkpXSwgMCksXHJcbiAgICAgICAgICAgIC8vIHggLSBzdW0gaXMgMFxyXG4gICAgICAgICAgICB0aGlzLnhXaGVuQUVxdWFsc0IoeiwgW3RoaXMudmFyaWFibGUoeCksIC4uLnN1bS5tYXAoYSA9PiB0aGlzLmNyZWF0ZU9yQ29weVZhcmlhYmxlKGEsIC0xKSldLCAwKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB4V2hlbkFFcXVhbHNCKHg6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBhOiBzdHJpbmcgfCBBcnJheTxzdHJpbmc+IHwgQXJyYXk8VmFyaWFibGU+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGI6IHN0cmluZyB8IG51bWJlcik6IENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcyB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgIEFzIHBlciBodHRwczovL2Jsb2cuYWRhbWZ1cm1hbmVrLnBsLzIwMTUvMDkvMTIvaWxwLXBhcnQtNC9cclxuXHJcbiAgICAgICAgICAgICB4IGlzIGEgZXF1YWxzIGIgPD0+IGEgZ3JlYXRlciBlcXVhbCB0aGFuIGIgYW5kIGEgbGVzcyBlcXVhbCB0aGFuIGJcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuaGVscGVyVmFyaWFibGVOYW1lKCd5V2hlbkVxdWFscycpO1xyXG4gICAgICAgIGNvbnN0IHogPSB0aGlzLmhlbHBlclZhcmlhYmxlTmFtZSgneldoZW5FcXVhbHMnKTtcclxuXHJcbiAgICAgICAgY29uc3QgYUdyZWF0ZXJFcXVhbEIgPSB0aGlzLnhXaGVuQUdyZWF0ZXJFcXVhbEIoeSwgYSwgYik7XHJcbiAgICAgICAgY29uc3QgYUxlc3NFcXVhbEIgPSB0aGlzLnhXaGVuQUxlc3NFcXVhbEIoeiwgYSwgYik7XHJcblxyXG4gICAgICAgIHJldHVybiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMuY29tYmluZUFuZEludHJvZHVjZVZhcmlhYmxlcyhcclxuICAgICAgICAgICAgW3gsIHldLCB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGFHcmVhdGVyRXF1YWxCLFxyXG4gICAgICAgICAgICBhTGVzc0VxdWFsQixcclxuICAgICAgICAgICAgdGhpcy54QWFuZEIoeCwgeSwgeiksXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHlXaGVuQUdyZWF0ZXJFcXVhbEIoYTogc3RyaW5nLCBiOiBudW1iZXIpOiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgIEFzIHBlciBodHRwczovL2Jsb2cuYWRhbWZ1cm1hbmVrLnBsLzIwMTUvMDkvMTIvaWxwLXBhcnQtNC8gYW5kIGh0dHBzOi8vYmxvZy5hZGFtZnVybWFuZWsucGwvMjAxNS8wOC8yMi9pbHAtcGFydC0xL1xyXG4gICAgICAgICAgICB4ID0gYSA+PSBiIGNhbiBiZSBkZWZpbmVkIGFzICEoYiA+IGEpXHJcbiAgICAgICAgICAgIHRoZSBuZWdhdGlvbiBmb3IgYmluYXJ5IHZhcmlhYmxlcyBjYW4gYmUgZXhwcmVzc2VkIGFzIChmb3IgeCA9ICF5IGJvdGggYmluYXJ5KSB4ID0gMSAtIHlcclxuICAgICAgICAgICAgdGhlIDEgLSB5IGZvcm0gY2FuIGJlIGV4dHJhY3RlZCBhbmQgYWRkZWQgdG8gdGhlIGNvbnN0cmFpbnQgdGhhdCBwdXRzIGFsbCBoZWxwIHZhcmlhYmxlcyB0b2dldGhlciwgdGhlcmVmb3JlIHdlIG9ubHkgbmVlZCB0byBleHByZXNzIHkgPSBiID4gYVxyXG4gICAgICAgICAgICBmb3IgfGF8LHxifCA8PSBrIGFuZCBLID0gMmsgKyAxXHJcbiAgICAgICAgICAgIHkgPSBiID4gYSBjYW4gYmUgZXhwcmVzc2VkIGFzOlxyXG4gICAgICAgICAgICBhIC0gYiArIEt5ID49IDBcclxuICAgICAgICAgICAgYSAtIGIgKyBLeSA8PSBLLTFcclxuXHJcbiAgICAgICAgICAgIGluIG91ciBjYXNlIGIgaXMgYWx3YXlzIGEgY29uc3RhbnQgZ2l2ZW4gYnkgdGhlIHNvbHV0aW9uIChyZWdpb24pXHJcbiAgICAgICAgICAgIHRoZXJlZm9yZSB3ZSBvbmx5IGhhdmUgYSBhbmQgeSBhcyBvdXIgdmFyaWFibGVzIHdoaWNoIGdpdmVzOlxyXG4gICAgICAgICAgICBhICsgS3kgPj0gYlxyXG4gICAgICAgICAgICBhICsgS3kgPD0gSy0xICsgYlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmhlbHBlclZhcmlhYmxlTmFtZSgpO1xyXG5cclxuICAgICAgICBpZiAoYiA+IFJlZ2lvbklscFNvbHZlci5rKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJiXCIsIGIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwia1wiLCBSZWdpb25JbHBTb2x2ZXIuayk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImIgPiBrLiBUaGlzIGltcGxlbWVudGF0aW9uIGNhbiBvbmx5IGhhbmRsZSBzb2x1dGlvbnMgdGhhdCBhcmUgYXQgbW9zdCBrXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcy5jb21iaW5lQW5kSW50cm9kdWNlVmFyaWFibGVzKFxyXG4gICAgICAgICAgICBbeV0sIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgdGhpcy5ncmVhdGVyRXF1YWxUaGFuKFt0aGlzLnZhcmlhYmxlKGEpLCB0aGlzLnZhcmlhYmxlKHksIFJlZ2lvbklscFNvbHZlci5LKV0sIGIpLFxyXG4gICAgICAgICAgICB0aGlzLmxlc3NFcXVhbFRoYW4oW3RoaXMudmFyaWFibGUoYSksIHRoaXMudmFyaWFibGUoeSwgUmVnaW9uSWxwU29sdmVyLkspXSwgUmVnaW9uSWxwU29sdmVyLksgLSAxICsgYilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgeFdoZW5BR3JlYXRlckVxdWFsQih4OiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYTogc3RyaW5nIHwgQXJyYXk8c3RyaW5nPiB8IEFycmF5PFZhcmlhYmxlPixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiBzdHJpbmcgfCBudW1iZXIpOiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgIEFzIHBlciBodHRwczovL2Jsb2cuYWRhbWZ1cm1hbmVrLnBsLzIwMTUvMDkvMTIvaWxwLXBhcnQtNC9cclxuXHJcbiAgICAgICAgICAgIGEgaXMgZ3JlYXRlciBlcXVhbCBiIDw9PiBub3QgYSBsZXNzIHRoYW4gYlxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBjb25zdCB6ID0gdGhpcy5oZWxwZXJWYXJpYWJsZU5hbWUoJ3pBTGVzc0InKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcy5jb21iaW5lQW5kSW50cm9kdWNlVmFyaWFibGVzKHosIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgLy8geiB3aGVuIGEgbGVzcyB0aGFuIGJcclxuICAgICAgICAgICAgdGhpcy54V2hlbkFMZXNzQih6LCBhLCBiKSxcclxuICAgICAgICAgICAgLy8geCBub3QgelxyXG4gICAgICAgICAgICB0aGlzLnhOb3RBKHgsIHopXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHhXaGVuQUxlc3NFcXVhbEIoeDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGE6IHN0cmluZyB8IEFycmF5PHN0cmluZz4gfCBBcnJheTxWYXJpYWJsZT4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYjogc3RyaW5nIHwgbnVtYmVyKTogQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICBBcyBwZXIgaHR0cHM6Ly9ibG9nLmFkYW1mdXJtYW5lay5wbC8yMDE1LzA5LzEyL2lscC1wYXJ0LTQvXHJcblxyXG4gICAgICAgICAgICBhIGlzIGxlc3MgZXF1YWwgYiA8PT4gbm90IGEgZ3JlYXRlciB0aGFuIGJcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgY29uc3QgeiA9IHRoaXMuaGVscGVyVmFyaWFibGVOYW1lKCd6QUdyZWF0ZXJCJyk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMuY29tYmluZUFuZEludHJvZHVjZVZhcmlhYmxlcyh6LCB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIC8vIHogd2hlbiBhIGdyZWF0ZXIgdGhhbiBiXHJcbiAgICAgICAgICAgIHRoaXMueFdoZW5BR3JlYXRlckIoeiwgYSwgYiksXHJcbiAgICAgICAgICAgIC8vIHggbm90IHpcclxuICAgICAgICAgICAgdGhpcy54Tm90QSh4LCB6KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB4V2hlbkFHcmVhdGVyQih4OiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGE6IHN0cmluZyB8IEFycmF5PHN0cmluZz4gfCBBcnJheTxWYXJpYWJsZT4gfCBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGI6IHN0cmluZyB8IEFycmF5PHN0cmluZz4gfCBBcnJheTxWYXJpYWJsZT4gfCBudW1iZXIpOiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgIEFzIHBlciBodHRwczovL2Jsb2cuYWRhbWZ1cm1hbmVrLnBsLzIwMTUvMDkvMTIvaWxwLXBhcnQtNC9cclxuICAgICAgICAgICAgYSxiIGludGVnZXJcclxuICAgICAgICAgICAgfGF8LHxifCA8PSBrXHJcbiAgICAgICAgICAgIGsgPSAyXm4gLSAxLCBuIG5hdHVyYWxcclxuICAgICAgICAgICAgSyA9IDJrICsgMVxyXG4gICAgICAgICAgICB4IGJpbmFyeVxyXG5cclxuICAgICAgICAgICAgMCA8PSBiIC0gYSArIEt4IDw9IEsgLSAxXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGxldCBhSXNWYXJpYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBiSXNWYXJpYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShhKSkge1xyXG4gICAgICAgICAgICBhSXNWYXJpYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIGEgPSBhcnJhaWZ5KGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgYiA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShiKSkge1xyXG4gICAgICAgICAgICBiSXNWYXJpYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIGIgPSBhcnJhaWZ5KGIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYUlzVmFyaWFibGUgJiYgYklzVmFyaWFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcy5jb21iaW5lKFxyXG4gICAgICAgICAgICAgICAgLy8gYiAtIGEgKyBLeCA+PSAwXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyZWF0ZXJFcXVhbFRoYW4oW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLihiIGFzIEFycmF5PHN0cmluZz4gfCBBcnJheTxWYXJpYWJsZT4pLm1hcChiID0+IHRoaXMuY3JlYXRlT3JDb3B5VmFyaWFibGUoYikpLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLihhIGFzIEFycmF5PHN0cmluZz4gfCBBcnJheTxWYXJpYWJsZT4pLm1hcChhID0+IHRoaXMuY3JlYXRlT3JDb3B5VmFyaWFibGUoYSwgLTEpKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlKHgsIFJlZ2lvbklscFNvbHZlci5LKVxyXG4gICAgICAgICAgICAgICAgXSwgMCksXHJcbiAgICAgICAgICAgICAgICAvLyBiIC0gYSArIEt4IDw9IEsgLSAxXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlc3NFcXVhbFRoYW4oW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLihiIGFzIEFycmF5PHN0cmluZz4gfCBBcnJheTxWYXJpYWJsZT4pLm1hcChiID0+IHRoaXMuY3JlYXRlT3JDb3B5VmFyaWFibGUoYikpLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLihhIGFzIEFycmF5PHN0cmluZz4gfCBBcnJheTxWYXJpYWJsZT4pLm1hcChhID0+IHRoaXMuY3JlYXRlT3JDb3B5VmFyaWFibGUoYSwgLTEpKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlKHgsIFJlZ2lvbklscFNvbHZlci5LKVxyXG4gICAgICAgICAgICAgICAgXSwgUmVnaW9uSWxwU29sdmVyLksgLSAxKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFJc1ZhcmlhYmxlICYmICFiSXNWYXJpYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzLmNvbWJpbmUoXHJcbiAgICAgICAgICAgICAgICAvLyAtYSArIEt4ID49IC1iXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyZWF0ZXJFcXVhbFRoYW4oW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLihhIGFzIEFycmF5PHN0cmluZz4gfCBBcnJheTxWYXJpYWJsZT4pLm1hcChhID0+IHRoaXMuY3JlYXRlT3JDb3B5VmFyaWFibGUoYSwgLTEpKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlKHgsIFJlZ2lvbklscFNvbHZlci5LKVxyXG4gICAgICAgICAgICAgICAgXSwgLWIpLFxyXG4gICAgICAgICAgICAgICAgLy8gLWEgKyBLeCA8PSBLIC0gYiAtIDFcclxuICAgICAgICAgICAgICAgIHRoaXMubGVzc0VxdWFsVGhhbihbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uKGEgYXMgQXJyYXk8c3RyaW5nPiB8IEFycmF5PFZhcmlhYmxlPikubWFwKGEgPT4gdGhpcy5jcmVhdGVPckNvcHlWYXJpYWJsZShhLCAtMSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGUoeCwgUmVnaW9uSWxwU29sdmVyLkspXHJcbiAgICAgICAgICAgICAgICBdLCBSZWdpb25JbHBTb2x2ZXIuSyAtIChiIGFzIG51bWJlcikgLSAxKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFhSXNWYXJpYWJsZSAmJiBiSXNWYXJpYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzLmNvbWJpbmUoXHJcbiAgICAgICAgICAgICAgICAvLyBiICsgS3ggPj0gYVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmVhdGVyRXF1YWxUaGFuKFtcclxuICAgICAgICAgICAgICAgICAgICAuLi4oYiBhcyBBcnJheTxzdHJpbmc+IHwgQXJyYXk8VmFyaWFibGU+KS5tYXAoYiA9PiB0aGlzLmNyZWF0ZU9yQ29weVZhcmlhYmxlKGIpKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlKHgsIFJlZ2lvbklscFNvbHZlci5LKVxyXG4gICAgICAgICAgICAgICAgXSwgYSBhcyBudW1iZXIpLFxyXG4gICAgICAgICAgICAgICAgLy8gYiArIEt4IDw9IEsgKyBhIC0gMVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sZXNzRXF1YWxUaGFuKFtcclxuICAgICAgICAgICAgICAgICAgICAuLi4oYiBhcyBBcnJheTxzdHJpbmc+IHwgQXJyYXk8VmFyaWFibGU+KS5tYXAoYiA9PiB0aGlzLmNyZWF0ZU9yQ29weVZhcmlhYmxlKGIpKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlKHgsIFJlZ2lvbklscFNvbHZlci5LKVxyXG4gICAgICAgICAgICAgICAgXSwgUmVnaW9uSWxwU29sdmVyLksgKyAoYSBhcyBudW1iZXIpIC0gMSksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBjb21wYXJpc29uISB4IHdoZW4gJHthfSA+ICR7Yn1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB4V2hlbkFMZXNzQih4OiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGE6IHN0cmluZyB8IEFycmF5PHN0cmluZz4gfCBBcnJheTxWYXJpYWJsZT4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGI6IHN0cmluZyB8IG51bWJlcik6IENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcyB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgQXMgcGVyIGh0dHBzOi8vYmxvZy5hZGFtZnVybWFuZWsucGwvMjAxNS8wOS8xMi9pbHAtcGFydC00L1xyXG5cclxuICAgICAgICAgICAgYSBpcyBsZXNzIHRoYW4gYiA8PT4gYiBpcyBncmVhdGVyIHRoYW4gYVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiB0aGlzLnhXaGVuQUdyZWF0ZXJCKHgsIGIsIGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgeEFhbmRCKHg6IHN0cmluZywgYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgIEFzIHBlciBodHRwOi8vYmxvZy5hZGFtZnVybWFuZWsucGwvMjAxNS8wOC8yMi9pbHAtcGFydC0xL1xyXG4gICAgICAgICAgICBhLGIseCBiaW5hcnlcclxuXHJcbiAgICAgICAgICAgIDAgPD0gYSArIGIgLSAyeCA8PSAxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcy5jb21iaW5lKFxyXG4gICAgICAgICAgICAvLyBhICsgYiAtMnggPj0gMFxyXG4gICAgICAgICAgICB0aGlzLmdyZWF0ZXJFcXVhbFRoYW4oW3RoaXMudmFyaWFibGUoYSksIHRoaXMudmFyaWFibGUoYiksIHRoaXMudmFyaWFibGUoeCwgLTIpXSwgMCksXHJcbiAgICAgICAgICAgIC8vIGEgKyBiIC0yeCA8PSAxXHJcbiAgICAgICAgICAgIHRoaXMubGVzc0VxdWFsVGhhbihbdGhpcy52YXJpYWJsZShhKSwgdGhpcy52YXJpYWJsZShiKSwgdGhpcy52YXJpYWJsZSh4LCAtMildLCAxKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB4QW9yQih4OiBzdHJpbmcsIGE6IHN0cmluZywgYjogc3RyaW5nKTogQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICBBcyBwZXIgaHR0cDovL2Jsb2cuYWRhbWZ1cm1hbmVrLnBsLzIwMTUvMDgvMjIvaWxwLXBhcnQtMS9cclxuICAgICAgICAgICAgYSxiLHggYmluYXJ5XHJcblxyXG4gICAgICAgICAgICAtMSA8PSBhICsgYiAtIDJ4IDw9IDBcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzLmNvbWJpbmUoXHJcbiAgICAgICAgICAgIC8vIGEgKyBiIC0yeCA+PSAtMVxyXG4gICAgICAgICAgICB0aGlzLmdyZWF0ZXJFcXVhbFRoYW4oW3RoaXMudmFyaWFibGUoYSksIHRoaXMudmFyaWFibGUoYiksIHRoaXMudmFyaWFibGUoeCwgLTIpXSwgLTEpLFxyXG4gICAgICAgICAgICAvLyBhICsgYiAtMnggPD0gMFxyXG4gICAgICAgICAgICB0aGlzLmxlc3NFcXVhbFRoYW4oW3RoaXMudmFyaWFibGUoYSksIHRoaXMudmFyaWFibGUoYiksIHRoaXMudmFyaWFibGUoeCwgLTIpXSwgMClcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgeE5vdEEoeDogc3RyaW5nLCBhOiBzdHJpbmcpOiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgIEFzIHBlciBodHRwOi8vYmxvZy5hZGFtZnVybWFuZWsucGwvMjAxNS8wOC8yMi9pbHAtcGFydC0xL1xyXG4gICAgICAgICAgICBhLHggYmluYXJ5XHJcblxyXG4gICAgICAgICAgICB4ID0gMSAtIGFcclxuICAgICAgICAgKi9cclxuICAgICAgICAvLyB4ICsgYSA9IDFcclxuICAgICAgICByZXR1cm4gdGhpcy5lcXVhbChbdGhpcy52YXJpYWJsZSh4KSwgdGhpcy52YXJpYWJsZShhKV0sIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlT3JDb3B5VmFyaWFibGUob3JpZ2luYWw6IHN0cmluZyB8IFZhcmlhYmxlLCBjb2VmZmljaWVudDogbnVtYmVyID0gMSk6IFZhcmlhYmxlIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9yaWdpbmFsID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZShvcmlnaW5hbCwgY29lZmZpY2llbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhcmlhYmxlKG9yaWdpbmFsLm5hbWUsIG9yaWdpbmFsLmNvZWYgKiBjb2VmZmljaWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmFyaWFibGUobmFtZTogc3RyaW5nLCBjb2VmZmljaWVudDogbnVtYmVyID0gMSk6IFZhcmlhYmxlIHtcclxuICAgICAgICByZXR1cm4ge25hbWUsIGNvZWY6IGNvZWZmaWNpZW50fTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGVxdWFsKHZhcmlhYmxlczogVmFyaWFibGUgfCBBcnJheTxWYXJpYWJsZT4sIHZhbHVlOiBudW1iZXIpOiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYCR7dGhpcy5mb3JtYXRWYXJpYWJsZUxpc3QodmFyaWFibGVzKX0gPSAke3ZhbHVlfWApO1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzKHRoaXMuY29uc3RyYWluKFxyXG4gICAgICAgICAgICBhcnJhaWZ5KHZhcmlhYmxlcyksXHJcbiAgICAgICAgICAgIHt0eXBlOiBDb25zdHJhaW50LkZJWEVEX1ZBUklBQkxFLCB1YjogdmFsdWUsIGxiOiB2YWx1ZX1cclxuICAgICAgICApKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdyZWF0ZXJFcXVhbFRoYW4odmFyaWFibGVzOiBWYXJpYWJsZSB8IEFycmF5PFZhcmlhYmxlPiwgbG93ZXJCb3VuZDogbnVtYmVyKTogQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKGAke3RoaXMuZm9ybWF0VmFyaWFibGVMaXN0KHZhcmlhYmxlcyl9ID49ICR7bG93ZXJCb3VuZH1gKTtcclxuICAgICAgICByZXR1cm4gbmV3IENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcyh0aGlzLmNvbnN0cmFpbihcclxuICAgICAgICAgICAgYXJyYWlmeSh2YXJpYWJsZXMpLFxyXG4gICAgICAgICAgICB7dHlwZTogQ29uc3RyYWludC5MT1dFUl9CT1VORCwgdWI6IDAsIGxiOiBsb3dlckJvdW5kfVxyXG4gICAgICAgICkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbGVzc0VxdWFsVGhhbih2YXJpYWJsZXM6IFZhcmlhYmxlIHwgQXJyYXk8VmFyaWFibGU+LCB1cHBlckJvdW5kOiBudW1iZXIpOiBDb25zdHJhaW50c1dpdGhOZXdWYXJpYWJsZXMge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoYCR7dGhpcy5mb3JtYXRWYXJpYWJsZUxpc3QodmFyaWFibGVzKX0gPD0gJHt1cHBlckJvdW5kfWApO1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzKHRoaXMuY29uc3RyYWluKFxyXG4gICAgICAgICAgICBhcnJhaWZ5KHZhcmlhYmxlcyksXHJcbiAgICAgICAgICAgIHt0eXBlOiBDb25zdHJhaW50LlVQUEVSX0JPVU5ELCB1YjogdXBwZXJCb3VuZCwgbGI6IDB9XHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdW1FcXVhbHNaZXJvKC4uLnZhcmlhYmxlczogQXJyYXk8VmFyaWFibGU+KTogQ29uc3RyYWludHNXaXRoTmV3VmFyaWFibGVzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lcXVhbCh2YXJpYWJsZXMsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3VtR3JlYXRlclRoYW4odmFyaWFibGVzOiBBcnJheTxWYXJpYWJsZT4sIGxvd2VyQm91bmQ6IG51bWJlcik6IENvbnN0cmFpbnRzV2l0aE5ld1ZhcmlhYmxlcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JlYXRlckVxdWFsVGhhbih2YXJpYWJsZXMsIGxvd2VyQm91bmQgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cmFpbih2YXJzOiBBcnJheTxWYXJpYWJsZT4sIGJuZHM6IEJvdW5kKTogU3ViamVjdFRvIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuYW1lOiB0aGlzLmNvbnN0cmFpbnROYW1lKCksXHJcbiAgICAgICAgICAgIHZhcnMsXHJcbiAgICAgICAgICAgIGJuZHNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29uc3RyYWludE5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ2MnICsgdGhpcy5fY29uc3RyYWludENvdW50ZXIubmV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc29sdmVJTFAoaWxwOiBMUCk6IE9ic2VydmFibGU8UHJvYmxlbVNvbHV0aW9uPiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0JCA9IG5ldyBSZXBsYXlTdWJqZWN0PFByb2JsZW1Tb2x1dGlvbj4oKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29sdmVyJC5waXBlKHRha2UoMSkpLnN1YnNjcmliZShnbHBrID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gZ2xway5zb2x2ZShpbHAsIHtcclxuICAgICAgICAgICAgICAgIG1zZ2xldjogTWVzc2FnZUxldmVsLkVSUk9SLFxyXG4gICAgICAgICAgICB9KSBhcyB1bmtub3duIGFzIFByb21pc2U8UmVzdWx0PjtcclxuICAgICAgICAgICAgcmVzLnRoZW4oKHNvbHV0aW9uOiBSZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCQubmV4dCh7aWxwLCBzb2x1dGlvbn0pO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0JC5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0JC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZvcm1hdFZhcmlhYmxlTGlzdCh2YXJpYWJsZXM6IFZhcmlhYmxlIHwgQXJyYXk8VmFyaWFibGU+KTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYXJyYWlmeSh2YXJpYWJsZXMpLm1hcCh2ID0+IGAke3YuY29lZiA+IDAgPyAnKycgOiAnJ30ke3YuY29lZiA9PT0gLTEgPyAnLScgOiAodi5jb2VmID09PSAxID8gJycgOiB2LmNvZWYpfSR7di5uYW1lfWApLmpvaW4oJyAnKTtcclxuICAgIH1cclxufVxyXG4iXX0=