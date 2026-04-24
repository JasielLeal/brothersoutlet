import { z } from 'zod'

export const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  street: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  zipCode: z.string().min(8, 'CEP inválido').max(9, 'CEP inválido'),
  paymentMethod: z.enum(['credit_card', 'pix', 'boleto']),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
