import { Row, Col, Spin, Typography, Skeleton } from 'antd';
import { motion } from 'framer-motion';
import {
  WalletOutlined,
  UserOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

const { Text, Title } = Typography;

const iconMap = {
  blue: <WalletOutlined />,
  red: <CreditCardOutlined />,
  cyan: <UserOutlined />,
  green: <FileTextOutlined />,
  purple: <FileTextOutlined />,
  orange: <FileTextOutlined />,
};

export default function AnalyticSummaryCard({ 
  title, 
  tagColor = 'blue', 
  data, 
  prefix, 
  isLoading = false,
  sparklineData = [],
  isGradientCard = false,
  isMoney = true,
}) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);

  const formattedData = data !== undefined
    ? (isMoney ? moneyFormatter({
        amount: data,
        currency_code: money_format_settings?.default_currency_code,
      }) : data)
    : (isMoney ? moneyFormatter({
        amount: 0,
        currency_code: money_format_settings?.default_currency_code,
      }) : 0);

  const getStatusColor = (color) => {
    const colors = {
      blue: '#2563EB',   // Royal Blue
      green: '#0ea5e9',  // Sky Blue
      red: '#4f46e5',    // Indigo Blue
      cyan: '#06b6d4',   // Cyan Blue
    };
    return colors[color] || colors.blue;
  };

  const getGradient = (color) => {
    const gradients = {
      blue: 'linear-gradient(135deg, #2563EB 0%, #1e3a8a 100%)',   // Royal Blue
      green: 'linear-gradient(135deg, #0ea5e9 0%, #075985 100%)',  // Sky Blue (for green tag)
      red: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',    // Indigo (for red tag)
      cyan: 'linear-gradient(135deg, #06b6d4 0%, #083344 100%)',   // Cyan
    };
    return gradients[color] || gradients.blue;
  };

  const currentColor = getStatusColor(tagColor);
  const currentGradient = getGradient(tagColor);

  // --- Premium Enterprise Card Style ---
  const bentoStyle = {
    background: '#1A1D21',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: 'none',
  };

  const textColor = '#A1A1AA'; // Muted gray
  const valueColor = '#E5E7EB'; // Soft white
  const iconBg = 'rgba(255, 255, 255, 0.03)';
  const iconColor = currentColor; // Data color reserved for icon

  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 6 }}
    >
      <motion.div
        variants={{
          initial: { 
            background: `${currentColor}08`,
            backgroundImage: `linear-gradient(180deg, ${currentColor}15 0%, rgba(0,0,0,0) 100%)`,
            borderColor: 'rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            y: 0
          },
          hover: { 
            background: currentGradient,
            backgroundImage: `radial-gradient(circle at top right, ${currentColor}40, transparent)`,
            borderColor: `${currentColor}CC`,
            boxShadow: `0 25px 50px -12px ${currentColor}50, 0 0 32px ${currentColor}30`,
            y: -12,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
          }
        }}
        initial="initial"
        whileHover="hover"
        className="whiteBox bento-card"
        style={{ 
          padding: '24px', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer'
        }}
      >
        {/* Color-Matched Inner Glow on Hover (Same color as Card Theme) */}
        <motion.div 
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 }
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 120%, ${currentColor}25, transparent 70%)`,
            pointerEvents: 'none'
          }}
        />
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: currentColor, opacity: 0.8 }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <motion.div
              variants={{
                initial: { color: textColor },
                hover: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            >
              <Text strong style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'inherit' }}>
                {title}
              </Text>
            </motion.div>
          </div>
          <motion.div 
            variants={{
              initial: { backgroundColor: `${currentColor}15`, scale: 1 },
              hover: { backgroundColor: 'rgba(255, 255, 255, 0.2)', scale: 1.1 }
            }}
            style={{ 
              fontSize: '18px', 
              color: currentColor,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'color 0.4s ease'
            }}
          >
            <motion.span
              variants={{
                initial: { color: currentColor },
                hover: { color: '#FFF' }
              }}
            >
              {iconMap[tagColor] || <FileTextOutlined />}
            </motion.span>
          </motion.div>
        </div>

        <div style={{ marginBottom: '8px' }}>
          {isLoading ? (
            <Skeleton.Input active size="small" style={{ width: 120, height: 32, borderRadius: 8 }} />
          ) : (
            <motion.div 
              variants={{
                initial: { color: valueColor, x: 0 },
                hover: { color: '#FFF', x: 2 }
              }}
              style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}
            >
              <Title level={3} style={{ margin: 0, fontWeight: 600, fontSize: '32px', color: 'inherit', letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
                {formattedData}
              </Title>
            </motion.div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', minHeight: '35px' }}>
          {isLoading ? (
             <Skeleton.Button active size="small" style={{ width: 70, height: 32, borderRadius: 16 }} />
          ) : (
            <>
              {sparklineData && sparklineData.length > 0 ? (
                <div style={{ width: '70px', height: '35px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData}>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={currentColor} 
                        fill={`${currentColor}10`} 
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ width: '70px', height: '35px', borderBottom: `2px dashed rgba(255,255,255,0.05)`, borderRadius: '4px' }}></div>
              )}
            </>
          )}
          <Text style={{ fontSize: '13px', color: textColor, fontWeight: 500 }}>
            {prefix}
          </Text>
        </div>
      </motion.div>
    </Col>
  );
}
