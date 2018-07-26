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
            selectedDateFrom: new Date(this.props.dateFrom),
            selectedDateTo: new Date(this.props.dateTo)
        };

        this.changeVisibilityOfDateIntervalPickerOpened = this.changeVisibilityOfDateIntervalPickerOpened.bind(this);
        this.setNewDates = this.setNewDates.bind(this);
        this.setNewTime = this.setNewTime.bind(this);
    }

    render() {
        let dateRange = this.displayDate();
        let timeRange = this.displayTime();

        return (
            <div className={'dateIntervalPicker'}>
                <div className={'dateIntervalPickerHidden'} onClick={this.changeVisibilityOfDateIntervalPickerOpened}>
                    <div className={'wrapper'}>
                        <div className={'interval'}>
                            {dateRange}{timeRange}
                        </div>
                        <div className={'calendar-icon'}>
                            <img src={icon}/>
                        </div>
                    </div>
                </div>

                <div className={this.state.visibilityOfDateIntervalPickerOpened}>
                    <DateIntervalPickerOpened dateTo={this.state.selectedDateTo}
                                              dateFrom={this.state.selectedDateFrom}
                                              setNewDates={this.setNewDates}
                                              setNewTime={this.setNewTime}/>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const that = this;

        document.addEventListener('click', function (event) {
            if (!that.findParentElementByClass(event.target, 'dateIntervalPicker') &&
                event.target.tagName !== 'HTML') {
                that.closeWindowFunction();
            }
        });
    }

    /**
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
            if (dateFrom.getFullYear() === dateTo.getFullYear() && dateFrom.getMonth() === dateTo.getMonth() &&
                dateFrom.getDate() === dateTo.getDate()) {
                if (dateFrom.getHours() > dateTo.getHours() || dateFrom.getHours() === dateTo.getHours() &&
                    dateFrom.getMinutes() > dateTo.getMinutes()) {
                    const timing = dateFrom;
                    dateFrom = dateTo;
                    dateTo = timing;
                }
            }
        }

        if (!(this.state.selectedDateFrom.getFullYear() === dateFrom.getFullYear() &&
                this.state.selectedDateFrom.getMonth() === dateFrom.getMonth() &&
                this.state.selectedDateFrom.getDate() === dateFrom.getDate() &&
                this.state.selectedDateFrom.getHours() === dateFrom.getHours() &&
                this.state.selectedDateFrom.getMinutes() === dateFrom.getMinutes() &&
                this.state.selectedDateTo.getFullYear() === dateTo.getFullYear() &&
                this.state.selectedDateTo.getMonth() === dateTo.getMonth() &&
                this.state.selectedDateTo.getDate() === dateTo.getDate() &&
                this.state.selectedDateTo.getHours() === dateTo.getHours() &&
                this.state.selectedDateTo.getMinutes() === dateTo.getMinutes())) {

            this.setState({
                selectedDateFrom: dateFrom,
                selectedDateTo: dateTo
            });

            this.onChange(dateFrom, dateTo);
        }
    }

    /**
     * Callback function, uses in Time.jsx
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
     * Callback function
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
     * @state selectedDateTo
     * @state selectedDateFrom
     *
     * @returns {Array}
     */
    displayDate() {
        const dateFromDay = this.addZero(this.state.selectedDateFrom.getDate());
        const dateFromMonth = this.addZero(this.state.selectedDateFrom.getMonth() + 1);
        const dateToDay = this.addZero(this.state.selectedDateTo.getDate());
        const dateToMonth = this.addZero(this.state.selectedDateTo.getMonth() + 1);
        const dateToYear = this.addZero(this.state.selectedDateTo.getFullYear() % 1000);
        let content = [];

        if (dateFromDay === dateToDay && dateFromMonth === dateToMonth) {
            content.push(<div className={'dateRange'}>{dateToDay + "." + dateToMonth + "." + dateToYear}</div>);
        } else {
            content.push(<div className={'dateRange'}>{dateFromDay + "." + dateFromMonth} &minus; {dateToDay
            + "." + dateToMonth + "." + dateToYear}</div>);
        }

        return content;
    }

    /**
     * @state selectedDateTo
     * @state selectedDateFrom
     *
     * @returns {Array}
     */
    displayTime() {
        const dateFromHours = this.addZero(this.state.selectedDateFrom.getHours());
        const dateFromMinutes = this.addZero(this.state.selectedDateFrom.getMinutes());
        const dateToHours = this.addZero(this.state.selectedDateTo.getHours());
        const dateToMinutes = this.addZero(this.state.selectedDateTo.getMinutes());
        let content = [];

        if (this.state.selectedDateFrom === this.state.selectedDateTo) {
            content.push(<div className={'timeRange'}>{dateFromHours + ":" + dateFromMinutes}</div>);
        } else {
            content.push(<div className={'timeRange'}>
                {dateFromHours + ":" + dateFromMinutes} &minus; {dateToHours + ":" + dateToMinutes}</div>);
        }

        return content;
    }

    /**
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
     * @param selectedDateFrom
     * @param selectedDateTo
     *
     * @props onChange
     */
    onChange(selectedDateFrom, selectedDateTo) {
        this.props.onChange(selectedDateFrom.getTime(), selectedDateTo.getTime());
    }
}

DateIntervalPicker.propTypes = {
    dateFrom: PropTypes.number,
    dateTo: PropTypes.number,
    onChange: PropTypes.func
};

DateIntervalPicker.defaultProps = {
    dateFrom: new Date("06/01/18 14:20").getTime(),
    dateTo: new Date("07/11/18 15:00").getTime(),
    onChange: function (selectedDateFrom, selectedDateTo) {
        console.log("onChange is working");
    }
};