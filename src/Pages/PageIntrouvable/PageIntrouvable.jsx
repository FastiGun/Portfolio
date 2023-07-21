import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PageIntrouvable = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate('/');
    })
    
    return (
        <></>
    )
}

export default PageIntrouvable