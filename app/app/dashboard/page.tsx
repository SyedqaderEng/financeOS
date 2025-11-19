import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardContentV2 } from '@/components/dashboard/dashboard-content-v2';

export default async function DashboardPage() {
  let user;

  try {
    user = await requireAuth();
  } catch {
    redirect('/login');
  }

  return <DashboardContentV2 userName={user.name} userEmail={user.email} />;
}
