import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">💰 FinanceOS</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:underline">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container flex flex-col items-center gap-6 pb-8 pt-6 md:py-12 lg:py-24">
          <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
              Master Your Money with{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                FinanceOS
              </span>
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Comprehensive personal finance management. Track expenses, manage budgets, set
              goals, and gain insights into your financial health.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start 30-Day Free Trial
                  <span className="text-xs">→</span>
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • Cancel anytime • Save $6,000/year on average
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container space-y-6 bg-secondary/30 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Everything You Need to Manage Your Finances
            </h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Powerful features designed for comprehensive financial management
            </p>
          </div>
          <div className="mx-auto grid gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <FeatureCard
              icon="📊"
              title="Advanced Analytics"
              description="Visualize your spending patterns, income trends, and net worth growth with interactive charts"
            />
            <FeatureCard
              icon="💳"
              title="Bank Sync"
              description="Automatically sync transactions from 10,000+ banks using secure Plaid integration"
            />
            <FeatureCard
              icon="🎯"
              title="Smart Budgets"
              description="Create flexible budgets with rollover support, alerts, and methodology templates"
            />
            <FeatureCard
              icon="🎁"
              title="Savings Goals"
              description="Track progress towards multiple goals with automatic contribution calculations"
            />
            <FeatureCard
              icon="📈"
              title="Investment Tracking"
              description="Monitor your portfolio, track gains/losses, and view asset allocation"
            />
            <FeatureCard
              icon="🔐"
              title="Bank-Level Security"
              description="Your data is encrypted and never sold. We use industry-standard security practices"
            />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PricingCard
              name="Basic"
              price="$79"
              period="/year"
              description="Perfect for individuals"
              features={[
                'Up to 3 bank accounts',
                'Unlimited transactions',
                'Basic budgets & goals',
                'Mobile app access',
                'Email support',
              ]}
            />
            <PricingCard
              name="Plus"
              price="$99"
              period="/year"
              description="Most popular choice"
              featured
              features={[
                'Unlimited bank accounts',
                'Advanced analytics',
                'Custom reports',
                'Investment tracking',
                'Priority support',
                'Export data',
              ]}
            />
            <PricingCard
              name="Family"
              price="$149"
              period="/year"
              description="For families & couples"
              features={[
                'Everything in Plus',
                'Up to 5 users',
                'Shared budgets',
                'Family dashboard',
                'Multi-currency support',
              ]}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Join thousands of users who have transformed their financial lives with FinanceOS
            </p>
            <Link href="/signup">
              <Button size="lg" className="mt-4">
                Start Your Free 30-Day Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 FinanceOS. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-6">
      <div className="flex flex-col gap-2">
        <div className="text-4xl">{icon}</div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  featured = false,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border p-8 ${
        featured ? 'border-primary shadow-lg' : 'bg-background'
      }`}
    >
      {featured && (
        <div className="absolute right-0 top-0 bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Popular
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href="/signup" className="mt-4">
          <Button className="w-full" variant={featured ? 'default' : 'outline'}>
            Start Free Trial
          </Button>
        </Link>
      </div>
    </div>
  );
}
