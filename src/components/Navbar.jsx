import { NavLink } from 'react-router-dom';
import { getLevelInfo } from '../utils/levelSystem';

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/quiz', label: '퀴즈', icon: '❓' },
  { to: '/curriculum', label: '커리큘럼', icon: '📚' },
  { to: '/diary', label: '연습 기록', icon: '📝' },
  { to: '/mypage', label: '마이페이지', icon: '👤' },
];

export default function Navbar({ user }) {
  const levelInfo = getLevelInfo(user.xp);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-logo">
            ⚽ J.T. Soccer
          </NavLink>
          <div className="navbar-links">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="navbar-user">
            <span className="navbar-level" style={{ color: levelInfo.color }}>
              {levelInfo.emoji} Lv.{levelInfo.level}
            </span>
            <span className="navbar-xp">{user.xp.toLocaleString()} XP</span>
          </div>
        </div>
      </nav>

      {/* 모바일 하단 탭바 */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
