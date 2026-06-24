import { Badge } from '@/components/ui/badge';
import {
  FINDING_STATUS_LABELS,
  type FindingStatus,
} from '@/lib/findings-types';
import { cn } from '@/lib/utils';

const statusStyles: Record<FindingStatus, string> = {
  ABIERTO: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  EN_TRATAMIENTO: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
  ACCION_PENDIENTE: 'bg-orange-500/15 text-orange-700 border-orange-500/30',
  CERRADO: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
};

export function FindingStatusBadge({
  status,
  className,
}: {
  status: FindingStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn('font-semibold', statusStyles[status], className)}
    >
      {FINDING_STATUS_LABELS[status]}
    </Badge>
  );
}
