import Profile from './components/Profile';
import ProfileLayout from '@/layout/ProfileLayout';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

export default function ProfileModule({ config }) {
  return (
    <ProfileLayout>
      <div style={{ width: '100%' }}>
        <Profile config={config} />
      </div>
    </ProfileLayout>
  );
}
