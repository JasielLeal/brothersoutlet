'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Marquee from 'react-fast-marquee'
import { ChevronRight, ChevronDown, Smartphone } from 'lucide-react'
import { useFeaturedProducts } from '@/features/products/hooks/useProducts'
import { ProductCard } from '@/features/products/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

/* ─── static data ──────────────────────────────────────── */

const dealFilters = ['Todos', 'Feminino', 'Masculino', 'Casual', 'Esportivo', 'outros']

const deals = [
  {
    id: 1,
    label: 'Look do Dia',
    name: 'Coleção Primavera',
    discount: 40,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
  },
  {
    id: 2,
    label: 'Street Style',
    name: 'Moda Urbana',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  },
  {
    id: 3,
    label: 'Casual Chic',
    name: 'Look Minimalista',
    discount: 17,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  },
]

const categories = [
  {
    name: 'Camisetas',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80',
    count: '2.3k+',
  },
  {
    name: 'Calças',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80',
    count: '1.8k+',
  },
  {
    name: 'Vestidos',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80',
    count: '3.1k+',
  },
  {
    name: 'Calçados',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
    count: '1.5k+',
  },
  {
    name: 'Jaquetas',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80',
    count: '900+',
  },
  {
    name: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=300&q=80',
    count: '2k+',
  },
]

const brands = [
  {
    name: 'Nike',
    svg: 'M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z',
  },
  {
    name: 'adidas',
    svg: 'm24 19.535-8.697-15.07-4.659 2.687 7.145 12.383Zm-8.287 0L9.969 9.59 5.31 12.277l4.192 7.258ZM4.658 14.723l2.776 4.812H1.223L0 17.41Z',
  },
  {
    name: 'Puma',
    svg: 'M23.845 3.008c-.417-.533-1.146-.106-1.467.08-2.284 1.346-2.621 3.716-3.417 5.077-.626 1.09-1.652 1.89-2.58 1.952-.686.049-1.43-.084-2.168-.405-1.807-.781-2.78-1.792-3.017-1.97-.487-.37-4.23-4.015-7.28-4.164 0 0-.372-.75-.465-.763-.222-.025-.45.451-.616.501-.15.053-.413-.512-.565-.487-.153.02-.302.586-.6.877-.22.213-.486.2-.637.463-.052.096-.034.265-.093.42-.127.32-.551.354-.555.697 0 .381.357.454.669.72.248.212.265.362.554.461.258.088.632-.187.964-.088.277.081.543.14.602.423.054.256 0 .658-.34.613-.112-.015-.598-.174-1.198-.11-.725.077-1.553.309-1.634 1.11-.041.447.514.97 1.055.866.371-.071.196-.506.399-.716.267-.27 1.772.944 3.172.944.593 0 1.031-.15 1.467-.605.04-.029.093-.102.155-.11a.632.632 0 01.195.088c1.131.897 1.984 2.7 6.13 2.721.582.007 1.25.279 1.796.777.48.433.764 1.125 1.037 1.825.418 1.053 1.161 2.069 2.292 3.203.06.068.99.78 1.06.833.012.01.084.167.053.255-.02.69-.123 2.67 1.365 2.753.366.02.275-.231.275-.41-.005-.341-.065-.685.113-1.04.253-.478-.526-.709-.509-1.756.019-.784-.645-.651-.984-1.25-.19-.343-.368-.532-.35-.946.073-2.38-.517-3.948-.805-4.327-.227-.294-.423-.403-.207-.54 1.24-.815 1.525-1.574 1.525-1.574.66-1.541 1.256-2.945 2.075-3.57.166-.12.589-.44.852-.56.763-.362 1.173-.578 1.388-.788.356-.337.635-1.053.294-1.48z',
  },
  {
    name: 'Zara',
    svg: 'M8.562 7l.002.006 2.794 7.621v-7.23h-1.15v-.07h3.96c1.903 0 3.231.976 3.231 2.375 0 1.02-.91 1.868-2.263 2.109l-.249.031.25.026c.821.094 1.473.346 1.935.75l.003.003L19.141 7h.07l.002.006 3.556 9.698H24v.07h-3.918v-.07h1.154l-1.17-3.189h-2.373v.002l.013.037c.094.281.142.576.139.873v1.196c0 .615.271 1.238.79 1.238.304 0 .547-.107.837-.372l.041.038c-.314.332-.695.473-1.266.473-.43 0-.8-.104-1.096-.308l-.056-.04c-.39-.296-.644-.778-.753-1.435l-.018-.106-.018-.16-.002-.028-.654 1.78h.928v.07h-1.942v-.07h.938l.718-1.954v-.005a6.35 6.35 0 01-.013-.346v-.854c0-1.049-.78-1.65-2.14-1.65h-1.337v4.81h1.158v.07H9.433v-.07h1.154l-1.17-3.189H6.172l-1.158 3.154.048-.008c1.521-.262 2.22-1.423 2.23-2.645h.07v2.758H0l5.465-9.377H3.268c-1.822 0-2.646 1.407-2.659 2.81H.54v-2.88h6.634l-.04.07-5.425 9.307h2.854c.071 0 .141-.003.212-.009l.072-.006.09-.01L8.491 7h.07zm9.883 2.095l-1.313 3.576.007.007.067.066c.193.197.347.43.452.684l.007.017h2.375l-1.595-4.35zm-10.648 0l-1.599 4.35h3.194l-1.595-4.35zm6.026-1.698h-1.02v4.427h1.336c1.353 0 1.767-.493 1.767-2.107 0-1.517-.72-2.32-2.083-2.32z',
  },
  {
    name: 'Under Armour',
    svg: 'M15.954 12c-.089.066-.195.142-.324.233-.826.585-2.023.985-3.58.985h-.104c-1.556 0-2.755-.4-3.58-.985A36.43 36.43 0 018.042 12c.09-.067.196-.143.324-.234.825-.584 2.024-.985 3.58-.985h.104c1.557 0 2.756.401 3.58.985.129.09.235.167.325.234M24 7.181s-.709-.541-2.95-1.365c-1.968-.721-3.452-.883-3.452-.883l.006 4.243c0 .598-.162 1.143-.618 1.765-1.672-.61-3.254-.985-4.981-.985-1.728 0-3.308.375-4.98.985-.457-.619-.62-1.168-.62-1.765l.007-4.243s-1.494.16-3.463.883C.709 6.642 0 7.181 0 7.181c.093 1.926 1.78 3.638 4.435 4.82C1.777 13.18.09 14.887 0 16.818c0 0 .709.54 2.949 1.365 1.968.721 3.453.883 3.453.883l-.007-4.244c0-.597.164-1.143.619-1.764 1.672.61 3.252.983 4.98.983 1.727 0 3.309-.374 4.98-.983.457.62.62 1.167.62 1.764l-.006 4.244s1.484-.16 3.452-.883c2.241-.826 2.95-1.365 2.95-1.365-.093-1.927-1.78-3.64-4.435-4.819 2.657-1.182 4.343-2.888 4.435-4.82',
  },
]

const faqs = [
  {
    q: 'Como funciona a Brothers Outlet?',
    a: 'A Brothers Outlet simplifica sua experiência de compra. Navegue pelo catálogo, escolha suas peças favoritas e finalize o pedido. Sua moda chega na velocidade que você merece.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos cartão de crédito, PIX e boleto bancário. Todas as transações são seguras e criptografadas.',
  },
  {
    q: 'Posso acompanhar meu pedido em tempo real?',
    a: 'Sim! Você pode acompanhar o status do seu pedido em tempo real pela nossa plataforma, desde a separação até a entrega na sua porta.',
  },
  {
    q: 'Há promoções ou descontos especiais?',
    a: 'Sim! Temos promoções exclusivas para clientes cadastrados, além de descontos sazonais de até 40% em coleções selecionadas.',
  },
  {
    q: 'A Brothers Outlet está disponível na minha cidade?',
    a: 'Estamos expandindo rapidamente. Consulte as áreas de entrega disponíveis ao inserir seu CEP no campo de busca.',
  },
]

const stats = [
  { value: '546+', label: 'Entregadores Cadastrados' },
  { value: '789.900+', label: 'Pedidos Entregues' },
  { value: '690+', label: 'Marcas Parceiras' },
  { value: '17.457+', label: 'Peças Disponíveis' },
]

/* ─── component ────────────────────────────────────────── */

export default function HomePage() {
  const [activeDeal, setActiveDeal] = useState('Todos')
  const [currentDeal, setCurrentDeal] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { data: featuredProducts, isLoading } = useFeaturedProducts()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % deals.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full">
      {/* ═══ HERO ════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Image
          src="/background.png"
          alt="Hero"
          width={1920}
          height={600}
          className="h-auto max-h-96 w-full rounded-2xl object-cover object-top"
          priority
        />
      </section>

      {/* ═══ DEALS ═══════════════════════════════════════════ */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Ofertas exclusivas</h2>
            <div className="hidden flex-wrap gap-2 sm:flex">
              {dealFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveDeal(f)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    activeDeal === f
                      ? 'border-[#1565a0] bg-[#1565a0] text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[#1565a0]/60'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ── Mobile: carousel ── */}
          <div className="relative overflow-hidden rounded-2xl sm:hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentDeal * 100}%)` }}
            >
              {deals.map((deal) => (
                <Link key={deal.id} href="/" className="relative w-full shrink-0">
                  <div className="relative aspect-[4/3]">
                    <Image src={deal.image} alt={deal.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>
                  <span className="absolute top-3 left-3 rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    -{deal.discount}%
                  </span>
                  <div className="absolute right-3 bottom-3 left-3">
                    <p className="text-xs font-medium text-white/70">{deal.label}</p>
                    <p className="text-sm font-bold text-white">{deal.name}</p>
                  </div>
                </Link>
              ))}
            </div>
            {/* Dots */}
            <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
              {deals.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentDeal(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentDeal ? 'h-2 w-6 bg-white' : 'h-2 w-2 bg-white/50'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            {/* Arrows */}
            <button
              onClick={() => setCurrentDeal((prev) => (prev - 1 + deals.length) % deals.length)}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/50"
              aria-label="Anterior"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              onClick={() => setCurrentDeal((prev) => (prev + 1) % deals.length)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/50"
              aria-label="Próximo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* ── Desktop: grid ── */}
          <div className="hidden grid-cols-3 gap-4 sm:grid">
            {deals.map((deal) => (
              <Link key={deal.id} href="/" className="group relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
                <span className="absolute top-3 left-3 rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  -{deal.discount}%
                </span>
                <div className="absolute right-3 bottom-3 left-3">
                  <p className="text-xs font-medium text-white/70">{deal.label}</p>
                  <p className="text-sm font-bold text-white">{deal.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ══════════════════════════════════════ */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Populares</h2>
            <Link href={'/'} className="text-sm font-medium text-[#1565a0] hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/?category=${encodeURIComponent(cat.name.toLowerCase())}`}
                className="group flex flex-col gap-2"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-400">{cat.count} peças</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══════════════════════════════ */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Produtos em Destaque</h2>
            <Link
              href="/"
              className="flex items-center gap-1 text-sm font-medium text-[#1565a0] hover:underline"
            >
              Ver todos <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ BRANDS ══════════════════════════════════════════ */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-xl font-bold">Marcas Populares</h2>
          <Marquee gradient gradientColor="#fff" speed={50} pauseOnHover>
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href="/"
                className="mx-24 flex flex-col items-center gap-2 opacity-50 transition-opacity hover:opacity-100"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 shrink-0 fill-gray-800"
                  aria-label={brand.name}
                >
                  <path d={brand.svg} />
                </svg>
                <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                  {brand.name}
                </span>
              </Link>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ═══ CTA BANNER ══════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="group relative overflow-hidden rounded-3xl bg-gray-900">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
            alt="Compre na Forget"
            fill
            className="object-cover opacity-40 transition-opacity duration-500 group-hover:opacity-30"
          />
          <div className="relative z-10 flex flex-col items-center justify-center px-8 py-20 text-center">
            <p className="mb-3 text-xs font-bold tracking-widest text-[#1565a0] uppercase">
              Nova coleção disponível
            </p>
            <h2 className="mb-4 text-4xl leading-tight font-extrabold text-white sm:text-5xl">
              Vista o que você é.
              <br />
              Compre na Brothers Outlet.
            </h2>
            <p className="mb-8 max-w-md text-sm text-white/70">
              Moda que combina com você — explore milhares de peças com entrega rápida e os melhores
              preços.
            </p>
            <Link
              href="/"
              className="rounded-full bg-[#1565a0] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Explorar coleção
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT / FAQ ═════════════════════════════════════ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes</h2>
            <p className="mt-2 text-sm text-gray-500">
              Tudo que você precisa saber sobre a Brothers Outlet.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {faqs.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold text-gray-900"
                >
                  {item.q}
                  <ChevronDown
                    className={`ml-4 h-4 w-4 shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="pb-5 text-sm leading-relaxed text-gray-500">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ════════════════════════════════════════════ */}
      <section className="bg-[#1565a0] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
