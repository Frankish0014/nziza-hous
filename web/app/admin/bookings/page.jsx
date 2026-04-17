import ProtectedRoute from '@/components/ProtectedRoute';
import AdminBookingsPage from '@/page-components/AdminBookingsPage';

export default function Page() {
  return (
    <ProtectedRoute adminOnly>
      <AdminBookingsPage />
    </ProtectedRoute>
  );
}
