import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';

export default async function DashboardPage() {
  let user;
  
  try {
    user = await requireAuth();
  } catch {
    redirect('/login');
  }

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Welcome to FinanceOS! 🎉</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Hey {user.name}, you're successfully logged in!
          </p>
        </div>

        <div className="bg-secondary/30 border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">✅ Phase 2 Complete!</h2>
          <p className="text-muted-foreground">
            Authentication is working! Your account details:
          </p>
          <ul className="space-y-2 text-sm">
            <li>📧 <strong>Email:</strong> {user.email}</li>
            <li>👤 <strong>Name:</strong> {user.name}</li>
            <li>💼 <strong>Plan:</strong> {user.subscriptionPlan}</li>
            <li>📊 <strong>Status:</strong> {user.subscriptionStatus}</li>
          </ul>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">🚀 What's Next?</h3>
          <p className="text-muted-foreground">Phase 3 will add:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Financial accounts management</li>
            <li>Transaction tracking</li>
            <li>Budget creation</li>
            <li>Analytics dashboard</li>
          </ul>
        </div>

        <form action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}>
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
