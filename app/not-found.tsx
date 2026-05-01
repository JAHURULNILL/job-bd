import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold text-blue-700">পৃষ্ঠা পাওয়া যায়নি</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900">
        আপনি যে চাকরি বা পেজ খুঁজছেন, সেটি এখন নেই।
      </h1>
      <p className="mt-4 text-sm leading-8 text-slate-600">
        job expire হয়ে গেলে বা slug invalid হলে এই page দেখানো হয়।
      </p>
      <Link
        href="/jobs"
        className="mt-8 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
      >
        চাকরির তালিকায় ফিরে যান
      </Link>
    </div>
  );
}
