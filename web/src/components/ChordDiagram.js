import React from 'react';

function ChordDiagram({ frets, fingers = [], size = 100, className, instrument = 'ukulele', ariaLabel }) {
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

  // Support variable string counts (4 for ukulele, 6 for guitar).
  // The count is derived from the chord data, which is authoritative; the
  // `instrument` prop records which instrument the diagram depicts (it drives
  // the accessible name and the bass-string line weights) but never overrides
  // the string count — a silent override would mis-render any shape whose data
  // disagrees with the prop (issue #239).
  const numStrings = frets.length;
  const isGuitar = instrument === 'guitar';
  const instrumentLabel = isGuitar ? 'Guitar' : 'Ukulele';
  // Guitar's lowest two strings (index 0 = low E2, index 1 = A2) are wound and
  // noticeably thicker than the rest; on the ukulele only the first two strings
  // read as "thick". Deriving the wound-string count from the instrument keeps
  // the bass-string line weights correct on both instruments — this is the
  // latent-trap the issue flags: `instrument` previously did nothing at all.
  const woundStrings = isGuitar ? 3 : 2;
  
  // String x positions (dynamically calculated based on number of strings)
  const strX = Array.from({ length: numStrings }, (_, i) => 
    numStrings === 1 
      ? strAreaX + strAreaW / 2 
      : strAreaX + (i / (numStrings - 1)) * strAreaW
  );

  // Calculate dynamic start fret based on chord data
  // Find minimum positive fret (ignore -1 muted and 0 open strings)
  const startFret = (() => {
    const positiveFrets = frets.filter(f => f > 0);
    if (positiveFrets.length === 0) return 1;
    // A chord with any open string (fret 0) is played at the nut. Shifting the
    // base fret off the nut would produce a misleading 'Nfr' label alongside
    // the open-string markers (issue #213), so open-position voicings always
    // start at the nut. Only barre/movable shapes with all strings fretted or
    // muted may shift their base fret.
    if (frets.some(f => f === 0)) return 1;
    const minFret = Math.min(...positiveFrets);
    const maxFret = Math.max(...positiveFrets);
    // If fret range spans more than 4 frets, shift window to start from min
    if (maxFret - minFret >= 4) {
      return minFret;
    }
    return minFret > 1 ? minFret : 1;
  })();

  // Detect barre chords (same finger used on 2+ strings at the same fret)
  const detectBarres = () => {
    const barres = [];
    const fingerFretGroups = {};
    
    // Group strings by finger number AND fret (ignore 0 and negative frets/fingers)
    frets.forEach((fret, stringIdx) => {
      const finger = fingers[stringIdx] || 0;
      if (finger > 0 && fret > 0) {
        const key = `${finger}-${fret}`;
        if (!fingerFretGroups[key]) {
          fingerFretGroups[key] = [];
        }
        fingerFretGroups[key].push(stringIdx);
      }
    });
    
    // For each finger+fret group with 2+ strings, draw a barre from lowest to highest string
    Object.keys(fingerFretGroups).forEach(key => {
      const stringIndices = fingerFretGroups[key].sort((a, b) => a - b);
      if (stringIndices.length >= 2) {
        const [fingerStr, fretStr] = key.split('-');
        barres.push({
          finger: parseInt(fingerStr),
          fret: parseInt(fretStr),
          startString: stringIndices[0],
          endString: stringIndices[stringIndices.length - 1]
        });
      }
    });
    
    return barres;
  };

  // Render barre indicators
  const renderBarres = () => {
    const barres = detectBarres();
    return barres.map((barre, idx) => {
      const startX = strX[barre.startString];
      const endX = strX[barre.endString];
      const yPos = fretTop + (barre.fret - startFret) * fretH + fretH / 2;
      
      return (
        <line
          key={`barre-${idx}`}
          x1={startX}
          y1={yPos}
          x2={endX}
          y2={yPos}
          stroke="#ef4444"
          strokeWidth={6}
          strokeLinecap="round"
        />
      );
    });
  };

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
  const renderNut = () => {
    if (startFret > 1) return null;
    return (
      <rect x={strX[0] - 2} y={fretTop - nutH} width={strX[numStrings - 1] - strX[0] + 4} height={nutH}
        fill="#e8e8f0" rx={1} />
    );
  };

  // Render the 4 vertical string lines
  const renderStrings = () => (
    <>
      {strX.map((x, i) => (
        <line key={`str-${i}`} x1={x} y1={fretTop} x2={x} y2={svgH}
          stroke="#9090a0" strokeWidth={i < woundStrings ? 1.5 : 1} />
      ))}
    </>
  );

  // Draw an accessible-name layer describing the actual fingering.
  // Because the <svg> carries role="img" and a single aria-label, the only way
  // to convey each string's mute / open / fretted state to assistive tech is to
  // encode it in that label. Without this every diagram announced the same
  // generic text and the per-chord aria-label passed by SongDetail was dropped
  // (issue #238). Callers may override the whole label via `ariaLabel`.
  const STRING_NAMES = isGuitar
    ? ['low E', 'A', 'D', 'G', 'B', 'high E']
    : ['G', 'C', 'E', 'A'];
  const describeFingering = () => {
    const parts = frets.map((fret, i) => {
      const stringName = STRING_NAMES[i] || `string ${i + 1}`;
      // -1 (muted) is reported as 'x' so the string order and the mute state are
      // both machine-checkable in tests and useful when spoken aloud.
      if (fret === -1) return `${stringName}=x`;
      if (fret === 0) return `${stringName}=0`;
      return `${stringName}=${fret}`;
    });
    return parts.join(', ');
  };
  const diagramLabel = `${instrumentLabel} chord diagram, ${numStrings} strings: ${describeFingering()}`;

  // Render exactly `numFrets` horizontal fret lines (span full string width)
  const renderFrets = () => (
    <>
      {Array.from({ length: numFrets + 1 }, (_, i) => (
        <line key={`fret-${i}`}
          x1={strX[0]} y1={fretTop + i * fretH}
          x2={strX[numStrings - 1]} y2={fretTop + i * fretH}
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
          <circle cx={cx} cy={cy} r={9}
            fill="#6366f1" stroke="#8b5cf6" strokeWidth="2" />
          {finger > 0 && (
            <text x={cx} y={cy + 12} textAnchor="middle"
              fill="white" fontSize="14" fontFamily="sans-serif" fontWeight="bold">
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
    const midX = (strX[0] + strX[numStrings - 1]) / 2;
    return (
      <text x={midX} y={fretTop - 6} textAnchor="middle"
        fill="#9090a0" fontSize="10" fontFamily="sans-serif">
          {startFret}fr
      </text>
    );
  };

  return (
    <svg
      className={className}
      width={svgW + marginX * 2}
      height={svgH}
      viewBox={`0 0 ${svgW + marginX * 2} ${svgH}`}
      style={{ display: 'block' }}
      role="img"
      aria-label={ariaLabel || diagramLabel}
    >
      {renderTopMarkers()}
      {renderStartFretMarker()}
      {renderNut()}
      {renderStrings()}
      {renderFrets()}
      {renderBarres()}
      {renderDots()}
    </svg>
  );
}

export default ChordDiagram;