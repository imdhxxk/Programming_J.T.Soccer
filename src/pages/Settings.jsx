import { useState } from 'react';
import { getSettings, saveSettings, clearAllData } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

export default function Settings() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [settings, setSettings] = useState(() => getSettings());
  const [showKey, setShowKey] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  function handleSave() {
    saveSettings(settings);
    showToast('설정이 저장되었습니다 ✅', 'success');
  }

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearAllData();
    showToast('모든 데이터가 초기화되었습니다', 'info');
    setConfirmClear(false);
    navigate('/');
    window.location.reload();
  }

  return (
    <div className="page">
      <h1 className="page-title">⚙️ 설정</h1>

      {/* AI 문제 생성 설정 */}
      <div className="settings-card">
        <h2 className="settings-section-title">🤖 AI 문제 생성</h2>
        <p className="settings-desc">
          Google Gemini API 키를 설정하면 AI가 레벨에 맞는 문제를 자동 생성합니다.<br />
          <strong style={{color: 'var(--color-primary)'}}>방법 1</strong>: 프로젝트 루트의 <code style={{background:'var(--bg-secondary)',padding:'2px 6px',borderRadius:'4px'}}>.env.local</code> 파일에 <code style={{background:'var(--bg-secondary)',padding:'2px 6px',borderRadius:'4px'}}>VITE_GEMINI_API_KEY=AIza...</code> 입력 후 서버 재시작<br />
          <strong style={{color: 'var(--color-blue)'}}>방법 2</strong>: 아래 입력창에 직접 입력 (브라우저에 저장)
        </p>
        <div className="settings-field">
          <label className="settings-label">Gemini API Key</label>
          <div className="api-key-input-row">
            <input
              type={showKey ? 'text' : 'password'}
              className="settings-input"
              placeholder="AIza..."
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            />
            <button className="btn-icon" onClick={() => setShowKey((v) => !v)}>
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <div className="settings-hint">
          💡 API 키는 이 기기의 브라우저(LocalStorage)에만 저장되며 외부로 전송되지 않습니다.
        </div>
        <button className="btn-primary" onClick={handleSave}>저장</button>
      </div>

      {/* 데이터 관리 */}
      <div className="settings-card danger-zone">
        <h2 className="settings-section-title" style={{ color: '#ef4444' }}>⚠️ 데이터 초기화</h2>
        <p className="settings-desc">
          모든 학습 기록, XP, 배지, 레벨이 초기화됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>
        <button
          className={`btn-danger ${confirmClear ? 'confirm' : ''}`}
          onClick={handleClear}
        >
          {confirmClear ? '⚠️ 정말 초기화하시겠습니까? (한 번 더 클릭)' : '데이터 초기화'}
        </button>
        {confirmClear && (
          <button className="btn-outline" style={{ marginTop: '8px' }} onClick={() => setConfirmClear(false)}>
            취소
          </button>
        )}
      </div>

      <button className="btn-outline" onClick={() => navigate(-1)}>← 뒤로가기</button>
    </div>
  );
}
