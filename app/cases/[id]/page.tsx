import { notFound } from "next/navigation"
import { MOCK_CASES } from "@/app/lib/mock-data"
import { Badge } from "@/app/components/ui/Badge"
import { Button } from "@/app/components/ui/Button"
import { StatusTimeline } from "@/app/components/features/StatusTimeline"
import { MapPin, Calendar, Activity, Share2 } from "lucide-react"
import { format } from "date-fns"

// Helper to simulate data fetching
async function getCase(id: string) {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 100))
  return MOCK_CASES.find(c => c.id === id)
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const caseData = await getCase(id)

  if (!caseData) {
    notFound()
  }

  const urgencyVariant = {
    high: "urgencyHigh",
    medium: "urgencyMedium",
    low: "urgencyLow",
  } as const

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video md:aspect-[21/9] mb-8 group">
         {caseData.photos[0] ? (
            <img 
              src={caseData.photos[0].url} 
              alt={caseData.species} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No Photo Available</div>
         )}
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
         
         <div className="absolute top-4 right-4">
            <Badge variant={urgencyVariant[caseData.urgency]} className="text-sm px-3 py-1">
              {caseData.urgency.toUpperCase()} URGENCY
            </Badge>
         </div>

         <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{caseData.species} <span className="opacity-70 text-2xl">#{caseData.id}</span></h1>
            <div className="flex items-center text-gray-200 gap-4 text-sm md:text-base">
              <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {caseData.location_current}</span>
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Found: {caseData.date_rescued ? format(new Date(caseData.date_rescued), 'MMM d, yyyy') : 'Unknown'}</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Status Timeline */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Rescue Journey</h2>
            <StatusTimeline currentStatus={caseData.status} />
          </section>

          {/* About */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
             <div>
               <h3 className="text-lg font-semibold mb-2">Description</h3>
               <p className="text-gray-700 leading-relaxed">{caseData.description}</p>
             </div>
             
             {caseData.medical_notes && (
               <div>
                 <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center"><Activity className="h-4 w-4 mr-2 text-primary" /> Medical Notes</h3>
                 <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                   {caseData.medical_notes}
                 </p>
               </div>
             )}
          </section>

           {/* Activity Log Placeholder */}
           <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
             <div className="space-y-4">
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">MR</div>
                 <div>
                   <p className="text-sm font-medium">Maria Rodriguez <span className="text-gray-500 font-normal">updated status to</span> At Vet</p>
                   <p className="text-xs text-gray-400">2 hours ago</p>
                 </div>
               </div>
               {/* More items would go here */}
             </div>
           </section>
        </div>

        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
            <h3 className="text-xl font-bold mb-4">Interested in helping?</h3>
            <p className="text-gray-600 mb-6 text-sm">You can help by adopting, fostering, or donating to this case.</p>
            
            <div className="space-y-3">
              <Button className="w-full text-lg h-12">I Want to Adopt</Button>
              <Button variant="outline" className="w-full">Become a Foster</Button>
              <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-gray-500">
                <Share2 className="h-4 w-4" /> Share Case
              </Button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-semibold mb-4 text-gray-900">Case Details</h4>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className="font-medium capitalize">{caseData.status.replace(/_/g, ' ')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Species</dt>
                <dd className="font-medium">{caseData.species}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Rescuer</dt>
                <dd className="font-medium">{caseData.primary_owner.name}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

