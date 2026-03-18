import '@/style/app.css';
import { Providers } from '@/lib/Providers';

export const metadata = {
  title: 'BizCollab',
  description: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
