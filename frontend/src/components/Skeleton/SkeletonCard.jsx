import { Card, Skeleton } from 'antd';

export default function SkeletonCard() {
  return (
    <Card
      style={{
        width: '100%',
        borderRadius: '24px',
        background: '#111622',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        height: '160px',
      }}
    >
      <Skeleton active paragraph={{ rows: 2 }} title={false} />
    </Card>
  );
}
