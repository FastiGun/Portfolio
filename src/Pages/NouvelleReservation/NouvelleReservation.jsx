import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './NouvelleReservation.scss';

const NouvelleReservation = () => {
    const [dateArrivee, setDateArrivee] = useState(null);
    const [dateDepart, setDateDepart] = useState(null);
    const [nombrePersonnes, setNombrePersonnes] = useState(0);
    const [nomLocataire, setNomLocataire] = useState('');

    const handleDateChange = (date) => {
        if (dateArrivee === null) {
            setDateArrivee(date);
        }
        if (dateArrivee !== null && dateDepart === null) {
            setDateDepart(date);
        }
    };

    const handleClickReset = () => {
        setDateArrivee(null);
        setDateDepart(null);
        setNombrePersonnes(0);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleIncrementNbPersonnes = () => {
        setNombrePersonnes(nombrePersonnes + 1);
    }

    const handleDecrementNbPersonnes = () => {
        if (nombrePersonnes > 0)
            setNombrePersonnes(nombrePersonnes - 1);
    }

    const handleChangeNomLocataire = (e) => {
        setNomLocataire(e.target.value);
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
                            value={dateArrivee ? dateArrivee.toLocaleDateString() : ''}
                            readOnly
                        />
                    </div>
                    <div className='input'>
                        <label>Date de départ</label>
                        <input
                            type="text"
                            value={dateDepart ? dateDepart.toLocaleDateString() : ''}
                            readOnly
                        />
                    </div>
                    <div className='input'>
                        <label>Nom du locataire</label>
                        <input
                            type="text"
                            value={nomLocataire}
                            onChange={handleChangeNomLocataire}
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