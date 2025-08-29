"use client";

import { toast, ExternalToast } from "sonner";
import { AiOutlineCheck, AiOutlineClose, AiOutlineWarning } from "react-icons/ai";
import React from "react";

type ToastType = "success" | "error" | "warning";

export function showToast(
  title: string,
  description: string,
  type: ToastType,
  position: ExternalToast["position"] = "bottom-right"
) {
  toast.dismiss();

  let icon: React.ReactNode = null;
  switch (type) {
    case "success":
      icon = <AiOutlineCheck className="text-green-600" />;
      break;
    case "error":
      icon = <AiOutlineClose className="text-red-600" />;
      break;
    case "warning":
      icon = <AiOutlineWarning className="text-yellow-600" />;
      break;
  }

  toast(title, {
    description,
    position,
    icon,
  });
}
