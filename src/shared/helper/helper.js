export const promisedSetState = (thisObj, newState) =>
	new Promise((resolve) => thisObj.setState(newState, resolve))
