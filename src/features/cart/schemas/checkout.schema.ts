import { z } from 'zod'

export const checkoutSchema = z
  .object({
    fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    phone: z.string().min(10, 'Telefone inválido'),
    zipCode: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    deliveryType: z.enum(['delivery', 'pickup']),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'pix', 'cash']),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    changeFor: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === 'delivery') {
      if (!data.zipCode || data.zipCode.length < 8) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CEP inválido', path: ['zipCode'] })
      }
      if (!data.street || data.street.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Endereço deve ter pelo menos 5 caracteres',
          path: ['street'],
        })
      }
      if (!data.number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Número é obrigatório',
          path: ['number'],
        })
      }
      if (!data.city || data.city.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cidade é obrigatória',
          path: ['city'],
        })
      }
      if (!data.state || data.state.length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Use a sigla do estado (ex: SP)',
          path: ['state'],
        })
      }
    }
  })

export type CheckoutInput = z.infer<typeof checkoutSchema>
