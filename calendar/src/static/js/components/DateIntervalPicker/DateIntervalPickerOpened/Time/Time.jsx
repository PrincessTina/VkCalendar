import React from "react";
import PropTypes from 'prop-types';

import DateIntervalPicker from "../../DateIntervalPicker.jsx";

import './time.less';

/**
 * Time area
 */
export default class Time extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isTimeChecked: true,
            timeLineClass: 'timeLine-visible'
        };

        this.oldSelectedDateFrom = this.props.dateFrom;
        this.oldSelectedDateTo = this.props.dateTo;
        this.activeId = null;

        this.processValue = this.processValue.bind(this);
        this.processArrows = this.processArrows.bind(this);
    }

    /**
     * Hangs event on click
     *
     * @state isTimeChecked
     * @state timeLineClass
     *
     * @props dateFrom
     * @props dateTo
     * @props setNewTime
     */
    componentDidMount() {
        const that = this;

        document.addEventListener('click', (event) => {
            if (event.target.classList && !event.target.classList.contains('inputTime')) {
                that.addZeroInValues();
            }

            if (event.target.classList && (DateIntervalPicker.findParentElementByClass(event.target, 'checkbox') ||
                    event.target.classList.contains('checkbox'))) {
                that.setState({
                    isTimeChecked: !that.state.isTimeChecked,
                    timeLineClass: (that.state.timeLineClass === 'timeLine') ? 'timeLine-visible' : 'timeLine'
                });

                if (!that.state.isTimeChecked) {
                    let dateFrom = that.props.dateFrom;
                    let dateTo = that.props.dateTo;

                    that.oldSelectedDateFrom = dateFrom;
                    that.oldSelectedDateTo = dateTo;

                    dateFrom = new Date((dateFrom.getMonth() + 1) + "/" + dateFrom.getDate() + "/" +
                        dateFrom.getFullYear() + " 00:00");
                    dateTo = new Date((dateTo.getMonth() + 1) + "/" + dateTo.getDate() + "/" +
                        dateTo.getFullYear() + " 00:00");

                    that.props.setNewTime(dateFrom, dateTo);
                } else {
                    const hoursFrom = that.oldSelectedDateFrom.getHours();
                    const minutesFrom = that.oldSelectedDateFrom.getMinutes();
                    const hoursTo = that.oldSelectedDateTo.getHours();
                    const minutesTo = that.oldSelectedDateTo.getMinutes();
                    let dateFrom = that.props.dateFrom;
                    let dateTo = that.props.dateTo;

                    dateFrom = new Date((dateFrom.getMonth() + 1) + "/" + dateFrom.getDate() + "/" +
                        dateFrom.getFullYear() + " " + hoursFrom + ":" + minutesFrom);
                    dateTo = new Date((dateTo.getMonth() + 1) + "/" + dateTo.getDate() + "/" +
                        dateTo.getFullYear() + " " + hoursTo + ":" + minutesTo);

                    that.props.setNewTime(dateFrom, dateTo);
                }
            }
        });
    }

    /**
     * Returns time block
     *
     * @param isTimeFrom
     *
     * @state isTimeChecked
     * @state oldSelectedDateFrom
     * @state oldSelectedDateTo
     *
     * @props dateFrom
     * @props dateTo
     *
     * @returns {XML}
     */
    createTimeBlocks(isTimeFrom) {
        const dateFrom = (this.state.isTimeChecked) ? this.props.dateFrom : this.oldSelectedDateFrom;
        const dateTo = (this.state.isTimeChecked) ? this.props.dateTo : this.oldSelectedDateTo;
        const digit = (isTimeFrom) ? 1 : 2;
        const today = new Date();
        const selectedHours = (isTimeFrom) ? dateFrom.getHours() : dateTo.getHours();
        const selectedMinutes = (isTimeFrom) ? dateFrom.getMinutes() : dateTo.getMinutes();
        const hoursId = 'h' + digit;
        const minutesId = 'm' + digit;
        let maxHours = 23;
        let maxMinutes = 59;

        if ((isTimeFrom && dateFrom.getFullYear() === today.getFullYear() &&
                dateFrom.getDate() === today.getDate() &&
                dateFrom.getMonth() === today.getMonth()) ||
            (!isTimeFrom && dateTo.getFullYear() === today.getFullYear() &&
                dateTo.getDate() === today.getDate() &&
                dateTo.getMonth() === today.getMonth())) {
            maxHours = today.getHours();
            maxMinutes = today.getMinutes();
        }

        return (
            <div className={'time'}>
                <input className={'inputTime dark'} type={'text'}
                       id={hoursId}
                       value={this.addZeroInValue(selectedHours, hoursId)}
                       onKeyDown={(event) => this.processArrows(maxHours, event)}
                       onChange={(event) => this.processValue(maxHours, event)}/>
                <div className={'colon'}>:</div>
                <input className={'inputTime dark'} type={'text'}
                       id={minutesId}
                       value={this.addZeroInValue(selectedMinutes, minutesId)}
                       onKeyDown={(event) => this.processArrows(maxMinutes, event)}
                       onChange={(event) => this.processValue(maxMinutes, event)}/>
            </div>
        );
    }

    /**
     * Corrects value, sets new times, calls function that sets new time
     *
     * @param maxValue
     * @param event
     *
     * @props setNewTime
     * @props dateFrom
     * @props dateTo
     *
     * @state isTimeChecked
     */
    processValue(maxValue, event) {
        if (this.state.isTimeChecked) {
            const element = event.target;
            let value = element.value;
            let selectedDateFrom = new Date(this.props.dateFrom.getTime());
            let selectedDateTo = new Date(this.props.dateTo.getTime());

            value = value.replace(/[^0-9]/g, '');

            if (value > maxValue) {
                value = maxValue;
            }

            switch (element.id) {
                case 'h1':
                    selectedDateFrom.setHours(value);
                    break;
                case 'm1':
                    selectedDateFrom.setMinutes(value);
                    break;
                case 'h2':
                    selectedDateTo.setHours(value);
                    break;
                case 'm2':
                    selectedDateTo.setMinutes(value);
                    break;
            }

            if (selectedDateTo.getTime() < selectedDateFrom.getTime()) {
                let timing = selectedDateFrom;
                selectedDateFrom = selectedDateTo;
                selectedDateTo = timing;
            }

            this.activeId = element.id;

            if (!(selectedDateFrom.getTime() === this.props.dateFrom.getTime() &&
                selectedDateTo.getTime() === this.props.dateTo.getTime())) {
                this.props.setNewTime(selectedDateFrom, selectedDateTo);
            }
        }
    }

    /**
     * Handles keys: if it's up or down arrow - changes the value (increment or decrement)
     *
     * @param maxValue
     * @param event
     */
    processArrows(maxValue, event) {
        const code = event.keyCode;
        let value = event.target.value;

        if (code === 38 || code === 40) {
            if (code === 38) {
                value++;
            }

            if (code === 40) {
                value--;
            }

            event.target.value = (value < 0) ? 0 : value;

            this.processValue(maxValue, event);
        }
    }

    /**
     * Adds one or two zeros at start of value string if it's length < 2 (works for all inputs)
     */
    addZeroInValues() {
        let inputElements = document.getElementsByClassName('inputTime');

        for (let i = 0; i < inputElements.length; i++) {
            let element = inputElements[i];

            if (element.value.length === 1) {
                element.value = '0' + element.value;
            } else if (element.value.length === 0) {
                element.value = '00';
            }
        }
    }

    /**
     * Adds one or two zeros at start of value string if it's length < 2 (works for required only input)
     *
     * @param value
     * @param id
     *
     * @return {string}
     */
    addZeroInValue(value, id) {
        value = value.toString();

        if (id !== this.activeId) {
            if (value.length === 1) {
                value = '0' + value;
            } else if (value.length === 0) {
                value = '00';
            }
        } else if (value === '0') {
            value = '';
        }

        return value;
    }

    /**
     * Displays time area
     *
     * @state isTimeChecked
     *
     * @returns {XML}
     */
    render() {
        let className = (this.state.isTimeChecked) ? 'checkbox on' : 'checkbox';

        return (
            <div className={'timeArea'}>
                <div className={className}>
                    <div className={'text'}>Выбрать время</div>
                </div>
                <div className={this.state.timeLineClass}>
                    {this.createTimeBlocks(true)}
                    {this.createTimeBlocks(false)}
                </div>
            </div>
        );
    }
}

Time.propTypes = {
    dateTo: PropTypes.instanceOf(Date),
    dateFrom: PropTypes.instanceOf(Date),
    setNewTime: PropTypes.func
};