import React from "react";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Voter from "./Voter";
import Category from "./Category";
import Home from "./Home";
import AddVoter from "./AddVoter";
import EditVoter from "./EditVoter";
import Start from "./Start";
import Voting from "./Voting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="" element={<Home />}></Route>
          <Route path="/voter" element={<Voter />}></Route>
          <Route path="/category" element={<Category />}></Route>
          <Route path="/createVoter" element={<AddVoter />}></Route>
          <Route path="/editVoter" element={<EditVoter />}></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/start" element={<Start />}></Route>
        <Route path="/voting" element={<Voting />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
