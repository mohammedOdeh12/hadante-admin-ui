import React from 'react';

interface StatusBadgeProps {
  status: string | boolean | undefined | null;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // توحيد النص بحروف صغيرة لتسهيل المقارنة
  const normalizedStatus = String(status).toLowerCase();

  // تحديد الألوان بناءً على الحالة
  let bgColor = "bg-gray-100 dark:bg-gray-800";
  let textColor = "text-gray-700 dark:text-gray-300";

  if (normalizedStatus === "active" || normalizedStatus === "true" || normalizedStatus === "enabled") {
    bgColor = "bg-green-100 dark:bg-green-900/30";
    textColor = "text-green-700 dark:text-green-400";
  } else if (normalizedStatus === "inactive" || normalizedStatus === "false" || normalizedStatus === "disabled" || normalizedStatus === "cancelled" || normalizedStatus === "expired") {
    bgColor = "bg-red-100 dark:bg-red-900/30";
    textColor = "text-red-700 dark:text-red-400";
  } else if (normalizedStatus === "pending") {
    bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
    textColor = "text-yellow-700 dark:text-yellow-400";
  }

  // تحديد النص المعروض (تحويل true/false إلى نصوص مفهومة)
  const displayText = normalizedStatus === "true" ? "active" : normalizedStatus === "false" ? "inactive" : status || "N/A";

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${bgColor} ${textColor}`}>
      {displayText}
    </span>
  );
}