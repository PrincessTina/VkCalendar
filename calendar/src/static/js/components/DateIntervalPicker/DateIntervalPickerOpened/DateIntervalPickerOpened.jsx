import React from "react";
import PropTypes from 'prop-types';

import Calendar from './Calendar/Calendar.jsx';
import Time from './Time/Time.jsx';

import './dateIntervalPickerOpened.less';

/**
 * Full version of the element
 */
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

        this.startRendering = true;

        this.selectMonths = this.selectMonths.bind(this);
    }

    /**
     * Sets animation at calendar's area
     */
    setChildAnimation() {
        if (document.getElementsByClassName('calendarArea')) {
            let area = document.getElementsByClassName('calendarArea')[0];

            if (!this.startRendering) {
                area.classList.remove('animation', 'opacity');

                setTimeout(function () {
                    area.classList.add('animation');
                }, 1);
            } else {
                area.classList.add('opacity');
                this.startRendering = false;
            }
        }
    }

    /**
     * Sets calendar's area visible at start time
     */
    componentDidMount() {
        this.setChildAnimation();
    }

    /**
     * Adds invisible additional months with left and right side
     *
     * @param isLeftAdditionalMonths
     *
     * @state arrayOfIndexesLeftAdditionalMonths
     * @state arrayOfIndexesRightAdditionalMonths
     * @state arrayOfMonths
     *
     * @returns {Array}
     */
    addAdditionalMonthsContent(isLeftAdditionalMonths) {
        const arrayOfIndexesOfAdditionalMonths = (isLeftAdditionalMonths)
            ? this.state.arrayOfIndexesLeftAdditionalMonths : this.state.arrayOfIndexesRightAdditionalMonths;
        const arraySize = arrayOfIndexesOfAdditionalMonths.length; // 5
        let content = [];

        for (let i = 0; i < arraySize; i++) {
            const index = arrayOfIndexesOfAdditionalMonths[i];
            const id = index + "-" + (index + 1);
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

            content.push(this.getCheckedMonth(object, index, 'month'));

            if (isLeftAdditionalMonths || (!isLeftAdditionalMonths && i !== arraySize - 1)) {
                content.push(this.pushBetweenMonthBlock(id));
            }
        }

        return content;
    }

    /**
     * Returns full month content (all 12 with additional with left and right side)
     *
     * @state arrayOfIndexesOfVisibleMonths
     * @state arrayOfMonths
     * @state selectedMonthRightIndex
     * @state selectedMonthLeftIndex
     *
     * @returns {XML}
     */
    renderFullMonthsContent() {
        const arrayOfIndexesOfVisibleMonths = this.state.arrayOfIndexesOfVisibleMonths;
        const arraySize = arrayOfIndexesOfVisibleMonths.length; // 12
        let content = [];

        content.push(this.addAdditionalMonthsContent(true));

        for (let i = 0; i < arraySize; i++) {
            const index = arrayOfIndexesOfVisibleMonths[i];
            const id = index + "-" + (index + 1);
            const monthClass = (index === this.state.selectedMonthLeftIndex ||
                index === this.state.selectedMonthRightIndex) ? 'month-selected' : 'month';
            const object = this.state.arrayOfMonths[index];

            content.push(this.getCheckedMonth(object, index, monthClass));
            content.push(this.pushBetweenMonthBlock(id));
        }

        content.push(this.addAdditionalMonthsContent(false));

        return (
            <div className={'lineOfMonths'}>
                {content}
            </div>
        );
    }

    /**
     * Checks month for december or january compliance and returns appropriate content
     *
     * @param object
     * @param index
     * @param monthClass
     *
     * @returns {XML}
     */
    getCheckedMonth(object, index, monthClass) {
        if (object.number === 12) {
            return (
                <div className={'decYearBlock'}>
                    <div className={'decYear'}>{object.year}</div>
                    <div className={monthClass} id={index}>{object.month.substr(0, 3)}</div>
                </div>
            );
        } else if (object.number === 1) {
            return (
                <div className={'janYearBlock'}>
                    <div className={'janYear'}>{object.year}</div>
                    <div className={monthClass} id={index}>{object.month.substr(0, 3)}</div>
                </div>
            );
        } else {
            return (
                <div className={monthClass} id={index}>{object.month.substr(0, 3)}</div>
            );
        }
    }

    /**
     * Adds betweenMonthBorderBlock (between month block with border under it and months)
     *
     * @param id (format: "149-150")
     *
     * @state selectedMonthLeftIndex
     * @state selectedMonthRightIndex
     *
     * @returns {XML}
     */
    pushBetweenMonthBlock(id) {
        const borderClass = (this.state.selectedMonthLeftIndex + "-" + this.state.selectedMonthRightIndex === id) ?
            'border-visible' : 'border';

        return (
            <div className={'betweenMonthBorderBlock'}>
                <div className={'betweenMonth'} id={id} onClick={() => this.selectMonths(id)}/>
                <div className={borderClass} id={id + "b"}/>
            </div>
        );
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
     * Fills array of indexes of visible months
     *
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

    /**
     * Fills array of indexes of addiitonal months
     *
     * @param arrayOfMonths
     * @param arrayOfIndexesOfVisibleMonths
     *
     * @returns {{arrayOfIndexesLeftAdditionalMonths: Array, arrayOfIndexesRightAdditionalMonths: Array}}
     */
    getFilledArrayOfIndexesOfAdditionalMonths(arrayOfMonths, arrayOfIndexesOfVisibleMonths) {
        const arraySize = 6;
        const leftLimit = arrayOfIndexesOfVisibleMonths[0] - 1;
        const rightLimit = arrayOfIndexesOfVisibleMonths[arrayOfIndexesOfVisibleMonths.length - 1] + 1;
        let arrayOfIndexesLeftAdditionalMonths = [];
        let arrayOfIndexesRightAdditionalMonths = [];

        for (let i = leftLimit; i > leftLimit - arraySize; i--) {
            arrayOfIndexesLeftAdditionalMonths.unshift(i);
        }

        for (let i = rightLimit; i < rightLimit + arraySize; i++) {
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
        if (id !== '-1-0' && id !== (this.state.arrayOfMonths.length - 1 + '-' + this.state.arrayOfMonths.length)) { // check on boundary
            const selectedMonthLeftIndex = parseInt(id.substr(0, id.indexOf("-")));
            const selectedMonthRightIndex = selectedMonthLeftIndex + 1;
            const arrayOfIndexesOfVisibleMonths =
                this.getFilledArrayOfIndexesOfVisibleMonths(this.state.arrayOfMonths, selectedMonthRightIndex);
            const {arrayOfIndexesLeftAdditionalMonths, arrayOfIndexesRightAdditionalMonths} =
                this.getFilledArrayOfIndexesOfAdditionalMonths(this.state.arrayOfMonths, arrayOfIndexesOfVisibleMonths);
            const headerAnimationClass = this.getAnimationClass(selectedMonthLeftIndex);

            this.setChildAnimation();

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
                }, 400, this);
            }
        }
    }

    /**
     * Returns animation class, that necessary for jump to the other month's pair
     *
     * @param selectedMonthLeftIndex
     *
     * @state arrayOfIndexesOfVisibleMonths
     *
     * @returns {string, undefined}
     */
    getAnimationClass(selectedMonthLeftIndex) {
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
     * Returns maximum possible number to the desired
     *
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

    /**
     * Displays header with months
     *
     * @returns {XML}
     */
    render() {
        return (
            <div className={'dateIntervalPickerOpened'}>
                <div className={'dateIntervalPickerOpened__content'}>
                    <div className={this.state.headerAnimationClass}>
                        {this.renderFullMonthsContent()}
                    </div>
                    <Calendar selectedMonthLeftIndex={this.state.selectedMonthLeftIndex}
                              selectedMonthRightIndex={this.state.selectedMonthRightIndex}
                              dateTo={this.props.dateTo}
                              dateFrom={this.props.dateFrom}
                              arrayOfMonths={this.state.arrayOfMonths}
                              setNewDates={this.props.setNewDates}/>
                    <Time dateTo={this.props.dateTo}
                          dateFrom={this.props.dateFrom}
                          setNewTime={this.props.setNewTime}/>
                </div>
            </div>
        );
    }
}

DateIntervalPickerOpened.propTypes = {
    dateFrom: PropTypes.instanceOf(Date),
    dateTo: PropTypes.instanceOf(Date),
    setNewDates: PropTypes.func,
    setNewTime: PropTypes.func
};