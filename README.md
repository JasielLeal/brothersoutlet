<div align="center">
  <img src="public/logo.png" alt="Brothers Outlet" height="80" />
  <h1>Brothers Outlet — Frontend</h1>
  <p>Plataforma de e-commerce de moda moderna, rápida e responsiva.</p>

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)

</div>

---

## Visão geral

Este repositório contém o **frontend** completo da plataforma **Brothers Outlet**, desenvolvido com as tecnologias mais modernas do ecossistema React/Next.js. O projeto foi construído com foco em performance, experiência do usuário e facilidade de integração com qualquer backend ou API REST.

---

## Funcionalidades

| Área             | Recursos                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| **Loja**         | Home com hero, carrossel de ofertas, categorias, produtos em destaque, marcas parceiras, FAQ e estatísticas |
| **Produtos**     | Listagem, detalhes, galeria de imagens, badge de desconto e lista de desejos                                |
| **Carrinho**     | Adicionar/remover itens, atualização de quantidade, resumo de pedido                                        |
| **Checkout**     | Formulário validado com React Hook Form + Zod                                                               |
| **Autenticação** | Login e cadastro com gestão de estado via Zustand                                                           |
| **Admin**        | Dashboard, gestão de pedidos, produtos e usuários                                                           |
| **UI/UX**        | Layout 100% responsivo (mobile-first), carrossel automático no mobile, navbar com blur ao rolar             |

---

## Stack técnica

- **[Next.js 16](https://nextjs.org/)** — App Router, Server Components, rotas por grupos
- **[React 19](https://react.dev/)** — Última versão estável
- **[TypeScript 5](https://www.typescriptlang.org/)** — Tipagem estrita em todo o projeto
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Estilização utilitária com tema customizado
- **[TanStack Query v5](https://tanstack.com/query)** — Cache e sincronização de dados do servidor
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Estado global leve (carrinho, autenticação)
- **[React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)** — Formulários com validação em schema
- **[Radix UI](https://www.radix-ui.com/)** — Componentes acessíveis (Dialog, Select, Toast…)
- **[Lucide React](https://lucide.dev/)** — Ícones SVG consistentes
- **[react-fast-marquee](https://www.react-fast-marquee.com/)** — Carrossel de marcas suave
- **[Axios](https://axios-http.com/)** — Cliente HTTP configurável
- **ESLint + Prettier + Husky** — Qualidade de código automatizada

---

## Estrutura do projeto

```
stackcommerce-frontend/
├── app/                        # Rotas (Next.js App Router)
│   ├── (shop)/                 # Grupo: loja pública
│   │   ├── page.tsx            # Home
│   │   ├── cart/               # Carrinho
│   │   ├── checkout/           # Checkout
│   │   └── product/[id]/       # Detalhe do produto
│   ├── (auth)/                 # Login / Cadastro
│   ├── admin/                  # Painel administrativo
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   └── users/
│   ├── globals.css             # Tema global (Tailwind + fontes)
│   └── layout.tsx              # Root layout
├── src/
│   ├── components/             # Componentes compartilhados
│   │   ├── layout/             # Navbar, Footer
│   │   └── ui/                 # Primitivos (Button, Card, Skeleton…)
│   ├── features/               # Domínios de negócio
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── products/
│   ├── hooks/                  # Hooks globais reutilizáveis
│   ├── lib/                    # Configurações (axios, queryClient…)
│   ├── mock/                   # Dados mock para desenvolvimento
│   ├── schemas/                # Schemas Zod
│   ├── types/                  # Tipos TypeScript globais
│   └── utils/                  # Funções utilitárias
├── public/
│   ├── logo.png                # Logo da Brothers Outlet
│   └── background.png          # Imagem hero
└── package.json
```

---

## Como rodar localmente

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/stackcommerce-frontend.git
cd stackcommerce-frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Scripts disponíveis

| Comando          | Descrição                            |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Inicia o servidor de desenvolvimento |
| `npm run build`  | Gera o build de produção             |
| `npm run start`  | Inicia o servidor de produção        |
| `npm run lint`   | Verifica erros de lint               |
| `npm run format` | Formata o código com Prettier        |

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_API_URL=https://sua-api.com
```

---

## Design system

- **Cor primária:** `#1565a0` (azul aço)
- **Fonte:** Mona Sans / Helvetica Neue
- **Border radius:** `rounded-2xl` como padrão
- **Breakpoints:** mobile-first — `sm: 640px`, `md: 768px`, `lg: 1024px`

---

## Licença

Projeto proprietário — todos os direitos reservados © 2026 Brothers Outlet.
