"use client";

import { toast } from "sonner";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";

export const alert = {
  success: (message: string) =>
    toast.success("Success", {
      description: message,
      icon: <FaCheckCircle className="text-green-500" />,
    }),

  error: (message: string) =>
    toast.error("Error", {
      description: message,
      icon: <FaTimesCircle className="text-red-500" />,
    }),

  warning: (message: string) =>
    toast.warning("Warning", {
      description: message,
      icon: <FaExclamationTriangle className="text-yellow-500" />,
    }),

  info: (message: string) =>
    toast.info("Info", {
      description: message,
      icon: <FaInfoCircle className="text-blue-500" />,
    }),
};
