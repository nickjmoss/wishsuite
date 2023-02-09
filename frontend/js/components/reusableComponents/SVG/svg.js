import React from 'react';
import PropTypes from 'prop-types';

import WishSuitePrimary from './WishSuitePrimary';

const SVG = (props) => {
	const components = {
		'wishSuitePrimary': WishSuitePrimary,
	};

	if (components[props.name]) {
		const TagName = components[props.name];
		return <TagName {...props} />;
	}
	return null;
};

SVG.propTypes = {
	name: PropTypes.string,
};

export default SVG;
