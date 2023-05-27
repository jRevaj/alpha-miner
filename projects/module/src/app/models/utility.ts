/**
 * Function for creating set of all subsets of given set.
 * @param original - the set to get all subsets of
 * @returns the set of all subsets of the given set
 */
export function setOfAllSubsets(original: Set<string>): Set<any> {
    let sets: Set<any> = new Set();
    if (original.size == 0) {
        sets.add(new Set());
        return sets;
    }

    let arr: Array<string> = [];
    original.forEach(e => arr.push(e));
    let head: String = arr[0];
    let rest: Set<string> = new Set(arr.slice(1, arr.length));
    for (let set of setOfAllSubsets(rest)) {
        let newSet: Set<any> = new Set();
        newSet.add(head)
        set.forEach((e: any) => newSet.add(e));
        sets.add(newSet);
        sets.add(set);
    }

    return sets;
}

/**
 * Function for checking if the given array contains all of the elements in the given target array.
 * @param arr - the array to check
 * @param target - the target array
 * @returns true if the given array contains all of the elements in the given target array
 */
export function containsAll(arr: Array<string>, target: Array<string>): boolean {
    return target.every(e => arr.includes(e));
}

/**
 * Function for sorting the given array of sets by the string representation.
 * @param yl - the array of sets of sets of strings to sort
 * @returns the sorted array of sets by the string representation
 */
export function sortYl(yl: Array<Set<string>[]>): Array<Set<string>[]> {
    return yl.sort((a, b) => {
        const strA = a.map(set => Array.from(set).join('')).join('');
        const strB = b.map(set => Array.from(set).join('')).join('');
        return strA.localeCompare(strB);
    });
}

/**
 * Function for converting the given type to a string.
 * @param input - the input to convert
 * @returns the string representation of the given input
 */
export function customToString(input: Set<Set<string>[]> | Array<Set<string>[]>): string {
    let result: string = "";
    for (const e of input) {
        let subResult = "";
        for (const f of Array.from(e)) {
            subResult += "[" + Array.from(f).join(", ") + "], ";
        }
        subResult = subResult.slice(0, -2);
        result += subResult + "\n";
    }
    result = result.slice(0, -1); // remove the last newline
    return result;
}
