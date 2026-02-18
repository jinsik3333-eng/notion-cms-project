import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/types";

interface PricingCardProps {
  plan: PricingPlan;
}

/**
 * 가격표 카드 컴포넌트 (Molecule)
 *
 * - 플랜 이름, 가격, 기능 목록, CTA 버튼
 * - isPopular인 경우 강조 표시
 */
export function PricingCard({ plan }: PricingCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col transition-all hover:shadow-lg",
        plan.isPopular && "border-blue-500 border-2 shadow-lg"
      )}
    >
      {plan.isPopular && (
        <div className="bg-blue-500 text-white text-center text-sm font-semibold py-1">
          추천 플랜
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{plan.price.toLocaleString()}</span>
          {plan.price > 0 && <span className="text-muted-foreground ml-2">/월</span>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-6">
        {/* 기능 목록 */}
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA 버튼 */}
        <Link href="/analyze" className="mt-auto">
          <Button
            className="w-full"
            variant={plan.isPopular ? "default" : "outline"}
          >
            지금 시작하기
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
