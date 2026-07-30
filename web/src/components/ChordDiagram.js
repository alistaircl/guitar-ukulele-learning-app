import React from 'react';

function ChordDiagram({ frets, fingers = [], size = 100, className, instrument = 'ukulele' }) {
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

  // Support variable string counts (4 for ukulele, 6 for guitar)
  const numStrings = frets.length;
  
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
    const minFret = Math.min(...positiveFrets);
    const maxFret = Math.max(...positiveFrets);
    // If fret range spans more than 4 frets, shift window to start from min
    if (maxFret - minFret >= 4) {
      return minFret;
    }
    return minFret > 1 ? minFret : 1;
  })();

  // Detect barre chords (same finger used on 2+ adjacent strings)
  const detectBarres = () => {
    const barres = [];
    const fingerGroups = {};
    
    // Group strings by finger number (ignore 0 and negative)
    frets.forEach((fret, stringIdx) => {
      const finger = fingers[stringIdx] || 0;
      if (finger > 0 && fret > 0) {
        if (!fingerGroups[finger]) {
          fingerGroups[finger] = [];
        }
        fingerGroups[finger].push({ stringIdx, fret });
      }
    });
    
    // Find consecutive strings with same finger
    Object.keys(fingerGroups).forEach(finger => {
      const strings = fingerGroups[finger].sort((a, b) => a.stringIdx - b.stringIdx);
      let currentBarre = [];
      
      strings.forEach((stringObj, idx) => {
        if (currentBarre.length === 0) {
          currentBarre.push(stringObj);
        } else {
          const last = currentBarre[currentBarre.length - 1];
          // Check if consecutive string and same fret
          if (stringObj.stringIdx === last.stringIdx + 1 && stringObj.fret === last.fret) {
            currentBarre.push(stringObj);
          } else {
            // End of current barre, check if it's valid (2+ strings)
            if (currentBarre.length >= 2) {
              barres.push({
                finger: parseInt(finger),
                fret: currentBarre[0].fret,
                startString: currentBarre[0].stringIdx,
                endString: currentBarre[currentBarre.length - 1].stringIdx
              });
            }
            currentBarre = [stringObj];
          }
        }
        
        // Add barre if we're at the last string and have a valid barre that wasn't already added
        // A barre is already added if the else block fired on this iteration
        if (idx === strings.length - 1 && currentBarre.length >= 2) {
          // Check if this exact barre already exists (prevent duplicates)
          const exists = barres.some(b => 
            b.finger === parseInt(finger) && 
            b.fret === currentBarre[0].fret && 
            b.startString === currentBarre[0].stringIdx &&
            b.endString === currentBarre[currentBarre.length - 1].stringIdx
          );
          if (!exists) {
            barres.push({
              finger: parseInt(finger),
              fret: currentBarre[0].fret,
              startString: currentBarre[0].stringIdx,
              endString: currentBarre[currentBarre.length - 1].stringIdx
            });
          }
        }
      });
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
          stroke="#9090a0" strokeWidth={i < 2 ? 1.5 : 1} />
      ))}
    </>
  );

  // Render 4 horizontal fret lines (span full string width)
  const renderFrets = () => (
    <>
      {[0, 1, 2, 3, 4].map(i => (
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
      width={svgW + marginX * 2}
      height={svgH}
      viewBox={`0 0 ${svgW + marginX * 2} ${svgH}`}
      style={{ display: 'block' }}
      role="img"
      aria-label="Chord diagram showing finger positions"
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