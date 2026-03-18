import { useMemo } from 'react';
import { Progress, Spin, Typography, Row, Col } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const { Text } = Typography;

const statusConfig = {
  draft: { color: '#8c8c8c', icon: <FileTextOutlined /> },
  sent: { color: '#1890ff', icon: <SyncOutlined /> },
  pending: { color: '#1890ff', icon: <ClockCircleOutlined /> },
  unpaid: { color: '#ffa940', icon: <ExclamationCircleOutlined /> },
  overdue: { color: '#ff4d4f', icon: <CloseCircleOutlined /> },
  partially: { color: '#13c2c2', icon: <SyncOutlined /> },
  paid: { color: '#52c41a', icon: <CheckCircleOutlined /> },
  declined: { color: '#ff4d4f', icon: <CloseCircleOutlined /> },
  accepted: { color: '#52c41a', icon: <SafetyCertificateOutlined /> },
  expired: { color: '#faad14', icon: <ClockCircleOutlined /> },
};

const defaultInvoiceStatistics = [
  { tag: 'draft', value: 0 },
  { tag: 'pending', value: 0 },
  { tag: 'paid', value: 0 },
  { tag: 'unpaid', value: 0 },
];

export default function PreviewCard({
  title = 'Quick Summary',
  statistics = [],
  isLoading = false,
  entity = 'invoice',
}) {
  const translate = useLanguage();

  const statisticsMap = useMemo(() => {
    if (!statistics || statistics.length === 0) return defaultInvoiceStatistics;
    return statistics;
  }, [statistics]);

  // Calculate total for the composition bar
  const total = useMemo(() => {
    return statisticsMap.reduce((acc, curr) => acc + (curr.value || 0), 0);
  }, [statisticsMap]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin />
      </div>
    );
  }

  return (
    <div style={{ padding: '4px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Text strong style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</Text>
        <div style={{ 
          height: '10px', 
          width: '100%', 
          backgroundColor: 'rgba(255,255,255,0.08)', 
          borderRadius: '5px', 
          marginTop: '16px', 
          display: 'flex', 
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {statisticsMap.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                width: `${total > 0 ? (item.value / total) * 100 : 0}%`, 
                backgroundColor: statusConfig[item.tag?.toLowerCase()]?.color || '#4B5563',
                height: '100%',
                transition: 'width 1s ease-in-out'
              }} 
            />
          ))}
        </div>
      </div>

      <Row gutter={[16, 20]}>
        {statisticsMap.map((item, index) => {
          const config = statusConfig[item.tag?.toLowerCase()] || { color: '#4B5563', icon: <FileTextOutlined /> };
          return (
            <Col span={12} key={index}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.04)', // Dark card
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'background-color 0.3s ease'
              }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '10px', 
                  backgroundColor: `${config.color}20`, 
                  color: config.color,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {config.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <Text style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 500, textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {translate(item.tag)}
                    </Text>
                    <Text strong style={{ fontSize: '13px', color: '#FFFFFF' }}>{item.value}%</Text>
                  </div>
                  <Progress 
                    percent={item.value} 
                    showInfo={false} 
                    strokeColor={config.color} 
                    size={4} 
                    railColor="rgba(255,255,255,0.08)"
                    strokeLinecap="round"
                  />
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
