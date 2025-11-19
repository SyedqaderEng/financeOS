import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default async function DashboardPage() {
  let user;

  try {
    user = await requireAuth();
  } catch {
    redirect('/login');
  }

  return <DashboardContent userName={user.name} userEmail={user.email} />;
}
