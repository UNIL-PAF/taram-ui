
import { useLayoutEffect, useRef, useState } from 'react';

export function useResponsiveChartSize({
                                           ratio = 0.6, // height = width * ratio
                                           minHeight = 200,
                                           maxHeight = Infinity,
                                       } = {}) {
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: minHeight });

    const prevHeightRef = useRef(null);

    useLayoutEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        console.log(element);

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const width = entry.contentRect.width;

            // Defer update to avoid ResizeObserver loop warning
            requestAnimationFrame(() => {
                let height = Math.round(width * ratio);

                // Apply constraints
                height = Math.max(minHeight, Math.min(maxHeight, height));

                // Skip unnecessary updates

                const TOLERANCE = 2; // pixels

                if (
                    prevHeightRef.current === null ||
                    Math.abs(prevHeightRef.current - height) > TOLERANCE
                ) {
                    prevHeightRef.current = height;
                    setSize({ width, height });
                }

            });
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [ratio, minHeight, maxHeight]);

    return { containerRef, ...size };
}
