import './styles/global.css'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createUserFormSchema = z
  .object({
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
      .min(6, 'A senha precisa de no mínimo 6 caracteres'),
    techs: z
      .array(
        z.object({
          title: z.string().nonempty('O titulo é obrigatório'),
          knowledge: z.coerce.number().min(1, 'Min é 1').max(100, 'max é 100'),
        }),
      )
      .min(2, 'insira pelo menos 2 tecnologias')
      .refine((techs) => {
        return techs.every(
          (tech) =>
            techs.filter((item) => item.title === tech.title).length < 2,
        )
      }, 'Só pode uma tecnologia de cada'),
  })
  .superRefine((arg, ctz) => {
    if (arg.password !== arg.confirmPassword) {
      ctz.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'As senhas são diferentes',
      })
    }
  })

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  function handleAddNewTech() {
    append({ title: '', knowledge: 0 })
  }

  function createUser(data: CreateUserFormData) {
    console.log(data)
  }

  return (
    <main className="h-screen bg-zinc-950 text-white flex items-center justify-center pb-4">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <h2 className="text-center text-3xl font-bold tracking-widest">FORM</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className="border border-transparent focus:border-emerald-600 shadow-sm 
              rounded h-10 bg-zinc-800 text-white px-3  outline-none"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            className="border border-transparent focus:border-emerald-600 shadow-sm 
              rounded h-10 bg-zinc-800 text-white px-3  outline-none"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className="border border-transparent focus:border-emerald-600 shadow-sm 
              rounded h-10 bg-zinc-800 text-white px-3  outline-none"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            className="border border-transparent focus:border-emerald-600 shadow-sm 
              rounded h-10 bg-zinc-800 text-white px-3  outline-none"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 space-y-4">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={handleAddNewTech}
              className="text-emerald-500 text-xs font-bold border border-emerald-500 p-2 
                rounded-md hover:bg-emerald-500 hover:text-white 
                hover:transition-all duration-300"
            >
              Adicionar
            </button>
          </label>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-2 items-center ">
                <div className="flex-1 flex flex-col ">
                  <label htmlFor="title">Nome</label>
                  <input
                    type="text"
                    className="w-full border border-transparent focus:border-emerald-600 shadow-sm 
                    rounded h-10 bg-zinc-800 text-white px-3  outline-none"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <p className="text-red-500 text-sm">
                      {errors.techs?.[index]?.title?.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="knowledge">Nível</label>
                  <input
                    type="number"
                    className="w-16 border border-transparent focus:border-emerald-600 shadow-sm 
                   rounded h-10 bg-zinc-800 text-white px-3  outline-none"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <p className="text-red-500 text-sm">
                      {errors.techs?.[index]?.knowledge?.message}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
          {errors.techs && (
            <p className="text-red-500 text-sm">{errors.techs?.message}</p>
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
