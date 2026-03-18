'use client';

import { Provider } from 'react-redux';
import store from '@/redux/store';
import { AntdAppConfig } from '@/utils/antdApp';
import Localization from '@/locale/Localization';
import { AppContextProvider } from '@/context/appContext';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import { Suspense, useState, useEffect } from 'react';
import PageLoader from '@/components/PageLoader';

import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: '#3B82F6',
                colorBgBase: '#000000',
                colorBgContainer: '#000000',
              },
            }}
          >
            <PageLoader />
          </ConfigProvider>
        </Provider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: '#3B82F6',
              colorBgBase: '#000000',
              colorBgContainer: '#000000',
              colorBgElevated: '#111111',
              borderRadius: 12,
            },
          }}
        >
          <AntdApp>
            <AntdAppConfig />
            <Localization>
              <AppContextProvider>
                <BrowserRouter>
                  <Suspense fallback={<PageLoader />}>
                    {children}
                  </Suspense>
                </BrowserRouter>
              </AppContextProvider>
            </Localization>
          </AntdApp>
        </ConfigProvider>
      </Provider>
    </QueryClientProvider>
  );
}
