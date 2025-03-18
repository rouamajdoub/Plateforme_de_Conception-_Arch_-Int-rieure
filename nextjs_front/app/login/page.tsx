import { LoginForm } from "@/components/forms/LoginForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/assets/logo-.png";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center">
          <Image src={Logo} alt="Logo" width={100} height={100} />
          <h1 className="text-3xl font-bold">Visiona </h1>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
