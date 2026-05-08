import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export const BackgroundGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000 * 2,
      height: 1000 * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.05, 0.05, 0.05],
      markerColor: [0, 0.96, 1], // Cyan
      glowColor: [0, 0.1, 0.2], // Deep cyan glow
      markers: [
        // Major financial hubs
        { location: [40.7128, -74.0060], size: 0.05 }, // NY
        { location: [51.5074, -0.1278], size: 0.04 },  // London
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [22.3193, 114.1694], size: 0.04 }, // HK
        { location: [1.3521, 103.8198], size: 0.04 },  // Singapore
        { location: [47.3769, 8.5417], size: 0.03 }    // Zurich
      ],
      // @ts-expect-error onRender is supported but might be missing in older TS definitions
      onRender: (state: any) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none mix-blend-screen overflow-hidden">
      <div className="w-[1000px] h-[1000px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <canvas
          ref={canvasRef}
          style={{ width: 1000, height: 1000, maxWidth: "100%", aspectRatio: 1 }}
        />
      </div>
    </div>
  );
};

export default BackgroundGlobe;
