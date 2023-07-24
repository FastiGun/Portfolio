import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Utils/AuthContext';
import axios from "axios";
import { Circles } from 'react-loader-spinner';
import { ToastContext } from '../../Utils/ToastContext';
import 'primeicons/primeicons.css';
import './Accueil.scss';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import Docxtemplater from 'docxtemplater';
import Contrat from "../../contrat.docx";
import { saveAs } from 'file-saver';
import { parse, subMonths, format } from 'date-fns';


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

    function loadFile(url, callback) {
        PizZipUtils.getBinaryContent(url, callback);
    }

    const handleCreateContrat = (dateArrivee, dateDepart, montantTotal, nomLocataire, prenomLocataire) => {  
        loadFile(Contrat, function (error, content) {
        if (error) {
            console.error('Error loading the template:', error);
            return;
        }
        const dateArriveeObj = parse(dateArrivee, 'dd/MM/yyyy', new Date());
        const datePaiementObj = subMonths(dateArriveeObj, 1);
        const datePaiement = format(datePaiementObj, 'dd/MM/yyyy');
        var zip = new PizZip(content);
        
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
        });
        const montantArrhes = montantTotal * 0.3;
        const montantReste = montantTotal - montantArrhes;
        console.log(process.env.REACT_APP_IBANFR, process.env.REACT_APP_IBAN_ETRANGER, process.env.REACT_APP_BIC);
    
        doc.setData({
            dateArrivee: dateArrivee,
            dateDepart: dateDepart,
            montantTotal: montantTotal,
            montantArrhes: montantArrhes,
            montantRestant: montantReste,
            datePaiement: datePaiement,
            dateCreationDoc: new Date().toLocaleDateString(),
            IBANFR: process.env.REACT_APP_IBAN_FRANCE,
            IBANETRANGER: process.env.REACT_APP_IBAN_ETRANGER,
            CodeBic: process.env.REACT_APP_BIC
        });
    
        try {
            doc.render();
        } catch (error) {
            toast.current.show({severity: 'error', summary: 'Contrat', detail: 'Une erreur est survenue lors de la création du contrat', life: 3000});
        }
    
        const out = doc.getZip().generate({
            type: 'blob',
            mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
    
        saveAs(out, `contrat-${nomLocataire}-${prenomLocataire}.docx`);
    
        toast.current.show({severity: 'success', summary: 'Contrat', detail: 'Le contrat a bien été créé', life: 3000});
        });
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
                                    <p className="card-text">Montant : {reservation.montantTotal} €</p>
                                </div>
                                <div className='btns-home'>
                                    <button className="creation-contrat" onClick={() => handleCreateContrat(reservation.dateArrivee, reservation.dateDepart, reservation.montantTotal, reservation.nomLocataire, reservation.prenomLocataire)}>
                                        <i className="pi pi-file-word"></i>
                                        <p>Contrat</p>
                                    </button>
                                    <button className="supprimer-reservation" onClick={() => handleAskDeleteReservation(reservation._id)}>
                                        <i className="pi pi-calendar-times"></i>
                                        <p>Annuler</p>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </>
    );
}

export default Accueil;
