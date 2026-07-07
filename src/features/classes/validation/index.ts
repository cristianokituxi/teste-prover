import { z } from "zod";

export const shiftSchema = z.enum(["Morning", "Afternoon", "Night"], {
  errorMap: () => ({ message: "Selecione um turno válido (Manhã, Tarde ou Noite)." }),
});

export const classSchema = z.object({
  name: z
    .string()
    .min(1, "O nome da turma é obrigatório.")
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(80, "O nome deve ter no máximo 80 caracteres.")
    .trim(),
  shift: shiftSchema,
  year: z
    .number({
      required_error: "O ano letivo é obrigatório.",
      invalid_type_error: "Ano letivo inválido.",
    })
    .int("O ano letivo deve ser um número inteiro.")
    .min(2000, "O ano letivo deve ser a partir de 2000.")
    .max(2100, "O ano letivo deve ser até 2100."),
});

export type ClassFormData = z.infer<typeof classSchema>;
