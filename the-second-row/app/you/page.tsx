import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Your Seat", description: "Your dashboard — saved stories, your Ledger, submissions, activity, membership, and settings. Nothing you touched is ever lost." };
export const dynamic = "force-dynamic";

export default function YouPage() {
  return (
    <>
      <SiteHeader current="/you" />
      <Dashboard />
    </>
  );
}
