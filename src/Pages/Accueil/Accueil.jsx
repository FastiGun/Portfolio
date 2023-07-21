import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Utils/AuthContext';
import axios from "axios";
import { Circles } from 'react-loader-spinner';
import { ToastContext } from '../../Utils/ToastContext';
import 'primeicons/primeicons.css';
import './Accueil.scss';

const Accueil = () => {

    const { token } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [reloadReservations, setReloadReservations] = useState(false)
    const toast = useContext(ToastContext);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/reservations`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setReservations(response.data.reservations.reverse());
        });
    }, [token, reloadReservations]);

    const handleDeleteReservation = (id) => {
        axios.delete(`${process.env.REACT_APP_BASE_URL}/reservations/${id.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setReloadReservations(true);
            toast.current.clear();
            toast.current.show({severity: 'success', summary: 'Suppression de la reservation', detail: "La réservation a bien été supprimée", life: 3000});
        })
    }

    const handleAskDeleteReservation = (id) => {
        toast.current.show({severity: 'warn', summary: 'Suppression de la reservation', detail: "Vous allez supprimer cette reservation", life: 30000, content: <Confirm id={id}/>, closable: false});
    }

    const Confirm = (id) => {
        return (
            <div className='confirm'>
                <h4>Voulez-vous vraiment supprimer cette réservation ?</h4>
                <div className="confirm-div">
                    <button className="oui" onClick={() => handleDeleteReservation(id)}>Oui</button>
                    <button className="non" onClick={() => toast.current.clear()}>Non</button>
                </div>
            </div>
        )
    }


    return (
        <>
            <h1 className='h1-top'>Accueil</h1>
            { reservations.length === 0 ?
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
                                <button className="supprimer-reservation" onClick={() => handleAskDeleteReservation(reservation._id)}>
                                    <i className="pi pi-calendar-times"></i>
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
