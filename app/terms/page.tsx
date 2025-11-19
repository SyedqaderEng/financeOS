import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            💰 FinanceOS
          </Link>
          <Link href="/login">
            <Button variant="ghost">Back to Login</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using FinanceOS, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to these terms, please do not use
              our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily use FinanceOS for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Account</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account and password.
              You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Privacy and Data</h2>
            <p className="text-muted-foreground">
              Your use of FinanceOS is also governed by our Privacy Policy. We take your privacy
              seriously and implement industry-standard security measures to protect your financial data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Financial Data</h2>
            <p className="text-muted-foreground">
              FinanceOS provides tools for personal finance management. We do not provide financial
              advice. All financial decisions you make are your sole responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Subscription and Billing</h2>
            <p className="text-muted-foreground">
              Paid subscriptions are billed in advance on a monthly or yearly basis. You can cancel
              your subscription at any time, and it will remain active until the end of the current
              billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account and access to the service immediately, without
              prior notice, for conduct that we believe violates these Terms of Service or is harmful
              to other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of any
              material changes via email or through the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at legal@financeos.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t">
          <Link href="/privacy">
            <Button variant="link" className="px-0">
              View Privacy Policy →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
