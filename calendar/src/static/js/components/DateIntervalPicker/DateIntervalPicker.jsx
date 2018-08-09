import React from "react";
import PropTypes from 'prop-types';

import DateIntervalPickerOpened from './DateIntervalPickerOpened/DateIntervalPickerOpened.jsx';

import './dateIntervalPicker.less';
import icon from '../../../images/calendar.png';

/**
 * Mini-version of the element, by which user can open the full version
 */
export default class DateIntervalPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visibilityOfDateIntervalPickerOpened: 'dateIntervalPicker__popupWindow',
            selectedDateFrom: new Date(this.props.dateFrom),
            selectedDateTo: new Date(this.props.dateTo)
        };

        this.changeVisibilityOfDateIntervalPickerOpened = this.changeVisibilityOfDateIntervalPickerOpened.bind(this);
        this.setNewDates = this.setNewDates.bind(this);
        this.setNewTime = this.setNewTime.bind(this);
    }

    /**
     * Removes visibility of the DateIntervalPicker's full version if it is
     *
     * @state visibilityOfDateIntervalPickerOpened
     */
    closeWindowFunction() {
        if (this.state.visibilityOfDateIntervalPickerOpened === 'dateIntervalPicker__popupWindow-visible') {
            this.setState({
                visibilityOfDateIntervalPickerOpened: 'dateIntervalPicker__popupWindow'
            });
        }
    }

    /**
     * Changes visibility of the DateIntervalPicker's full version to the opposite
     *
     * @state visibilityOfDateIntervalPickerOpened
     */
    changeVisibilityOfDateIntervalPickerOpened() {
        const className = (this.state.visibilityOfDateIntervalPickerOpened === 'dateIntervalPicker__popupWindow') ?
            'dateIntervalPicker__popupWindow-visible' : 'dateIntervalPicker__popupWindow';

        this.setState({
            visibilityOfDateIntervalPickerOpened: className
        });
    };

    /**
     * Hangs event closing DateIntervalPicker's full version window on click
     */
    componentDidMount() {
        const that = this;

        document.addEventListener('click', (event) => {
            if (!that.findParentElementByClass(event.target, 'dateIntervalPicker') &&
                event.target.tagName !== 'HTML') {
                that.closeWindowFunction();
            }
        });
    }

    /**
     * Checks element parent's classes recursively for compliance with the sought
     *
     * @param element
     * @param className
     *
     * @returns {boolean}
     */
    findParentElementByClass(element, className) {
        while (element && element.parentNode) {
            element = element.parentNode;

            if (element.classList && element.classList.contains(className)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Callback function, uses in Calendar.jsx
     * Exposes new dates (with old time)
     *
     * @param selectedDateFrom
     * @param selectedDateTo
     * @param isFinishedMoving
     *
     * @state selectedDateFrom
     * @state selectedDateTo
     */
    setNewDates(selectedDateFrom, selectedDateTo, isFinishedMoving) {
        let dateFrom = new Date((selectedDateFrom.getMonth() + 1) + "/" + selectedDateFrom.getDate() +
            "/" + selectedDateFrom.getFullYear() + " " + this.state.selectedDateFrom.getHours() + ":" +
            this.state.selectedDateFrom.getMinutes());
        let dateTo = new Date((selectedDateTo.getMonth() + 1) + "/" + selectedDateTo.getDate() +
            "/" + selectedDateTo.getFullYear() + " " + this.state.selectedDateTo.getHours() + ":" +
            this.state.selectedDateTo.getMinutes());

        if (isFinishedMoving) {
            if (dateFrom.getTime() > dateTo.getTime()) {
                const timing = dateFrom;
                dateFrom = dateTo;
                dateTo = timing;
            }
        }

        if (!(this.state.selectedDateFrom.getTime() === dateFrom.getTime() &&
                this.state.selectedDateTo.getTime() === dateTo.getTime())) {
            this.setState({
                selectedDateFrom: dateFrom,
                selectedDateTo: dateTo
            });

            this.onChange(dateFrom, dateTo);
        }
    }

    /**
     * Callback function, uses in Time.jsx
     * Exposes new time (with old dates)
     *
     * @param selectedDateFrom
     * @param selectedDateTo
     *
     * @state selectedDateFrom
     * @state selectedDateTo
     */
    setNewTime(selectedDateFrom, selectedDateTo) {
        this.setState({
            selectedDateFrom: selectedDateFrom,
            selectedDateTo: selectedDateTo
        });

        this.onChange(selectedDateFrom, selectedDateTo);
    }

    /**
     * Returns date xml content
     *
     * @state selectedDateTo
     * @state selectedDateFrom
     *
     * @returns {XML}
     */
    displayDate() {
        const dateFromDay = this.addZero(this.state.selectedDateFrom.getDate());
        const dateFromMonth = this.addZero(this.state.selectedDateFrom.getMonth() + 1);
        const dateToDay = this.addZero(this.state.selectedDateTo.getDate());
        const dateToMonth = this.addZero(this.state.selectedDateTo.getMonth() + 1);
        const dateToYear = this.addZero(this.state.selectedDateTo.getFullYear() % 1000);

        if (dateFromDay === dateToDay && dateFromMonth === dateToMonth) {
            return (
                <div className={'dateRange'}>{dateToDay + "." + dateToMonth + "." + dateToYear}</div>
            );
        } else {
            return (
                <div className={'dateRange'}>{dateFromDay + "." + dateFromMonth} &minus; {dateToDay
                + "." + dateToMonth + "." + dateToYear}</div>
            );
        }
    }

    /**
     * Returns time xml content
     *
     * @state selectedDateTo
     * @state selectedDateFrom
     *
     * @returns {XML}
     */
    displayTime() {
        const dateFromHours = this.addZero(this.state.selectedDateFrom.getHours());
        const dateFromMinutes = this.addZero(this.state.selectedDateFrom.getMinutes());
        const dateToHours = this.addZero(this.state.selectedDateTo.getHours());
        const dateToMinutes = this.addZero(this.state.selectedDateTo.getMinutes());

        if (this.state.selectedDateFrom.getTime() === this.state.selectedDateTo.getTime()) {
            return (
                <div className={'timeRange'}>{dateFromHours + ":" + dateFromMinutes}</div>
            );
        } else {
            return (
                <div className={'timeRange'}>{dateFromHours + ":" + dateFromMinutes} &minus; {dateToHours +
                ":" + dateToMinutes}</div>
            );
        }
    }

    /**
     * Add zero at the start of number string if the number < 10
     *
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

    /**
     * Calls function from props with new dates
     *
     * @param selectedDateFrom
     * @param selectedDateTo
     *
     * @props onChange
     */
    onChange(selectedDateFrom, selectedDateTo) {
        this.props.onChange(selectedDateFrom.getTime(), selectedDateTo.getTime());
    }

    /**
     * Displays mini-version
     *
     * @returns {XML}
     */
    render() {
        return (
            <div className={'dateIntervalPicker'}>
                <div className={'dateIntervalPickerHidden'} onClick={this.changeVisibilityOfDateIntervalPickerOpened}>
                    <div className={'wrapper'}>
                        <div className={'interval'}>
                            {this.displayDate()}{this.displayTime()}
                        </div>
                        <div className={'calendar-icon'}>
                            <img src={icon}/>
                        </div>
                    </div>
                </div>

                <div className={this.state.visibilityOfDateIntervalPickerOpened}>
                    <DateIntervalPickerOpened dateTo={this.state.selectedDateTo}
                                              dateFrom={this.state.selectedDateFrom}
                                              leftLimitDate={this.props.leftLimitDate}
                                              setNewDates={this.setNewDates}
                                              setNewTime={this.setNewTime}/>
                </div>
            </div>
        );
    }
}

DateIntervalPicker.propTypes = {
    dateFrom: PropTypes.number,
    dateTo: PropTypes.number,
    leftLimitDate: PropTypes.number,
    onChange: PropTypes.func
};

DateIntervalPicker.defaultProps = {
    dateFrom: new Date("06/01/18 14:20").getTime(),
    dateTo: new Date("07/11/18 15:00").getTime(),
    leftLimitDate: new Date('1/01/2006').getTime(),
    onChange: function (selectedDateFrom, selectedDateTo) {
        console.log("onChange is working");
    }
};