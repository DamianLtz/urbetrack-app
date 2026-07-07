import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type Props = { data: { zoneName: string; count: number }[] };

const chartConfig = {
  count: {
    label: "Incidentes",
    color: "var(--color-primary-ut)",
  },
} satisfies ChartConfig;

export function IncidentsByZoneChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incidentes por zona</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sin datos para mostrar
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidentes por zona</CardTitle>
        <CardDescription>Cantidad de incidentes por zona</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
          <BarChart accessibilityLayer data={sortedData} layout="vertical">
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="zoneName"
              type="category"
              width={90}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={5}>
              <LabelList
                dataKey="count"
                position="insideRight"
                className="fill-white"
                offset={16}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
