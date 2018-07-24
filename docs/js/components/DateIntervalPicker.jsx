import React from "react";
import PropTypes from 'prop-types';

import DateIntervalPickerOpened from './DateIntervalPickerOpened.jsx';

import '../../css/dateIntervalPicker.less';
import icon from '../../images/calendar.png';

export default class DateIntervalPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visibilityOfDateIntervalPickerOpened: 'dateIntervalPicker__popupWindow',
            selectedDateFrom: this.props.dateFrom,
            selectedDateTo: this.props.dateTo
        };

        this.changeVisibilityOfDateIntervalPickerOpened = this.changeVisibilityOfDateIntervalPickerOpened.bind(this);
    }

    render() {
        let dateRange = this.displayDate();
        let timeRange = this.displayTime();

        return (
            <div className={'dateIntervalPicker'}>
                <div className={'dateIntervalPickerHidden'} onClick={this.changeVisibilityOfDateIntervalPickerOpened}>
                    <div className={'wrapper'}>
                        <div className={'interval'}>
                            {dateRange}<i>{timeRange}</i>
                        </div>
                        <div className={'calendar-icon'}>
                            <img src={icon}/>
                        </div>
                    </div>
                </div>

                <div className={this.state.visibilityOfDateIntervalPickerOpened}>
                    <DateIntervalPickerOpened dateTo={this.state.selectedDateTo}
                                              dateFrom={this.state.selectedDateFrom}/>
                </div>
            </div>
        );
    }

    /**
     * @state selectedDateTo
     * @state selectedDateFrom
     *
     * @returns {string}
     */
    displayDate() {
        const dateFromDay = this.addZero(this.state.selectedDateFrom.getDate());
        const dateFromMonth = this.addZero(this.state.selectedDateFrom.getMonth() + 1);
        const dateToDay = this.addZero(this.state.selectedDateTo.getDate());
        const dateToMonth = this.addZero(this.state.selectedDateTo.getMonth() + 1);
        const dateToYear = this.addZero(this.state.selectedDateTo.getFullYear() % 1000);

        if (dateFromDay === dateToDay && dateFromMonth === dateToMonth) {
            return dateToDay + "." + dateToMonth + "." + dateToYear + " ";
        } else {
            return dateFromDay + "." + dateFromMonth + " - " + dateToDay + "." + dateToMonth + "." +
                dateToYear + " ";
        }
    }

    /**
     * @state selectedDateTo
     * @state selectedDateFrom
     *
     * @returns {string}
     */
    displayTime() {
        const dateFromHours = this.addZero(this.state.selectedDateFrom.getHours());
        const dateFromMinutes = this.addZero(this.state.selectedDateFrom.getMinutes());
        const dateToHours = this.addZero(this.state.selectedDateTo.getHours());
        const dateToMinutes = this.addZero(this.state.selectedDateTo.getMinutes());

        if (dateToHours === dateFromHours && dateToMinutes === dateFromMinutes) {
            return "(" + dateFromHours + ":" + dateFromMinutes + ")";
        } else {
            return "(" + dateFromHours + ":" + dateFromMinutes + " - " + dateToHours + ":" + dateToMinutes + ")";
        }
    }

    /**
     * @state visibilityOfDateIntervalPickerOpened
     */
    changeVisibilityOfDateIntervalPickerOpened() {
        const className = (this.state.visibilityOfDateIntervalPickerOpened === 'dateIntervalPicker__popupWindow') ?
            'dateIntervalPicker__popupWindow-visible' : 'dateIntervalPicker__popupWindow';

        this.setState({visibilityOfDateIntervalPickerOpened: className});
    };

    /**
     * @param number
     *
     * @returns {string}
     */
    addZero(number) {
        if (number < 10) {
            return "0" + number;
        } else {
            return number;
        }
    }
}

DateIntervalPicker.propTypes = {
    dateFrom: PropTypes.instanceOf(Date),
    dateTo: PropTypes.instanceOf(Date),
};

DateIntervalPicker.defaultProps = {
    dateFrom: new Date(),
    dateTo: new Date(),
};