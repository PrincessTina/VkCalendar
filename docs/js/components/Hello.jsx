import React from "react";

import '../../css/hello_world.less';

export default class Hello extends React.Component {
    render() {
        return (
            <div className={'hello_world'}>
                HELLO, WORLD!
            </div>
        );
    }
}