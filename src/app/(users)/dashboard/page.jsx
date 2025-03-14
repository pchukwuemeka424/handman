"use client";
import { redirect } from "next/navigation";

import Dashboard from "@/components/dashboard";
import { Alert } from "@/components/ui/alert"; // ShadCN Alert
import { User } from "lucide-react";
import UserDashboard from "@/components/userdashboard";
import { useUser } from "@/context/userContext";
import Link from "next/link";

export default function DashboardPage() {
  const profile = useUser();
  const kycStatus = profile?.kyc_status;

  return (
    <div className="space-y-4">
      {/* Show messages based on KYC status */}
      {kycStatus === null || kycStatus === undefined ? (
        <Alert variant="destructive" className="text-center">
          <p className="font-semibold">KYC Verification Required</p>
          <p className="text-sm">
            To ensure full access to all platform features, we require you to verify your identity. 
            This process is quick and helps us maintain security and compliance.
          </p>
          <p className="mt-2">
            Please <Link href="/dashboard/kyc" className="underline text-blue-500 font-semibold">click here</Link> to upload your KYC documents and complete the verification.
          </p>
        </Alert>
      ) : kycStatus === "Pending" ? (
        <Alert variant="warning" className="text-center">
          <p className="font-semibold">KYC Verification In Progress</p>
          <p className="text-sm">
            We have received your KYC documents and they are currently under review. This process usually takes 
            between 24 to 48 hours. Please be patient while we verify your details.
          </p>
        
        </Alert>
      ) : null}

      <Dashboard />
    </div>
  );
}
