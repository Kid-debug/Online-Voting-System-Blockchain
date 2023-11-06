import React from "react";
import Login from "./Login";
import Register from "./Register";
import AdminRegister from "./AdminRegister";
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
        {/* Separate top-level routes for login and user-specific dashboards */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminregister" element={<AdminRegister />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/position" element={<Position />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/voter" element={<Voter />} />
        <Route path="/election" element={<Election />} />
        <Route path="/adminfeedback" element={<AdminFeedback />} />
        <Route path="/reportsummary" element={<ReportSummary />} />
        <Route path="/editfeedback" element={<EditFeedback />} />
        <Route path="/createVoter" element={<AddVoter />} />
        <Route path="/editVoter" element={<EditVoter />} />
        <Route path="/createCategory" element={<AddCategory />} />
        <Route path="/editCategory" element={<EditCategory />} />
        <Route path="/createPosition" element={<AddPosition />} />
        <Route path="/editPosition" element={<EditPosition />} />
        <Route path="/createCandidate" element={<AddCandidate />} />
        <Route path="/editCandidate" element={<EditCandidate />} />
        <Route path="/createElection" element={<AddElection />} />
        <Route path="/editElection" element={<EditElection />} />

        {/* Voter/User Routes */}
        <Route path="/voterdashboard" element={<VoterDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/electionList" element={<ElectionList />} />
        <Route path="/electionDetails" element={<ElectionDetails />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/result" element={<Result />} />
        <Route path="/forgotPass" element={<ForgotPassword />} />
        <Route path="/resetPass" element={<PasswordResetConfirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
