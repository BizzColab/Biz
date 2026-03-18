import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { info } from '@/redux/auth/actions';
import { useProfileContext } from '@/context/profileContext';
import AdminInfo from './AdminInfo';
import UpdateAdmin from './UpdateAdmin';
import PasswordModal from './PasswordModal';

const Visibility = ({ isOpen, children }) => {
  const show = isOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return <div style={{ ...show, transition: 'all 0.3s ease-in-out' }}>{children}</div>;
};

export default function Profile({ config }) {
  const dispatch = useDispatch();
  const { state } = useProfileContext();
  const { update, read } = state || { update: {}, read: {} };

  useEffect(() => {
    dispatch(info());
  }, [dispatch]);

  return (
    <div>
      <Visibility isOpen={read?.isOpen}>
        <AdminInfo config={config} />
      </Visibility>
      <Visibility isOpen={update?.isOpen}>
        <UpdateAdmin config={config} />
      </Visibility>
      <PasswordModal />
    </div>
  );
}
