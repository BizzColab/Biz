'use client';

import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import AuthRouter from '@/router/AuthRouter';
import ErpApp from '@/apps/ErpApp';

export default function CatchAllPage() {
  const { isLoggedIn } = useSelector(selectAuth);

  if (!isLoggedIn) {
    return <AuthRouter />;
  }

  return <ErpApp />;
}
