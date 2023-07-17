import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendrier.scss';

const Calendrier = () => {
    //const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showInfos, setShowInfos] = useState(false);

    const handleDayClick = (date) => {
        if (selectedDate && date.getTime() === selectedDate.getTime()) {
            setSelectedDate(null);
            setShowInfos(false);
        } else {
            setSelectedDate(date);
            setShowInfos(true);
        }
    };

    return (
        <>
            <h1 className='h1-top'>Calendrier</h1>
            <div className='calendrier'>
                <Calendar className='calendar' onClickDay={handleDayClick} />

                <div className="infos">
                    {showInfos && (
                        <>
                            <p className="nom-locataire">Mr DUPONT</p>
                            <p className="date">Dates : 10/07/2022 - 12/07/2022</p>
                            <p className="heure">Nombre de personnes : 3</p>
                        </>
                    )}
                </div>

            </div>
        </>
    );
}

export default Calendrier;