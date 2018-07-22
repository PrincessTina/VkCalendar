import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import '../../css/dateIntervalPickerOpened.less';

let selectedMonthLeftIndex = null;
let selectedMonthRightIndex = null;

export default class DateIntervalPickerOpened extends React.Component {
    constructor(props) {
        super(props);

        this.state = {arrayOfMonths: [], arrayOfIndexesOfVisibleMonths: []};

        this.selectMonths = this.selectMonths.bind(this);

        setTimeout(function (component) {
            component.fillArrayOfMonths();
            component.fillArrayOfIndexesOfVisibleMonths();
        }, 1, this);
    }

    render() {
        let content = this.renderMonths();

        return (
            <div className={'dateIntervalPickerOpened'}>
                <div className={'dateIntervalPickerOpened__content'}>
                    <div className={'line'}>
                        {content}
                    </div>
                    <div className={'calendar'}/>
                </div>
            </div>
        );
    }

    /**
     * Returns month's content for rendering
     *
     * @state arrayOfMonths
     * @state arrayOfIndexesOfVisibleMonths
     */
    renderMonths() {
        let arrayOfIndexesOfVisibleMonths = this.state.arrayOfIndexesOfVisibleMonths;
        let arraySize = arrayOfIndexesOfVisibleMonths.length;
        let followingYear = null;
        let previousYear = null;
        let fullContent = [];
        let previousYearContent = [];
        let betweenYearsContent = [];
        let followingYearContent = [];

        for (let i = 0; i < arraySize; i++) {
            let index = arrayOfIndexesOfVisibleMonths[i];
            let id = index + "-" + (index + 1);
            let object = this.state.arrayOfMonths[index];

            // sets the years
            if (previousYear === null) {
                previousYear = object.year;
            } else if (previousYear !== object.year) {
                followingYear = object.year;
            }

            if (object.year === previousYear) { // sets the previous year content
                previousYearContent.push(<div className={'month'} id={index}>{object.month.substr(0, 3)}</div>);

                if (object.number !== 12) {
                    this.pushBetweenMonthBlock(previousYearContent, id);
                } else {
                    let timing;

                    previousYearContent = this.trimTheContent(previousYearContent, previousYear, true);

                    betweenYearsContent.push(<div className={'between'}/>); // sets between year content
                    this.pushBetweenMonthBlock(betweenYearsContent, id);

                    timing = betweenYearsContent;

                    betweenYearsContent = [];
                    betweenYearsContent.push(<div className={'betweenYears'}>{timing}</div>);
                }
            } else if (object.year === followingYear) { // sets the following year content
                followingYearContent.push(<div className={'month'} id={index}>{object.month.substr(0, 3)}</div>);

                if (i !== arraySize - 1) {
                    this.pushBetweenMonthBlock(followingYearContent, id);
                } else {
                    followingYearContent = this.trimTheContent(followingYearContent, followingYear, false);
                }
            }
        }

        fullContent.push(previousYearContent);
        fullContent.push(betweenYearsContent);
        fullContent.push(followingYearContent);

        return fullContent;
    }

    componentDidMount() {
        //this.selectMonths();
    }

    /**
     * Fills the arrayOfMonths in state
     * (the full range of allowable months with years)
     *
     * @state arrayOfMonths
     */
    fillArrayOfMonths() {
        let leftLimitDate = new Date('1/01/2006');
        let leftLimitYear = leftLimitDate.getFullYear();
        let leftLimitMonth = leftLimitDate.getMonth() + 1;
        let rightLimitDate = new Date();
        let rightLimitYear = rightLimitDate.getFullYear();
        let rightLimitMonth = rightLimitDate.getMonth() + 1;
        let arrayOfMonths = [];

        for (let year = leftLimitYear; year <= rightLimitYear; year++) {
            let startNumber = 1;
            let finishNumber = 12;

            if (year === leftLimitYear) {
                startNumber = leftLimitMonth;
            } else if (year === rightLimitYear) {
                finishNumber = rightLimitMonth;
            }

            for (let number = startNumber; number <= finishNumber; number++) {
                let month;

                switch (number) {
                    case 1:
                        month = 'Январь';
                        break;
                    case 2:
                        month = 'Февраль';
                        break;
                    case 3:
                        month = 'Март';
                        break;
                    case 4:
                        month = 'Апрель';
                        break;
                    case 5:
                        month = 'Май';
                        break;
                    case 6:
                        month = 'Июнь';
                        break;
                    case 7:
                        month = 'Июль';
                        break;
                    case 8:
                        month = 'Август';
                        break;
                    case 9:
                        month = 'Сентябрь';
                        break;
                    case 10:
                        month = 'Октябрь';
                        break;
                    case 11:
                        month = 'Ноябрь';
                        break;
                    case 12:
                        month = 'Декабрь';
                        break;
                }

                let object = {
                    year: year,
                    month: month,
                    number: number
                };

                arrayOfMonths.push(object);
            }
        }

        this.setState({arrayOfMonths: arrayOfMonths});
    }

    /**
     * Fills the arrayOfIndexesOfVisibleMonths in state
     * (the indexes of the 12 months that will be visible at start time)
     * Also sets indexes of selected months in state at start moment
     *
     * @props dateFrom
     * @state arrayOfIndexesOfVisibleMonths
     * @state selectedMonthLeftIndex
     * @state selectedMonthRightIndex
     */
    fillArrayOfIndexesOfVisibleMonths() {
        let rightMonth = this.props.dateTo.getMonth() + 1;
        let rightYear = this.props.dateTo.getFullYear();
        let searchedIndex;
        let arrayOfIndexesOfVisibleMonths = [];

        for (let i = 0; i < this.state.arrayOfMonths.length; i++) {
            let object = this.state.arrayOfMonths[i];

            if (object.year === rightYear && object.number === rightMonth) {
                searchedIndex = i;
                break;
            }
        }

        arrayOfIndexesOfVisibleMonths.push(searchedIndex);

        if (searchedIndex + 5 < this.state.arrayOfMonths.length && searchedIndex - 6 >= 0) { // if months are enough and left and right
            for (let i = searchedIndex + 1; i <= searchedIndex + 5; i++) {
                arrayOfIndexesOfVisibleMonths.push(i);
            }

            for (let i = searchedIndex - 1; i >= searchedIndex - 6; i--) {
                arrayOfIndexesOfVisibleMonths.unshift(i);
            }
        } else if (searchedIndex - 6 < 0) { // if months are enough only with right side
            let maxLeft = 0;

            for (let i = searchedIndex - 1; i >= 0; i--) {
                arrayOfIndexesOfVisibleMonths.unshift(i);
                maxLeft++;
            }

            for (let i = searchedIndex + 1; i <= 11 - maxLeft + searchedIndex; i++) {
                arrayOfIndexesOfVisibleMonths.push(i);
            }
        } else if (searchedIndex + 5 >= this.state.arrayOfMonths.length) { // if months are enough only with left side
            let maxRight = 0;

            for (let i = searchedIndex + 1; i < this.state.arrayOfMonths.length; i++) {
                arrayOfIndexesOfVisibleMonths.push(i);
                maxRight++;
            }

            for (let i = searchedIndex - 1; i >= searchedIndex - 11 + maxRight; i--) {
                arrayOfIndexesOfVisibleMonths.unshift(i);
            }
        }

        selectedMonthLeftIndex = searchedIndex - 1;
        selectedMonthRightIndex = searchedIndex;
        this.setState({arrayOfIndexesOfVisibleMonths: arrayOfIndexesOfVisibleMonths});
        console.log(searchedIndex);
    }

    pushBetweenMonthBlock(content, id) {
        let timing = [];

        timing.push(<div className={'betweenMonth'} id={id} onClick={() => this.selectMonths(id)}/>);
        timing.push(<div className={'border'} id={id + "b"}/>);
        content.push(<div className={'betweenMonthBorderBlock'}>{timing}</div>);
    }

    trimTheContent(content, year, isPreviousYear) {
        let timing = [];
        let nameOfTheYear;
        let nameOfTheBlock;

        if (isPreviousYear) {
            nameOfTheYear = 'thePreviousYear';
        } else {
            nameOfTheYear = 'theFollowingYear';
        }
        nameOfTheBlock = nameOfTheYear + 'Block';

        timing.push(<div className={nameOfTheYear}>{year}</div>);
        timing.push(<div className={'lineOfMonths'}>{content}</div>);

        content = [];
        content.push(<div className={nameOfTheBlock}>{timing}</div>);

        return content;
    }

    changeBorderVisibilityClasses(id) {
        let borderElement = document.getElementById(id);

        if (borderElement.classList.contains("border-visible")) {
            borderElement.classList.remove("border-visible");
            borderElement.classList.add("border");
        } else {
            borderElement.classList.remove("border");
            borderElement.classList.add("border-visible");
        }
    }

    changeMonthColorClasses(id) {
        let monthLeftElement = document.getElementById(id);
        let monthRightElement = document.getElementById(id + 1);

        if (monthLeftElement.classList.contains("month")) {
            monthLeftElement.classList.remove("month");
            monthLeftElement.classList.add("month-selected");
            monthRightElement.classList.remove("month");
            monthRightElement.classList.add("month-selected");
        } else {
            monthLeftElement.classList.remove("month-selected");
            monthLeftElement.classList.add("month");
            monthRightElement.classList.remove("month-selected");
            monthRightElement.classList.add("month");
        }
    }

    selectMonths(id) {
        this.changeBorderVisibilityClasses(selectedMonthLeftIndex + "-" + selectedMonthRightIndex + "b");
        this.changeMonthColorClasses(selectedMonthLeftIndex);

        if (id !== undefined) {
            selectedMonthLeftIndex = parseInt(id.substr(0, id.indexOf("-")));
            selectedMonthRightIndex = selectedMonthLeftIndex + 1;

            this.changeBorderVisibilityClasses(id + "b");
            this.changeMonthColorClasses(selectedMonthLeftIndex);
        }

        console.log(id);
    }
}

DateIntervalPickerOpened.propTypes = {
    dateFrom: PropTypes.instanceOf(Date),
    dateTo: PropTypes.instanceOf(Date),
};

DateIntervalPickerOpened.defaultProps = {
    dateFrom: new Date(),
    dateTo: new Date("05/15/18")
};