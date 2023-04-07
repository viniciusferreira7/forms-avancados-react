import './styles/global.css'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracteres'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  function createUser(data: any) {
    console.log(data)
  }

  return (
    <main className="h-screen bg-zinc-950 text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <h2 className="text-center text-3xl font-bold tracking-widest">FORM</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input
            type="text"
            className="border border-zinc-200 shadow-sm rounded h-10 bg-zinc-800 text-white px-3"
            {...register('email')}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input
            type="password"
            className="border border-zinc-200 shadow-sm rounded h-10 bg-zinc-800 text-white px-3"
            {...register('password')}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold h-10 text-white hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>
    </main>
  )
}
