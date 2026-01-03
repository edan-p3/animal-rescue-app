import { CaseStatus } from "@/app/lib/types"
import { cn } from "@/app/lib/utils"
import { Check } from "lucide-react"

interface StatusTimelineProps {
  currentStatus: CaseStatus
}

export function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const steps: { status: CaseStatus; label: string }[] = [
    { status: "reported", label: "Reported" },
    { status: "rescued", label: "Rescued" },
    { status: "at_vet", label: "At Vet" },
    { status: "surgery", label: "Surgery" }, // Optional in flow, but assuming linear for now based on prompt or handled as branch
    { status: "at_foster", label: "Foster" },
    { status: "adoption_talks", label: "Talks" },
    { status: "adopted", label: "Adopted" },
  ]
  
  // Find index of current status
  const currentIndex = steps.findIndex(s => s.status === currentStatus)

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="min-w-[600px] flex items-center justify-between relative">
        {/* Connector Line */}
        <div className="absolute left-0 top-3.5 h-0.5 w-full bg-gray-200 -z-10" />
        
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <div key={step.status} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors bg-white",
                  isCompleted ? "bg-primary border-primary text-white" : 
                  isCurrent ? "border-primary text-primary" : "border-gray-300 text-gray-300"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <div className={cn("h-2.5 w-2.5 rounded-full", isCurrent ? "bg-primary" : "bg-transparent")} />}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isCurrent ? "text-primary" : "text-gray-500"
              )}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

