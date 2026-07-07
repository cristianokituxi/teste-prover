import { z } from "zod";

export const schoolSchema = z.object({
  name: z
    .string()
    .min(1, "O nome da escola é obrigatório.")
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres.")
    .trim(),
  address: z
    .string()
    .min(1, "O endereço é obrigatório.")
    .min(5, "O endereço deve ter pelo menos 5 caracteres.")
    .max(200, "O endereço deve ter no máximo 200 caracteres.")
    .trim(),
});

export type SchoolFormData = z.infer<typeof schoolSchema>;
