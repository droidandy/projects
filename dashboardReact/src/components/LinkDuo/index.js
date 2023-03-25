import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import isExternal from 'is-url-external';

const LinkDuo = props => ( isExternal(props.to) ?
        <a href={props.to} {...props}/> : <Link {...props} />
);

LinkDuo.propTypes = {
    to: PropTypes.string.isRequired
};
export default LinkDuo;
