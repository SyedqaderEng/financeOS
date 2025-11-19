import Link from 'next/link'
import { Twitter, Facebook, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30 mt-auto">
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
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
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
                <Link href="/#features" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
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
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
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
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] inline-block">
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
              <span>🔒</span> Encrypted & Secure
            </span>
            <span className="flex items-center gap-1">
              <span>✓</span> Powered by Plaid
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
