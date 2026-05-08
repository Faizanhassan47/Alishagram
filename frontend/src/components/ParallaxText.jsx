import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MotionDiv = motion.div;

const ParallaxText = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <MotionDiv 
      ref={ref} 
      style={{ y, willChange: 'transform' }} 
      className={className}
    >
      {children}
    </MotionDiv>
  );
};

export default ParallaxText;
