import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    preferredInstrument: 'guitar',
    microphoneSensitivity: 0.8,
    showChordNames: true,
    autoAdvance: true,
    theme: 'light'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('guitarUkuleleSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings from localStorage', e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('guitarUkuleleSettings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'range' ? parseFloat(value) : value
    }));
  };

  const resetToDefaults = () => {
    const defaults = {
      preferredInstrument: 'guitar',
      microphoneSensitivity: 0.8,
      showChordNames: true,
      autoAdvance: true,
      theme: 'light'
    };
    setSettings(defaults);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      
      <div className="setting-group">
        <h3>Preferences</h3>
        
        <div className="setting-item">
          <label htmlFor="preferredInstrument">Preferred Instrument:</label>
          <select id="preferredInstrument" name="preferredInstrument" value={settings.preferredInstrument} onChange={handleChange}>
            <option value="guitar">Guitar</option>
            <option value="ukulele">Ukulele</option>
          </select>
        </div>
        
        <div className="setting-item">
          <label htmlFor="microphoneSensitivity">Microphone Sensitivity:</label>
          <input
            type="range"
            id="microphoneSensitivity"
            name="microphoneSensitivity"
            min="0.1"
            max="1.0"
            step="0.1"
            value={settings.microphoneSensitivity}
            onChange={handleChange}
          />
          <span className="setting-value">${Math.round(settings.microphoneSensitivity * 100)}%</span>
        </div>
      </div>

      <div className="setting-group">
        <h3>Display</h3>
        
        <div className="setting-item">
          <label htmlFor="showChordNames">
            <input
              type="checkbox"
              id="showChordNames"
              name="showChordNames"
              checked={settings.showChordNames}
              onChange={handleChange}
            />
            Show Chord Names
          </label>
        </div>
        
        <div className="setting-item">
          <label htmlFor="autoAdvance">
            <input
              type="checkbox"
              id="autoAdvance"
              name="autoAdvance"
              checked={settings.autoAdvance}
              onChange={handleChange}
            />
            Auto-advance Lyrics/Tabs
          </label>
        </div>
        
        <div className="setting-item">
          <label htmlFor="theme">Theme:</label>
          <select id="theme" name="theme" value={settings.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="setting-group">
        <h3>About</h3>
        <p className="about-text">
          Guitar & Ukulele Learning App v1.0.0<br />
          Built with React and Web Audio API<br />
          © 2026
        </p>
        <button className="reset-btn" onClick={resetToDefaults}>
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default Settings;