import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-all hover:opacity-80 hover:scale-105 cursor-pointer group">
            <span className="text-2xl group-hover:rotate-12 transition-transform">💰</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              FinanceOS
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost">Back to Home</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">About FinanceOS</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We're on a mission to make personal finance simple, accessible, and empowering for everyone.
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              FinanceOS was born from a simple frustration: managing money shouldn't be complicated.
              Too many people feel overwhelmed by their finances, not because they don't want to save
              or budget, but because the tools available are either too complex, too expensive, or
              simply don't work.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We built FinanceOS to be different. A modern, beautiful, and powerful personal finance
              app that works the way you think about money. Whether you're paying off debt, saving
              for a dream vacation, or building wealth for retirement—FinanceOS gives you the clarity
              and control you need to succeed.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To empower 1 million people to take control of their financial future by providing the
              best personal finance management tools at an affordable price. We believe financial
              wellness should be accessible to everyone, not just the wealthy.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4">What We Value</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">🔐 Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Your financial data is yours. We use bank-level encryption, never sell your data,
                  and give you complete control over your information.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">💡 Simplicity</h3>
                <p className="text-sm text-muted-foreground">
                  Complex features hidden behind an intuitive interface. Power when you need it,
                  simplicity when you don't.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">⚡ Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We're constantly improving. New features, better insights, and smarter automation
                  to make managing money effortless.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">🤝 Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  No hidden fees, no surprises. Simple pricing, clear terms, and honest
                  communication—always.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4">By The Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">$60M+</div>
                <div className="text-sm text-muted-foreground">Tracked</div>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">$6,000</div>
                <div className="text-sm text-muted-foreground">Avg. Saved/Year</div>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4">Join Our Journey</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We're just getting started. Whether you're a user, partner, or investor—we'd love to
              have you along for the ride as we build the future of personal finance.
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
