import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { SwitchTheme } from "@/components/ui/switchTheme";

export function Header() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold">
            Coin Tracker
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="px-2">
                  <Link href="/dashboard">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="px-2">
                  <Link href="/transactions">Transactions</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="px-2">
                  <Link href="/settings">Settings</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-4">
          <Button asChild variant="default">
            <Link href="/signin">Sign In</Link>
          </Button>
          <SwitchTheme />
        </div>
      </div>
    </header>
  );
}
