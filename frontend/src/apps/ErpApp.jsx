import { useLayoutEffect, useState, useEffect } from 'react';
import { selectAppSettings } from '@/redux/settings/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from 'antd';
import { motion, useSpring, useMotionValue } from 'framer-motion';

import { useAppContext } from '@/context/appContext';
import Navigation from '@/apps/Navigation/NavigationContainer';
import BusinessInsightsChat from '@/components/BusinessInsightsChat';
import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';
import AppRouter from '@/router/AppRouter';
import useResponsive from '@/hooks/useResponsive';
import storePersist from '@/redux/storePersist';

export default function ErpCrmApp() {
  const { Content } = Layout;
  const { isMobile } = useResponsive();
  const dispatch = useDispatch();
  const [settingsTimeout, setSettingsTimeout] = useState(false);

  // --- Premium Interactive Infrastructure Logic ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  useEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
    const timer = setTimeout(() => setSettingsTimeout(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  if (settingIsloaded || settingsTimeout)
    return (
      <div 
        onMouseMove={handleMouseMove}
        style={{ 
          position: 'relative', 
          minHeight: '100vh', 
          backgroundColor: '#000000', 
          overflow: 'hidden' 
        }}
      >
        {/* Premium Infrastructure Background (Blueprint Grid) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.4
        }}></div>

        {/* Global Interactive Spotlight */}
        <motion.div
          style={{
            position: 'absolute',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            zIndex: 1,
            pointerEvents: 'none',
            x: spotlightX,
            y: spotlightY,
            translateX: '-50%',
            translateY: '-50%'
          }}
        />

        {/* Subtle Blue Tint Gradient */}
        <div style={{ 
          position: 'absolute', 
          top: '-10%', 
          left: '-5%', 
          width: '50vw', 
          height: '50vw', 
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)', 
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(100px)'
        }}></div>

        <Layout hasSider style={{ background: 'transparent', position: 'relative', zIndex: 10 }}>
          <Navigation />

          {isMobile ? (
            <Layout style={{ background: 'transparent', marginLeft: 0 }}>
              <HeaderContent />
              <Content
                style={{
                  margin: '20px auto 30px', // Shifting text upwards
                  overflow: 'initial',
                  width: '100%',
                  padding: '0 25px',
                  maxWidth: 'none',
                }}
              >
                <AppRouter />
              </Content>
            </Layout>
          ) : (
            <Layout style={{ marginLeft: 108, background: 'transparent', transition: 'margin-left 0.3s ease' }}>
              <HeaderContent />
              <Content
                style={{
                  margin: '20px auto 30px', // Shifting text upwards
                  overflow: 'initial',
                  width: '100%',
                  padding: '0 40px',
                  maxWidth: 1600,
                }}
              >
                <AppRouter />
              </Content>
            </Layout>
          )}
        </Layout>
        <BusinessInsightsChat variant="widget" />
      </div>
    );
  else return <PageLoader />;
}

