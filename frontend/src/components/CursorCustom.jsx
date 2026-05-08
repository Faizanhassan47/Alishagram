import React, { useEffect, useRef, useState } from 'react';
import './CursorCustom.css';

const CursorCustom = () => {
  const cursorRef = useRef(null);
  const [cursorState, setCursorState] = useState('default'); // 'default', 'pointer', 'view'
  const stateRef = useRef('default');

  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      // Use requestAnimationFrame for smoother GPU-synced updates
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (cursorRef.current) {
          // Use translate3d for hardware acceleration, bypassing React state
          cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
      });
      
      const target = e.target;
      if (!target) return;

      let newState = 'default';
      
      const isPhoto = target.closest('.pcard') || target.closest('.hp-mosaic-item') || target.closest('.hp-journal-img-wrap');
      
      if (isPhoto) {
        newState = 'view';
      } else {
        const isClickable = target.tagName === 'A' || 
                           target.tagName === 'BUTTON' ||
                           target.closest('button') ||
                           target.closest('a') ||
                           window.getComputedStyle(target).cursor === 'pointer';
        newState = isClickable ? 'pointer' : 'default';
      }

      if (stateRef.current !== newState) {
        stateRef.current = newState;
        setCursorState(newState);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className={`custom-cursor cursor-${cursorState}`}
    >
      {cursorState === 'view' && <span className="cursor-text">VIEW</span>}
    </div>
  );
};

export default CursorCustom;
