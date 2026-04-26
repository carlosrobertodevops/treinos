import { ActivityIcon, DumbbellIcon, TimerResetIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const stats = [
  { label: 'API', value: 'Elysia', detail: 'REST em Bun' },
  { label: 'Banco', value: 'Postgres', detail: 'Drizzle ORM' },
  { label: 'UI', value: 'Next.js', detail: 'ShadCN + Tailwind' },
]

const Page = () => (
  <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10 md:py-16">
    <section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
      <div className="flex flex-col gap-6">
        <Badge className="w-fit">Bootcamp Treinos</Badge>
        <div className="flex flex-col gap-4">
          <h1 className="max-w-3xl text-5xl font-black tracking-tight text-balance md:text-7xl">
            Treinos com plano, sessao e progresso em fluxo unico.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-8">
            Arquitetura atualizada para Next.js App Router, Bun, Elysia,
            Drizzle ORM, PostgreSQL, Zod 4, Docker, ShadCN/UI e Tailwind CSS.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button>Ver dashboard</Button>
          <Button variant="outline">Abrir planos</Button>
        </div>
      </div>

      <Card className="overflow-hidden border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DumbbellIcon data-icon="inline-start" />
            Sessao do dia
          </CardTitle>
          <CardDescription>Contrato UI pronto para consumir API.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm font-medium">Upper force</p>
            <p className="text-muted-foreground text-sm">6 exercicios - 52 min</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <ActivityIcon className="mb-3" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-muted-foreground text-xs">dias ativos</p>
            </div>
            <div className="rounded-lg border p-3">
              <TimerResetIcon className="mb-3" />
              <p className="text-2xl font-bold">82%</p>
              <p className="text-muted-foreground text-xs">conclusao</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <section className="grid gap-4 md:grid-cols-3">
      {stats.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle>{item.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{item.detail}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  </main>
)

export default Page
