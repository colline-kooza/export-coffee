import Image from "next/image";

export function Header({ showTagline = true }: { showTagline?: boolean }) {
  return (
    <div className="flex flex-col items-center ">
      <div className="flex items-center gap-2">
        <Image
          src="/logo_light.png"
          alt="Lendbox"
          width={667}
          height={337}
          className="w-36 dark:hidden"
        />
        <Image
          src="/logo_dark.png"
          alt="Lendbox"
          width={667}
          height={337}
          className="w-36 hidden dark:block"
        />
      </div>
      {showTagline && (
        <p className="text-[#6B7280] text-sm tracking-wide">
          BRINGING EASTLEIGH CLOSER TO YOU
        </p>
      )}
    </div>
  );
}
