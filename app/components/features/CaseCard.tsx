import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MapPin, Clock, AlertCircle } from "lucide-react"
import { Case } from "@/app/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/Card"
import { Badge } from "@/app/components/ui/Badge"
import { Button } from "@/app/components/ui/Button"
import { cn } from "@/app/lib/utils"

interface CaseCardProps {
  caseData: Case
}

export function CaseCard({ caseData }: CaseCardProps) {
  const urgencyVariant = {
    high: "urgencyHigh",
    medium: "urgencyMedium",
    low: "urgencyLow",
  } as const

  const statusColors = {
    reported: "bg-gray-500",
    rescued: "bg-blue-500",
    at_vet: "bg-purple-500",
    surgery: "bg-red-500",
    at_foster: "bg-orange-500",
    adoption_talks: "bg-yellow-500",
    adopted: "bg-green-500",
  }

  const statusLabel = caseData.status.replace(/_/g, " ").toUpperCase()

  return (
    <Card className="overflow-hidden card-hover h-full flex flex-col">
      <div className="relative aspect-video bg-gray-200">
        {caseData.photos[0] ? (
          <img 
            src={caseData.photos[0].thumbnail_url || caseData.photos[0].url} 
            alt={caseData.species}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Photo
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={urgencyVariant[caseData.urgency]}>
            {caseData.urgency.toUpperCase()}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight">
              {caseData.species} <span className="text-gray-400 text-sm font-normal">#{caseData.id.slice(0, 6)}</span>
            </h3>
            <div className="flex items-center mt-1 space-x-2">
               <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                 {statusLabel}
               </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <div className="space-y-2 text-sm text-gray-600 mt-2">
          <div className="flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            <span className="truncate">{caseData.location_found}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            <span>Updated {formatDistanceToNow(new Date(caseData.updated_at), { addSuffix: true })}</span>
          </div>
          <p className="line-clamp-2 mt-3 text-gray-500">
            {caseData.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Link href={`/cases/${caseData.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

