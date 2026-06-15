import { useState } from 'react';
import { getDiary, saveDiary } from '../utils/storage';

export default function Diary() {
  const [entries, setEntries] = useState(() => getDiary());
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  function handleSave() {
    if (!text.trim()) return;
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      timestamp: new Date().toISOString(),
      text: text.trim(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveDiary(updated);
    setText('');
  }

  function handleDelete(id) {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveDiary(updated);
  }

  function handleEdit(entry) {
    setEditId(entry.id);
    setEditText(entry.text);
  }

  function handleEditSave() {
    const updated = entries.map((e) => e.id === editId ? { ...e, text: editText } : e);
    setEntries(updated);
    saveDiary(updated);
    setEditId(null);
    setEditText('');
  }

  return (
    <div className="page">
      <h1 className="page-title">📝 연습 기록</h1>
      <p className="page-sub">오늘의 연습과 배운 점을 기록해 성장을 확인하세요!</p>

      {/* 새 기록 작성 */}
      <div className="diary-write-card">
        <div className="diary-date">📅 {today}</div>
        <textarea
          className="diary-textarea"
          placeholder="오늘의 연습 내용, 배운 점, 목표 등을 자유롭게 적어보세요...

예시)
- 오늘은 오프사이드 규칙을 공부했다
- 티키타카 전술에 대해 알게 되었다
- 퀴즈 5문제 중 4문제 맞았다! 내일은 더 잘할 수 있다"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
        <div className="diary-write-footer">
          <span className="diary-char-count">{text.length}자</span>
          <button className="btn-primary" onClick={handleSave} disabled={!text.trim()}>
            저장하기 💾
          </button>
        </div>
      </div>

      {/* 기록 목록 */}
      <div className="diary-entries">
        <h2 className="section-title">📋 이전 기록 ({entries.length}개)</h2>

        {entries.length === 0 && (
          <div className="empty-state">
            <span className="empty-emoji">📝</span>
            <p>아직 기록이 없어요. 첫 번째 연습 기록을 남겨보세요!</p>
          </div>
        )}

        {entries.map((entry) => (
          <div key={entry.id} className="diary-entry-card">
            <div className="diary-entry-header">
              <span className="diary-entry-date">📅 {entry.date}</span>
              <div className="diary-entry-actions">
                <button className="btn-icon" onClick={() => handleEdit(entry)} title="수정">✏️</button>
                <button className="btn-icon danger" onClick={() => handleDelete(entry.id)} title="삭제">🗑️</button>
              </div>
            </div>

            {editId === entry.id ? (
              <div className="diary-edit-area">
                <textarea
                  className="diary-textarea"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                  autoFocus
                />
                <div className="diary-edit-actions">
                  <button className="btn-primary small" onClick={handleEditSave}>저장</button>
                  <button className="btn-outline small" onClick={() => setEditId(null)}>취소</button>
                </div>
              </div>
            ) : (
              <p className="diary-entry-text">{entry.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
