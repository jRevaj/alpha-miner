/**
 * Returns the set of all subsets of the given set.
 * @param original: Set<string> - the set to get all subsets of
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
 * Returns true if the given array contains all of the elements in the given target array.
 * @param arr: Array<string> - the array to check
 * @param target: Array<string> - the target array
 */
export function containsAll(arr: Array<string>, target: Array<string>): boolean {
    return target.every(e => arr.includes(e));
}

/**
 * Sorts the given array of sets of sets of strings by the string representation of the sets of sets of strings.
 * @param yl: Array<Set<string>[]> - the array of sets of sets of strings to sort
 */
export function sortYl(yl: Array<Set<string>[]>): Array<Set<string>[]> {
    return yl.sort((a, b) => {
        const strA = a.map(set => Array.from(set).join('')).join('');
        const strB = b.map(set => Array.from(set).join('')).join('');
        return strA.localeCompare(strB);
    });
}
