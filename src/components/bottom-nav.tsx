import { BarChart2, Calendar, Home, Sparkles, User } from 'lucide-react'
import Link from 'next/link'

type NavKey = 'home' | 'plans' | 'ai' | 'evolution' | 'profile'

interface BottomNavProps {
  active?: NavKey
}

export const BottomNav = ({ active }: BottomNavProps) => {
  const isActive = (key: NavKey) =>
    active === key ? 'text-foreground' : 'text-muted-foreground'

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[420px] items-center justify-between rounded-t-3xl border-t border-border bg-background px-6 py-4">
      <Link href="/home" className={`p-2 ${isActive('home')}`} aria-label="Home">
        <Home className="size-6" />
      </Link>
      <Link
        href="/workout-plans"
        className={`p-2 ${isActive('plans')}`}
        aria-label="Planos"
      >
        <Calendar className="size-6" />
      </Link>
      <Link
        href="/ai/coach"
        className="-mt-8 rounded-full bg-primary p-4 text-primary-foreground shadow-lg"
        aria-label="Coach AI"
      >
        <Sparkles className="size-6" fill="currentColor" />
      </Link>
      <Link
        href="/evolution"
        className={`p-2 ${isActive('evolution')}`}
        aria-label="Evolução"
      >
        <BarChart2 className="size-6" />
      </Link>
      <Link
        href="/profile"
        className={`p-2 ${isActive('profile')}`}
        aria-label="Perfil"
      >
        <User className="size-6" />
      </Link>
    </nav>
  )
}
