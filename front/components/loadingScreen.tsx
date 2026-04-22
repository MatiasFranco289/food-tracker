import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="w-screen h-screen fixed flex justify-center items-center bg-black/15 z-50 backdrop-blur duration-200">
      <Image
        src="/loading.gif"
        alt="loading"
        width={100}
        height={100}
        unoptimized={true}
        loading="eager"
      />
    </div>
  );
}
