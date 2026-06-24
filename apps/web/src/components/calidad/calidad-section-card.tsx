import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type CalidadSectionCardProps = {
  title: string;
  description: string;
  href?: string;
  icon: LucideIcon;
  available?: boolean;
  badge?: string;
};

export function CalidadSectionCard({
  title,
  description,
  href,
  icon: Icon,
  available = true,
  badge,
}: CalidadSectionCardProps) {
  return (
    <Card
      className={cn(
        'border-sky-200/50 transition-shadow hover:shadow-md',
        !available && 'opacity-80',
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700">
            <Icon className="size-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{title}</CardTitle>
              {badge ? (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700">
                  {badge}
                </span>
              ) : null}
            </div>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {available && href ? (
          <Link href={href}>
            <Button className="bg-sky-600 hover:bg-sky-700">Ingresar</Button>
          </Link>
        ) : (
          <Button disabled>Próximamente</Button>
        )}
      </CardContent>
    </Card>
  );
}

export function CalidadFutureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="border-dashed bg-slate-50/50">
      <CardHeader>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Icon className="size-6 shrink-0" />
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
