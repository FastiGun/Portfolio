import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';
import Accueil from './Pages/Accueil/Accueil';
import Calendrier from './Pages/Calendrier/Calendrier';
import Connexion from './Pages/Connexion/Connexion';
import NouvelleReservation from './Pages/NouvelleReservation/NouvelleReservation';
import ProtectedRoute from './Utils/ProtectedRoute';
import { AuthContext } from './Utils/AuthContext';
import { useState, useContext } from 'react';


function App() {

  const { logged, setLogged, userName, setUserName, token, setToken } = useContext(AuthContext);
  const [showLogOut, setShowLogOut] = useState(false);

  const handleClickLogOut = () => {
    setShowLogOut(!showLogOut);
  }

  const handleClickLoged = () => {
    setLogged(false);
    setUserName('');
    setShowLogOut(!showLogOut);
    setToken('');
  }

  return (
    <AuthContext.Provider value={{ logged, setLogged, userName, setUserName, token, setToken }}>
      <Router>
        <div>
          <div className="App">
            <header className="App-header">
              <div className="gauche">
                <h1>
                  <Link to="/">StayBook</Link>
                </h1>
                <nav className='nav-home'>
                  {logged && (<>
                    <Link to="/calendrier">Calendrier</Link>
                    <Link to="/nouvelle-reservation">Réserver</Link>
                  </>)}
                </nav>
              </div>
              {logged && (
                <>
                  <div className="droite" onClick={handleClickLogOut}>
                    <div className="initiale">
                      <p>{userName.split('')[0].toUpperCase()}</p>
                    </div>

                  </div>
                  <div className={`logout ${showLogOut ? '' : 'logout-off'}`}>
                    <p href="#" onClick={handleClickLoged}>
                      Déconnexion
                    </p>
                  </div>
                </>
              )}
            </header>
            <div className="content">
              <Routes>
                <Route exact path="/connexion" element={<Connexion />} />
                <Route exact path="/" element={<ProtectedRoute isLoggedIn={logged}><Accueil /></ProtectedRoute>} />
                <Route exact path="/calendrier" element={<ProtectedRoute isLoggedIn={logged}><Calendrier /></ProtectedRoute>} />
                <Route exact path="/nouvelle-reservation" element={<ProtectedRoute isLoggedIn={logged}><NouvelleReservation /></ProtectedRoute>} />
                <Route path="/*" element={<PageIntrouvable />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

function PageIntrouvable() {
  return <h2>Page introuvable</h2>;
}

export default App;
