import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
//import Accueil from './Pages/Accueil/Accueil';
import { useState } from 'react';


function App() {

  const [showLogOut, setShowLogOut] = useState(false);
  //const [loged, setLoged] = useState(false);

  const handleClickLogOut = () => {
    setShowLogOut(!showLogOut);
  }

  const handleClickLoged = () => {

  }

  return (
    <Router>
      <div>
        <div className="App">
          <header className="App-header">
            <div className="gauche">
              <h1>
                <a href='/accueil'>StayBook</a>
              </h1>
              <nav className='nav-home'>
                <a href="/accueil">Accueil</a>
                <a href="/calendrier">Calendrier</a>
              </nav>
            </div>
            <div className="droite" onClick={handleClickLogOut}>
              <div className="initiale">
                <p>B</p>
              </div>

            </div>
            <div className={`logout ${showLogOut ? '' : 'logout-off'}`}>
              <p href="#" onClick={handleClickLoged}>
                Déconnexion
              </p>
            </div>
          </header>
        </div>
        <div className="content">
          <Routes>
            <Route exact path="/accueil" element={<Accueil />} />
            <Route exact path="/calendrier" element={<Calendrier />} />
            <Route exact path="/reservations" element={<Accueil />} />
            <Route path="/*" element={<PageIntrouvable />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Accueil() {
  return <h2>Accueil</h2>;
}

function Calendrier() {
  return <h2>Calendrier</h2>;
}

function PageIntrouvable() {
  return <h2>Page introuvable</h2>;
}

export default App;
