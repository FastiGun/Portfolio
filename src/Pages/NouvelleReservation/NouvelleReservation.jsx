import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './NouvelleReservation.scss';
import axios from 'axios';
import { AuthContext } from '../../Utils/AuthContext';
import { ToastContext } from '../../Utils/ToastContext';
import { Circles } from 'react-loader-spinner';
import { parse } from 'date-fns';

const NouvelleReservation = () => {
    const { token } = useContext(AuthContext);
    const [dateArrivee, setDateArrivee] = useState(null);
    const [dateDepart, setDateDepart] = useState(null);
    const [nombrePersonnes, setNombrePersonnes] = useState(0);
    const [nomLocataire, setNomLocataire] = useState('');
    const [prenomLocataire, setPrenomLocataire] = useState('');
    const [montantTotal, setMontantTotal] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const [, setReservations] = useState([]);
    const [reservedDates, setReservedDates] = useState([]);
    const toast = useContext(ToastContext);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
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
        setIsLoading(false);
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
        setMontantTotal(0);
    }

    const handleClickResetDates = (e) => {
        e.preventDefault();
        setDateArrivee(null);
        setDateDepart(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(dateArrivee === null || dateDepart === null || nombrePersonnes === 0 || nomLocataire === '' || prenomLocataire === '') {
            toast.current.show({severity: 'error', summary: 'Enregistrement', detail: 'Veuillez remplir tous les champs'});
        } else {
            axios.post(`${process.env.REACT_APP_BASE_URL}/reservations`, {
                "nomLocataire": nomLocataire,
                "prenomLocataire": prenomLocataire,
                "dateArrivee": dateArrivee,
                "dateDepart": dateDepart,
                "nombrePersonne": nombrePersonnes,
                "montantTotal": montantTotal
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
                    setMontantTotal(0);
                    toast.current.show({severity: 'success', summary: 'Enregistrement', detail: 'Réservation créée'});
                    navigate('/');
                }
            }).catch((error) => {
                if (error.response.status === 409) {
                    toast.current.show({severity: 'error', summary: 'Enregistrement', detail: 'Réservation impossible, dates déjà réservées'});
                }
                else {
                    toast.current.show({severity: 'error', summary: 'Enregistrement', detail: 'Erreur inconnue'});
                }
            })
        }
        
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
        setNomLocataire(e.target.value.toUpperCase());
    }

    const handleChangePrenomLocataire = (e) => {
        e.preventDefault();
        setPrenomLocataire(e.target.value);
    }

    const handleChangeMontantTotal = (e) => {
        e.preventDefault();
        setMontantTotal(e.target.value);
    }

    return (
        <>
            <h1 className='h1-top'>Nouvelle réservation</h1>
            {isLoading ? (
                <div className="loader-page"><Circles color='#070f4e' height={100} width={100} /></div>
            ) : (
                <div className='calendrier'>
                    <Calendar className='calendar'
                        onChange={handleDateChange}
                        tileClassName={tileContent} 
                    />
                    <form className="inputs" onSubmit={handleSubmit}>
                        <div className='input'>
                            <label>Date d'arrivée</label>
                            <input
                                type="text"
                                value={dateArrivee ? dateArrivee : ''}
                                placeholder='Choisir sur le calendrier'
                                readOnly
                                required
                            />
                        </div>
                        <div className='input'>
                            <label>Date de départ</label>
                            <input
                                type="text"
                                value={dateDepart ? dateDepart : ''}
                                placeholder={dateArrivee === null ? '' : 'Choisir sur le calendrier'}
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
                            <label>Montant total en euros</label>
                            <input
                                type="number"
                                value={montantTotal}
                                onChange={handleChangeMontantTotal}
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
                        <div className="input double-btn">
                            <button onClick={handleClickResetDates}>Effacer les dates</button>
                            <button onClick={handleClickReset}>Tout effacer</button>
                        </div>
                        <div className="input">
                            <button className="submit" onClick={handleSubmit}>Créer la réservation</button>
                        </div>
                    </form>
                </div>
            )}
            
        </>
    );
}

export default NouvelleReservation;