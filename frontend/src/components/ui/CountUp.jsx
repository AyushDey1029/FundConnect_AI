import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const CountUp = ({ value, duration = 1.5, className = '', prefix = '', suffix = '' }) => {
  const springValue = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setHasStarted(true);
    springValue.set(value);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (current) => {
    return Math.round(current).toLocaleString();
  });

  return (
    <motion.span className={className}>
      {prefix}
      {hasStarted ? <motion.span>{displayValue}</motion.span> : "0"}
      {suffix}
    </motion.span>
  );
};

export default CountUp;
