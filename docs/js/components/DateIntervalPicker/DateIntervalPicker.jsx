import React from "react";
import PropTypes from 'prop-types';

import DateIntervalPickerOpened from './DateIntervalPickerOpened/DateIntervalPickerOpened.jsx';
import {Months} from './constants.jsx';

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
            if (!DateIntervalPicker.findParentElementByClass(event.target, 'dateIntervalPicker') &&
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
    static findParentElementByClass(element, className) {
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
     * Returns full date content
     *
     * @state selectedDateFrom
     * @state selectedDateTo
     *
     * @return {Array}
     */
    display() {
        const dateFromDay = this.addZero(this.state.selectedDateFrom.getDate());
        const dateFromMonth = this.processMonth(DateIntervalPicker.getMonthFromNumber(
            this.state.selectedDateFrom.getMonth() + 1));
        const dateFromHours = this.addZero(this.state.selectedDateFrom.getHours());
        const dateFromMinutes = this.addZero(this.state.selectedDateFrom.getMinutes());
        const dateToDay = this.addZero(this.state.selectedDateTo.getDate());
        const dateToMonth = this.processMonth(DateIntervalPicker.getMonthFromNumber(
            this.state.selectedDateTo.getMonth() + 1));
        const dateToHours = this.addZero(this.state.selectedDateTo.getHours());
        const dateToMinutes = this.addZero(this.state.selectedDateTo.getMinutes());
        let content = [];

        content.push(<div className={'dateRange'}>{dateFromDay + " " + dateFromMonth}</div>);
        content.push(<div className={'timeRange'}>{dateFromHours + ":" + dateFromMinutes}</div>);

        if (dateFromDay === dateToDay && dateFromMonth === dateToMonth) {
            if (this.state.selectedDateFrom.getTime() !== this.state.selectedDateTo.getTime()) {
                content.push(<div className={'minusBetweenTime'}> &minus; </div>);
                content.push(<div className={'timeRange'}>{dateToHours + ":" + dateToMinutes}</div>);
            }
        } else {
            content.push(<div className={'minusBetweenDates'}> &minus; </div>);
            content.push(<div className={'dateRange'}>{dateToDay + " " + dateToMonth}</div>);
            content.push(<div className={'timeRange'}>{dateToHours + ":" + dateToMinutes}</div>);
        }

        return content;
    }

    /**
     * Returns month's name by the appropriate number
     *
     * @param number
     *
     * @returns {string}
     */
    static getMonthFromNumber(number) {
        switch (number) {
            case 1:
                return Months.January;
            case 2:
                return Months.February;
            case 3:
                return Months.March;
            case 4:
                return Months.April;
            case 5:
                return Months.May;
            case 6:
                return Months.June;
            case 7:
                return Months.July;
            case 8:
                return Months.August;
            case 9:
                return Months.September;
            case 10:
                return Months.October;
            case 11:
                return Months.November;
            case 12:
                return Months.December;
        }
    }

    /**
     * Returns abbreviated name of month
     *
     * @param monthName
     *
     * @returns {string}
     */
    processMonth(monthName) {
        if (monthName.length === 3) {
            return monthName.substr(0,2) + 'я';
        } else {
            return monthName.substr(0,3);
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
        const dateFrom = new Date(selectedDateFrom.getMonth() + 1 + '/' + selectedDateFrom.getDate() + '/' +
            selectedDateFrom.getFullYear() + ' ' + selectedDateFrom.getHours() + ':' + selectedDateFrom.getMinutes() +
            ':00');
        const dateTo = new Date(selectedDateTo.getMonth() + 1 + '/' + selectedDateTo.getDate() + '/' +
            selectedDateTo.getFullYear() + ' ' + selectedDateTo.getHours() + ':' + selectedDateTo.getMinutes() +
            ':59');

        this.props.onChange(dateFrom.getTime(), dateTo.getTime());
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
                            {this.display()}
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
    /**
     * start date arrived at the initial time
     */
    dateFrom: PropTypes.number,

    /**
     * end date arrived at the initial time
     */
    dateTo: PropTypes.number,

    /**
     * the maximum date to which you can scroll to the left
     */
    leftLimitDate: PropTypes.number,

    /**
     * callback function that will be called if you change the date
     */
    onChange: PropTypes.func
};

DateIntervalPicker.defaultProps = {
    dateFrom: new Date("06/01/18 14:20").getTime(),
    dateTo: new Date("07/11/18 15:00").getTime(),
    leftLimitDate: new Date('1/01/2006').getTime(),
    onChange: function (selectedDateFrom, selectedDateTo) {
        console.log('dateFrom: ' + selectedDateFrom);
        console.log('dateTo: ' + selectedDateTo);
    }
};