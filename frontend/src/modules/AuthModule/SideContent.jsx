import React from 'react';
import { Space, Layout, Typography } from 'antd';
import { DeploymentUnitOutlined, NodeIndexOutlined, SecurityScanOutlined } from '@ant-design/icons';
import logo from '@/style/images/brand-logo.png';
import useLanguage from '@/locale/useLanguage';

import { useLocation } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function SideContent() {
  const translate = useLanguage();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  const features = [
    {
      icon: <DeploymentUnitOutlined style={{ fontSize: 22, color: '#3b82f6' }} />, 
      title: 'Enterprise ERP Suite',
      description: 'A Complete Ecosystem For Modern Business Operations And Finance.'
    },
    {
      icon: <NodeIndexOutlined style={{ fontSize: 22, color: '#3b82f6' }} />,
      title: 'Stealth Performance',
      description: 'Optimized For High-velocity Data Management And Real-time Insights.'
    },
    {
      icon: <SecurityScanOutlined style={{ fontSize: 22, color: '#3b82f6' }} />,
      title: 'Uncompromised Security',
      description: 'Enterprise-grade Encryption For Your Most Sensitive Financial Data.'
    }
  ];


  return (
    <Content
      style={{
        padding: '60px 40px',
        width: '100%',
        maxWidth: '550px',
        margin: '0 auto',
        background: 'transparent',
        zIndex: 2,
        position: 'relative'
      }}
      className="sideContent"
    >
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', zIndex: -1 }}></div>
      
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px', cursor: 'pointer' }} onClick={() => window.open('/', '_self')}>
          <img
            src={logo.src || logo}
            alt="BizCollab Logo"
            style={{ 
              height: '48px',
              width: 'auto',
              display: 'block',
              filter: 'brightness(1.2)' 
            }}
          />
          <Title level={2} style={{ color: '#FFFFFF', margin: 0, fontWeight: 900, fontSize: '28px', letterSpacing: '-1px' }}>
            BizCollab
          </Title>
        </div>

        <Title 
          level={1} 
          style={{ 
            fontSize: 42,
            fontWeight: 800,
            marginBottom: 20,
            lineHeight: 1.1,
            color: '#FFFFFF',
            letterSpacing: '-1.2px'
          }}
        >
          Master your
          <br />
          <span style={{ 
            background: 'linear-gradient(to right, #3b82f6, #4ade80)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>Financial Ecosystem</span>
        </Title>
        
        <Paragraph 
          style={{ 
            fontSize: 17, 
            color: 'rgba(255, 255, 255, 0.45)',
            marginBottom: 60,
            lineHeight: 1.6,
            maxWidth: '420px'
          }}
        >
          Join thousands of elite companies using BizCollab OS to scale operations and accelerate financial velocity.
        </Paragraph>

        {isLoginPage && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '24px'
                }}
              >
                <div style={{
                  color: '#3b82f6',
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(59, 130, 246, 0.15)'
                }}>
                  {feature.icon}
                </div>
                <div>
                  <Title level={4} style={{ color: '#FFFFFF', margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700 }}>
                    {translate(feature.title)}
                  </Title>
                  <Text style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.45)', lineHeight: 1.5, display: 'block' }}>
                    {translate(feature.description)}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Content>
  );
}

