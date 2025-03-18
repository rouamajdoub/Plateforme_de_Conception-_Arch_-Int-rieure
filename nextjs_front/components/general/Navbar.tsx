import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo-.png";
import { ThemeToggle } from "./themeToggle";
import { Button, buttonVariants } from "../ui/button";
import { auth, signOut } from "@/app/utils/auth";

export async function Navbar() {
  const session = await auth();
  return (
    <nav className="flex items-centre justify-between py-2">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} width={80} height={80} alt="logo" />
        <h1 className="text-2xl font-bold">Visiona</h1>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {session?.user ? <form action={async()=>{
          "use server"
          await signOut({ redirectTo: "/" })
        }}>
          <Button>Logout</Button>
        </form> : <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>Login</Link>}
      </div>
    </nav>
  );
}
