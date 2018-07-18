import React from 'react';
import ReactDOM from 'react-dom';

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
        ReactDOM.render(
            <h>Hello, World!</h>,
            document.getElementById('hello_world')
        );
    }
};