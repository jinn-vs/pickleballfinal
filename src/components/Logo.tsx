import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label={SITE_NAME} className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.webp"
        alt={`${SITE_NAME} logo`}
        width={200}
        height={61}
        priority
        className="h-10 w-auto sm:h-11"
      />
    </Link>
  );
}
