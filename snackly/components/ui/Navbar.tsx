"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { ShoppingCart, Ticket } from "lucide-react"; // Optional icons

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6 lg:px-12">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-black text-primary tracking-tighter italic hover:opacity-80 transition-opacity">
            snackly
          </span>
        </Link>

        {/* LINKS */}
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Menu
          </Link>
          <Link 
            href="/orders" 
            className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary ${
              pathname === "/orders" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            My Orders
          </Link>
        </div>
      </div>
    </nav>
  );
}