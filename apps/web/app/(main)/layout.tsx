import { MainLayout } from '@/components/layout/MainLayout';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function MainRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
