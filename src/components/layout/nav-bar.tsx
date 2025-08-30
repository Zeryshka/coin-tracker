"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SwitchTheme } from "@/components/ui/switch-theme";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/layout/logo";
import { UserMenu } from "@/components/user-menu";
import { SignInDialogButton } from "@/components/sign-in-dialog-btn";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <header className="w-full border-b bg-background h-16">
      <div className="container mx-auto flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-8">
          <Logo />
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
          {session ? <UserMenu /> : <SignInDialogButton />}
          <SwitchTheme />
        </div>
      </div>
    </header>
  );
}
