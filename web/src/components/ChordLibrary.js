import React, { useState } from 'react';

const CHORDS = [
  { name: 'C', frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  { name: 'G', frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  { name: 'Am', frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
  { name: 'F', frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  { name: 'Em', frets: [0, 4, 3, 2], fingers: [0, 4, 2, 1] },
  { name: 'D', frets: [-1, -1, 0, 2], fingers: [0, 0, 0, 1] },
  { name: 'A', frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  { name: 'E', frets: [1, 4, 3, 2], fingers: [1, 4, 3, 2] },
  { name: 'Dm', frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  { name: 'B7', frets: [-1, 3, 2, 3], fingers: [0, 1, 2, 3] },
  { name: 'E7', frets: [0, 2, 0, 1], fingers: [0, 2, 0, 1] },
  { name: 'A7', frets: [2, 2, 1, 2], fingers: [1, 2, 0, 3] },
];

function ChordDiagram({ frets, size = 100, className }) {
  // Layout constants (proportional)
  const svgW = size;
  const svgH = size + 22; // extra 22px for open/muted markers
  const nutH = 5;
  const markerTop = 10;   // y offset where open/muted markers sit
  const fretTop = nutH + markerTop + 12; // y where fret 1 starts
  const numFrets = 4;
  const fretH = (svgH - fretTop) / numFrets;
  const marginX = 8;
  const strAreaX = marginX;
  const strAreaW = svgW - marginX * 2;

  // String x positions (4 strings)
  const strX = Array.from({ length: 4 }, (_, i) => strAreaX + (i / 3) * strAreaW);

  // Determine the starting fret (for barre chords that start above fret 1)
  const fingered = frets.filter(f => f > 0);
  const minFret = fingered.length > 0 ? Math.min(...fingered) : 1;
  const startFret = minFret > 1 ? minFret : 1;

  // Draw open/muted markers above the nut
  const renderTopMarkers = () => {
    return strX.map((x, stringIdx) => {
      const fret = frets[stringIdx];
      const cx = x;
      if (fret === -1) {
        // Muted — draw X above nut
        const s = 5;
        return (
          <g key={`mx-${stringIdx}`}>
            <line x1={cx - s} y1={markerTop - s} x2={cx + s} y2={markerTop + s} stroke="#ef4444" strokeWidth="2" />
            <line x1={cx + s} y1={markerTop - s} x2={cx - s} y2={markerTop + s} stroke="#ef4444" strokeWidth="2" />
          </g>
        );
      } else if (fret === 0) {
        // Open — draw O circle above nut
        return (
          <circle key={`ox-${stringIdx}`} cx={cx} cy={markerTop} r={5}
            fill="none" stroke="#22c55e" strokeWidth="2" />
        );
      }
      return null;
    });
  };

  // Render the nut (thick bar at top of fret grid)
  const renderNut = () => (
    <rect x={strX[0] - 2} y={fretTop - nutH} width={strX[3] - strX[0] + 4} height={nutH}
      fill="#e8e8f0" rx={1} />
  );

  // Render the 4 vertical string lines
  const renderStrings = () => (
    <>
      {strX.map((x, i) => (
        <line key={`str-${i}`} x1={x} y1={fretTop} x2={x} y2={svgH}
          stroke="#9090a0" strokeWidth={i < 2 ? 1.5 : 1} />
      ))}
    </>
  );

  // Render 4 horizontal fret lines
  const renderFrets = () => (
    <>
      {[0, 1, 2, 3, 4].map(i => (
        <line key={`fret-${i}`}
          x1={strX[0]} y1={fretTop + i * fretH}
          x2={strX[3]} y2={fretTop + i * fretH}
          stroke="#9090a0" strokeWidth={i === 0 ? 0 : 1} />
      ))}
    </>
  );

  // Render finger dots on the correct fret positions
  const renderDots = () => {
    return frets.map((fret, stringIdx) => {
      if (fret <= 0) return null;
      const displayFret = fret - startFret + 1; // 1-indexed within the diagram
      if (displayFret < 1 || displayFret > numFrets) return null;
      const cx = strX[stringIdx];
      const cy = fretTop + (displayFret - 0.5) * fretH;
      return (
        <circle key={`dot-${stringIdx}`} cx={cx} cy={cy} r={5}
          fill="#6366f1" stroke="#8b5cf6" strokeWidth={1.5} />
      );
    });
  };

  // Show "X" marker for starting fret > 1
  const renderStartFretMarker = () => {
    if (startFret <= 1) return null;
    const midX = (strX[0] + strX[3]) / 2;
    return (
      <text x={midX} y={fretTop - 6} textAnchor="middle"
        fill="#9090a0" fontSize="10" fontFamily="sans-serif">
        {startFret}fr
      </text>
    );
  };

  return (
    <svg
      width={svgW + marginX * 2}
      height={svgH}
      viewBox={`0 0 ${svgW + marginX * 2} ${svgH}`}
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      {renderTopMarkers()}
      {renderStartFretMarker()}
      {renderNut()}
      {renderStrings()}
      {renderFrets()}
      {renderDots()}
    </svg>
  );
}

function ChordCard({ chord, selected, onClick }) {
  const fingerCount = chord.frets.filter(f => f > 0).length;
  return (
    <div
      className={`chord-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      aria-pressed={selected}
      aria-label={`${chord.name} chord diagram showing ${chord.frets.filter(f => f > 0).length} finger positions`}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div className="chord-name">{chord.name}</div>
      <ChordDiagram frets={chord.frets} size={100} className="chord-diagram" />
      <div className="chord-fingers">
        {fingerCount > 0
          ? `${fingerCount} finger${fingerCount > 1 ? 's' : ''}`
          : 'Open chords'}
      </div>
    </div>
  );
}

function ChordLibrary() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="section">
      <h2 className="section-title">Chord Library</h2>
      <div className="chord-grid">
        {CHORDS.map(chord => (
          <ChordCard
            key={chord.name}
            chord={chord}
            selected={selected === chord.name}
            onClick={() => setSelected(selected === chord.name ? null : chord.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default ChordLibrary;