'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FeatureModal } from '@/components/feature-modal';
import { ChevronDown, Mail, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

// Feature details for modals
const FEATURES = {
  analytics: {
    title: 'Advanced Analytics',
    icon: '📊',
    description: 'Visualize your spending patterns, income trends, and net worth growth with interactive charts',
    benefits: [
      'Real-time spending insights and trends',
      'Interactive charts and visualizations',
      'Category-based spending breakdowns',
      'Monthly and yearly comparisons',
      'Net worth tracking over time',
      'Customizable dashboards',
    ],
    highlights: [
      'View comprehensive spending patterns across all your accounts in one place',
      'Get AI-powered insights that highlight unusual spending or saving opportunities',
      'Track your net worth growth month-over-month with detailed analytics',
      'Export custom reports for presentations or financial planning',
    ],
  },
  bankSync: {
    title: 'Bank Sync',
    icon: '💳',
    description: 'Automatically sync transactions from 10,000+ banks using secure Plaid integration',
    benefits: [
      'Support for 10,000+ financial institutions',
      'Automatic daily transaction imports',
      'Secure read-only bank connections',
      'Multi-currency support',
      'No manual data entry required',
      'Real-time balance updates',
    ],
    highlights: [
      'Connect to your bank using Plaid, the industry-leading secure bank connector',
      'Transactions are automatically imported and categorized daily',
      'Your banking passwords are never stored—only secure authentication tokens',
      'Support for checking, savings, credit cards, and investment accounts',
    ],
  },
  budgets: {
    title: 'Smart Budgets',
    icon: '🎯',
    description: 'Create flexible budgets with rollover support, alerts, and methodology templates',
    benefits: [
      'Multiple budgeting methodologies (50/30/20, zero-based, envelope)',
      'Real-time spending alerts',
      'Unused budget rollover to next month',
      'Flexible category customization',
      'Progress tracking and visual indicators',
      'Family budget sharing',
    ],
    highlights: [
      'Choose from proven budgeting methods or create custom categories',
      'Get alerts before you overspend with customizable thresholds',
      'Roll over unused budget to next month to save even more',
      'Share budgets with family members for coordinated financial planning',
    ],
  },
  goals: {
    title: 'Savings Goals',
    icon: '🎁',
    description: 'Track progress towards multiple goals with automatic contribution calculations',
    benefits: [
      'Unlimited goal tracking',
      'Automatic contribution calculations',
      'Visual progress indicators',
      'Target date tracking',
      'Multiple account allocation',
      'Goal templates and presets',
    ],
    highlights: [
      'Set multiple savings goals—emergency fund, vacation, down payment, education',
      'FinanceOS calculates exactly how much to save monthly to hit your targets',
      'Watch progress with visual indicators that motivate continued saving',
      'Automatically allocate funds or track manual contributions toward each goal',
    ],
  },
  investments: {
    title: 'Investment Tracking',
    icon: '📈',
    description: 'Monitor your portfolio, track gains/losses, and view asset allocation',
    benefits: [
      'Real-time portfolio tracking',
      'Gain/loss calculations',
      'Asset allocation visualization',
      'Performance benchmarking',
      'Dividend and interest tracking',
      'Cost basis tracking',
    ],
    highlights: [
      'Connect investment accounts and see your entire portfolio in one place',
      'Automatically calculate gains, losses, and return on investment',
      'View asset allocation across stocks, bonds, crypto, and other investments',
      'Benchmark your performance against market indices',
    ],
  },
  security: {
    title: 'Bank-Level Security',
    icon: '🔐',
    description: 'Your data is encrypted and never sold. We use industry-standard security practices',
    benefits: [
      '256-bit AES encryption',
      'SOC 2 Type II certified',
      'Two-factor authentication',
      'Read-only bank access',
      'No password storage',
      'Regular security audits',
    ],
    highlights: [
      'All data encrypted in transit (TLS) and at rest (AES-256)',
      'We never store your banking passwords—only secure API tokens',
      'Enable two-factor authentication for additional account security',
      'SOC 2 Type II certified with annual third-party security audits',
    ],
  },
};

// Testimonials data
const TESTIMONIALS = [
  {
    quote: 'FinanceOS helped me find $400/month in unnecessary subscriptions I didn\'t even know I had. I\'ve saved over $5,000 this year alone!',
    author: 'Sarah M.',
    location: 'Denver, CO',
    rating: 5,
  },
  {
    quote: 'As a small business owner, I needed to separate personal and business finances. FinanceOS makes it effortless to track both with their multi-account support.',
    author: 'James T.',
    location: 'Austin, TX',
    rating: 5,
  },
  {
    quote: 'The investment tracking feature is a game-changer. I can see my entire financial picture—not just checking accounts—all in one place.',
    author: 'Maria L.',
    location: 'New York, NY',
    rating: 5,
  },
];

// FAQ data
const FAQ_ITEMS = [
  {
    question: 'Is my financial data secure?',
    answer: 'Absolutely. FinanceOS uses bank-level 256-bit encryption and read-only access to your accounts. We never store your banking passwords, and we\'re SOC 2 Type II certified. Your data is encrypted both in transit and at rest, and we never sell your information to third parties.',
  },
  {
    question: 'How does bank sync work?',
    answer: 'We partner with Plaid, the industry leader in secure bank connections. Plaid connects to 10,000+ financial institutions in the US and Canada. Your transactions are automatically imported daily, so your data is always up to date without manual entry.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes! There are no contracts or commitments. You can cancel your subscription at any time from your account settings, and it will remain active until the end of your billing period.',
  },
  {
    question: 'What makes FinanceOS different from Mint or YNAB?',
    answer: 'Unlike Mint (discontinued), FinanceOS is actively developed with modern features and security. Compared to YNAB, we offer automatic bank sync at a lower price point, plus investment tracking and multi-currency support that YNAB doesn\'t have.',
  },
  {
    question: 'Do I need to manually enter transactions?',
    answer: 'No! FinanceOS automatically imports all transactions from connected accounts. You can manually add cash transactions if needed, but most users never have to enter anything.',
  },
  {
    question: 'Can I share my budget with my spouse/partner?',
    answer: 'Yes! The Family plan supports up to 5 users with shared budgets and accounts. Perfect for couples managing money together or families tracking their finances.',
  },
];

export default function LandingPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getFeatureData = (featureKey: string) => {
    return FEATURES[featureKey as keyof typeof FEATURES] || null;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:brightness-110 hover:scale-105">
              <span className="text-2xl font-bold">💰 FinanceOS</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
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
              Take Control of Your Money with Smart Finance Tracking
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Join 10,000+ users who save an average of $6,000 per year with FinanceOS. Track every dollar, crush your goals, and build the financial future you deserve.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start Your Free 30-Day Trial
                  <span className="text-xs">→</span>
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <p>✓ No credit card required • ✓ Cancel anytime • ✓ Bank-level security • ✓ 4.8★ rated</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container space-y-6 bg-secondary/30 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Why FinanceOS is the Smart Choice for Your Wallet
            </h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Powerful features designed for comprehensive financial management
            </p>
          </div>
          <div className="mx-auto grid gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <FeatureCard
              featureKey="analytics"
              icon="📊"
              title="Advanced Analytics"
              description="Visualize your spending patterns, income trends, and net worth growth with interactive charts"
              onClick={() => setSelectedFeature('analytics')}
            />
            <FeatureCard
              featureKey="bankSync"
              icon="💳"
              title="Bank Sync"
              description="Automatically sync transactions from 10,000+ banks using secure Plaid integration"
              onClick={() => setSelectedFeature('bankSync')}
            />
            <FeatureCard
              featureKey="budgets"
              icon="🎯"
              title="Smart Budgets"
              description="Create flexible budgets with rollover support, alerts, and methodology templates"
              onClick={() => setSelectedFeature('budgets')}
            />
            <FeatureCard
              featureKey="goals"
              icon="🎁"
              title="Savings Goals"
              description="Track progress towards multiple goals with automatic contribution calculations"
              onClick={() => setSelectedFeature('goals')}
            />
            <FeatureCard
              featureKey="investments"
              icon="📈"
              title="Investment Tracking"
              description="Monitor your portfolio, track gains/losses, and view asset allocation"
              onClick={() => setSelectedFeature('investments')}
            />
            <FeatureCard
              featureKey="security"
              icon="🔐"
              title="Bank-Level Security"
              description="Your data is encrypted and never sold. We use industry-standard security practices"
              onClick={() => setSelectedFeature('security')}
            />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Trusted by 10,000+ Users Worldwide
            </h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              See how FinanceOS is transforming financial lives
            </p>
          </div>
          <div className="mx-auto grid gap-6 md:max-w-[64rem] md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-sm italic text-muted-foreground">"{testimonial.quote}"</p>
                <div className="pt-2 border-t">
                  <p className="font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            ))}
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

        {/* CTA Section - No gap with pricing */}
        <section className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Join thousands of users who have transformed their financial lives with FinanceOS. Save money, reduce stress, and achieve your goals.
            </p>
            <Link href="/signup">
              <Button size="lg" className="mt-4">
                Start Your Free 30-Day Trial
              </Button>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-8">
            <div className="text-center space-y-4 w-full">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[85%] text-muted-foreground sm:text-lg mx-auto">
                Everything you need to know about FinanceOS
              </p>
            </div>
            <div className="w-full space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <h3 className="font-semibold text-left">{item.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 py-3 bg-secondary/30 border-t">
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-secondary/30">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">FinanceOS</h3>
              <p className="text-sm text-muted-foreground">
                Your personal finance management solution for building wealth and achieving financial freedom.
              </p>
              <div className="flex gap-3 pt-2">
                <a
                  href="https://twitter.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-muted-foreground hover:text-primary transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 FinanceOS. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span>🔒</span> Bank-Level Security
              </span>
              <span className="flex items-center gap-1">
                <span>✓</span> SOC 2 Type II Certified
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Feature Modal */}
      <FeatureModal
        isOpen={selectedFeature !== null}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature ? getFeatureData(selectedFeature) : null}
      />
    </div>
  );
}

function FeatureCard({
  featureKey,
  icon,
  title,
  description,
  onClick,
}: {
  featureKey: string;
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden rounded-lg border bg-background p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary group cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="font-bold group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="pt-2 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Click to learn more →
        </div>
      </div>
    </button>
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
      className={`relative overflow-hidden rounded-lg border p-8 transition-all duration-300 ${
        featured
          ? 'border-primary shadow-lg bg-background scale-105 md:scale-100'
          : 'bg-background hover:shadow-md'
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
