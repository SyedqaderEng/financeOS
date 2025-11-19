import { Sidebar } from '@/components/layout/sidebar'
import { Footer } from '@/components/layout/footer'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64 transition-all duration-300 flex flex-col min-h-screen">
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
