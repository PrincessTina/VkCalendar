import React from "react";

import '../../css/dateIntervalPickerHidden.less';
import icon from '../../images/calendar.png';

export default class DateIntervalPickerHidden extends React.Component {
    render() {
        return (
            <div className={'dateIntervalPickerHidden'}>
                <div className={'wrapper'}>
                    <div className={'interval'}>
                        04.07 - 11.07.18 <i>(10:13 - 21:07)</i>
                    </div>
                    <div className={'calendar-icon'}>
                        <img src={icon}/>
                    </div>
                </div>
            </div>
        );
    }
}