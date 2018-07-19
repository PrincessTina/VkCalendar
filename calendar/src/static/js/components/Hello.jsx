import React from "react";
import PropTypes from 'prop-types';

import '../../css/hello_world.less';

export default class Hello extends React.Component {
    render() {
        return (
            <div className={'hello_world'}>
                HELLO, WORLD and {this.props.name} ({this.props.age})!
            </div>
        );
    }
}

/**
 * Name - the name of user; age - the age of user;
 * @type {{name: string, age: number}}
 */
Hello.propTypes = {
    name: PropTypes.string,
    age: PropTypes.number,
};