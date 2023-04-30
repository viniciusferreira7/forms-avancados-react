import './styles/global.css'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from './components/Form'
import { ErrorMessage } from './components/Form/ErrorMessage'
import { PlusCircle, XCircle } from 'lucide-react'

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

// [ ] Add button remove fieldArray
// [ ] Composition pattern

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const methods = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const { handleSubmit, control } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  function addNewTech() {
    append({ title: '' })
  }

  function createUser(data: CreateUserFormData) {
    console.log(data)
  }

  return (
    <main className="h-screen bg-zinc-950 text-white flex items-center justify-center pb-4">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(createUser)}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <h2 className="text-center text-3xl font-bold tracking-widest">
            FORM
          </h2>
          <Form.Field>
            <Form.Label htmlFor="name">Nome</Form.Label>
            <Form.Input type="text" name="name" />
            <ErrorMessage field="name" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.Input type="email" name="email" />
            <ErrorMessage field="email" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="password">Senha</Form.Label>
            <Form.Input type="password" name="password" />
            <ErrorMessage field="password" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="confirmPassword">Confirmar Senha</Form.Label>
            <Form.Input type="password" name="confirmPassword" />
            <ErrorMessage field="confirmPassword" />
          </Form.Field>
          <Form.Field>
            <Form.Label>
              Tecnologias
              <button
                type="button"
                onClick={addNewTech}
                className="text-emerald-500 font-semibold text-xs flex items-center gap-1"
              >
                Adicionar nova
                <PlusCircle size={14} />
              </button>
            </Form.Label>
            <Form.ErrorMessage field="techs" />

            {fields.map((field, index) => {
              const fieldName = `techs.${index}.title`

              return (
                <Form.Field key={field.id}>
                  <div className="flex gap-2 items-center">
                    <Form.Input type={fieldName} name={fieldName} />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                  <Form.ErrorMessage field={fieldName} />
                </Form.Field>
              )
            })}
          </Form.Field>
          <button
            type="submit"
            className="bg-emerald-500 rounded font-semibold h-10 text-white hover:bg-emerald-600"
          >
            Salvar
          </button>
        </form>
      </FormProvider>
    </main>
  )
}
