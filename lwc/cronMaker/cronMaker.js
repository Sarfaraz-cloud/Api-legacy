import { LightningElement, track } from 'lwc';
import executeBatch from '@salesforce/apex/LegacyBatchScheduler.scheduleBatch';

export default class CronMaker extends LightningElement {

@track hour = '';
@track second = '';
@track minute = '';
@track output = [];
@track selectedValue;
@track selectedYear;
@track selectedToYear;
@track yearOptions = [];
@track selectedFromYear;
@track dayOrWeek = false;
@track yearInput = false;
@track selectedYear = '';
@track showModal = false;
@track clickedButtonLabel;
@track cronExpression = '';
@track yearDuration = false;
@track yearRangeOptions = [];
@track forParticularTime = true;
@track forMultipleTimes = false;
@track dayOfMonth = 'Day Of Month';
@track value = 'For Particular Time';
@track copyButtonStyle = 'display:none';
 @track showButton = false;
jobName = '';

    handleInputChange(event) {
        this.jobName = event.detail.value;
    }
    get particularTimeOrMultipleTime() {
        return [
            { label: 'For Particular Time', value: 'For Particular Time' },
            { label: 'For Multiple Times', value: 'For Multiple Times' },
        ];
    }
    
    handleYearChange(event) {
        this.selectedYear = event.detail.value;
    }
     mainOptions = [{
            label: 'Every Year',
            value: 'Every Year'
        },
        {
            label: 'Year Input',
            value: 'Year Input'
        },
        {
            label: 'Year Duration',
            value: 'Year Duration'
        }
    ];

    get yearOptions() {
        const currentYear = new Date().getFullYear();
        const years = [];

        for (let i = currentYear; i >= currentYear - 10; i--) {
            years.push({ label: i.toString(), value: i.toString() });
        }

        return years;
    }

    get yearRangeOptions() {
        const currentYear = new Date().getFullYear();
        const futureYears = 5;
        const options = [];

        for (let i = 0; i <= futureYears; i++) {
            const year = currentYear + i;
            options.push({ label: year.toString(), value: year.toString() });
        }

        return options;
    }

    connectedCallback() {
        const currentYear = new Date().getFullYear();
        this.yearOptions = this.generateYearOptions(currentYear, 25);
        this.yearRangeOptions = this.generateYearOptions(currentYear, 25);
    }

    generateYearOptions(startYear, count) {
        const yearOptions = [];
        for (let i = 0; i < count; i++) {
            const year = startYear + i;
            yearOptions.push({ label: year.toString(), value: year.toString() });
        }
        return yearOptions;
    }

    handleMainComboChange(event) {
        this.selectedValue = event.detail.value;

        if (this.selectedValue === 'Year Input') {
            this.yearInput = true;
            this.yearDuration = false;
        } else if (this.selectedValue === 'Year Duration') {
            this.yearInput = false;
            this.yearDuration = true;
        } else {
            this.yearInput = false;
            this.yearDuration = false;
        }
    }

    handleYearChange(event) {
        const fieldName = event.target.name;
        const selectedValue = event.detail.value;
        if (fieldName === 'Specified Year :') {
            this.selectedYear = selectedValue;
        } else if (fieldName === 'For Years from : ') {
            this.selectedFromYear = selectedValue;
        } else if (fieldName === 'To: ') {
            this.selectedToYear = selectedValue;
        }
    }

    handleClick(event) {
        this.clickedButtonLabel = event.target.label;
        console.log('handle click schedule==126>',this.clickedButtonLabel);
    }

    handleChange(event) {
        this.forParticularTime = event.target.checked;
    }

    handleChangeRadio(event) {
        let handleValue = event.target.value;
        console.log('OUTPUT : ', this.forParticularTime);
        if (handleValue === 'For Particular Time') {
            this.showButton = true;
            this.forParticularTime = true;
            this.forMultipleTimes = false;
        } else {
            this.forParticularTime = false;
            this.forMultipleTimes = true;
        }
    }

    get everyMonthOrSelectedMonth() {
        return [
            { label: 'Every Month', value: 'Every Month' },
            { label: 'Jan', value: 'Jan' },
            { label: 'Feb', value: 'Feb' },
            { label: 'Mar', value: 'Mar' },
            { label: 'Apr', value: 'Apr' },
            { label: 'May', value: 'May' },
            { label: 'Jun', value: 'Jun' },
            { label: 'Jul', value: 'Jul' },
            { label: 'Aug', value: 'Aug' },
            { label: 'Sep', value: 'Sep' },
            { label: 'Oct', value: 'Oct' },
            { label: 'Nov', value: 'Nov' },
            { label: 'Dec', value: 'Dec' },
        ];
    }

    get dayOfMonthOrDayOfWeek() {
        return [
            { label: 'Day Of Month', value: 'Day Of Month' },
            { label: 'Day Of Week', value: 'Day Of Week' },
        ];
    }

    handleChange1(event) {
        this.dayOfMonth = event.target.checked;
    }

    handleChangeRadio1(event) {
        let handleValue1 = event.target.value;
        console.log('OUTPUT : ', this.dayOfMonth);
        if (handleValue1 === 'Day Of Month') {
            this.dayOfMonth = true;
            this.dayOfWeek = false;
        } else {
            this.dayOfMonth = false;
            this.dayOfWeek = true;
        }
    }

    get dailyOrSelectedDay() {
        return [
            { label: 'Daily', value: 'Daily' },
            { label: 'Last Day', value: 'Last Day' },
            { label: '1',  value: '1' },
            { label: '2',  value: '2' },
            { label: '3',  value: '3' },
            { label: '4',  value: '4' },
            { label: '5',  value: '5' },
            { label: '6',  value: '6' },
            { label: '7',  value: '7' },
            { label: '8',  value: '8' },
            { label: '9',  value: '9' },
            { label: '10', value: '10' },
            { label: '11', value: '11' },
            { label: '12', value: '12' },
            { label: '13', value: '13' },
            { label: '14', value: '14' },
            { label: '15', value: '15' },
            { label: '16', value: '16' },
            { label: '17', value: '17' },
            { label: '18', value: '18' },
            { label: '19', value: '19' },
            { label: '20', value: '20' },
            { label: '21', value: '21' },
            { label: '22', value: '22' },
            { label: '23', value: '23' },
            { label: '24', value: '24' },
            { label: '25', value: '25' },
            { label: '26', value: '26' },
            { label: '27', value: '27' },
            { label: '28', value: '28' },
            { label: '29', value: '29' },
            { label: '30', value: '30' },
            { label: '31', value: '31' },
        ];
    }

    get weekSelection() {
        return [
            { label: '1st', value: '1st' },
            { label: '2nd', value: '2nd' },
            { label: '3rd', value: '3rd' },
            { label: '4th', value: '4th' },
        ];
    }

    get daySelection() {
        return [
            { label: 'Sunday',    value: 'Sunday' },
            { label: 'Monday',    value: 'Monday' },
            { label: 'Tuesday',   value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday',  value: 'Thursday' },
            { label: 'Friday',    value: 'Friday' },
            { label: 'Saturday',  value: 'Saturday' },
            
        ];
    }

    generateCron() {
        this.output = [];
        var frequency = 0;
        var hourTemp = 0;
        var minuteTemp = 0;
        var secondTemp = 0;
        this.showModal = true;

        if (this.hour !== '' && this.hour !== 0) {
            const timeduration =
                parseFloat(this.hour) +
                parseFloat(this.minute / 60) +
                parseFloat(this.second / 3600);
            frequency = 24 / timeduration;

            for (var i = 0; i < frequency; i++) {
                if (i > 0) {
                    if (this.second !== '') {
                        secondTemp += parseInt(this.second);
                    } else {
                        secondTemp = 0;
                    }
                    if (this.minute !== '') {
                        minuteTemp += parseInt(this.minute);
                    } else {
                        minuteTemp = 0;
                    }
                }
                if (secondTemp >= 60) {
                    minuteTemp += 1;
                    secondTemp = secondTemp - 60;
                }
                this.output.push( `0 ${minuteTemp} ${(
                    this.hour * i
                ) + parseInt(hourTemp)} * * ? *`);
                console.log('this.output',JSON.stringify( this.output));
                this.copyButtonStyle = 'display:block';
            }
        } else if (this.minute !== '') {
            frequency = 60 / this.minute;

            for (var i = 0; i < frequency; i++) {
                if (this.second !== '') {
                    secondTemp += parseInt(this.second);
                } else {
                    secondTemp = 0;
                }
                if (secondTemp >= 60) {
                    minuteTemp += 1;
                    secondTemp = secondTemp - 60;
                }
                this.output.push(`0 ${minuteTemp} ${(this.minute) * i} * * ? *`);
                this.copyButtonStyle = 'display:block';
            }

        } else {
            this.output = 'Either hours or minutes must be filled.';
            this.copyButtonStyle = 'display:none';
        }
        this.cronExpression =  this.output;
    }

     handleClick() {
        try {
            this.generateCron();
            executeBatch({ cronExpressions: this.cronExpression,
                           JobName:  this.jobName })
                .then((result) => {
                    console.log('Batch job scheduled successfully:', result);
                })
                .catch((error) => {
                    console.error('Error scheduling batch job:', error);
                });
        } catch (ex) {
            console.log('Synchronous error:', ex.message);
        }
        console.log('RESULT Value corn323==>',result);
    }

     generateCronPopup() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    handleHourChange(event) {
        this.hour = event.target.value;
    }

    handleMinuteChange(event) {
        this.minute = event.target.value;
    }

    handleSecondChange(event) {
        this.second = event.target.value;
    }

    handleInputChange(event) {
        const fieldName = event.target.label.toLowerCase();
        this[fieldName] = parseInt(event.target.value, 10);
    }

    generateCronExpression() {
        try {
            this.cronExpression = `${this.minute} ${this.hour} ${this.day} ${this.month} ${this.dayOfWeek}`;
            console.log('This is cron Expression ' + this.cronExpression);
        } catch (error) {
            this.cronExpression = 'Invalid input values';
        }
    }
}