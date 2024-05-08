import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface CustomerSurveyCardProps {
  animate?: boolean;
  animateDelay?: number;
  elavate?: boolean;
  children: JSX.Element | JSX.Element[];
}

const Card = ({
  children,
  animate = false,
  elavate = false,
  animateDelay,
}: CustomerSurveyCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      animate={
        animate ? (isInView ? { opacity: [0, 0.2, 1], x: [200, 0] } : {}) : {}
      }
      transition={{ ease: "easeOut", duration: 0.3, delay: animateDelay }}
      className={`card rounded-xl flex flex-col gap-8 px-4 py-8 w-full ${
        elavate ? "border-gray-50 border-2 shadow-lg" : ""
      }`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
