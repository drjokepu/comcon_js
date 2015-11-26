function isMatchStr(prefix, path) {
	if (prefix === '') {
		return path === '';
	} else {
		return path.indexOf(prefix) === 0;
	}
}

class PathTracking {
	static isMatch(props, state) {
		if (props.urlPrefix !== undefined) {
			return isMatchStr(props.urlPrefix, state.path);
		} else {
			return false;
		}
	}
}

export default PathTracking;
