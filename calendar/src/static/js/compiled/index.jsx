import React from 'react';
import ReactDOM from 'react-dom';

import Hello from '../components/Hello.jsx';

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
        ReactDOM.render(
            <Hello/>,
            document.getElementById('hello_world')
        );
    }
};