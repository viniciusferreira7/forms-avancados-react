import './styles/global.css'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('O nome é obrigatório')
    .transform((name) =>
      name
        .trim()
        .split(' ')
        .map((word) => {
          return word[0].toUpperCase().concat(word.substring(1))
        })
        .join(' '),
    ),
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .toLowerCase()
    .email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracteres'),
  confirmPassword: z
    .string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres')
    .superRefine((pass) => {
      // Task: make confirm password
    }),
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
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className="border border-transparent focus:border-emerald-600 shadow-sm rounded h-10 bg-zinc-800 text-white px-3  outline-none"
            {...register('name')}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            className="border border-transparent focus:border-emerald-600 shadow-sm rounded h-10 bg-zinc-800 text-white px-3  outline-none"
            {...register('email')}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className="border border-transparent focus:border-emerald-600 shadow-sm rounded h-10 bg-zinc-800 text-white px-3  outline-none"
            {...register('password')}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="confirmPassword"
            className="border border-transparent focus:border-emerald-600 shadow-sm rounded h-10 bg-zinc-800 text-white px-3  outline-none"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span>{errors.confirmPassword.message}</span>
          )}
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
