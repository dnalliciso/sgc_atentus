"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe } from "lucide-react";
import type { UserAccount } from "@/lib/users-store";

interface CountryDistributionProps {
  users: UserAccount[];
}

export function CountryDistribution({ users }: CountryDistributionProps) {
  const data = useMemo(() => {
    const countryCount: Record<string, number> = {};
    users.forEach((user) => {
      countryCount[user.pais] = (countryCount[user.pais] || 0) + 1;
    });

    const total = users.length;
    return Object.entries(countryCount)
      .map(([country, count]) => ({
        country,
        count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [users]);

  const countryFlags: Record<string, string> = {
    Chile: "CL",
    Argentina: "AR",
    Perú: "PE",
    Colombia: "CO",
    México: "MX",
    Brasil: "BR",
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Distribución por País
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.country} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {countryFlags[item.country]
                      ? String.fromCodePoint(
                          ...countryFlags[item.country]
                            .split("")
                            .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
                        )
                      : "🌍"}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {item.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {item.count} cuentas
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
