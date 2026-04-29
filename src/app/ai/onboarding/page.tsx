'use client'

import { ArrowUp, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const welcomeMessages = [
  'Bem-vindo ao FIT.AI! 🎉',
  'O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.',
  'Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.',
  'Vamos configurar seu perfil?',
]

const AiOnboardingPage = () => {
  const router = useRouter()
  const [started, setStarted] = useState(false)

  const handleStart = () => {
    setStarted(true)
    router.push('/ai/coach')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex shrink-0 items-center border-b border-border p-5">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-primary">
            <Sparkles className="size-[18px]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-base font-semibold leading-none">Coach AI</p>
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-primary" />
              <span className="text-xs leading-none text-primary">Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-3 px-5 pt-5 pb-32">
        {welcomeMessages.map((msg, i) => (
          <div key={i} className="flex max-w-[80%] justify-start">
            <div className="rounded-xl bg-secondary px-3 py-3 text-sm leading-snug text-foreground">
              {msg}
            </div>
          </div>
        ))}

        {!started && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleStart}
              className="rounded-xl bg-primary px-3 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Começar!
            </button>
          </div>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[420px] border-t border-border bg-background p-5">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Digite sua mensagem"
            className="h-[42px] flex-1 rounded-full border-secondary bg-secondary px-4 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
          />
          <Button
            type="button"
            size="icon"
            className="size-[42px] shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ArrowUp className="size-5" />
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default AiOnboardingPage
