import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Utils/AuthContext';
import axios from "axios";
import Calendar from 'react-calendar';
import { Circles } from 'react-loader-spinner';
import 'react-calendar/dist/Calendar.css';
import './Calendrier.scss';

const Calendrier = () => {
    const { token } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [reservedDates, setReservedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showInfos, setShowInfos] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/reservations`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setReservations(response.data.reservations);
            const reservedDatesArray = [];
            response.data.reservations.forEach((reservation) => {
                const startDate = new Date(reservation.dateArrivee);
                const endDate = new Date(reservation.dateDepart);
          
                // Générez toutes les dates entre la date d'arrivée et la date de départ
                for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                  reservedDatesArray.push(new Date(date));
                }
              });
              setReservedDates(reservedDatesArray);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ ]);

    const tileContent = ({ date }) => {
        const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const reservedDatesAdjusted = reservedDates.map(reservedDate => {
          const adjustedReservedDate = new Date(reservedDate);
          adjustedReservedDate.setDate(adjustedReservedDate.getDate() - 1);
          return adjustedReservedDate;
        });
        
        if (reservedDatesAdjusted.some(reservedDate => {
          const formattedReservedDate = new Date(reservedDate.getFullYear(), reservedDate.getMonth(), reservedDate.getDate());
          return formattedReservedDate.getTime() === formattedDate.getTime();
        })) {
          return "reserved";
        }
        
        return "";
      };
      
      
    

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
            { reservations === undefined || reservations === null ? (
                <div className="loader-page">
                    <Circles color='#070f4e' height={100} width={100} />
                </div>
            ) : (
                <div className='calendrier'>
                <Calendar className='calendar' onClickDay={handleDayClick} tileClassName={tileContent}  />

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
            
            )}
        </>
    );
}

export default Calendrier;