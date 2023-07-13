import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="gauche">
          <h1>
            <a href='/'>StayBook</a>
          </h1>
          <nav className='nav-home'>
            <a href="/">Accueil</a>
            <a href="/calendrier">Calendrier</a>
          </nav>
        </div>
        <div className="droite">
          <div className="initiale">
            <p>B</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
