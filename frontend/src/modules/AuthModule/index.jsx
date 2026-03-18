import useLanguage from '@/locale/useLanguage';

import { Layout, Col, Typography, Space } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';

import logo from '@/style/images/brand-logo.png';

import { motion } from 'framer-motion';

const { Content } = Layout;
const { Title, Text } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content
        style={{
          padding: isForRegistre ? '20px 40px 40px' : '40px 40px 40px',
          maxWidth: '520px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="auth-container-electric"
          style={{
            background: 'transparent',
            backdropFilter: 'blur(30px)',
            border: '1.5px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '24px',
            padding: '36px 48px 48px',
            position: 'relative'
          }}
        >
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <img
                src={logo.src || logo}
                alt="BizCollab Logo"
                style={{ height: '40px', width: 'auto', display: 'block' }}
              />
              <Title level={3} style={{ color: '#FFFFFF', margin: 0, fontWeight: 900, fontSize: '24px', letterSpacing: '-0.8px' }}>
                BizCollab
              </Title>
            </div>
          </Col>
          
          <Space orientation="vertical" size={12} style={{ marginBottom: 24, width: '100%' }}>
            <Title 
              level={1} 
              style={{ 
                marginBottom: 0,
                fontSize: 36,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-1.5px'
              }}
            >
              {translate(AUTH_TITLE)}
            </Title>
            <Text 
              style={{ 
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.45)',
                fontWeight: 400,
                display: 'block'
              }}
            >
              {AUTH_TITLE === 'Sign in' 
                ? translate('Enter your enterprise credentials.')
                : translate('Initialize your corporate workspace.')}
            </Text>
          </Space>

          <div className="site-layout-content">{authContent}</div>
        </motion.div>
      </Content>
    </AuthLayout>
  );
};


export default AuthModule;
