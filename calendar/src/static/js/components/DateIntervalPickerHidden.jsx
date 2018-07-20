import React from "react";

import DateIntervalPickerOpened from './DateIntervalPickerOpened.jsx';

import '../../css/dateIntervalPickerHidden.less';
import icon from '../../images/calendar.png';

export default class DateIntervalPickerHidden extends React.Component {
    constructor() {
        super();

        this.state = {visibilityOfDateIntervalPickerOpened: 'dateIntervalPicker__popupWindow'};

        this.changeVisibilityOfDateIntervalPickerOpened = this.changeVisibilityOfDateIntervalPickerOpened.bind(this);
    }

    changeVisibilityOfDateIntervalPickerOpened() {
        let className = this.state.visibilityOfDateIntervalPickerOpened;

        switch (className) {
            case 'dateIntervalPicker__popupWindow':
                className = 'dateIntervalPicker__popupWindow-visible';
                break;
            default:
                className = 'dateIntervalPicker__popupWindow';
        }

        this.setState({visibilityOfDateIntervalPickerOpened: className});
    };

    render() {
        return (
            <div className={'dateIntervalPicker'}>
                <div className={'dateIntervalPickerHidden'} onClick={this.changeVisibilityOfDateIntervalPickerOpened}>
                    <div className={'wrapper'}>
                        <div className={'interval'}>
                            04.07 - 11.07.18 <i>(10:13 - 21:07)</i>
                        </div>
                        <div className={'calendar-icon'}>
                            <img src={icon}/>
                        </div>
                    </div>
                </div>

                <div className={this.state.visibilityOfDateIntervalPickerOpened}>
                    <DateIntervalPickerOpened/>
                </div>
            </div>
        );
    }
}