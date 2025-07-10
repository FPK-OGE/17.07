import React, { useState, useEffect } from 'react';

const VersionedTimer = ({ 
  version = "1.0", // МЕНЯЙТЕ ЭТО ЗНАЧЕНИЕ ДЛЯ ОБНОВЛЕНИЯ
  initialTime = 60,
  direction = 'down',
  finishImageUrl = 'https://via.placeholder.com/300?text=TIMER+DONE'
}) => {
  const storageKey = `timer-v${version}`;

  // 1. Инициализация таймера
  const [time, setTime] = useState(() => {
    // Принудительный сброс при изменении версии
    const lastVersion = localStorage.getItem('last-timer-version');
    if (lastVersion !== version) {
      localStorage.removeItem(storageKey);
      localStorage.setItem('last-timer-version', version);
      return initialTime;
    }

    // Восстановление сохраненного времени
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const { value, savedAt } = JSON.parse(saved);
      const secondsPassed = Math.floor((Date.now() - savedAt) / 1000);
      const newTime = direction === 'down' 
        ? Math.max(0, value - secondsPassed)
        : value + secondsPassed;
      
      if (direction === 'down' && newTime <= 0) {
        return 0;
      }
      return newTime;
    }

    return initialTime;
  });

  const [finished, setFinished] = useState(time <= 0 && direction === 'down');

  // 2. Сохранение прогресса
  useEffect(() => {
    if (time <= 0 && direction === 'down') {
      setFinished(true);
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify({
      value: time,
      savedAt: Date.now()
    }));
  }, [time, storageKey, direction]);

  // 3. Логика отсчета
  useEffect(() => {
    if (finished) return;

    const timer = setInterval(() => {
      setTime(prev => {
        const newTime = direction === 'down' ? prev - 1 : prev + 1;
        if (direction === 'down' && newTime <= 0) {
          setFinished(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [direction, finished]);

  const formatTime = (seconds) => {
    const days = Math.floor(Math.abs(seconds) / 86400);
    const hours = Math.floor((Math.abs(seconds) % 86400) / 3600);
    const mins = Math.floor((Math.abs(seconds) % 3600) / 60);
    const secs = Math.abs(seconds) % 60;
    
    return `${days > 0 ? days + ':' : ''}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (finished) {
    return (
      <div style={{ textAlign: 'center' }}>
        <img src={finishImageUrl} alt="Timer finished" style={{ maxWidth: '100%' }} />
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', fontSize: '2em' }}>
      {formatTime(time)}
    </div>
  );
};

export default VersionedTimer;