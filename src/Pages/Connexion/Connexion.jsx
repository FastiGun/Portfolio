import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Connexion.scss';
import { AuthContext } from '../../Utils/AuthContext';
import { Circles } from 'react-loader-spinner';

const Connexion = () => {

    const { setLogged, setUserName, setToken } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMail, setErrorMail] = useState(false);
    const [errorMDP, setErrorMDP] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, {
            email: email,
            password: password
        }).then((response) => {
            if (response.status === 200) {
                setUserName(response.data.username);
                setToken(response.data.token);
                setLogged(true);
                navigate('/');
            } 
        }).catch((error) => {
            if (error.response.status === 401) {
                if(error.response.data.message === "Email invalide"){
                    setErrorMail(true);
                } else {
                    setErrorMail(false);
                }
                if(error.response.data.message === "Mot de passe incorrect"){
                    setErrorMDP(true);
                } else {
                    setErrorMDP(false);
                }
            }
            setLoading(false);
        })
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
                {loading ? (
                    <div className="loader"><Circles color='#070f4e' height={40} width={40} /></div>
                ) : <button type="submit">Valider</button>}
            </form>
        </>
    );
}

export default Connexion;