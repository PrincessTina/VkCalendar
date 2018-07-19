import React from 'react';
import ReactDOM from 'react-dom';

import Hello from '../components/Hello.jsx';

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
        ReactDOM.render(
            <Hello name={"Tom"} age={12}/>,
            document.getElementById('hello_world')
        );
    }
};