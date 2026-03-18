import { Statistic, Progress, Skeleton, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

export default function CustomerPreviewCard({
  isLoading = false,
  activeCustomer = 0,
  newCustomer = 0,
}) {
  const translate = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.2)' }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className="whiteBox bento-card" 
      style={{ 
        height: '520px', 
        padding: '32px', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <Title level={4} style={{ margin: 0, color: '#E5E7EB', fontWeight: 700 }}>{translate('Customers')}</Title>
        <Text style={{ color: '#A1A1AA', fontSize: '14px' }}>{translate('Retention and acquisition stats')}</Text>
      </div>

      {isLoading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
          <Skeleton.Button active size="large" style={{ width: 160, height: 160, borderRadius: '50%' }} />
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <Progress 
                type="dashboard" 
                percent={newCustomer} 
                size={180}
                strokeWidth={10}
                strokeColor="#3B82F6"
                railColor="rgba(255,255,255,0.03)"
                showInfo={false}
            />
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -30%)',
              textAlign: 'center'
            }}>
              <Text strong style={{ fontSize: '28px', color: '#E5E7EB', display: 'block', letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>{newCustomer}%</Text>
              <Text style={{ color: '#A1A1AA', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>{translate('New Growth')}</Text>
            </div>
          </div>

          <div style={{ 
            width: '100%', 
            padding: '24px', 
            backgroundColor: 'transparent', 
            borderRadius: '12px', 
            border: '1px solid rgba(255,255,255,0.05)',
            marginTop: '20px'
          }}>
            <Statistic
              title={<Text style={{ color: '#A1A1AA', fontSize: '13px', fontWeight: 500 }}>{translate('Active Customer Rate')}</Text>}
              value={activeCustomer}
              precision={1}
              styles={{
                content: {
                  color: activeCustomer >= 0 ? '#10B981' : '#EF4444',
                  fontWeight: 800,
                  fontSize: '28px',
                  letterSpacing: '-0.5px',
                  fontVariantNumeric: 'tabular-nums'
                }
              }}
              prefix={
                activeCustomer > 0 ? (
                  <ArrowUpOutlined style={{ fontSize: '20px', color: '#05f549ff' }} />
                ) : activeCustomer < 0 ? (
                  <ArrowDownOutlined style={{ fontSize: '20px', color: '#f80909ff' }} />
                ) : null
              }
              suffix={<span style={{ fontSize: '16px', marginLeft: '4px', opacity: 0.6 }}>%</span>}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

