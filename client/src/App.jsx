import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Library from './pages/Library';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={<Placeholder title="Top Games" subtitle="Your most played games" />}
        />
        <Route path="/library" element={<Library />} />
        <Route
          path="/profile"
          element={<Placeholder title="Profile" subtitle="Your public page" />}
        />
        <Route
          path="/friends"
          element={<Placeholder title="Friends" subtitle="Compare with friends" />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
