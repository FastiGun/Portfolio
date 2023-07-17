import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Connexion.scss';
import { AuthContext } from '../../Utils/AuthContext';
import { ToastContext } from '../../Utils/ToastContext';

const Connexion = () => {

    const { setLogged, setUserName } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useContext(ToastContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'mail@mail.com') {
            if (password === 'motDePasse') {
                setLogged(true);
                const userName = 'Benjamin';
                setUserName(userName);
                toast.current.show({ severity: 'success', summary: 'Connexion réussie', detail: `Bonjour ${userName}`, life: 2000 });
                navigate('/');
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Mot de passe incorrect', life: 3000 });
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email inconnu', life: 3000 });
        }
    }

    const handleChangeMail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }


    return (
        <>
            <h1 className='h1-top'>Connexion</h1>
            <form className='form-connexion' action="" onSubmit={handleSubmit}>
                <div className="input-box">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="mail@mail.com" onChange={handleChangeMail} />
                </div>
                <div className="input-box">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" name="password" placeholder="********" onChange={handleChangePassword} />
                </div>
                <button type="submit">Connexion</button>
            </form>
        </>
    );
}

export default Connexion;