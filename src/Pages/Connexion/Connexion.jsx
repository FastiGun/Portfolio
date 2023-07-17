import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Connexion.scss';
import { AuthContext } from '../../Utils/AuthContext';

const Connexion = () => {

    const { setLogged, setUserName } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMail, setErrorMail] = useState(false);
    const [errorMDP, setErrorMDP] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'mail@mail.com') {
            setErrorMail(false)
            if (password === 'motDePasse') {
                setErrorMDP(false)
                setLogged(true);
                const userName = 'Benjamin';
                setUserName(userName);
                navigate('/');
            } else {
                setErrorMDP(true)
            }
        } else {
            setErrorMail(true)
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
                <span className="error">{errorMail && ("Ce mail ne correspond pas à un compte")}</span>
                <div className="input-box">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" name="password" placeholder="********" onChange={handleChangePassword} />
                </div>
                <span className="error">{errorMDP && ("Mot de passe incorrect")}</span>
                <button type="submit">Connexion</button>
            </form>
        </>
    );
}

export default Connexion;