import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";
import { ThemeToggle } from "./themeToggle";

export function Navbar() {
  return (
    <nav className="flex items-centre justify-between py-2">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="logo" />
        <h1 className="text-2xl font-bold">Visiona</h1>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button>Login</button>
      </div>
    </nav>
  );
}
