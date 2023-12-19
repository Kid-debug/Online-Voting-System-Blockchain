import React from "react";
import Login from "./Login";
import Register from "./Register";
import AdminRegister from "./AdminRegister";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./admin/Dashboard";
import Category from "./admin/Category/Category";
import Position from "./admin/Position/Position";
import Candidate from "./admin/Candidate/Candidate";
import AdminPage from "./admin/Admin/AdminPage";
import Voter from "./admin/Voter/Voter";
import AdminFeedback from "./admin/Feedback/AdminFeedback";
import EditFeedback from "./admin/Feedback/EditFeedback";
import Home from "./admin/Home";
import AddAdmin from "./admin/Admin/AddAdmin";
import EditAdmin from "./admin/Admin/EditAdmin";
import AddCategory from "./admin/Category/AddCategory";
import EditCategory from "./admin/Category/EditCategory";
import AddPosition from "./admin/Position/AddPosition";
import EditPosition from "./admin/Position/EditPosition";
import AddCandidate from "./admin/Candidate/AddCandidate";
import EditCandidate from "./admin/Candidate/EditCandidate";
import VoterDashboard from "./VoterDashboard";
import About from "./About";
import ElectionList from "./ElectionList";
import Voting from "./Voting";
import Verification from "./Verification";
import Feedback from "./Feedback";
import UserFeedbackList from "./UserFeedbackList";
import EditUserFeedback from "./EditUserFeedback";
import Profile from "./Profile";
import Result from "./Result";
import ElectionDetails from "./ElectionDetails";
import ForgotPassword from "./ForgotPassword";
import PasswordResetConfirmation from "./PasswordResetConfirmation";
import ReportSummary from "./admin/ReportSummary";
import Missing from "./component/Missing";
import Unauthorized from "./component/Unauthorized";
import Errorpage from "./component/Errorpage";
import RequireAuth from "./component/RequireAuth";
import { AuthProvider } from "./context/AuthProvider";
import SessionHandler from "./component/SessionHandler";
import MailVerification from "./MailVerification";
import ResetPassword from "./ResetPassword";
import VoteHistoryList from "./VoteHistoryList";
import YearlyReport from "./admin/YearlyReport";
import CategoryReport from "./admin/CategoryReport";
import PositionReport from "./admin/PositionReport";

const ROLES = {
  User: "U",
  Admin: "A",
  SuperAdmin: "S",
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SessionHandler />
        <Routes>
          {/* Default route goes to Login */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminregister" element={<AdminRegister />} />
          <Route path="/forgotPass" element={<ForgotPassword />} />
          <Route path="/resetPass" element={<PasswordResetConfirmation />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/error" element={<Errorpage />} />
          <Route
            path="/mail-verification/:token"
            element={<MailVerification />}
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Admin, ROLES.SuperAdmin]} />
            }
          > */}
          <Route path="/admin" element={<Dashboard />}>
            {/* The "index" route represents the default child route */}
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="category" element={<Category />} />
            <Route path="position" element={<Position />} />
            <Route path="candidate" element={<Candidate />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="voter" element={<Voter />} />
            <Route path="adminfeedback" element={<AdminFeedback />} />
            <Route path="reportsummary" element={<ReportSummary />} />
            <Route path="yearlyreport" element={<YearlyReport />} />
            <Route path="categoryreport" element={<CategoryReport />} />
            <Route path="positionreport" element={<PositionReport />} />
            <Route path="editfeedback/:feedbackId" element={<EditFeedback />} />
            <Route path="createAdmin" element={<AddAdmin />} />
            <Route path="editAdmin/:id" element={<EditAdmin />} />
            <Route path="createCategory" element={<AddCategory />} />
            <Route path="editCategory/:categoryId" element={<EditCategory />} />
            <Route path="createPosition" element={<AddPosition />} />
            <Route
              path="editPosition/:categoryId/:eventId"
              element={<EditPosition />}
            />
            <Route path="createCandidate" element={<AddCandidate />} />
            <Route
              path="editCandidate/:categoryId/:eventId/:candidateId"
              element={<EditCandidate />}
            />
            {/* ... more nested admin routes */}
            {/* </Route> */}
          </Route>

          {/* <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.User, ROLES.Admin, ROLES.SuperAdmin]}
              />
            }
          > */}
          <Route path="/voterdashboard" element={<VoterDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/electionList/:categoryId" element={<ElectionList />} />
          <Route
            path="/electionDetails/:categoryId/:eventId"
            element={<ElectionDetails />}
          />
          <Route path="/voting/:categoryId/:eventId" element={<Voting />} />

          <Route path="/verification" element={<Verification />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/userfeedbacklist" element={<UserFeedbackList />} />
          <Route
            path="/edituserfeedback/:feedbackId"
            element={<EditUserFeedback />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/result/:categoryId/:eventId" element={<Result />} />
          <Route path="/votehistorylist" element={<VoteHistoryList />} />
          {/* </Route> */}
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<Missing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
