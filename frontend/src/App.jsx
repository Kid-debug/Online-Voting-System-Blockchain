import React from "react";
import Login from "./Login";
import Register from "./Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./admin/Dashboard";
import Category from "./admin/Category/Category";
import Position from "./admin/Position/Position";
import Candidate from "./admin/Candidate/Candidate";
import Voter from "./admin/Voter/Voter";
import Election from "./admin/Election/Election";
import AdminFeedback from "./admin/Feedback/AdminFeedback";
import EditFeedback from "./admin/Feedback/EditFeedback";
import Home from "./admin/Home";
import AddVoter from "./admin/Voter/AddVoter";
import EditVoter from "./admin/Voter/EditVoter";
import AddCategory from "./admin/Category/AddCategory";
import EditCategory from "./admin/Category/EditCategory";
import AddPosition from "./admin/Position/AddPosition";
import EditPosition from "./admin/Position/EditPosition";
import AddCandidate from "./admin/Candidate/AddCandidate";
import EditCandidate from "./admin/Candidate/EditCandidate";
import AddElection from "./admin/Election/AddElection";
import EditElection from "./admin/Election/EditElection";
import VoterDashboard from "./VoterDashboard";
import About from "./About";
import ElectionList from "./ElectionList";
import Voting from "./Voting";
import Verification from "./Verification";
import Feedback from "./Feedback";
import Profile from "./Profile";
import Result from "./Result";
import ElectionDetails from "./ElectionDetails";
import ForgotPassword from "./ForgotPassword";
import PasswordResetConfirmation from "./PasswordResetConfirmation";
import ReportSummary from "./admin/ReportSummary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<Dashboard />}>
          <Route path="" element={<Home />}></Route>
          <Route path="/category" element={<Category />}></Route>
          <Route path="/position" element={<Position />}></Route>
          <Route path="/candidate" element={<Candidate />}></Route>
          <Route path="/voter" element={<Voter />}></Route>
          <Route path="/election" element={<Election />}></Route>
          <Route path="/adminfeedback" element={<AdminFeedback />}></Route>
          <Route path="/reportsummary" element={<ReportSummary />}></Route>
          <Route path="/editfeedback" element={<EditFeedback />}></Route>
          <Route path="/createVoter" element={<AddVoter />}></Route>
          <Route path="/editVoter" element={<EditVoter />}></Route>
          <Route path="/createCategory" element={<AddCategory />}></Route>
          <Route path="/editCategory" element={<EditCategory />}></Route>
          <Route path="/createPosition" element={<AddPosition />}></Route>
          <Route path="/editPosition" element={<EditPosition />}></Route>
          <Route path="/createCandidate" element={<AddCandidate />}></Route>
          <Route path="/editCandidate" element={<EditCandidate />}></Route>
          <Route path="/createElection" element={<AddElection />}></Route>
          <Route path="/editElection" element={<EditElection />}></Route>
        </Route>
        {/* Login and Register Routes */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        {/* Voter/User Routes */}
        <Route path="/voterdashboard" element={<VoterDashboard />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/electionList" element={<ElectionList />}></Route>
        <Route path="/electionDetails" element={<ElectionDetails />}></Route>
        <Route path="/voting" element={<Voting />}></Route>
        <Route path="/verification" element={<Verification />}></Route>
        <Route path="/feedback" element={<Feedback />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/result" element={<Result />}></Route>
        <Route path="/forgotPass" element={<ForgotPassword />}></Route>
        <Route
          path="/resetPass"
          element={<PasswordResetConfirmation />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
