import React, { Fragment } from 'react';
import './App.css';
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";


const App = () => {
  return (
    // fragment will not be showing up on the DOM
    <Fragment>
      <Navbar />
      <Landing />
    </Fragment>
  );
}

export default App;
