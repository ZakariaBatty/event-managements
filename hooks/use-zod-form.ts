import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

export function useZodForm<T extends z.ZodType<any, any>>(
   schema: T,
   defaultValues?: z.infer<T>
) {
   const form = useForm<z.infer<T>>({
      resolver: zodResolver(schema),
      defaultValues,
   });

   return {
      form,
      formState: form.formState,
      register: form.register,
      handleSubmit: form.handleSubmit,
      reset: form.reset,
      setValue: form.setValue,
      getValues: form.getValues,
      watch: form.watch,
      errors: form.formState.errors,
   };
}
