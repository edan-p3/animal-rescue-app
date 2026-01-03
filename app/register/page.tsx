import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Select } from "@/app/components/ui/Select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/Card"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md border-0 shadow-lg sm:border sm:shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join the community to help rescue animals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">Full Name</label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
            <Input id="email" placeholder="m@example.com" type="email" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
            <Input id="password" type="password" />
          </div>
          <div className="space-y-2">
             <label htmlFor="role" className="text-sm font-medium leading-none">I am a...</label>
             <Select 
               id="role"
               options={[
                 { label: "Rescuer", value: "rescuer" },
                 { label: "Veterinarian", value: "vet" },
                 { label: "Foster Parent", value: "foster" },
                 { label: "Adoption Coordinator", value: "coordinator" },
               ]}
             />
          </div>
          <Button className="w-full">Create Account</Button>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

