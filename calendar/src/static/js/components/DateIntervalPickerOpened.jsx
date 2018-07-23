import React from "react";
import PropTypes from 'prop-types';

import '../../css/dateIntervalPickerOpened.less';

window.test = 10000;

export default class DateIntervalPickerOpened extends React.Component {
    constructor(props) {
        super(props);

        const arrayOfMonths = this.getFilledArrayOfMonths();
        const {arrayOfIndexesOfVisibleMonths, selectedMonthLeftIndex, selectedMonthRightIndex} =
            this.getInitializedArrayOfIndexesOfVisibleMonths(arrayOfMonths);
        const {arrayOfIndexesLeftAdditionalMonths, arrayOfIndexesRightAdditionalMonths} =
            this.getFilledArrayOfIndexesOfAdditionalMonths(arrayOfMonths, arrayOfIndexesOfVisibleMonths);

        this.state = {
            arrayOfMonths: arrayOfMonths,
            arrayOfIndexesOfVisibleMonths: arrayOfIndexesOfVisibleMonths,
            selectedMonthLeftIndex: selectedMonthLeftIndex,
            selectedMonthRightIndex: selectedMonthRightIndex,
            headerAnimationClass: 'header',
            arrayOfIndexesLeftAdditionalMonths: arrayOfIndexesLeftAdditionalMonths,
            arrayOfIndexesRightAdditionalMonths: arrayOfIndexesRightAdditionalMonths
        };

        this.selectMonths = this.selectMonths.bind(this);
    }

    render() {
        const content = this.renderMonths();
        const leftAdditional = this.renderAdditionalMonths(true);
        const rightAdditional = this.renderAdditionalMonths(false);

        return (
            <div className={'dateIntervalPickerOpened'}>
                <div className={'dateIntervalPickerOpened__content'}>
                    <div className={this.state.headerAnimationClass}>
                        {leftAdditional}
                        {content}
                        {rightAdditional}
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
     * @state selectedMonthLeftIndex
     * @state selectedMonthRightIndex
     *
     * @returns {Array}
     */
    renderMonths() {
        const arrayOfIndexesOfVisibleMonths = this.state.arrayOfIndexesOfVisibleMonths;
        const arraySize = arrayOfIndexesOfVisibleMonths.length;
        let followingYear = null;
        let previousYear = null;
        let fullContent = [];
        let previousYearContent = [];
        let betweenYearsContent = [];
        let followingYearContent = [];

        for (let i = 0; i < arraySize; i++) {
            const index = arrayOfIndexesOfVisibleMonths[i];
            const id = index + "-" + (index + 1);
            const monthClass = (index === this.state.selectedMonthLeftIndex ||
                index === this.state.selectedMonthRightIndex) ? 'month-selected' : 'month';
            const object = this.state.arrayOfMonths[index];

            // sets the years
            if (previousYear === null) {
                previousYear = object.year;
            } else if (previousYear !== object.year) {
                followingYear = object.year;
            }

            if (object.year === previousYear) { // sets the previous year content
                previousYearContent.push(<div className={monthClass} id={index}>{object.month.substr(0, 3)}</div>);

                if (object.number !== 12) {
                    this.pushBetweenMonthBlock(previousYearContent, id);
                } else {
                    let timing;

                    previousYearContent = this.getLeveledContent(previousYearContent, previousYear, true, false);

                    betweenYearsContent.push(<div className={'between'}/>); // sets between year content
                    this.pushBetweenMonthBlock(betweenYearsContent, id);

                    timing = betweenYearsContent;

                    betweenYearsContent = [];
                    betweenYearsContent.push(<div className={'betweenYears'}>{timing}</div>);
                }
            } else if (object.year === followingYear) { // sets the following year content
                followingYearContent.push(<div className={monthClass} id={index}>{object.month.substr(0, 3)}</div>);

                if (i !== arraySize - 1) {
                    this.pushBetweenMonthBlock(followingYearContent, id);
                } else {
                    followingYearContent = this.getLeveledContent(followingYearContent, followingYear, false, false);
                }
            }
        }

        fullContent.push(previousYearContent);
        fullContent.push(betweenYearsContent);
        fullContent.push(followingYearContent);

        return fullContent;
    }

    /**
     * @param isLeftAdditionalMonths
     *
     * @state arrayOfIndexesLeftAdditionalMonths
     * @state arrayOfIndexesRightAdditionalMonths
     * @state arrayOfMonths
     *
     * @returns {Array}
     */
    renderAdditionalMonths(isLeftAdditionalMonths) {
        const arraySize = 5;
        const arrayOfIndexesOfAdditionalMonths = (isLeftAdditionalMonths)
            ? this.state.arrayOfIndexesLeftAdditionalMonths : this.state.arrayOfIndexesRightAdditionalMonths;
        let fullContent = [];
        let additionalContent = [];
        let betweenYearsContent = [];

        for (let i = 0; i < arraySize; i++) {
            const index = arrayOfIndexesOfAdditionalMonths[i];
            const id = index + "-" + (index + 1);
            const monthClass = 'month';
            let object;

            if (index < 0) {
                object = {
                    year: -1,
                    month: "Null",
                    number: -1
                };
            } else {
                object = this.state.arrayOfMonths[index];
            }

            additionalContent.push(<div className={monthClass} id={index}>{object.month.substr(0, 3)}</div>);

            if (i !== arraySize - 1) {
                this.pushBetweenMonthBlock(additionalContent, id);
            } else {
                let timing;

                if (isLeftAdditionalMonths) {
                    additionalContent = this.getLeveledContent(additionalContent,
                        <span style={{visibility: "hidden"}}>Null</span>, true, true);
                } else {
                    additionalContent = this.getLeveledContent(additionalContent,
                        <span style={{visibility: "hidden"}}>Null</span>, false, true);
                }

                betweenYearsContent.push(<div className={'between'}/>); // sets between year content
                this.pushBetweenMonthBlock(betweenYearsContent, id);

                timing = betweenYearsContent;

                betweenYearsContent = [];
                betweenYearsContent.push(<div className={'betweenYears'}>{timing}</div>);
            }

        }

        if (isLeftAdditionalMonths) {
            fullContent.push(additionalContent);
            fullContent.push(betweenYearsContent);
        } else {
            fullContent.push(betweenYearsContent);
            fullContent.push(additionalContent);
        }

        return fullContent;
    }

    /**
     * @param content
     * @param id (format: "149-150")
     *
     * @state selectedMonthLeftIndex
     * @state selectedMonthRightIndex
     */
    pushBetweenMonthBlock(content, id) {
        const borderClass = (this.state.selectedMonthLeftIndex + "-" + this.state.selectedMonthRightIndex === id) ?
            'border-visible' : 'border';
        let timing = [];

        timing.push(<div className={'betweenMonth'} id={id} onClick={() => this.selectMonths(id)}/>);
        timing.push(<div className={borderClass} id={id + "b"}/>);
        content.push(<div className={'betweenMonthBorderBlock'}>{timing}</div>);
    }

    /**
     * @param content
     * @param year
     * @param isPreviousYear
     * @param isAdditional
     *
     * @returns {Array}
     */
    getLeveledContent(content, year, isPreviousYear, isAdditional) {
        const nameOfTheYear = (isPreviousYear) ? 'thePreviousYear' : 'theFollowingYear';
        const nameOfTheBlock = (isAdditional) ? nameOfTheYear + 'AdditionalBlock' : nameOfTheYear + 'Block';
        let timing = [];

        timing.push(<div className={nameOfTheYear}>{year}</div>);

        if (isPreviousYear) {
            timing.push(<div className={'lineOfMonthsLeft'}>{content}</div>);
        } else {
            timing.push(<div className={'lineOfMonthsRight'}>{content}</div>);
        }

        content = [];
        content.push(<div className={nameOfTheBlock}>{timing}</div>);

        return content;
    }

    /**
     * Fills the arrayOfMonths in state
     * (the full range of allowable months with years)
     */
    getFilledArrayOfMonths() {
        const leftLimitDate = new Date('1/01/2006');
        const leftLimitYear = leftLimitDate.getFullYear();
        const leftLimitMonth = leftLimitDate.getMonth() + 1;
        const rightLimitDate = new Date();
        const rightLimitYear = rightLimitDate.getFullYear();
        const rightLimitMonth = rightLimitDate.getMonth() + 1;
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

                const object = {
                    year: year,
                    month: month,
                    number: number
                };

                arrayOfMonths.push(object);
            }
        }

        return arrayOfMonths;
    }

    /**
     * Initialize the arrayOfIndexesOfVisibleMonths in state at start time
     * (the indexes of the 12 months that will be visible)
     * Also sets indexes of selected months in state at start moment
     *
     * @props dateTo
     */
    getInitializedArrayOfIndexesOfVisibleMonths(arrayOfMonths) {
        const rightMonth = this.props.dateTo.getMonth() + 1;
        const rightYear = this.props.dateTo.getFullYear();
        let searchedIndex; // index of right selected month
        let arrayOfIndexesOfVisibleMonths;

        for (let i = 0; i < arrayOfMonths.length; i++) {
            const object = arrayOfMonths[i];

            if (object.year === rightYear && object.number === rightMonth) {
                searchedIndex = i;
                break;
            }
        }

        arrayOfIndexesOfVisibleMonths = this.getFilledArrayOfIndexesOfVisibleMonths(arrayOfMonths, searchedIndex);

        return {
            arrayOfIndexesOfVisibleMonths: arrayOfIndexesOfVisibleMonths,
            selectedMonthLeftIndex: searchedIndex - 1,
            selectedMonthRightIndex: searchedIndex
        };
    }

    /**
     * @param arrayOfMonths
     * @param indexOfRightMonth
     *
     * @returns {Array}
     */
    getFilledArrayOfIndexesOfVisibleMonths(arrayOfMonths, indexOfRightMonth) {
        let arrayOfIndexesOfVisibleMonths = [indexOfRightMonth];

        if (indexOfRightMonth + 5 < arrayOfMonths.length && indexOfRightMonth - 6 >= 0) { // if months are enough and left and right
            for (let i = indexOfRightMonth + 1; i <= indexOfRightMonth + 5; i++) {
                arrayOfIndexesOfVisibleMonths.push(i);
            }

            for (let i = indexOfRightMonth - 1; i >= indexOfRightMonth - 6; i--) {
                arrayOfIndexesOfVisibleMonths.unshift(i);
            }
        } else if (indexOfRightMonth - 6 < 0) { // if months are enough only with right side
            let maxLeft = 0;

            for (let i = indexOfRightMonth - 1; i >= 0; i--) {
                arrayOfIndexesOfVisibleMonths.unshift(i);
                maxLeft++;
            }

            for (let i = indexOfRightMonth + 1; i <= 11 - maxLeft + indexOfRightMonth; i++) {
                arrayOfIndexesOfVisibleMonths.push(i);
            }
        } else if (indexOfRightMonth + 5 >= arrayOfMonths.length) { // if months are enough only with left side
            let maxRight = 0;

            for (let i = indexOfRightMonth + 1; i < arrayOfMonths.length; i++) {
                arrayOfIndexesOfVisibleMonths.push(i);
                maxRight++;
            }

            for (let i = indexOfRightMonth - 1; i >= indexOfRightMonth - 11 + maxRight; i--) {
                arrayOfIndexesOfVisibleMonths.unshift(i);
            }
        }

        return arrayOfIndexesOfVisibleMonths;
    }

    getFilledArrayOfIndexesOfAdditionalMonths(arrayOfMonths, arrayOfIndexesOfVisibleMonths) {
        const leftLimit = arrayOfIndexesOfVisibleMonths[0] - 1;
        const rightLimit = arrayOfIndexesOfVisibleMonths[arrayOfIndexesOfVisibleMonths.length - 1] + 1;
        let arrayOfIndexesLeftAdditionalMonths = [];
        let arrayOfIndexesRightAdditionalMonths = [];

        for (let i = leftLimit; i > leftLimit - 5; i--) {
            const index = (arrayOfMonths[i] !== undefined) ? i : -i;
            arrayOfIndexesLeftAdditionalMonths.unshift(index);
        }

        for (let i = rightLimit; i < rightLimit + 5; i++) {
            const index = (arrayOfMonths[i] !== undefined) ? i : -i;
            arrayOfIndexesRightAdditionalMonths.push(index);
        }

        return {
            arrayOfIndexesLeftAdditionalMonths: arrayOfIndexesLeftAdditionalMonths,
            arrayOfIndexesRightAdditionalMonths: arrayOfIndexesRightAdditionalMonths
        }
    }

    /**
     * Sets new selected months's left and right indexes, new array of indexes of visible and additional months,
     * header animation class
     *
     * @param id
     *
     * @state selectedMonthLeftIndex
     * @state selectedMonthRightIndex
     * @state arrayOfMonths
     * @state arrayOfIndexesOfVisibleMonths
     * @state headerAnimationClass
     * @state arrayOfIndexesLeftAdditionalMonths
     * @state arrayOfIndexesRightAdditionalMonths
     */
    selectMonths(id) {
        const selectedMonthLeftIndex = parseInt(id.substr(0, id.indexOf("-")));
        const selectedMonthRightIndex = selectedMonthLeftIndex + 1;
        const arrayOfIndexesOfVisibleMonths =
            this.getFilledArrayOfIndexesOfVisibleMonths(this.state.arrayOfMonths, selectedMonthRightIndex);
        const {arrayOfIndexesLeftAdditionalMonths, arrayOfIndexesRightAdditionalMonths} =
            this.getFilledArrayOfIndexesOfAdditionalMonths(this.state.arrayOfMonths, arrayOfIndexesOfVisibleMonths);
        const headerAnimationClass = this.getCalculatedAnimationClass(selectedMonthLeftIndex);

        // animation count, учесть, что анимация идет не всегда (когда границы)

        if (headerAnimationClass === undefined) {
            this.setState({
                arrayOfIndexesOfVisibleMonths: arrayOfIndexesOfVisibleMonths,
                selectedMonthLeftIndex: selectedMonthLeftIndex,
                selectedMonthRightIndex: selectedMonthRightIndex,
                headerAnimationClass: 'header',
                arrayOfIndexesLeftAdditionalMonths: arrayOfIndexesLeftAdditionalMonths,
                arrayOfIndexesRightAdditionalMonths: arrayOfIndexesRightAdditionalMonths
            });
        } else {
            this.setState({
                selectedMonthLeftIndex: selectedMonthLeftIndex,
                selectedMonthRightIndex: selectedMonthRightIndex,
                headerAnimationClass: headerAnimationClass
            });

            setTimeout(function (that) {
                that.setState({
                    arrayOfIndexesOfVisibleMonths: arrayOfIndexesOfVisibleMonths,
                    headerAnimationClass: 'header',
                    arrayOfIndexesLeftAdditionalMonths: arrayOfIndexesLeftAdditionalMonths,
                    arrayOfIndexesRightAdditionalMonths: arrayOfIndexesRightAdditionalMonths
                });
                console.log("animation ended");
            }, window.test, this);
        }

        console.log(id);
    }

    /**
     * @param selectedMonthLeftIndex
     *
     * @state arrayOfIndexesOfVisibleMonths
     *
     * @returns {string, undefined}
     */
    getCalculatedAnimationClass(selectedMonthLeftIndex) {
        const centerLeftMonth = this.state.arrayOfIndexesOfVisibleMonths[5];
        const desiredStepSize = selectedMonthLeftIndex - centerLeftMonth;
        let possibleStepSize;
        let animationClass;

        if (desiredStepSize > 0) {
            animationClass = 'header-right';
        } else if (desiredStepSize < 0) {
            animationClass = 'header-left';
        } else {
            return undefined;
        }

        possibleStepSize = this.getClosestNumber(desiredStepSize);

        if (possibleStepSize === 0) {
            return undefined;
        }

        animationClass += "-" + possibleStepSize;

        return animationClass;
    }

    /**
     * @param desiredStepSize
     *
     * @state arrayOfIndexesLeftAdditionalMonths
     * @state arrayOfIndexesRightAdditionalMonths
     *
     * @returns {number}
     */
    getClosestNumber(desiredStepSize) {
        const arrayOfIndexesAdditionalMonths = (desiredStepSize > 0) ? this.state.arrayOfIndexesRightAdditionalMonths :
            this.state.arrayOfIndexesLeftAdditionalMonths;
        let maxStep = 0;

        if (desiredStepSize > 0) {
            for (let i = 0; i < Math.abs(desiredStepSize); i++) {
                if (arrayOfIndexesAdditionalMonths[i] < 0) {
                    break;
                } else {
                    maxStep++;
                }
            }
        } else {
            for (let i = Math.abs(desiredStepSize) - 1; i >= 0; i--) {
                if (arrayOfIndexesAdditionalMonths[i] < 0) {
                    break;
                } else {
                    maxStep++;
                }
            }
        }

        return maxStep;
    }
}

DateIntervalPickerOpened.propTypes = {
    dateFrom: PropTypes.instanceOf(Date),
    dateTo: PropTypes.instanceOf(Date),
};

DateIntervalPickerOpened.defaultProps = {
    dateFrom: new Date(),
    dateTo: new Date("01/15/17")
};