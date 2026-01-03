import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card"
import { CaseActivity } from "@/app/lib/types"

export function ActivityFeed() {
  // Mock activities
  const activities = [
    { id: 1, text: "Animal #101 moved to Surgery", time: "10 min ago" },
    { id: 2, text: "Cat #102 adopted ✓", time: "2 hours ago" },
    { id: 3, text: "New case reported: Injured Dog", time: "3 hours ago" },
  ]

  return (
    <Card className="h-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg">Recent Updates</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 text-sm">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{activity.text}</p>
                <p className="text-gray-500 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

