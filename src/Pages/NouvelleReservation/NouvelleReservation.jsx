import React, { useState, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './NouvelleReservation.scss';
import axios from 'axios';
import { AuthContext } from '../../Utils/AuthContext';
import { ToastContext } from '../../Utils/ToastContext';

const NouvelleReservation = () => {
    const { token } = useContext(AuthContext);
    const [dateArrivee, setDateArrivee] = useState(null);
    const [dateDepart, setDateDepart] = useState(null);
    const [nombrePersonnes, setNombrePersonnes] = useState(0);
    const [nomLocataire, setNomLocataire] = useState('');
    const [prenomLocataire, setPrenomLocataire] = useState('');
    const toast = useContext(ToastContext);

    const handleDateChange = (date) => {
        if (dateArrivee === null) {
            setDateArrivee(date.toLocaleDateString());
        }
        if (dateArrivee !== null && dateDepart === null) {
            setDateDepart(date.toLocaleDateString());
        }
    };

    const handleClickReset = (e) => {
        e.preventDefault();
        setNomLocataire('');
        setPrenomLocataire('');
        setDateArrivee(null);
        setDateDepart(null);
        setNombrePersonnes(0);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_BASE_URL}/reservations`, {
            "nomLocataire": nomLocataire,
            "prenomLocataire": prenomLocataire,
            "dateArrivee": dateArrivee,
            "dateDepart": dateDepart,
            "nombrePersonne": nombrePersonnes
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 201) {
                setNomLocataire('');
                setPrenomLocataire('');
                setDateArrivee(null);
                setDateDepart(null);
                setNombrePersonnes(0);
                toast.current.show({severity: 'success', summary: 'Enregistrement', detail: 'Réservation créée'});
            }
        }).catch((error) => {
            if (error.response.status === 409) {
                toast.current.show({severity: 'error', summary: 'Enregistrement', detail: 'Réservation impossible, dates déjà réservées'});
            }
        })
    }

    const handleIncrementNbPersonnes = (e) => {
        e.preventDefault();
        setNombrePersonnes(nombrePersonnes + 1);
    }

    const handleDecrementNbPersonnes = (e) => {
        e.preventDefault();
        if (nombrePersonnes > 0)
            setNombrePersonnes(nombrePersonnes - 1);
    }

    const handleChangeNomLocataire = (e) => {
        e.preventDefault();
        setNomLocataire(e.target.value);
    }

    const handleChangePrenomLocataire = (e) => {
        e.preventDefault();
        setPrenomLocataire(e.target.value);
    }

    return (
        <>
            <h1 className='h1-top'>Nouvelle réservation</h1>
            <div className='calendrier'>
                <Calendar className='calendar'
                    onChange={handleDateChange}
                />
                <form className="inputs" onSubmit={handleSubmit}>
                    <div className='input'>
                        <label>Date d'arrivée</label>
                        <input
                            type="text"
                            value={dateArrivee ? dateArrivee : ''}
                            readOnly
                            required
                        />
                    </div>
                    <div className='input'>
                        <label>Date de départ</label>
                        <input
                            type="text"
                            value={dateDepart ? dateDepart : ''}
                            readOnly
                            required
                        />
                    </div>
                    <div className='input'>
                        <label>Nom du locataire</label>
                        <input
                            type="text"
                            value={nomLocataire}
                            onChange={handleChangeNomLocataire}
                            required
                        />
                    </div>
                    <div className='input'>
                        <label>Prénom du locataire</label>
                        <input
                            type="text"
                            value={prenomLocataire}
                            onChange={handleChangePrenomLocataire}
                            required
                        />
                    </div>
                    <div className='input'>
                        <label>Nombre de personne</label>
                        <div className="nbPersonneSelector">
                            <button onClick={handleDecrementNbPersonnes}>-</button>
                            <p className="nombrePersonne">{nombrePersonnes}</p>
                            <button onClick={handleIncrementNbPersonnes}>+</button>
                        </div>
                    </div>
                    <div className="input">
                        <button onClick={handleClickReset}>Tout effacer</button>
                    </div>
                    <div className="input">
                        <button onClick={handleSubmit}>Créer la réservation</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default NouvelleReservation;