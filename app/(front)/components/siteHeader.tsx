"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, Coffee } from "lucide-react";

const menuItems = [
  { title: "Home", href: "/", active: true },
  { title: "About Us", href: "/" },
  { title: "Catalog", href: "/" },
  { title: "For Clients", href: "/", hasDropdown: true },
  { title: "Blog", href: "/" },
];

export default function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed  top-0 z-50 w-full bg- --primary backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}

        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">CMS</span>
          </div>
          <div>
            <h1 className=" font-bold text-white">Coffee Export</h1>
            <p className="text-xs text-white/80">Management System</p>
          </div>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-8">
            {menuItems.map((item) => (
              <li key={item.title} className="relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {item.title}
                  {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </Link>
                {item.active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/login" passHref>
            <Button
              asChild
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <span>Login</span>
            </Button>
          </Link>

          <Link href="/" passHref>
            <Button
              asChild
              className="bg-[#F5E6D3] hover:bg-[#F5E6D3]/90 text-[#5C3D2E] font-medium px-6"
            >
              <span>Sign Up</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-[#5C3D2E]">
            <nav className="flex flex-col h-full pt-8">
              <ul className="flex-1 space-y-6">
                {menuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 text-lg font-medium text-white/80 hover:text-white transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                      {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 pt-6 space-y-3">
                <Link href="/login" passHref>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    <span>Login</span>
                  </Button>
                </Link>
                <Button
                  className="w-full bg-[#F5E6D3] hover:bg-[#F5E6D3]/90 text-[#5C3D2E]"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
