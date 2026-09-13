"use client";

import BilingualStageList from "@/components/admin/BilingualStageList";

export default function AdminServicesPage() {
  return (
    <BilingualStageList
      table="services"
      stageField="pillar"
      stageOptions={["build", "improve", "grow"]}
      title="Services"
    />
  );
}
