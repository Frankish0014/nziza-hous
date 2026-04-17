import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardPage from '@/page-components/AdminDashboardPage';

export default function Page() {
  return (
    <ProtectedRoute adminOnly>
      <AdminDashboardPage />
    </ProtectedRoute>
  );
}
