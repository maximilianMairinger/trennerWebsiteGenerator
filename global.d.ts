interface Array<T> extends Object {
	/**
	 * True if empty
	 */
	readonly empty: boolean;
	/**
	 * Last element
	 */
	readonly last: T;
	/**
	 * First element
	 */
	readonly first: T;
	/**
	 * length without empty slots
	 */
	readonly realLength: number;
	/**
	 * Clears the array of all elements
	 */
	clear(): T[];
	/**
	 * Clears the array of all elements
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Clear(): T[];
	/**
	 * Adds values to the array
	 */
	add(...value: T[]): T[];
	/**
	 * Adds values to the array
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Add(...value: T[]): T[];
	/**
	 * Sets the array to the given one without chnaging the refernece
	 */
	set(array: T[] | T[]): T[];
	/**
	 * Sets the array to the given one without chnaging the refernece
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Set(array: T[] | T[]): T[];
	/**
	 * Iterates over all own properties
	 * awaits any promises
	 * when !== undefined gets returned => the the loop stopts and the returned val gets returned
	 */
	ea<R>(loop: (e?: any, i?: number, ...args: any) => R, thisArg?: any): R;
	/**
	 * Iterates over all own properties
	 * awaits any promises
	 * when !== undefined gets returned => the the loop stopts and the returned val gets returned
	 */
	each<R>(loop: (e?: any, i?: number, ...args: any) => R, thisArg?: any): R;
	/**
	 * Reverts the array
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Reverse(): T[];
	/**
	 * Gets all indexes that match the given values
	 */
	index(...values: T[]): number[];
	/**
	 * Cleans the array of all nulls and undefineds
	 */
	clean(): T[];
	/**
	 * clones
	 */
	clone(): T[];
	/**
	 * Cleans the array of all nulls and undefineds
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Clean(): T[];
	/**
	 * Removes given indexes
	 */
	removeI(...index: number[]): T[];
	/**
	 * Removes given indexes
	 */
	rmI(...index: number[]): T[];
	/**
	 * Removes given indexes
	 * The inital array stays unchanged; a new one gets inited;
	 */
	RemoveI(...index: number[]): T[];
	/**
	 * Removes given indexes
	 * The inital array stays unchanged; a new one gets inited;
	 */
	RmI(...index: number[]): T[];
	/**
	 * Removes given values
	 */
	removeV(...value: T[]): T[];
	/**
	 * Removes given values
	 */
	rmV(...value: T[]): T[];
	/**
	 * Removes given values
	 * The inital array stays unchanged; a new one gets inited;
	 */
	RemoveV(...value: T[]): T[];
	/**
	 * Removes given values
	 * The inital array stays unchanged; a new one gets inited;
	 */
	RmV(...value: T[]): T[];
	/**
	 * The inital array stays unchanged; a new one gets inited;
	 */
	remove(...valueOrIndex: T[] | number[]): T[];
	/**
	 * The inital array stays unchanged; a new one gets inited;
	 */
	rm(...valueOrIndex: T[] | number[]): T[];
	/**
	 * Removes given values / indexes
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Remove(...valueOrIndex: T[] | number[]): T[];
	/**
	 * Removes given values / indexes
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Rm(...valueOrIndex: T[] | number[]): T[];
	/**
	 * Sets the array to given indexes
	 */
	get(...index: number[]): T[];
	/**
	 * Sets the array to given indexes
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Get(...index: number[]): T[];
	/**
	 * Adds given values to the end of the array
	 */
	dda(...value: T[]): T[];
	/**
	 * Adds given values to the end of the array
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Dda(...value: T[]): T[];
	/**
	 * Removes given number of elements from the end of the array
	 */
	rem(amount: number): T[];
	/**
	 * Removes given number of elements from the end of the array
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Rem(amount: number): T[];
	/**
	 * The inital array stays unchanged; a new one gets inited;
	 */
	mer(amount: number): T[];
	/**
	 * Removes given number of elements from the begin of the array
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Mer(amount: number): T[];
	/**
	 * Swaps the two given indexes; the two parameters must have equal length
	 */
	swapI(i1: number, i2: number): T[];
	/**
	 * Swaps the two given indexes; the two parameters must have equal length
	 * The inital array stays unchanged; a new one gets inited;
	 */
	SwapI(i1: number | number[], i2: number | number[]): T[];
	/**
	 * Swaps the two given values; the two parameters must have equal length
	 */
	swapV(v1: T | T[], v2: T | T[]): T[];
	/**
	 * Swaps the two given values; the two parameters must have equal length
	 * The inital array stays unchanged; a new one gets inited;
	 */
	SwapV(v1: T | T[], v2: T | T[]): T[];
	/**
	 * Swaps the two given indexes or values; the two parameters must have equal length
	 */
	swap(vi1: number | number[] | T | T[], vi2: number | number[] | T | T[]): T[];
	/**
	 * Swaps the two given indexes or values; the two parameters must have equal length
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Swap(vi1: number | number[] | T | T[], vi2: number | number[] | T | T[]): T[];
	/**
	 * Like default flat
	 * The inital array stays unchanged; a new one gets inited;
	 */
	Flat(ammount?: number): T[]
	 /**
 	 * Add elements a to array but only if they are not already present
 	 */
 	gather(...a: T[]): this;
 	/**
 	 * Add elements a to array but only if they are not already present
 	 * The inital array stays unchanged; a new one gets inited;
 	 */
 	Gather(...a: T[]): T[];
	/**
	 * Gets the element prior of that given as index
	 * If the prior index would be -1 the last one is returned
	 */
	prior(index: number, by?: number): T;
	/**
	 * Gets the element next of that given as index
	 * If the next index would be length the first one is returned
	 */
	 next(index: number, by?: number): T;
  /**
	 * Inject item at index
	 */
	inject(item: T, index: number): this
	/**
	 * True if all given vals are included within this
	 */
	contains(...vals: T[]): boolean
	/**
	 * True if non of the given vals are included within this
	 */
	excludes(...vals: T[]): boolean
}

interface IndexOutOfBoundsException extends Exception {
	index: number;
	array: any[];
}

interface InvalidInputException extends Exception {

}

interface InvalidConstructorException extends Exception {

}

interface InvalidValueException extends Exception {
	value: any;
	array: any[];
}

interface Exception extends Error {
	message: string;
}
