'use client'

import { useProducts } from '@/features/products/hooks/useProducts'
import { useOrders } from '@/features/orders/hooks/useOrders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import { mockUsers } from '@/mock/users'

export default function DashboardPage() {
  const { data: productsData } = useProducts({ limit: 100 })
  const { data: orders } = useOrders()

  const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) ?? 0
  const totalProducts = productsData?.total ?? 0
  const totalOrders = orders?.length ?? 0
  const totalUsers = mockUsers.filter((u) => u.role === 'customer').length

  const stats = [
    {
      title: 'Receita Total',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      description: 'Todos os pedidos',
    },
    {
      title: 'Pedidos',
      value: totalOrders,
      icon: ShoppingBag,
      description: 'Total de pedidos',
    },
    {
      title: 'Produtos',
      value: totalProducts,
      icon: Package,
      description: 'Produtos cadastrados',
    },
    {
      title: 'Clientes',
      value: totalUsers,
      icon: Users,
      description: 'Clientes cadastrados',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel administrativo</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground mt-1 text-xs">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {!orders?.length ? (
            <p className="text-muted-foreground text-sm">Nenhum pedido encontrado</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-muted-foreground text-xs">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                    <span
                      className={`text-xs font-medium ${
                        order.status === 'delivered'
                          ? 'text-green-600'
                          : order.status === 'cancelled'
                            ? 'text-red-500'
                            : 'text-yellow-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
