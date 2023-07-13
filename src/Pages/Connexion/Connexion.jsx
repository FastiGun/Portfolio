import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Connexion.scss';

const Connexion = () => {

    const [email, setEmail] = useState('mail@mail.com');
    const [password, setPassword] = useState('motDePasse');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (e.target.email.value === email && e.target.password.value === password) {
            navigate('/');
        } 
    }

    return (
        <>
            <h1 className='h1-top'>Connexion</h1>
            <form className='form-connexion' action="" onSubmit={handleSubmit}>
                <div className="input-box">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="mail@mail.com" />
                </div>
                <div className="input-box">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" name="password" placeholder="********" />
                </div>
                <button type="submit">Connexion</button>
            </form>
        </>
    );
}

export default Connexion;