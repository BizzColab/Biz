import { lazy, Suspense } from 'react';

import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { AppContextProvider } from '@/context/appContext';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';
import Localization from '@/locale/Localization';
import { App } from 'antd';
import { AntdAppConfig } from '@/utils/antdApp';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => (
  <Localization>
    <AppContextProvider>
      <Suspense fallback={<PageLoader />}>
        <ErpApp />
      </Suspense>
    </AppContextProvider>
  </Localization>
);

export default function BizCollabOs() {
  const { isLoggedIn } = useSelector(selectAuth);

  console.log(
    '🚀 Welcome to BizCollab.We also offer commercial customization services? Contact us at bizcollab@gmail.com for more information.'
  );
  if (!isLoggedIn) {
    return (
      <App>
        <AntdAppConfig />
        <Localization>
          <AuthRouter />
        </Localization>
      </App>
    );
  } else {
    return (
      <App>
        <AntdAppConfig />
        <DefaultApp />
      </App>
    );
  }
}
