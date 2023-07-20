import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Utils/AuthContext';
import axios from "axios";
import { Circles } from 'react-loader-spinner';
import './Accueil.scss';

const Accueil = () => {

    const { token } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/reservations`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setReservations(response.data.reservations);
        });
    }, [token]);


    return (
        <>
            <h1 className='h1-top'>Accueil</h1>
            { reservations === [] || reservations === undefined ?
                <div className="loader-page">
                    <Circles color='#070f4e' height={100} width={100} />
                </div> : 
                <div className="reservations-accueil">
                    <h2 className="title-reservations">Réservations</h2>
                    {reservations.map((reservation) => {
                        return (
                            <div className="card" key={reservation._id}>
                                <div className="card-body">
                                    <h4 className="card-title">{reservation.prenomLocataire} {reservation.nomLocataire}</h4>
                                    <p className="card-text">{reservation.dateArrivee} - {reservation.dateDepart}</p>
                                    <p className="card-text">{reservation.nombrePersonne} personnes</p>
                                </div>
                                <button className="supprimer-reservation">
                                    Annuler
                                </button>
                            </div>
                        )
                    })}
                </div>
            }
        </>
    );
}

export default Accueil;
