import React from 'react';
import ReactDOM from 'react-dom';

import Menu from '../components/Menu.jsx';

import '../../css/main.less';

document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        ReactDOM.render(
            <Menu/>,
            document.getElementsByClassName('root')[0]
        );
    }
};