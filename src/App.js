import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Homescreen from './screens/Homescreen';
import ListInventaire from './screens/listInventaire';
import Loginscreen from './screens/Loginscreen';
import Registerscreen from './screens/Registerscreen';
import CartDetailsScreen from './screens/CartDetailsScreen';
import Footer from './components/Footer';
import CartAllOrders from './screens/CartAllOrders';
import NewDetailInventaire from './screens/newDetailInventaire';
import Menuscreen from './screens/menuscreen';
import Validinv from './screens/validinv';

function AppContent() {
  const location = useLocation();
  
  // Condition pour vérifier si on est sur la page de login
  const isLoginScreen = location.pathname === '/';

  return (
    <div className="App">
      {/* Affiche le Navbar uniquement si ce n'est pas la page de login */}
   {!isLoginScreen && <Navbar />}
     
      <Routes>
      <Route path='/' element={<Loginscreen />} />
        <Route path='/homescreen' element={<Homescreen />} />
        <Route path='/menu' element={<Menuscreen />} />
        <Route path='/cart' element={<ListInventaire />} />
        <Route path='/validinv' element={<Validinv />} />
        <Route path='/detailinventaire' element={<NewDetailInventaire />} />
       { /* <Route path='/register' element={<Registerscreen />} /> */}
      
        <Route path="/orders" element={<CartDetailsScreen />} />
      { /*  <Route path="/allorders" element={<CartAllOrders />} /> */} 
      </Routes>
      
      <Footer style={{ position: 'relative', bottom: '0' }} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
