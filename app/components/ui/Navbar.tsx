import Link from "next/link"
import { Button } from "./Button"
import { Heart } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold text-gray-dark tracking-tight hidden sm:inline-block">
            RescuePlatform
          </span>
          <span className="text-xl font-bold text-gray-dark tracking-tight sm:hidden">
            Rescue
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

