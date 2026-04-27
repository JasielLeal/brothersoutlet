export type BoletoStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

export type Boleto = {
  id: string
  code: string // linha digitável
  supplierName: string
  description: string
  amount: number
  dueDate: string
  paidAt?: string
  status: BoletoStatus
  createdAt: string
}

let _id = 13
function uid() {
  return String(_id++)
}

export const mockBoletos: Boleto[] = [
  {
    id: '1',
    code: '34191.09008 63521.350002 21826.790004 1 98230000012990',
    supplierName: 'TextilBR Indústria e Comércio',
    description: 'Pedido #4821 — camisetas oversized',
    amount: 12990,
    dueDate: '2026-05-10T00:00:00Z',
    status: 'pending',
    createdAt: '2026-04-20T00:00:00Z',
  },
  {
    id: '2',
    code: '34191.09008 63521.350002 21826.790004 1 98230000008500',
    supplierName: 'Moda Sul Confecções',
    description: 'Pedido #4790 — calças slim',
    amount: 8500,
    dueDate: '2026-04-25T00:00:00Z',
    paidAt: '2026-04-24T10:30:00Z',
    status: 'paid',
    createdAt: '2026-04-10T00:00:00Z',
  },
  {
    id: '3',
    code: '34191.09008 63521.350002 21826.790004 1 98230000015600',
    supplierName: 'Calçados Nordeste LTDA',
    description: 'Reposição de estoque — linha casual',
    amount: 15600,
    dueDate: '2026-04-20T00:00:00Z',
    status: 'overdue',
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: '4',
    code: '34191.09008 63521.350002 21826.790004 1 98230000022300',
    supplierName: 'Fashion Import Co.',
    description: 'Importação coleção verão 2026',
    amount: 22300,
    dueDate: '2026-05-15T00:00:00Z',
    status: 'pending',
    createdAt: '2026-04-22T00:00:00Z',
  },
  {
    id: '5',
    code: '34191.09008 63521.350002 21826.790004 1 98230000006750',
    supplierName: 'SportWear Solutions',
    description: 'Kit uniformes esportivos',
    amount: 6750,
    dueDate: '2026-04-15T00:00:00Z',
    paidAt: '2026-04-14T09:00:00Z',
    status: 'paid',
    createdAt: '2026-03-30T00:00:00Z',
  },
  {
    id: '6',
    code: '34191.09008 63521.350002 21826.790004 1 98230000031000',
    supplierName: 'InvernoCerto Jaquetas',
    description: 'Coleção inverno — pré-venda',
    amount: 31000,
    dueDate: '2026-05-20T00:00:00Z',
    status: 'pending',
    createdAt: '2026-04-25T00:00:00Z',
  },
  {
    id: '7',
    code: '34191.09008 63521.350002 21826.790004 1 98230000009800',
    supplierName: 'Acessórios Finos SP',
    description: 'Bolsas e cintos coleção atual',
    amount: 9800,
    dueDate: '2026-04-10T00:00:00Z',
    status: 'overdue',
    createdAt: '2026-03-25T00:00:00Z',
  },
  {
    id: '8',
    code: '34191.09008 63521.350002 21826.790004 1 98230000004200',
    supplierName: 'Top Line Malhas',
    description: 'Camisetas básicas — lote 3',
    amount: 4200,
    dueDate: '2026-04-05T00:00:00Z',
    status: 'cancelled',
    createdAt: '2026-03-20T00:00:00Z',
  },
  {
    id: '9',
    code: '34191.09008 63521.350002 21826.790004 1 98230000017400',
    supplierName: 'Couro & Cia Distribuidora',
    description: 'Calçados couro legítimo — lote 2',
    amount: 17400,
    dueDate: '2026-05-05T00:00:00Z',
    status: 'pending',
    createdAt: '2026-04-18T00:00:00Z',
  },
  {
    id: '10',
    code: '34191.09008 63521.350002 21826.790004 1 98230000011100',
    supplierName: 'Estilo Urbano Importações',
    description: 'Streetwear — remessa abril',
    amount: 11100,
    dueDate: '2026-04-28T00:00:00Z',
    paidAt: '2026-04-27T14:00:00Z',
    status: 'paid',
    createdAt: '2026-04-12T00:00:00Z',
  },
  {
    id: '11',
    code: '34191.09008 63521.350002 21826.790004 1 98230000007350',
    supplierName: 'BolsaMax Comércio',
    description: 'Coleção bolsas primavera',
    amount: 7350,
    dueDate: '2026-04-18T00:00:00Z',
    status: 'overdue',
    createdAt: '2026-04-03T00:00:00Z',
  },
  {
    id: '12',
    code: '34191.09008 63521.350002 21826.790004 1 98230000025000',
    supplierName: 'Premium Jeans Brasil',
    description: 'Denim coleção 2026/2 — pré-pedido',
    amount: 25000,
    dueDate: '2026-06-01T00:00:00Z',
    status: 'pending',
    createdAt: '2026-04-26T00:00:00Z',
  },
]

export { uid }
