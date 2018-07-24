import React from "react";
import PropTypes from 'prop-types';

import '../../css/calendar.less';

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.arrayOfDaysInMonths = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }

    render() {
        const leftCalendarContent = this.createCalendarContent(this.props.selectedMonthLeftIndex);
        const rightCalendarContent = this.createCalendarContent(this.props.selectedMonthRightIndex);

        return (
            <div className={'calendarArea'}>
                <div className={'calendar'}>{leftCalendarContent}</div>
                <div className={'calendar'}>{rightCalendarContent}</div>
            </div>
        );
    }

    /**
     * @param index
     *
     * @props arrayOfMonths
     *
     * @return {Array}
     */
    createCalendarContent(index) {
        const object = this.props.arrayOfMonths[index];
        const daysMatrix = this.formDaysMatrix(index);
        const today = new Date().getDate();
        const canBeToday = (new Date().getFullYear() === object.year && new Date().getMonth() + 1 === object.number);
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

        for (let i = 0; i < 6; i++) {
            rowContent = [];

            for (let j = 0; j < 7; j++) {
                if (daysMatrix[i][j] === 0) {
                    rowContent.push(<div className={'cell-empty'}/>);
                } else if ((daysMatrix[i][j] > today) && canBeToday) {
                    rowContent.push(<div className={'cell-future'}>{daysMatrix[i][j]}</div>);
                } else if ((j === 5 || j === 6) && daysMatrix[i][j] === today && canBeToday){
                    rowContent.push(<div className={'cell-weekend cell-today'}>{daysMatrix[i][j]}</div>);
                } else if (j === 5 || j === 6) {
                    rowContent.push(<div className={'cell-weekend'}>{daysMatrix[i][j]}</div>);
                } else if (daysMatrix[i][j] === today && canBeToday){
                    rowContent.push(<div className={'cell-today'}>{daysMatrix[i][j]}</div>);
                } else {
                    rowContent.push(<div className={'cell'}>{daysMatrix[i][j]}</div>);
                }
            }

            calendarContent.push(<div className={'row'}>{rowContent}</div>);
        }

        return calendarContent;
    }

    /**
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
     * @param index
     *
     * @props arrayOfMonths
     *
     * @returns {number}
     */
    calculateDayOfWeek(index) {
        const object = this.props.arrayOfMonths[index];
        const a = parseInt((14 - object.number) / 12);
        const y = object.year - a;
        const m = object.number + 12 * a - 2;
        const day = 1;
        let weekDay = (day + y + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400) + parseInt((31 * m) / 12))
        % 7;

        weekDay = (weekDay === 0) ? 6 : weekDay - 1;

        return weekDay;
    }
}

Calendar.propTypes = {
    selectedMonthLeftIndex: PropTypes.number,
    selectedMonthRightIndex: PropTypes.number,
    arrayOfMonths: PropTypes.instanceOf(Array),
};