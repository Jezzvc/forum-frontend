import logo from './logo.svg';
import './App.css';
import Perfil from './components/Perfil';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <title>Michi's Forum</title>
        <div className="titulo">
        <h1>Michi's Forum <span>Bienvenido</span></h1>
        </div>
        <Perfil/>
      </header>
    </div>
  );
}

export default App;
