'use client'

import { ArrowUp, Sparkles, X } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const quickActions = ['Alterar plano de treino', 'Mudar objetivo', 'Atualizar informações']

const AiCoachPage = () => (
  <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-black">
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-zinc-700/60 via-black to-black" />
      <div className="absolute left-5 top-5 text-2xl font-semibold tracking-tight text-white">
        FIT.AI
      </div>
    </div>

    <div className="relative z-10 flex h-[82vh] w-full flex-col rounded-t-3xl bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <header className="flex shrink-0 items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-[18px]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-base font-semibold leading-none text-foreground">Coach AI</p>
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-primary" />
              <span className="text-xs leading-none text-primary">Online</span>
            </div>
          </div>
        </div>
        <Link
          href="/home"
          aria-label="Fechar"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary"
        >
          <X className="size-6" />
        </Link>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        <div className="flex max-w-[85%] justify-start">
          <div className="rounded-xl bg-secondary px-3 py-3 text-sm leading-snug text-foreground">
            Olá! Sou sua IA personal. Como posso ajudar com seu treino hoje?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="rounded-xl bg-primary px-3 py-3 text-sm text-primary-foreground">
            Olá!
          </div>
        </div>
      </div>

      <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-5 pb-3">
        {quickActions.map((label) => (
          <button
            key={label}
            type="button"
            className="whitespace-nowrap rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="shrink-0 border-t border-border p-5">
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
      </div>
    </div>
  </div>
)

export default AiCoachPage
