import React from "react";
import PropTypes from 'prop-types';

import './calendar.less';

/**
 * Calendar area
 */
export default class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDateFrom: this.props.dateFrom,
            selectedDateTo: this.props.dateTo,
            firstlyClickedDate: undefined
        };

        this.mouseUp = this.mouseUp.bind(this);
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseDown = this.mouseDown.bind(this);

        this.arrayOfDaysInMonths = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.isClamped = false;
    }

    /**
     * Hangs event on mouse up
     */
    componentDidMount() {
        const that = this;

        document.addEventListener('mouseup', () => {
            that.mouseUp();
        });
    }

    /**
     * Returns calendar's area content
     *
     * @param index
     *
     * @props arrayOfMonths
     *
     * @state selectedDateFrom
     * @state selectedDateTo
     *
     * @return {Array}
     */
    createCalendarContent(index) {
        const object = this.props.arrayOfMonths[index];
        const daysMatrix = this.formDaysMatrix(index);
        const today = new Date().getDate();
        const canBeToday = (new Date().getFullYear() === object.year && new Date().getMonth() + 1 === object.number);
        let neededInCheckOnSelected = false;
        let rowContent = [];
        let calendarContent = [];

        calendarContent.push(<div className={'title'}>{object.month + " " + object.year}</div>);
        rowContent.push(<div className={'day'}>Пн</div>);
        rowContent.push(<div className={'day'}>Вт</div>);
        rowContent.push(<div className={'day'}>Ср</div>);
        rowContent.push(<div className={'day'}>Чт</div>);
        rowContent.push(<div className={'day'}>Пт</div>);
        rowContent.push(<div className={'weekend'}>Сб</div>);
        rowContent.push(<div className={'weekend'}>Вс</div>);
        calendarContent.push(<div className={'row'}>{rowContent}</div>);

        if (this.state.selectedDateFrom.getFullYear() === object.year ||
            this.state.selectedDateTo.getFullYear() === object.year) {
            if (this.state.selectedDateFrom.getMonth() + 1 === object.number ||
                this.state.selectedDateTo.getMonth() + 1 === object.number) {
                neededInCheckOnSelected = true;
            }
        }

        for (let i = 0; i < 6; i++) {
            rowContent = [];

            for (let j = 0; j < 7; j++) {
                const day = daysMatrix[i][j];
                const id = object.number + "/" + day + "/" + object.year % 1000;
                let className = "";

                if (neededInCheckOnSelected) {
                    if (this.state.selectedDateFrom.getMonth() + 1 === object.number &&
                        this.state.selectedDateTo.getMonth() + 1 === object.number) {
                        if (day >= this.state.selectedDateFrom.getDate() && day <= this.state.selectedDateTo.getDate()) {
                            className = 'cell-selected';
                        }
                    } else if (this.state.selectedDateFrom.getMonth() + 1 === object.number) {
                        if (day >= this.state.selectedDateFrom.getDate()) {
                            className = 'cell-selected';
                        }
                    } else if (this.state.selectedDateTo.getMonth() + 1 === object.number) {
                        if (day <= this.state.selectedDateTo.getDate()) {
                            className = 'cell-selected';
                        }
                    }
                }

                if (day === 0) {
                    rowContent.push(<div className={'cell-empty'}/>);
                } else if ((day > today) && canBeToday) {
                    rowContent.push(<div className={'cell-future'}>{day}</div>);
                } else {
                    if ((j === 5 || j === 6) && day === today && canBeToday) {
                        className = (className === "") ? 'cell-weekend cell-today' : className + ' bolder';
                    } else if (j === 5 || j === 6) {
                        className = (className === "") ? 'cell-weekend' : className;
                    } else if (day === today && canBeToday) {
                        className = (className === "") ? 'cell-today' : className + ' bolder';
                    } else {
                        className = (className === "") ? 'cell' : className;
                    }
                    rowContent.push(<div className={className} id={id}
                                         onMouseDown={() => this.mouseDown(id)}
                                         onMouseOver={() => this.mouseOver(id)}
                                         onMouseUp={this.mouseUp}>{day}</div>);
                }
            }

            calendarContent.push(<div className={'row'}>{rowContent}</div>);
        }

        return calendarContent;
    }

    /**
     * Returns matrix of days (broken down by days of the week) of month
     *
     * @param index
     *
     * @returns {Array}
     */
    formDaysMatrix(index) {
        const firstWeekDay = this.calculateDayOfWeek(index);
        const lastDayNumber = this.getLastMonthDay(index);
        let daysMatrix = [];
        let dayNumber = 1;

        for (let i = 0; i < 6; i++) {
            let row = [];

            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < firstWeekDay) || (dayNumber > lastDayNumber)) {
                    row.push(0);
                } else {
                    row.push(dayNumber);
                    dayNumber++;
                }
            }

            daysMatrix.push(row);
        }

        return daysMatrix;
    }

    /**
     * Returns number of the last day of month
     *
     * @param index
     *
     * @props arrayOfMonths
     *
     * @global arrayOfDaysInMonths
     *
     * @returns {number}
     */
    getLastMonthDay(index) {
        const object = this.props.arrayOfMonths[index];
        const monthNumber = object.number;

        if (monthNumber !== 2) {
            return this.arrayOfDaysInMonths[monthNumber - 1];
        } else {
            if (this.isLeapYear(object.year)) {
                return 29;
            } else {
                return 28;
            }
        }
    }

    /**
     * Makes a leap year check
     *
     * @param year
     *
     * @returns {boolean}
     */
    isLeapYear(year) {
        if (year % 4 === 0) {
            if (year % 100 === 0) {
                return (year % 400 === 0);
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    /**
     * Finds day of week for the first day of month
     *
     * Algorithm is taken from wiki
     * @link https://ru.wikibooks.org/wiki/%D0%A0%D0%B5%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8_%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC%D0%BE%D0%B2/%D0%92%D0%B5%D1%87%D0%BD%D1%8B%D0%B9_%D0%BA%D0%B0%D0%BB%D0%B5%D0%BD%D0%B4%D0%B0%D1%80%D1%8C
     *
     * a, y, m factors are used only for calculating weekday factor
     *
     * @param index
     *
     * @props arrayOfMonths
     *
     * @returns {number}
     */
    calculateDayOfWeek(index) {
        const object = this.props.arrayOfMonths[index];
        const aFactor = parseInt((14 - object.number) / 12);
        const yFactor = object.year - aFactor;
        const mFactor = object.number + 12 * aFactor - 2;
        const day = 1; // we can (and have to) calculate day of week for only the first day of month
        let weekDay = (day + yFactor + parseInt(yFactor / 4) - parseInt(yFactor / 100) + parseInt(yFactor / 400) +
            parseInt((31 * mFactor) / 12)) % 7;

        weekDay = (weekDay === 0) ? 6 : weekDay - 1;

        return weekDay;
    }

    /**
     * Mouse is clamped
     * Sets selectedDateFrom, selectedDateTo, firstlyClickedDate in clicked date; calls function that
     * updates dates in mini-version
     *
     * @state selectedDateFrom
     * @state selectedDateTo
     * @state firstlyClickedDate
     *
     * @param id
     */
    mouseDown(id) {
        const date = new Date(id);

        this.isClamped = true;
        this.setState({
            selectedDateFrom: date,
            selectedDateTo: date,
            firstlyClickedDate: date
        });

        this.synchronize(date, date, false);
    }

    /**
     * Mouse comes to the cell
     * Changes selectedDateFrom and selectedDateTo on the basis of the date on which brought; calls function that
     * updates dates in mini-version
     *
     * @state selectedDateFrom
     * @state selectedDateTo
     * @state firstlyClickedDate
     *
     * @param id
     */
    mouseOver(id) {
        const date = new Date(id);

        if (this.isClamped) {
            if (date > this.state.firstlyClickedDate) {
                this.setState({
                    selectedDateFrom: this.state.firstlyClickedDate,
                    selectedDateTo: date
                });
                this.synchronize(this.state.firstlyClickedDate, date, false);
            } else {
                this.setState({
                    selectedDateFrom: date,
                    selectedDateTo: this.state.firstlyClickedDate
                });
                this.synchronize(date, this.state.firstlyClickedDate, false);
            }
        }
    }

    /**
     * Mouse isn't clamped anymore
     * Stops to count dates; calls function that updates dates in mini-version
     *
     * @state selectedDateFrom
     * @state selectedDateTo
     */
    mouseUp() {
        this.isClamped = false;
        this.synchronize(this.state.selectedDateFrom, this.state.selectedDateTo, true);
    }

    /**
     * Updates dates in mini-version
     *
     * @param selectedDateFrom
     * @param selectedDateTo
     * @param isFinishedMoving
     *
     * @props setNewDates
     */
    synchronize(selectedDateFrom, selectedDateTo, isFinishedMoving) {
        this.props.setNewDates(selectedDateFrom, selectedDateTo, isFinishedMoving);
    }

    /**
     * Displays calendar content
     *
     * @returns {XML}
     */
    render() {
        return (
            <div className={'calendarArea'}>
                <div className={'calendar'}>{this.createCalendarContent(this.props.selectedMonthLeftIndex)}</div>
                <div className={'calendar'}>{this.createCalendarContent(this.props.selectedMonthRightIndex)}</div>
            </div>
        );
    }
}

Calendar.propTypes = {
    selectedMonthLeftIndex: PropTypes.number,
    selectedMonthRightIndex: PropTypes.number,
    dateTo: PropTypes.instanceOf(Date),
    dateFrom: PropTypes.instanceOf(Date),
    arrayOfMonths: PropTypes.instanceOf(Array),
    setNewDates: PropTypes.func
};