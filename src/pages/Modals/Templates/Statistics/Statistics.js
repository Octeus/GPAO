import React from "react";
import './Statistics.css'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import Select from "../../../../components/Select/Select";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const du = new Date();

let years = [],
    from = 2020
while (from <= parseInt(new Date().getFullYear())) {
    years.push(from);
    from++;
}

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        this.day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        this.state = {
            db: props.data,
            cards: props.data.cards,
            items: props.data.settings.stats.items,
            lapse: (props.data.settings.stats.lapse.length > 0) ? props.data.settings.stats.lapse : ['year'],
            presentation: props.data.settings.stats.presentation,
            data: null,
            options: null,
            sort: (props.data.settings.stats.lapse.length > 0) ? props.data.settings.stats.lapse[0] : 'year',
            weeks: weeksInYear(du.getFullYear()),
            year: du.getFullYear(),
            month: ('0' + (du.getMonth() + 1)).slice(-2),
            date: ('0' + (du.getDate() + 1)).slice(-2),
            week: getRealWeekNumber(du.getFullYear(), du.getMonth(), du.getDate()),
            totalCards: 0,
            createdCards: 0,
            updatedCards: 0
        }
    }

    componentDidMount() {

        this.getFilters(this.state.sort, {
            sort: this.state.sort,
            year: this.state.year,
            weeks: this.state.weeks,
            month: this.state.month,
            date: this.state.date
        })
    }

    getFilters = (mode, state) => {

        if (state !== null) {
            this.dataTreatment(state)
        }
    }

    dataTreatment = (state) => {

        let data = {total: 0},
            cards = this.state.cards,
            filter = state.year;

        if (state.sort !== 'year') {
            filter = state.year + '-' + state.month
        }

        if (state.sort === 'year') {

            for (let i = 0; i < cards.length; i++) {
                if (cards[i].created_at.indexOf(filter) === 0) {
                    data.label = 'for year ' + filter
                    if (!data['content']) {
                        data['content'] = {
                            'created': {
                                'total': 0,
                                'data': {
                                    'January': 0,
                                    'February': 0,
                                    'March': 0,
                                    'April': 0,
                                    'May': 0,
                                    'June': 0,
                                    'July': 0,
                                    'August': 0,
                                    'September': 0,
                                    'October': 0,
                                    'November': 0,
                                    'December': 0,
                                }
                            },
                            'updated': {
                                'total': 0,
                                'data': {
                                    'January': 0,
                                    'February': 0,
                                    'March': 0,
                                    'April': 0,
                                    'May': 0,
                                    'June': 0,
                                    'July': 0,
                                    'August': 0,
                                    'September': 0,
                                    'October': 0,
                                    'November': 0,
                                    'December': 0,
                                }
                            }
                        }
                    }
                    let mParser = parseInt(cards[i].created_at.split('-')[1])-1,
                        index = this.month[mParser]

                    if (cards[i].mode === "CREATE") {
                        data['content']['created']['data'][index]++;
                        data['content']['created']['total']++;
                        data.total++;
                    }
                    if (cards[i].mode === "UPDATE") {
                        data['content']['updated']['data'][index]++;
                        data['content']['updated']['total']++;
                        data.total++;
                    }
                }
            }

        } else if (state.sort === 'month') {

            for (let i = 0; i < cards.length; i++) {
                if (cards[i].created_at.indexOf(filter) === 0) {

                    let mParser = cards[i].created_at.split('-'),
                        y = parseInt(mParser[0]),
                        m = parseInt(mParser[1]) - 1,
                        da = parseInt(mParser[2].split(' ')[0]),
                        index = this.month[m],
                        weekN = getRealWeekNumber(y, m, da),
                        weeksCount = getWeeksInMonth(y, m)

                    data.label = 'for the month of ' + index + ' ' + state.year
                    if (!data['content']) {
                        data['content'] = {
                            'created': {
                                'total': 0,
                                'data': {},
                            },
                            'updated': {
                                'total': 0,
                                'data': {}
                            }
                        }

                        for (let j = 0; j < weeksCount.length; j++) {
                            data['content']['created']['data']['Week #' + weeksCount[j].week] = 0
                            data['content']['updated']['data']['Week #' + weeksCount[j].week] = 0
                        }
                    }

                    if (cards[i].mode === "CREATE") {
                        data['content']['created']['data']['Week #' + weekN]++;
                        data['content']['created']['total']++;
                        data.total++;
                    }
                    if (cards[i].mode === "UPDATE") {
                        data['content']['updated']['data']['Week #' + weekN]++;
                        data['content']['updated']['total']++;
                        data.total++;
                    }
                }
            }
        }

        this.setCharts(data, state)
    }

    setCharts = (infos, state) => {

        let datasets = [],
            text = window.capitalize(this.state.items.join(' and ') + ' cards ' + infos.label)

        let options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: text,
                    },
                },
            },
            labels = this.extractLabels(infos.content.created.data),
            data = {
                labels,
                datasets: datasets,
            };

        if (this.state.items.includes('created')) {
            datasets.push({
                label: 'Created cards',
                data: this.extractData(infos.content.created.data),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
            })
        }

        if (this.state.items.includes('updated')) {
            datasets.push({
                label: 'Updated cards',
                data: this.extractData(infos.content.updated.data),
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
            })
        }

        state.options = options
        state.data = data
        state.totalCards = infos.total
        state.createdCards = infos.content.created.total
        state.updatedCards = infos.content.updated.total

        this.setState(state)
    }

    extractLabels = (infos) => {

        let labels = [];
        for (const infosKey in infos) {
            labels.push(infosKey);
        }
        return labels;
    }

    extractData = (infos) => {

        let data = [];
        for (const infosKey in infos) {
            data.push(infos[infosKey]);
        }
        return data;
    }

    render() {

        return(
            <div id='stats-container' className={this.state.db.settings.theme + ' bg border-color color-2'}>
                {this.state.data !== null &&
                    <>
                        <fieldset>
                            <legend>Mode</legend>
                            <div>
                                <Select
                                    label='Choose mode :'
                                    className={this.state.db.settings.theme + ' bg border-color'}
                                    options={this.state.lapse}
                                    defaultValue={this.state.lapse[0]}
                                    onChange={(e) => {
                                        let target = e.currentTarget,
                                            value = target.value

                                        this.getFilters('years', {
                                            sort: value,
                                            year: du.getFullYear(),
                                            weeks: weeksInYear(parseInt(du.getFullYear())),
                                            month: ('0' + (du.getMonth() + 1)).slice(-2),
                                            date: ('0' + (du.getDate() + 1)).slice(-2)
                                        })
                                    }}
                                />
                            </div>
                        </fieldset>
                        <fieldset id='inline-fieldset'>
                            <legend>Filters</legend>
                            <div>
                                <Select
                                    label='Select year :'
                                    className={this.state.db.settings.theme + ' bg border-color'}
                                    options={years}
                                    defaultValue={parseInt(du.getFullYear())}
                                    onChange={(e) => {
                                        let target = e.currentTarget,
                                            value = parseInt(target.value)
                                        this.getFilters('year', {
                                            year: value,
                                            sort: this.state.sort,
                                            month: this.state.month,
                                            weeks: weeksInYear(parseInt(value)),
                                            date: this.state.date
                                        })
                                    }}
                                />
                                {this.state.sort === 'month' &&
                                    <Select
                                        label='Select month :'
                                        className={this.state.db.settings.theme + ' bg border-color'}
                                        options={this.month}
                                        array={true}
                                        defaultValue={parseInt(du.getMonth())}
                                        onChange={(e) => {
                                            let target = e.currentTarget,
                                                value = parseInt(target.value)
                                            this.getFilters('month', {
                                                year: this.state.year,
                                                sort: this.state.sort,
                                                month: ('0' + (value + 1)).slice(-2),
                                                week:getWeeksList(this.state.year, ('0' + (value + 1)).slice(-2))[0],
                                                date: this.state.date
                                            })
                                        }}
                                    />
                                }
                            </div>
                        </fieldset>
                        <div id='charts-container' className={'charts' + this.state.presentation + '-container'}>
                            {this.state.presentation === 'Bar' &&
                                <Bar options={this.state.options} data={this.state.data}/>
                            }
                            {this.state.presentation === 'Line' &&
                                <Line options={this.state.options} data={this.state.data}/>
                            }
                        </div>
                        <ul id='charts-details'>
                            {this.state.items.includes('created') &&
                                <li className='charts-details-cell created'>Created: <span>{this.state.createdCards}</span></li>
                            }
                            {this.state.items.includes('updated') &&
                                <li className='charts-details-cell updated'>Updated: <span>{this.state.updatedCards}</span></li>
                            }
                            <li className='charts-details-cell total'>Total: <span>{this.state.totalCards}</span></li>
                        </ul>
                    </>
                }
                {this.state.data === null &&
                    <div id='stats-loader'>
                        <span className={this.state.db.settings.theme + ' loader-bg'}/>
                    </div>
                }
            </div>
        );
    }
}
function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0, 0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
}

function weeksInYear(year) {
    let m = 11,
        dd = 31,
        w;

    // Find week that 31 Dec is in. If is first week, reduce date until
    // get previous week.
    do {
        let ddd = new Date(year, m, dd--);
        w = parseInt(getWeekNumber(ddd)[1]);
    } while (w === 1);

    return w;
}

function getWeeksList(year, month) {

    month = parseInt(month) - 1

    let first = (month === 0) ? new Date(year, month, 0) : new Date(year, month, 1),
        next = new Date(year, month+1, 0),
        firstWeek = getDayWeekNumber(first),
        firstNext = getDayWeekNumber(next),
        wks = []

    firstNext = (next.getDay() > 1 && next.getDate() - 1 >= 28) ? firstNext - 1 : firstNext
    firstWeek = (firstWeek > weeksInYear(year)) ? 1 : firstWeek

    while (firstWeek <= firstNext) {
        wks.push(firstWeek)
        firstWeek++
    }

    return wks
}

function getRealWeekNumber(year, month, date) {

    let customDate = (month === 0) ? new Date(year, month, 0) : new Date(year, month, 1),
        oneJan =  new Date(year, 0, 1),
        numberOfDays =  Math.floor((customDate - oneJan) / (24 * 60 * 60 * 1000)),
        weekNumber = Math.ceil(( customDate.getDay() + numberOfDays) / 7)
    return weekNumber;
}

function getDayWeekNumber(newd) {

    let todaydate = newd,
        oneJan =  new Date(todaydate.getFullYear(), 0, 1),
        numberOfDays =  Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000)),
        weekNumber = Math.ceil(( todaydate.getDay() + numberOfDays) / 7)
    return weekNumber;
}

function getWeeksInMonth(year, month, income = 'monday') {

    let weeks = [],
        firstDate = new Date(year, month, 1),
        lastDate = new Date(year, month + 1, 0),
        numDays = lastDate.getDate();

    let start = 1;
    let end = 7 - firstDate.getDay();
    if (income === 'monday') {
        if (firstDate.getDay() === 0) {
            end = 1;
        } else {
            end = 7 - firstDate.getDay() + 1;
        }
    }
    while (start <= numDays) {
        weeks.push({start: start, end: end, week: getWeekNumber(new Date(year, month, start--))[1]});
        start = end + 1;
        end = end + 7;
        end = start === 1 && end === 8 ? 1 : end;
        if (end > numDays) {
            end = numDays;
        }
    }
    return weeks;
}


export default Statistics;