// src/app/api/transactions/export/route.ts
export const dynamic = 'force-dynamic' 

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      include: {
        product: true,
        variant: true,
        reseller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Convert to CSV
    const headers = [
      'ID',
      'Tanggal',
      'Produk',
      'Varian',
      'Quantity',
      'Total Harga',
      'Reseller',
      'Customer Name',
      'Customer Phone',
      'Status',
      'Notes',
    ]

    const rows = transactions.map((t) => [
      t.id,
      new Date(t.createdAt).toLocaleString('id-ID'),
      t.product.name,
      t.variant ? `${t.variant.name}: ${t.variant.value}` : 'Standard',
      t.quantity,
      t.totalPrice.toString(),
      t.reseller?.name || 'Direct',
      t.customerName || '-',
      t.customerPhone || '-',
      t.status,
      t.notes || '-',
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transactions-${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to export transactions' },
      { status: 500 }
    )
  }
}
