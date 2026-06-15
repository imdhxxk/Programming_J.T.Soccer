import { useState } from 'react';
import { getSettings, saveSettings, clearAllData } from '../utils/storage';
import { resolveApiKey } from '../utils/quizGenerator';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

export default function Settings() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [settings, setSettings] = useState(() => getSettings());
  const [showKey, setShowKey] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [testResult, setTestResult] = useState(null); // { ok, msg }
  const [testing, setTesting] = useState(false);

  async function handleTest() {
    const key = resolveApiKey(settings.apiKey);
    if (!key) {
      setTestResult({ ok: false, msg: 'API 키가 없습니다. 입력 후 저장하거나 .env.local을 확인하세요.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: key });
      const result = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: '안녕이라고 한 단어만 답하세요.' });
      const text = result.text.trim();
      setTestResult({ ok: true, msg: `✅ 연결 성공! 응답: "${text}"` });
    } catch (e) {
      const msg = e?.message || String(e);
      let detail = msg;
      if (msg.includes('401') || msg.includes('API_KEY_INVALID') || msg.includes('invalid')) {
        detail = '❌ 키 인증 실패 (401) — 잘못된 API 키입니다. Google AI Studio에서 새 키를 발급받으세요.';
      } else if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        detail = '⚠️ 할당량 초과 (429) — 무료 티어 한도 초과. Google Cloud 콘솔에서 결제 등록 필요.';
      } else if (msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
        detail = '❌ 권한 없음 (403) — 이 키로는 Gemini API를 사용할 수 없습니다.';
      } else if (msg.includes('404') || msg.includes('not found')) {
        detail = '❌ 모델 없음 (404) — gemini-2.0-flash 모델에 접근할 수 없습니다.';
      }
      setTestResult({ ok: false, msg: detail });
      console.error('[API test]', msg);
    } finally {
      setTesting(false);
    }
  }

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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleSave}>저장</button>
          <button className="btn-outline" onClick={handleTest} disabled={testing}>
            {testing ? '테스트 중...' : '🔬 API 키 테스트'}
          </button>
        </div>
        {testResult && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: testResult.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${testResult.ok ? '#22c55e' : '#ef4444'}`,
            color: testResult.ok ? '#22c55e' : '#ef4444',
            fontSize: '0.88rem',
            wordBreak: 'break-all',
          }}>
            {testResult.msg}
          </div>
        )}
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
