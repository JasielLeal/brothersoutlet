'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { checkoutSchema, type CheckoutInput } from '@/features/cart/schemas/checkout.schema'
import { useCheckout } from '@/features/cart/hooks/useCheckout'
import { useCart } from '@/features/cart/hooks/useCart'
import { formatCurrency } from '@/utils/formatCurrency'

export default function CheckoutPage() {
  const { mutate: checkout, isPending, error } = useCheckout()
  const { items, total, isEmpty } = useCart()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit_card',
    },
  })

  const paymentMethod = watch('paymentMethod')

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-lg font-medium">Seu carrinho está vazio</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold">Finalizar Compra</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit((data) => checkout(data))} className="space-y-6 lg:col-span-2">
          {/* Personal Info */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">Informações Pessoais</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input id="fullName" {...register('fullName')} />
                {errors.fullName && (
                  <p className="text-destructive text-xs">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" {...register('phone')} />
                {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">Endereço de Entrega</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="zipCode">CEP</Label>
                <Input id="zipCode" placeholder="00000-000" {...register('zipCode')} />
                {errors.zipCode && (
                  <p className="text-destructive text-xs">{errors.zipCode.message}</p>
                )}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="street">Rua</Label>
                <Input id="street" {...register('street')} />
                {errors.street && (
                  <p className="text-destructive text-xs">{errors.street.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="number">Número</Label>
                <Input id="number" {...register('number')} />
                {errors.number && (
                  <p className="text-destructive text-xs">{errors.number.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="complement">Complemento</Label>
                <Input id="complement" placeholder="Apto, bloco..." {...register('complement')} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...register('city')} />
                {errors.city && <p className="text-destructive text-xs">{errors.city.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" placeholder="SP" maxLength={2} {...register('state')} />
                {errors.state && <p className="text-destructive text-xs">{errors.state.message}</p>}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">Pagamento</h2>
            <div className="grid grid-cols-3 gap-3">
              {(['credit_card', 'pix', 'boleto'] as const).map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${
                    paymentMethod === method
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    value={method}
                    {...register('paymentMethod')}
                    className="sr-only"
                  />
                  {method === 'credit_card' && 'Cartão de Crédito'}
                  {method === 'pix' && 'PIX'}
                  {method === 'boleto' && 'Boleto'}
                </label>
              ))}
            </div>

            {paymentMethod === 'credit_card' && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="cardNumber">Número do cartão</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    {...register('cardNumber')}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="cardName">Nome no cartão</Label>
                  <Input id="cardName" {...register('cardName')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cardExpiry">Validade</Label>
                  <Input id="cardExpiry" placeholder="MM/AA" {...register('cardExpiry')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input id="cardCvv" placeholder="000" maxLength={4} {...register('cardCvv')} />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
              {(error as Error).message}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? 'Processando...' : `Confirmar pedido • ${formatCurrency(total)}`}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="bg-card h-fit rounded-xl border p-6">
          <h2 className="mb-4 font-semibold">Resumo</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground flex-1 truncate">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="ml-2 font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
