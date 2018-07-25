import React from "react";
import PropTypes from 'prop-types';

import Calendar from './Calendar.jsx';

import '../../css/dateIntervalPickerOpened.less';

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

    render() {
        const content = this.renderFullMonthsContent();

        return (
            <div className={'dateIntervalPickerOpened'}>
                <div className={'dateIntervalPickerOpened__content'}>
                    <div className={this.state.headerAnimationClass}>
                        {content}
                    </div>
                    <Calendar selectedMonthLeftIndex={this.state.selectedMonthLeftIndex}
                              selectedMonthRightIndex={this.state.selectedMonthRightIndex}
                              dateTo={this.props.dateTo}
                              dateFrom={this.props.dateFrom}
                              arrayOfMonths={this.state.arrayOfMonths}
                              closedWindowFunction={this.props.closeWindowFunction}/>
                </div>
            </div>
        );
    }

    /**
     * Sets calendar's area visible at start time
     */
    componentDidMount() {
        this.setChildAnimation();
    }

    /**
     * @param fullContent
     * @param object
     * @param index
     * @param monthClass
     */
    checkMonth(fullContent, object, index, monthClass) {
        let timing = [];

        if (object.number === 12) {
            timing.push(<div className={'decYear'}>{object.year}</div>);
            timing.push(<div className={monthClass} id={index}>{object.month.substr(0, 3)}</div>);

            fullContent.push(<div className={'decYearBlock'}>{timing}</div>);
        } else if (object.number === 1) {
            timing.push(<div className={'janYear'}>{object.year}</div>);
            timing.push(<div className={monthClass} id={index}>{object.month.substr(0, 3)}</div>);

            fullContent.push(<div className={'janYearBlock'}>{timing}</div>);
        } else {
            fullContent.push(<div className={monthClass} id={index}>{object.month.substr(0, 3)}</div>);
        }
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
    addAdditionalMonthsContent(isLeftAdditionalMonths) {
        const arraySize = 5;
        const arrayOfIndexesOfAdditionalMonths = (isLeftAdditionalMonths)
            ? this.state.arrayOfIndexesLeftAdditionalMonths : this.state.arrayOfIndexesRightAdditionalMonths;
        let fullContent = [];

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

            this.checkMonth(fullContent, object, index, 'month');

            if (isLeftAdditionalMonths || (!isLeftAdditionalMonths && i !== arraySize - 1)) {
                this.pushBetweenMonthBlock(fullContent, id);
            }
        }

        return fullContent;
    }

    /**
     * @state arrayOfIndexesOfVisibleMonths
     * @state arrayOfMonths
     * @state selectedMonthRightIndex
     * @state selectedMonthLeftIndex
     *
     * @returns {Array}
     */
    renderFullMonthsContent() {
        const arrayOfIndexesOfVisibleMonths = this.state.arrayOfIndexesOfVisibleMonths;
        const arraySize = 12;
        let fullContent = [];
        let timing;

        fullContent.push(this.addAdditionalMonthsContent(true));

        for (let i = 0; i < arraySize; i++) {
            const index = arrayOfIndexesOfVisibleMonths[i];
            const id = index + "-" + (index + 1);
            const monthClass = (index === this.state.selectedMonthLeftIndex ||
                index === this.state.selectedMonthRightIndex) ? 'month-selected' : 'month';
            const object = this.state.arrayOfMonths[index];

            this.checkMonth(fullContent, object, index, monthClass);
            this.pushBetweenMonthBlock(fullContent, id);
        }

        fullContent.push(this.addAdditionalMonthsContent(false));

        timing = fullContent;
        fullContent = [];
        fullContent.push(<div className={'lineOfMonths'}>{timing}</div>);

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
            arrayOfIndexesLeftAdditionalMonths.unshift(i);
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
                console.log("animation ended");
            }, 400, this);
        }

        console.log(id);
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
    closeWindowFunction: PropTypes.func
};