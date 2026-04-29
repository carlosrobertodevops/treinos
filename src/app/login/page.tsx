import { Button } from '@/components/ui/button'

const Login = () => (
  <div className="relative mx-auto flex h-screen w-full max-w-md flex-col items-center justify-end overflow-hidden bg-black">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <img
        src="http://localhost:3845/assets/773c1692f16475d0ed3ff30b0fa02d38f936e190.png"
        alt=""
        aria-hidden
        className="size-full object-cover opacity-90"
      />
    </div>

    <div className="absolute left-1/2 top-12 z-10 -translate-x-1/2 text-4xl font-black uppercase tracking-tighter text-white">
      Fit.ai
    </div>

    <div className="relative z-10 flex w-full flex-col items-center gap-12 rounded-t-[24px] bg-primary px-5 pb-10 pt-12 text-primary-foreground">
      <div className="flex w-full flex-col items-center gap-6">
        <h1 className="text-center text-[32px] font-semibold leading-[1.05] tracking-tight text-white">
          O app que vai transformar a forma como você treina.
        </h1>

        <Button className="flex h-12 w-full max-w-[320px] items-center justify-center gap-2 rounded-full bg-white font-semibold text-black hover:bg-zinc-100">
          <svg className="size-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          Fazer login com Google
        </Button>
      </div>

      <p className="text-xs text-white/70">
        ©2026 Copyright FIT.AI. Todos os direitos reservados
      </p>
    </div>
  </div>
)

export default Login
