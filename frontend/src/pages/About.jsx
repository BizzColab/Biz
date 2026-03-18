import React from 'react';
import { Row, Col, Card, Typography, Button, Space, Divider, Tag, Badge } from 'antd';
import { motion } from 'framer-motion';
import { 
  GithubOutlined, 
  GlobalOutlined, 
  SafetyCertificateOutlined, 
  ThunderboltOutlined, 
  TeamOutlined, 
  BuildOutlined, 
  RocketOutlined, 
  LineChartOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import logo from '@/style/images/brand-logo.png';
import useLanguage from '@/locale/useLanguage';

const { Title, Text, Paragraph } = Typography;

const About = () => {
  const translate = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const FeatureCard = ({ icon, title, description }) => (
    <motion.div variants={itemVariants}>
      <Card 
        bordered={false} 
        style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          height: '100%',
          transition: 'all 0.3s'
        }}
        bodyStyle={{ padding: '32px' }}
        className="about-feature-card"
        hoverable
      >
        <div style={{ fontSize: '32px', color: '#3B82F6', marginBottom: '16px' }}>{icon}</div>
        <Title level={4} style={{ marginBottom: '12px', color: '#FFFFFF' }}>{translate(title)}</Title>
        <Text style={{ color: 'rgba(255,255,255,0.65)' }}>{translate(description)}</Text>
      </Card>
    </motion.div>
  );

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}
    >
      <style>{`
        .about-feature-card:hover { BorderColor: #3B82F6 !important; transform: translateY(-8px); }
        .tech-tag { background: rgba(59, 130, 246, 0.1) !important; border: 1px solid rgba(59, 130, 246, 0.3) !important; color: #3B82F6 !important; padding: 4px 12px; }
      `}</style>

      {/* Hero Section */}
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '100px' }}>
        <div style={{ marginBottom: '40px' }}>
          <img
            src={logo.src || logo}
            alt="BizCollab Logo"
            style={{ height: '120px', width: 'auto', margin: '0 auto', filter: 'brightness(1.1)' }}
          />
        </div>
        <Title style={{ fontSize: '64px', fontWeight: 800, letterSpacing: '-3px', color: '#FFFFFF', marginBottom: '24px' }}>
          BizCollab Ecosystem
        </Title>
        <Paragraph style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
          Welcome to the high-performance workspace designed for elite agencies and businesses. 
          BizCollab is a full-scale ERP/CRM suite built with precision to automate your workflow, 
          manage high-volume financials, and provide real-time strategic insights.
        </Paragraph>
        
        <Space size="large" style={{ marginTop: '48px' }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<GithubOutlined />} 
            onClick={() => window.open('https://github.com/BizzColab/Biz')}
            style={{ padding: '0 40px', height: '54px', borderRadius: '12px' }}
          >
            GitHub Repository
          </Button>
        </Space>
      </motion.div>

      <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '100px' }} />

      {/* Core Modules Grid */}
      <motion.div variants={itemVariants} style={{ marginBottom: '100px' }}>
        <Row justify="center" style={{ marginBottom: '48px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: '#FFFFFF', marginBottom: '12px' }}>Enterprise-Grade Infrastructure</Title>
            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Architected for scalability and extreme performance.</Text>
          </Col>
        </Row>
        
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard 
              icon={<LineChartOutlined />}
              title="Predictive Dashboard"
              description="Real-time analytics engine providing data-driven insights with futuristic visualizations."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard 
              icon={<ThunderboltOutlined />}
              title="Automated Invoicing"
              description="High-velocity invoice generation with multi-currency support and automated tax calculations."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard 
              icon={<TeamOutlined />}
              title="Advanced CRM"
              description="Integrated client relationship module with comprehensive history and status tracking."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard 
              icon={<BuildOutlined />}
              title="Modular Architecture"
              description="A plugin-ready framework that adapts to your business needs without bloat."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard 
              icon={<SafetyCertificateOutlined />}
              title="Encrypted Financials"
              description="Industry-standard security protocols for all payment records and financial transactions."
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FeatureCard 
              icon={<BuildOutlined />}
              title="Dynamic Theming"
              description="Midnight Glass UI engine optimized for high-contrast focus and aesthetic excellence."
            />
          </Col>
        </Row>
      </motion.div>

      {/* Technical Insight Section */}
      <motion.div variants={itemVariants} style={{ marginBottom: '100px' }}>
        <Card 
          style={{ 
            background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(0,0,0,0) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: '80px 40px' }}
        >
          <Row align="middle" gutter={[60, 40]}>
            <Col xs={24} lg={12}>
              <Title level={2} style={{ color: '#FFFFFF', marginBottom: '24px' }}>The Tech Stack behind the Performance</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', lineHeight: '1.9' }}>
                BizCollab is built on a modern, distributed architecture. 
                Our frontend utilizes React 18, Ant Design, and Redux for a buttery-smooth 
                60fps UI. The backend is powered by Node.js and MongoDB, ensuring 
                sub-100ms response times even under high data volume.
              </Paragraph>
              <Space wrap size={[12, 12]} style={{ marginTop: '24px' }}>
                {['React 18', 'Redux Toolkit', 'Ant Design', 'Node.js', 'Express', 'MongoDB', 'Docker', 'JWT Auth'].map(tech => (
                  <Tag key={tech} className="tech-tag">{tech}</Tag>
                ))}
              </Space>
            </Col>
            <Col xs={24} lg={12}>
              <div style={{ position: 'relative', padding: '20px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', zIndex: 0 }} />
                <Row gutter={[20, 20]} style={{ position: 'relative', zIndex: 1 }}>
                  {[
                    { label: 'Uptime', val: '99.9%' },
                    { label: 'Latency', val: '<80ms' },
                    { label: 'Security', val: 'AES-256' },
                    { label: 'Response', val: 'Instant' }
                  ].map((stat, idx) => (
                    <Col span={12} key={idx}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                        <Title level={2} style={{ color: '#3B82F6', margin: 0, fontSize: '32px' }}>{stat.val}</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }}>{stat.label}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Contact Section */}
      <motion.div variants={itemVariants} style={{ textAlign: 'center', padding: '40px' }}>
        <Title level={2} style={{ color: '#FFFFFF', marginBottom: '32px' }}>Partner with Excellence</Title>
        <Space size="large">
          <Button 
            type="primary" 
            size="large" 
            icon={<CustomerServiceOutlined />}
            onClick={() => window.open('https://www.BizCollab.com/contact-us/')}
            style={{ height: '54px', padding: '0 48px', borderRadius: '12px' }}
          >
            Request Custom Development
          </Button>
        </Space>
        <div style={{ marginTop: '48px', color: 'rgba(255,255,255,0.45)' }}>
          © {new Date().getFullYear()} BizCollab CRM. All rights reserved. 
          <br />Designed for Performance and Visual Excellence.
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;

