import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';
import Accueil from './Pages/Accueil/Accueil';
import Calendrier from './Pages/Calendrier/Calendrier';
import Reservations from './Pages/Reservations/Reservations';
import Connexion from './Pages/Connexion/Connexion';
import ProtectedRoute from './Utils/ProtectedRoute';
import { useState } from 'react';


function App() {

  const [showLogOut, setShowLogOut] = useState(false);
  const [logged, setLogged] = useState(false);
  const [name] = useState('Benjamin');

  const handleClickLogOut = () => {
    setShowLogOut(!showLogOut);
  }

  const handleClickLoged = () => {
    setLogged(!logged);
  }

  return (
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
                  <Link to="/reservations">Réservations</Link>
                </>)}
              </nav>
            </div>
            {logged && (
              <>
                <div className="droite" onClick={handleClickLogOut}>
                  <div className="initiale">
                    <p>{name.split('')[0].toUpperCase()}</p>
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
              <Route exact path="/reservations" element={<ProtectedRoute isLoggedIn={logged}><Reservations /></ProtectedRoute>} />
              <Route path="/*" element={<PageIntrouvable />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

function PageIntrouvable() {
  return <h2>Page introuvable</h2>;
}

export default App;
