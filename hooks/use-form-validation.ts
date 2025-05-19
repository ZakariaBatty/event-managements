'use client';

import { useState } from 'react';
import { z } from 'zod';

export function useFormValidation<T>(schema: z.ZodType<T>) {
   const [errors, setErrors] = useState<Record<string, string>>({});

   const validate = (data: unknown): data is T => {
      try {
         schema.parse(data);
         setErrors({});
         return true;
      } catch (error) {
         if (error instanceof z.ZodError) {
            const formattedErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
               const path = err.path.join('.');
               formattedErrors[path] = err.message;
            });
            setErrors(formattedErrors);
         }
         return false;
      }
   };

   const getFieldError = (field: keyof T) => {
      return errors[field as string];
   };

   return {
      errors,
      validate,
      getFieldError,
      hasErrors: Object.keys(errors).length > 0,
   };
}
