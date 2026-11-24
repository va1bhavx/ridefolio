"use client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { currency } from "@/lib/formatters"
export function ExpenseChart({
  categories,
}: {
  categories: { name: string; amount: number }[]
}) {
  return (
    <div className="panel mb-8 p-5">
      <h2 className="mb-3 font-medium">Where your ownership spend goes</h2>
      <div
        className="h-56"
        role="img"
        aria-label={categories
          .map((c) => `${c.name}: ${currency(c.amount)}`)
          .join(". ")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categories}
            layout="vertical"
            margin={{ left: 0, right: 20 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => currency(Number(v))}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                color: "var(--foreground)",
              }}
              cursor={{ fill: "var(--secondary)" }}
            />
            <Bar
              dataKey="amount"
              fill="var(--primary)"
              radius={[0, 3, 3, 0]}
              barSize={20}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <dl className="flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-xs">
        {categories.map((c) => (
          <div key={c.name}>
            <dt className="inline text-muted-foreground">{c.name}: </dt>
            <dd className="inline font-mono">{currency(c.amount)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
