import { Filters } from "@/app/components/features/Filters"
import { CaseCard } from "@/app/components/features/CaseCard"
import { ActivityFeed } from "@/app/components/features/ActivityFeed"
import { Button } from "@/app/components/ui/Button"
import { MOCK_CASES } from "@/app/lib/mock-data"
import { Heart, Activity, Home as HomeIcon, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Cases", value: "12", icon: Activity, color: "text-blue-500" },
          { label: "Rescued (Month)", value: "34", icon: Heart, color: "text-red-500" },
          { label: "In Foster", value: "8", icon: HomeIcon, color: "text-orange-500" },
          { label: "Adopted (Month)", value: "15", icon: CheckCircle, color: "text-green-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-gray-50 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-6">
          <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold text-gray-900">Active Cases</h1>
             <Button className="md:hidden">Filter</Button>
          </div>
          
          <div className="hidden md:block">
            <Filters />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CASES.map((caseData) => (
              <CaseCard key={caseData.id} caseData={caseData} />
            ))}
          </div>
          
          {MOCK_CASES.length === 0 && (
             <div className="text-center py-12">
               <p className="text-gray-500 text-lg">No active cases at the moment 🎉</p>
             </div>
          )}
        </div>

        <aside className="w-full lg:w-80 hidden lg:block">
           <ActivityFeed />
        </aside>
      </div>
    </div>
  )
}
