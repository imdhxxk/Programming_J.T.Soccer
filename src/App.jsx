import { Routes, Route } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Curriculum from './pages/Curriculum';
import Diary from './pages/Diary';
import MyPage from './pages/MyPage';
import Settings from './pages/Settings';

export default function App() {
  const { user, refresh } = useUser();

  return (
    <ToastProvider>
      <Navbar user={user} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/quiz" element={<Quiz user={user} onComplete={refresh} />} />
          <Route path="/curriculum" element={<Curriculum user={user} />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/mypage" element={<MyPage user={user} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </ToastProvider>
  );
}
