'use client'

import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      {/* Logo */}
      <div className="text-2xl font-bold text-primary cursor-pointer" onClick={() => router.push('/')}>
        Jobotics
      </div>

      {/* Navigation Links */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink onClick={() => router.push('/dashboard/user')} className="cursor-pointer px-4 py-2">
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink onClick={() => router.push('/resumes')} className="cursor-pointer px-4 py-2">
              Resumes
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink onClick={() => router.push('/schedule')} className="cursor-pointer px-4 py-2">
              Schedule
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Profile / Sign out */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/profile')}>
          <User className="w-5 h-5 mr-2" /> Profile
        </Button>

        <Button variant="destructive" onClick={() => router.push('/auth/signout')}>
          <LogOut className="w-5 h-5 mr-2" /> Sign out
        </Button>
      </div>
    </nav>
  )
}