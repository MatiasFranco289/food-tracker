"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="p-4">
      <div className="flex flex-row-reverse absolute top-0 right-0 p-4">
        <p
          onClick={() => {
            if (pathname == "/profile") return;
            router.push("/profile");
          }}
          className={`mx-2 duration-200 ${pathname == "/profile" ? "text-white" : "cursor-pointer text-white/80 hover:text-white hover:scale-105"}`}
        >
          Profile
        </p>
        <p
          onClick={() => {
            if (pathname == "/home") return;
            router.push("/home");
          }}
          className={`mx-2 duration-200 ${pathname == "/home" ? "text-white" : "cursor-pointer text-white/80 hover:text-white hover:scale-105"}`}
        >
          Home
        </p>
      </div>

      <div className="w-full h-12.5"></div>
    </div>
  );
}
