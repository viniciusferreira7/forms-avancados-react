import { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
}

export function Input(props: InputProps) {
  const { register } = useFormContext()

  return (
    <input
      type="text"
      className="border border-transparent focus:border-emerald-600 shadow-sm 
      rounded h-10 bg-zinc-800 text-white px-3  outline-none"
      {...register(props.name)}
      {...props}
    />
  )
}
