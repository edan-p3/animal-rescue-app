import { Input } from "@/app/components/ui/Input"
import { Select } from "@/app/components/ui/Select"
import { Search } from "lucide-react"
import { Button } from "@/app/components/ui/Button"

export function Filters() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
      <div className="relative flex-grow md:max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input placeholder="Search cases..." className="pl-9" />
      </div>
      
      <div className="grid grid-cols-2 gap-2 md:flex md:gap-4 md:items-center flex-grow">
        <Select 
          placeholder="Species"
          options={[
            { label: "All Species", value: "all" },
            { label: "Dog", value: "dog" },
            { label: "Cat", value: "cat" },
            { label: "Other", value: "other" },
          ]}
          className="w-full"
        />
        <Select 
          placeholder="Status"
          options={[
            { label: "All Statuses", value: "all" },
            { label: "Reported", value: "reported" },
            { label: "Rescued", value: "rescued" },
            { label: "At Vet", value: "at_vet" },
            { label: "Adopted", value: "adopted" },
          ]}
          className="w-full"
        />
        <Select 
          placeholder="Urgency"
          options={[
            { label: "All Urgencies", value: "all" },
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
          ]}
          className="w-full"
        />
      </div>
      
      <Button variant="outline" className="w-full md:w-auto hidden md:block">
        Clear
      </Button>
    </div>
  )
}

