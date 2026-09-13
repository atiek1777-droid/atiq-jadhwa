import Link from "next/link";

// Rendered inside the root layout (which already provides <html>/<body>),
// so this only needs to return the page content.
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-lg">الصفحة غير موجودة / Page not found</p>
      <Link href="/ar" className="underline underline-offset-4">
        العودة للرئيسية / Back home
      </Link>
    </div>
  );
}
