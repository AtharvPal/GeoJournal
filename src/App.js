import React from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'

import Users from './user/pages/Users'
import NewPlace from "./places/pages/NewPlace";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Users />}/>
        <Route path="/places/new" element={<NewPlace />}/>
        {/* this is a fallback path, any route that does not match any exact paths fall into this */}
        <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
    </Router>
  );

}

export default App;
