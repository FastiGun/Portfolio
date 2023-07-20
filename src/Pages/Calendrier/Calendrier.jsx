import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Utils/AuthContext';
import axios from "axios";
import Calendar from 'react-calendar';
import { Circles } from 'react-loader-spinner';
import { parse } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import './Calendrier.scss';

const Calendrier = () => {
    const { token } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [reservationInfo, setReservationInfo] = useState(null);
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
            const reservedDatesArray = response.data.reservations.flatMap((reservation) => {
                const startDate = parse(reservation.dateArrivee, 'dd/MM/yyyy', new Date());
                const endDate = parse(reservation.dateDepart, 'dd/MM/yyyy', new Date());
                const dates = [];
                for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                    dates.push(new Date(date));
                }
                return dates;
            });
            setReservedDates(reservedDatesArray);
        });
    }, [token]);

    const tileContent = ({ date }) => {
        const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (reservedDates.some((reservedDate) => {
            const formattedReservedDate = new Date(reservedDate.getFullYear(), reservedDate.getMonth(), reservedDate.getDate());
            return formattedReservedDate.getTime() === formattedDate.getTime();
        })) {
            return "reserved";
        }
        return "";
    };

    const handleDayClick = (date) => {
        if (selectedDate && isSameDay(date, selectedDate)) {
            setSelectedDate(null);
            setShowInfos(false);
            setReservationInfo(null);
        } else {
            setSelectedDate(date);
            setShowInfos(true);

            const reservation = reservations.find((reservation) => {
                const startDate = parse(reservation.dateArrivee, 'dd/MM/yyyy', new Date());
                const endDate = parse(reservation.dateDepart, 'dd/MM/yyyy', new Date());
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                return startDate <= date && date <= endDate;
            });

            setReservationInfo(reservation);
        }
    };

    const isSameDay = (date1, date2) => {
        const formattedDate1 = formatDate(date1);
        const formattedDate2 = formatDate(date2);
        return formattedDate1 === formattedDate2;
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <h1 className='h1-top'>Calendrier</h1>
            {reservations === undefined || reservations === [] ? (
                <div className="loader-page">
                    <Circles color='#070f4e' height={100} width={100} />
                </div>
            ) : (
                <div className='calendrier'>
                    <Calendar className='calendar' onClickDay={handleDayClick} tileClassName={tileContent} />

                    <div className="infos">
                        {showInfos && (
                            <>
                                {reservationInfo ? (
                                    <>
                                        <p className="nom-locataire">{reservationInfo.prenomLocataire} {reservationInfo.nomLocataire}</p>
                                        <p className="date">Du {reservationInfo.dateArrivee} au {reservationInfo.dateDepart}</p> {/* Utilisez directement les dates de réservation sans appel à toLocaleDateString */}
                                        <p className="nbJours">{reservationInfo.dureeLocation} jours</p>
                                        <p className="heure">{reservationInfo.nombrePersonne} personnes</p>
                                    </>
                                ) : (
                                    <p className="no-reservation">Aucune réservation pour cette journée</p>
                                )}
                            </>
                        )}
                    </div>

                </div>

            )}
        </>
    );
}

export default Calendrier;
