import React from 'react';

function ChordDiagram({ frets, fingers = [], size = 100, className, instrument = 'ukulele', ariaLabel }) {
  // Layout constants (proportional)
  const svgW = size;
  const svgH = size + 22; // extra 22px for open/muted markers
  const nutH = 5;
  const markerTop = 10;   // y offset where open/muted markers sit
  const fretTop = nutH + markerTop + 12; // y where fret 1 starts

  // Find minimum positive fret (ignore -1 muted and 0 open strings)
  const positiveFrets = frets.filter(f => f > 0);
  const hasOpenString = frets.some(f => f === 0);
  const minFret = positiveFrets.length > 0 ? Math.min(...positiveFrets) : 1;
  const maxFret = positiveFrets.length > 0 ? Math.max(...positiveFrets) : 1;

  // Number of frets to display: at least 4, wider if the shape spans more
  // frets than a 4-fret window can hold (e.g. Dm barre [2,2,1,5] spans 1-5).
  // Open-position voicings always start at the nut and keep a 4-fret window.
  const numFrets = hasOpenString || positiveFrets.length === 0
    ? 4
    : Math.max(4, maxFret - minFret + 1);
  const fretH = (svgH - fretTop) / numFrets;
  const marginX = 8;
  const strAreaX = marginX;
  const strAreaW = svgW - marginX * 2;

  // Support variable string counts (4 for ukulele, 6 for guitar)
  const numStrings = frets.length;
  
  // String x positions (dynamically calculated based on number of strings)
  const strX = Array.from({ length: numStrings }, (_, i) => 
    numStrings === 1 
      ? strAreaX + strAreaW / 2 
      : strAreaX + (i / (numStrings - 1)) * strAreaW
  );

  // Calculate dynamic start fret based on chord data
  const startFret = (() => {
    if (positiveFrets.length === 0) return 1;
    // A chord with any open string (fret 0) is played at the nut. Shifting the
    // base fret off the nut would produce a misleading 'Nfr' label alongside
    // the open-string markers (issue #213), so open-position voicings always
    // start at the nut. Only barre/movable shapes with all strings fretted or
    // muted may shift their base fret.
    if (hasOpenString) return 1;
    // If fret range spans more than 4 frets, shift window to start from min
    if (maxFret - minFret >= 4) {
      return minFret;
    }
    return minFret > 1 ? minFret : 1;
  })();

  // Detect barre chords: same finger used on 2+ strings at the same fret,
  // whether the strings are adjacent or not (e.g. a partial barre with a gap,
  // or muted/open strings between the barred strings).
  const detectBarres = () => {
    const barres = [];
    const groups = {};

    // Group strings by (finger, fret). Ignore open (0) and muted (-1) strings
    // and strings with no finger assigned.
    frets.forEach((fret, stringIdx) => {
      const finger = fingers[stringIdx] || 0;
      if (finger > 0 && fret > 0) {
        const key = `${finger}:${fret}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push({ stringIdx, fret, finger });
      }
    });

    // Any group with 2+ strings sharing the same finger and fret is a barre.
    // The barre line spans from the lowest to the highest string index in the
    // group (issue #428), regardless of whether the strings are consecutive.
    Object.keys(groups).forEach(key => {
      const strings = groups[key].sort((a, b) => a.stringIdx - b.stringIdx);
      if (strings.length >= 2) {
        barres.push({
          finger: strings[0].finger,
          fret: strings[0].fret,
          startString: strings[0].stringIdx,
          endString: strings[strings.length - 1].stringIdx,
        });
      }
    });

    return barres;
  };

  // Generate descriptive aria-label from frets/fingers for accessibility
  const generateAriaLabel = () => {
    const stringNames = numStrings === 6
      ? ['low E', 'A', 'D', 'G', 'B', 'high E']  // Guitar: E2, A2, D3, G3, B3, E4
      : ['G', 'C', 'E', 'A'];  // Ukulele: G, C, E, A

    const parts = [];
    frets.forEach((fret, stringIdx) => {
      if (fret === -1) {
        // Muted strings don't add to description
      } else if (fret === 0) {
        parts.push(`open ${stringNames[stringIdx]}`);
      } else if (fret > 0) {
        const finger = fingers[stringIdx] || 0;
        const fingerText = finger > 0 ? ` with finger ${finger}` : '';
        parts.push(`fret ${fret} on ${stringNames[stringIdx]}${fingerText}`);
      }
    });

    if (parts.length === 0) {
      return 'Chord diagram showing finger positions';
    }
    return `Chord diagram: ${parts.join(', ')}`;
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
          stroke="#9090a0" strokeWidth={i < 2 ? 1.5 : 1} />
      ))}
    </>
  );

  // Render horizontal fret lines (span full string width); numFrets+1 lines
  // for numFrets fret spaces (e.g. 5 frets needs 6 lines).
  const renderFrets = () => (
    <>
      {[...Array(numFrets + 1)].map((_, i) => (
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
      aria-label={ariaLabel || generateAriaLabel()}
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