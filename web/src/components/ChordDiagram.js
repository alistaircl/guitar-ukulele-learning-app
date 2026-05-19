import React from 'react';

function ChordDiagram({ frets, fingers = [], size = 100, className }) {
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

  // Always start from first fret to show open positions clearly
  const startFret = 1;

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
  // Render finger dots on the correct fret positions, with finger numbers if provided
  const renderDots = () => {
    return frets.map((fret, stringIdx) => {
      if (fret <= 0) return null;
      const displayFret = fret - startFret + 1; // 1-indexed within the diagram
      if (displayFret < 1 || displayFret > numFrets) return null;
      const cx = strX[stringIdx];
      const cy = fretTop + (displayFret - 0.5) * fretH;
      const finger = fingers[stringIdx] || 0;
      return (
        <g key={`dot-${stringIdx}`}>
          <circle cx={cx} cy={cy} r={5}
            fill="#6366f1" stroke="#8b5cf6" strokeWidth="1.5" />
          {finger > 0 && (
            <text x={cx} y={cy + 4} textAnchor="middle"
              fill="white" fontSize="3" fontFamily="sans-serif" fontWeight="bold">
              {finger}
            </text>
          )}
        </g>
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
      role="img"
      aria-label={`Chord diagram showing finger positions`}
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

export default ChordDiagram;