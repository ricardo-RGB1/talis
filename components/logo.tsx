import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";

const headingFont = localFont({
  src: "../public/fonts/font.woff2",
});

const Logo = () => {
  return (
    <Link href="/">
      <div className="items-center gap-x-2 hidden md:flex">
        <Image src="/logo.svg" alt="Talis Logo" width={30} height={30} />
        <p
          className={cn("text-xl text-neutral-700 pb-1", headingFont.className)}
        >
          Talis
        </p>
      </div>
    </Link>
  );
};

export default Logo;
