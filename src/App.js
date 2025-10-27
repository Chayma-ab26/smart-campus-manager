import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './api/Login';
import Home from './home';
import AdminDashboard from './admin/AdminDashboard';
import EnseignantDashboard from './enseignant/EnseignantDashboard';
import EtudiantDashboard from './etudiant/EtudiantDashboard';

import AdminUsersList from './admin/users/AdminUsersList';
import ListClasses from './admin/classes/ListClasses';
function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />                {/* Page d'accueil */}
        <Route path="/login" element={<Login />} />         {/* Page login */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersList />} />
        <Route path="/admin/events" element={<AdminDashboard />} />
        <Route path="/admin/salles" element={<AdminDashboard />} />
        <Route path="/admin/classes" element={<ListClasses />} />


        <Route path="/enseignant/dashboard" element={<EnseignantDashboard />} />
        <Route path="/etudiant/dashboard" element={<EtudiantDashboard />} />
      </Routes>
  );
}


export default App;
