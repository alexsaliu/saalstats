import { useState } from 'react'
import axios from 'axios'

const API = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/athlete/'
    : 'https://saal-backend.herokuapp.com/athlete/'

function App() {
    const [athlete, setAthlete] = useState('')
    const [data, setData] = useState([])

    const submit = async () => {
        const results = await axios.get(`${API}${athlete.toLowerCase()}`)
        setData(results.data)
    }

    const formatDate = (date) => {
        date = new Date(date)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDay()
        return day + '-' + month + '-' + year
    }

    return (
        <div className="App">
            <input onChange={(e) => setAthlete(e.target.value)} type="text" placeholder="Athlete Name" />
            <button onClick={() => submit()}>Submit</button>
            <div>
                {data.map((row, i) => <div key={i} className="row">
                    <div>{formatDate(row.date)}</div>
                    <div>{row.meeting}</div>
                    <div>{row.distance}</div>
                    <div>{row.round}</div>
                    <div>{row.mark}</div>
                    <div>{row.time}</div>
                    <div>{row.adj_time}</div>
                    <div>{row.position}</div>
                </div>)}
            </div>
        </div>
    );
}

export default App;
