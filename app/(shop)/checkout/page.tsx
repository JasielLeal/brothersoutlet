'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Tag,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  User,
  CreditCard,
  Check,
  MapPin,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { checkoutSchema, type CheckoutInput } from '@/features/cart/schemas/checkout.schema'
import { useCheckout } from '@/features/cart/hooks/useCheckout'
import { useCart } from '@/features/cart/hooks/useCart'
import { formatCurrency } from '@/utils/formatCurrency'

const COUPONS: Record<string, number> = {
  PROMO10: 0.1,
  DESCONTO15: 0.15,
}

const STEPS = [
  { label: 'Você', icon: User },
  { label: 'Entrega', icon: MapPin },
  { label: 'Pagamento', icon: CreditCard },
]

const PAYMENT_OPTIONS = [
  { value: 'credit_card', label: '💳 Cartão de Crédito' },
  { value: 'debit_card', label: '🏦 Cartão de Débito' },
  { value: 'pix', label: '⚡ PIX' },
  { value: 'cash', label: '💵 Espécie (dinheiro)' },
] as const

export default function CheckoutPage() {
  const { mutate: checkout, isPending, error } = useCheckout()
  const { items, total, isEmpty } = useCart()

  const [step, setStep] = useState(0)
  const [needsChange, setNeedsChange] = useState<boolean | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [discountPct, setDiscountPct] = useState(0)
  const [couponError, setCouponError] = useState('')

  const discountAmount = Math.round(total * discountPct * 100) / 100
  const finalTotal = total - discountAmount

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit_card',
      deliveryType: 'delivery',
    },
  })

  const paymentMethod = watch('paymentMethod')
  const deliveryType = watch('deliveryType')

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase()
    if (COUPONS[code] !== undefined) {
      setDiscountPct(COUPONS[code])
      setCouponError('')
    } else {
      setCouponError('Cupom inválido')
    }
  }

  async function nextStep() {
    let fields: (keyof CheckoutInput)[] = []
    if (step === 0) fields = ['fullName', 'phone']
    if (step === 1) {
      fields = ['deliveryType']
      if (deliveryType === 'delivery') {
        fields = [...fields, 'zipCode', 'street', 'number', 'city', 'state']
      }
    }
    const valid = await trigger(fields)
    if (valid) setStep((s) => s + 1)
  }

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-lg font-medium">Seu carrinho está vazio</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Finalizar Compra</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Form ──────────────────────────────────── */}
        <div className="lg:col-span-2">
          {/* Step indicator */}
          <div className="mb-8 flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const done = i < step
              const current = i === step
              return (
                <div key={i} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                        done
                          ? 'border-[#1565a0] bg-[#1565a0] text-white'
                          : current
                            ? 'border-[#1565a0] bg-white text-[#1565a0]'
                            : 'border-gray-200 bg-white text-gray-300'
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span
                      className={`mt-1.5 text-[11px] font-medium ${
                        current ? 'text-[#1565a0]' : done ? 'text-gray-500' : 'text-gray-300'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`mx-2 mb-5 h-0.5 flex-1 transition-colors ${i < step ? 'bg-[#1565a0]' : 'bg-gray-200'}`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Form */}
          <form id="checkout-form" onSubmit={handleSubmit((data) => checkout(data))}>
            {/* ── Step 0: Identificação ── */}
            {step === 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-1 text-base font-bold text-gray-900">Quem está comprando?</h2>
                <p className="mb-5 text-sm text-gray-400">Só precisamos do seu nome e contato.</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input
                      id="fullName"
                      placeholder="Seu nome completo"
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" {...register('phone')} />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 1: Entrega + Endereço ── */}
            {step === 1 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-1 text-base font-bold text-gray-900">Como quer receber?</h2>
                <p className="mb-5 text-sm text-gray-400">Entrega em casa ou retirada na loja.</p>

                {/* Delivery type selector */}
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { value: 'delivery', label: 'Entrega em casa', emoji: '🚚' },
                      { value: 'pickup', label: 'Retirar na loja', emoji: '🏪' },
                    ] as const
                  ).map(({ value, label, emoji }) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                        deliveryType === value
                          ? 'border-[#1565a0] bg-blue-50/40'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={value}
                        {...register('deliveryType')}
                        className="sr-only"
                      />
                      <span className="text-xl leading-none">{emoji}</span>
                      <span className="text-sm font-semibold text-gray-800">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Address fields — só aparece se entrega */}
                {deliveryType === 'delivery' && (
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input id="zipCode" placeholder="00000-000" {...register('zipCode')} />
                      {errors.zipCode && (
                        <p className="text-xs text-red-500">{errors.zipCode.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        placeholder="Nome da rua / avenida"
                        {...register('street')}
                      />
                      {errors.street && (
                        <p className="text-xs text-red-500">{errors.street.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="number">Número</Label>
                      <Input id="number" placeholder="Ex: 123" {...register('number')} />
                      {errors.number && (
                        <p className="text-xs text-red-500">{errors.number.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        placeholder="Apto, bloco... (opcional)"
                        {...register('complement')}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" {...register('city')} />
                      {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" placeholder="SP" maxLength={2} {...register('state')} />
                      {errors.state && (
                        <p className="text-xs text-red-500">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {deliveryType === 'pickup' && (
                  <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-700">📍 Endereço da loja</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Av. Paulista, 1000 — São Paulo, SP
                      <br />
                      Seg–Sáb: 9h–20h · Dom: 10h–16h
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 2: Pagamento ── */}
            {step === 2 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-1 text-base font-bold text-gray-900">Como quer pagar?</h2>
                <p className="mb-5 text-sm text-gray-400">Escolha a forma de pagamento.</p>

                <div className="space-y-1.5">
                  <Label htmlFor="paymentMethod">Forma de pagamento</Label>
                  <select
                    id="paymentMethod"
                    {...register('paymentMethod')}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-[#1565a0] focus:ring-1 focus:ring-[#1565a0] focus:outline-none"
                  >
                    {PAYMENT_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.paymentMethod && (
                    <p className="text-xs text-red-500">{errors.paymentMethod.message}</p>
                  )}
                </div>

                {/* Card info — pagamento na entrega */}
                {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                  <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3">
                    <p className="text-sm font-semibold text-[#1565a0]">
                      {paymentMethod === 'credit_card'
                        ? '💳 Cartão de Crédito'
                        : '🏦 Cartão de Débito'}
                    </p>
                    <p className="mt-0.5 text-xs text-[#1565a0]/80">
                      A máquina será levada na hora da entrega. Nenhum dado de cartão é necessário
                      agora.
                    </p>
                  </div>
                )}

                {/* PIX */}
                {paymentMethod === 'pix' && (
                  <div className="mt-5 rounded-xl bg-green-50 px-4 py-3">
                    <p className="text-sm font-semibold text-green-700">⚡ Pagamento via PIX</p>
                    <p className="mt-0.5 text-xs text-green-600">
                      Após confirmar o pedido, o atendente enviará a chave PIX pelo WhatsApp para
                      você realizar o pagamento.
                    </p>
                  </div>
                )}

                {/* Cash */}
                {paymentMethod === 'cash' && (
                  <div className="mt-5 space-y-4">
                    <p className="text-sm font-semibold text-gray-800">Vai precisar de troco?</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          { label: 'Sim, preciso', value: true },
                          { label: 'Não, tenho o valor', value: false },
                        ] as const
                      ).map(({ label, value }) => (
                        <button
                          key={String(value)}
                          type="button"
                          onClick={() => setNeedsChange(value)}
                          className={`flex items-center justify-center rounded-xl border-2 py-3 text-sm font-medium transition-all ${
                            needsChange === value
                              ? 'border-[#1565a0] bg-blue-50/40 text-[#1565a0]'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {needsChange === true && (
                      <div className="space-y-1.5">
                        <Label htmlFor="changeFor">Troco para quanto?</Label>
                        <Input
                          id="changeFor"
                          placeholder="Ex: R$ 100,00"
                          {...register('changeFor')}
                        />
                      </div>
                    )}

                    {needsChange === false && (
                      <p className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
                        Ótimo! Nenhum troco necessário.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {(error as Error).message}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1.5 rounded-2xl border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  key="continuar"
                  type="button"
                  onClick={nextStep}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#1565a0] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-80"
                >
                  Continuar
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  key="confirmar"
                  type="submit"
                  disabled={isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1565a0] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isPending ? 'Processando...' : 'Confirmar pedido'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── Order Summary ──────────────────────────── */}
        <div className="h-fit overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="p-6">
            <h2 className="mb-5 text-base font-bold text-gray-900">Seu pedido</h2>

            {/* Items */}
            <div className="mb-5 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">{item.quantity}x</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mb-1 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5">
              <Tag className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value)
                  setCouponError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                placeholder="Código de desconto"
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="text-sm font-semibold text-[#1565a0] transition-opacity hover:opacity-70"
              >
                Aplicar
              </button>
            </div>
            {couponError && <p className="mb-3 text-xs text-red-500">{couponError}</p>}
            {discountPct > 0 && !couponError && (
              <p className="mb-3 text-xs text-green-600">✓ Cupom aplicado</p>
            )}
            {!couponError && discountPct === 0 && <div className="mb-3" />}

            {/* Price breakdown */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(total)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Desconto</span>
                  <span className="font-medium text-green-600">
                    −{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}
              <div className="my-1 h-px bg-gray-100" />
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Secure badge */}
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="mb-1 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Checkout Seguro — SSL</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              Seus dados estão protegidos durante toda a transação.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
