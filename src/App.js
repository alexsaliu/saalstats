import { useState, useEffect } from 'react'
import axios from 'axios'

import { meetingNames } from './meetingNames.js'

const API = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://saal-backend.herokuapp.com'

function App() {
    const [athleteName, setAthleteName] = useState('')
    const [selectedDistance, setSelectedDistance] = useState('')
    const [selectedMeeting, setSelectedMeeting] = useState('')
    const [selectedYear, setSelectedYear] = useState('')
    const [athletes, setAthletes] = useState([])
    const [distances, setDistances] = useState([])
    const [meetings, setMeetings] = useState(meetingNames.sort())
    const [years] = useState([2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010])
    const [headings] = useState(['Date', 'Meeting', 'Distance', 'Round', 'Mark', 'Time', 'Adj Time', 'Position', 'Z Score', 'Z Score 1u/1d'])
    const [results, setResults] = useState([])

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        let data = await axios.get(`${API}/data`)
        data = data.data
        setAthletes(data.athletes.map(athlete => athlete.name).sort())
        setDistances(data.events.map(event => event.distance).filter((event, index, array) => array.indexOf(event) === index))
    }

    const submit = async () => {
        let queries = 0;
        if (athleteName) queries++
        if (selectedDistance) queries++
        if (selectedMeeting) queries++
        if (selectedYear) queries++
        if (queries > 1) {
            const data = await axios.get(`${API}/athlete`, {
                params: {
                    athlete: athleteName.toLowerCase(),
                    distance: selectedDistance,
                    meeting: selectedMeeting,
                    year: selectedYear
                }
            })
            setResults(data.data)
            console.log(data.data);
        }
        else {
            console.log('Need 2 queries');
        }
    }

    const formatDate = (date) => {
        date = new Date(date)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return day + '-' + month + '-' + year
    }

    const formatMeeting = (name) => {
        const lc = name.toLowerCase()
        for (let meet of meetingNames) {
            if (lc.includes(meet.toLowerCase())) {
                if (meet === 'Gambier') meet = 'Mt ' + meet
                return meet
            }
        }
        return name
    }

    return (
        <div className="App">
            <button onClick={() => submit()}>Submit</button>
            <select onChange={(e) => setAthleteName(e.target.value)}>
                <option></option>
                {athletes.map((athlete, i) => <option key={i}>{athlete}</option>)}
            </select>
            <select onChange={(e) => setSelectedDistance(e.target.value)}>
                <option></option>
                {distances.map((athlete, i) => <option key={i}>{athlete}</option>)}
            </select>
            <select onChange={(e) => setSelectedMeeting(e.target.value)}>
                <option></option>
                {meetings.map((meeting, i) => <option key={i}>{meeting}</option>)}
            </select> Select at least 2
            {/* <select onChange={(e) => setSelectedYear(e.target.value)}>
                <option></option>
                {years.map((year, i) => <option key={i}>{year}</option>)}
            </select> */}
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) => <th key={i}>{heading}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {results.map((row, i) => <tr key={i} className="row">
                        <td>{formatDate(row.date)}</td>
                        <td>{formatMeeting(row.meeting)}</td>
                        <td>{row.distance}</td>
                        <td>{row.round}</td>
                        <td>{row.mark}</td>
                        <td>{row.time}</td>
                        <td>{row.adj_time}</td>
                        <td>{row.position}</td>
                        <td>{row.zscore}</td>
                        <td>{row.zscore_1u1d}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    );
}

export default App;
