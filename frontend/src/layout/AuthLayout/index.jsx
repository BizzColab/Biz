import React from 'react';
import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Layout, Row, Col } from 'antd';

import { useSelector } from 'react-redux';
const { Content } = Layout;

export default function AuthLayout({ sideContent, children }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end movement feeling
  const spotlightX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const spotlightY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <Layout 
      onMouseMove={handleMouseMove}
      style={{ minHeight: '100vh', background: '#000000', overflow: 'hidden', position: 'relative' }}
    >
      {/* Blueprint Grid Overlay */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {/* Interactive Mouse-Follow Glow Spotlight */}
      <motion.div
        style={{
          position: 'absolute',
          top: -200,
          left: -200,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 80%)',
          zIndex: 1,
          pointerEvents: 'none',
          x: spotlightX,
          y: spotlightY
        }}
      />

      {/* Glossy Background Elements */}
      <div style={{ 
        position: 'absolute', 
        top: '-15%', 
        left: '-10%', 
        width: '60vw', 
        height: '60vw', 
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)', 
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'blur(80px)'
      }}></div>
      <div style={{ 
        position: 'absolute', 
        bottom: '-25%', 
        right: '-10%', 
        width: '70vw', 
        height: '70vw', 
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)', 
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'blur(100px)'
      }}></div>


      <Row style={{ minHeight: '100vh', margin: 0, position: 'relative', zIndex: 1 }}>
        <Col
          xs={{ span: 24, order: 1 }}
          md={{ span: 13, order: 2 }}
          lg={{ span: 12, order: 2 }}
          style={{ 
            background: 'transparent', 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
          }}
        >
          {children}
        </Col>
        <Col
          xs={{ span: 24, order: 2 }}
          md={{ span: 11, order: 1 }}
          lg={{ span: 12, order: 1 }}
          style={{
            minHeight: 'auto',
            background: 'rgba(5, 5, 5, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden',
            position: 'relative',
            paddingBottom: '60px'
          }}
        >
          {sideContent}
        </Col>
      </Row>
    </Layout>
  );
}


