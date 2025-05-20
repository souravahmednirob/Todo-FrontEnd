import React from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimationWrapperProps {
    children: React.ReactNode;
    animation?: 'fadeIn' | 'slideIn' | 'fadeInUp' | 'fadeInDown' | 'zoom' | 'bounce' | 'none';
    delay?: number;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
}

const animations: Record<string, Variants> = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    slideIn: {
        hidden: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1 },
    },
    fadeInUp: {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    },
    fadeInDown: {
        hidden: { y: -50, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    },
    zoom: {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
    },
    bounce: {
        hidden: { y: 0, opacity: 0 },
        visible: {
            y: [0, -20, 10, -5, 0],
            opacity: 1,
            transition: {
                y: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 10,
                }
            }
        },
    },
    none: {
        hidden: {},
        visible: {},
    },
};

const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
                                                               children,
                                                               animation = 'fadeIn',
                                                               delay = 0,
                                                               duration = 0.5,
                                                               className = '',
                                                               style = {},
                                                           }) => {
    const selectedAnimation = animations[animation] || animations.fadeIn;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={selectedAnimation}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
};

export default AnimationWrapper;