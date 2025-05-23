/***
 *
 * @param a
 * @param b
 *
 * Deeply compares two objects on structure, ordering and values
 */
export function deepEqual<T>(a: T, b: T): boolean {
    return JSON.stringify(a) == JSON.stringify(b);
}

/***
 *
 * @param obj
 *
 * Creates a complete copy of the given object.
 * The resulting object has no references to the input.
 */
export function deepCopy<T>(obj: T): T {
    if (obj === null) return null;
    if (obj === undefined) return undefined;


    return JSON.parse(JSON.stringify(obj));
}

