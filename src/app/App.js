import React from "react";
import logo from "../assets/logo.svg";
import "../styles/App.css";

import Question from "./components/Question";

const questions = [];

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>
            <main> 
                <Question questions={questions}/>
            </main>
        </div>
    );
}

export default App;
