import React from "react";
import PropTypes from 'prop-types';

import '../../css/dateIntervalPickerOpened.less';

export default class DateIntervalPickerOpened extends React.Component {
    constructor(props) {
        super(props);

        this.pip = this.pip.bind(this);

        this.state = {arrayOfMonths: [], arrayOfIndexesOfVisibleMonths: []};

        setTimeout(function (component) {
            component.fillArrayOfMonths();
            component.fillArrayOfIndexesOfVisibleMonths();
        }, 1000, this);
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
     *
     * @props dateFrom
     * @state arrayOfIndexesOfVisibleMonths
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

        for (let i = searchedIndex; i > searchedIndex - 12; i--) {
            arrayOfIndexesOfVisibleMonths.push(i);
        }

        console.log(searchedIndex);
        this.setState({arrayOfIndexesOfVisibleMonths: arrayOfIndexesOfVisibleMonths});
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

        for (let i = arraySize - 1; i >= 0; i--) {
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
                    previousYearContent.push(<div className={'betweenMonth'} id={id} onClick={() => this.pip(id)}/>);
                } else {
                    let timing = previousYearContent;
                    previousYearContent = [];

                    previousYearContent.push(<div className={'thePreviousYear'}>{previousYear}</div>);
                    previousYearContent.push(<div className={'lineOfMonths'}>{timing}</div>);

                    timing = previousYearContent;
                    previousYearContent = [];

                    previousYearContent.push(<div className={'thePreviousYearBlock'}>{timing}</div>);


                    betweenYearsContent.push(<div className={'between'}/>); // sets between year content
                    betweenYearsContent.push(<div className={'betweenMonth'} id={id} onClick={() => this.pip(id)}/>);

                    timing = betweenYearsContent;
                    betweenYearsContent = [];

                    betweenYearsContent.push(<div className={'betweenYears'}>{timing}</div>);
                }
            } else if (object.year === followingYear) { // sets the following year content
                followingYearContent.push(<div className={'month'} id={index}>{object.month.substr(0, 3)}</div>);

                if (i !== 0) {
                    followingYearContent.push(<div className={'betweenMonth'} id={id} onClick={() => this.pip(id)}/>);
                } else {
                    let timing = followingYearContent;
                    followingYearContent = [];

                    followingYearContent.push(<div className={'theFollowingYear'}>{followingYear}</div>);
                    followingYearContent.push(<div className={'lineOfMonths'}>{timing}</div>);

                    timing = followingYearContent;
                    followingYearContent = [];

                    followingYearContent.push(<div className={'theFollowingYearBlock'}>{timing}</div>);
                }
            }
        }

        fullContent.push(previousYearContent);
        fullContent.push(betweenYearsContent);
        fullContent.push(followingYearContent);

        return fullContent;
    }

    pip(value) {
        console.log(value);
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
}


DateIntervalPickerOpened.propTypes = {
    dateFrom: PropTypes.instanceOf(Date),
    dateTo: PropTypes.instanceOf(Date),
};

DateIntervalPickerOpened.defaultProps = {
    dateFrom: new Date(),
    dateTo: new Date("06/22/18")
};