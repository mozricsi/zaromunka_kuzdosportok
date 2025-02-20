import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/kartyak.css'
 
const SportKartyak = () => {

  return (
 <>
 <div>
    
    <h1>Sportkártyák</h1>
 <main>
        <div className="card" id="boxing">
            <h2>Box</h2>
            <p>Kattints a részletekért!</p>
        </div>
        <div className="card" id="judo">
            <h2>Judo</h2>
            <p>Kattints a részletekért!</p>
        </div>
        <div className="card" id="jiu-jitsu">
            <h2>Jiu Jitsu</h2>
            <p>Kattints a részletekért!</p>
        </div>
        <div className="card" id="muay-thai">
            <h2>Muay Thai</h2>
            <p>Kattints a részletekért!</p>
        </div>
        <div className="card" id="k1">
            <h2>K1</h2>
            <p>Kattints a részletekért!</p>
        </div>
        <div className="card" id="wrestling">
            <h2>Birkózás</h2>
            <p>Kattints a részletekért!</p>
        </div>
        <div className="card" id="kickbox">
            <h2>Kickbox</h2>
            <p>Kattints a részletekért!</p>
        </div>
    </main>
 </div>
 </>
 
  );
};
 
export default SportKartyak;