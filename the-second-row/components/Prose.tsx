import SiteHeader from "@/components/SiteHeader";

// Shared layout for the publication's standard pages (about, legal, help, …).
export default function Prose({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="wrap wrap--reading page">
        <div className="page-kicker">{kicker}</div>
        <h1>{title}</h1>
        {children}
      </main>
    </>
  );
}
