"use client";

import BilingualStageList from "@/components/admin/BilingualStageList";

export default function AdminRestaurantSolutionsPage() {
  return (
    <BilingualStageList
      table="restaurant_solutions"
      stageField="stage"
      stageOptions={["diagnose", "cost", "control", "organize", "improve", "grow"]}
      title="Restaurant Business Solutions"
    />
  );
}
