import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

/**
 * 후기 카드 컴포넌트 (Molecule)
 *
 * - 사용자명, 회사, 직급, 별점, 후기 내용
 * - isVerified인 경우 검증 배지 표시
 */
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6 space-y-4">
        {/* 별점 */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < testimonial.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          ))}
          <span className="text-sm font-semibold ml-2">{testimonial.rating}.0</span>
        </div>

        {/* 후기 내용 */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          &quot;{testimonial.content}&quot;
        </p>

        {/* 작성자 정보 */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm font-semibold">{testimonial.author}</p>
            <p className="text-xs text-muted-foreground">
              {testimonial.jobRole}
              {testimonial.company && ` · ${testimonial.company}`}
            </p>
          </div>

          {/* 검증 배지 */}
          {testimonial.isVerified && (
            <Badge variant="secondary" className="text-xs">
              검증됨
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
