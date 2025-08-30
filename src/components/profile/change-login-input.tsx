"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { updateLogin } from "@/server-actions/update-login";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const LOGIN_REGEX = /^[a-zA-Z0-9_.-]{3,20}$/;

const checkLoginAvailability = async (login: string): Promise<boolean> => {
  const response = await fetch(`/api/user/check-login?login=${encodeURIComponent(login)}`);
  if (!response.ok) throw new Error("Failed to check login");
  return response.json();
};

const icons = {
  idle: null,
  checking: <AiOutlineLoading3Quarters className="animate-spin text-gray-400" />,
  free: <AiOutlineCheck className="text-green-600" />,
  taken: <AiOutlineClose className="text-red-600" />,
};

export default function ChangeLoginInput() {
  const [login, setLogin] = useState("");
  const router = useRouter();

  const {
    data: isAvailable,
    error,
    isLoading,
    isValidating,
  } = useSWR(
    login && LOGIN_REGEX.test(login) ? `/api/user/check-login?login=${login}` : null,
    () => checkLoginAvailability(login),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
      onSuccess: (available) => {
        if (available) {
          toast.dismiss();
          toast("Confirm", {
            description: `Confirm update login to "${login}"?`,
            position: "top-center",
            action: {
              label: "Confirm",
              onClick: handleConfirmUpdate,
            },
          });
        }
      },
    },
  );

  const handleConfirmUpdate = async () => {
    try {
      await updateLogin(login);
      showToast("Success", "Login updated successfully", "success");
      setLogin("");
      router.refresh();
    } catch (err: any) {
      showToast("Error", err.message || "Error updating login", "error");
    }
  };

  const handleLoginChange = (value: string) => {
    setLogin(value);
  };

  const getStatus = () => {
    if (!login) return "idle";
    if (!LOGIN_REGEX.test(login)) return "taken";
    if (isLoading || isValidating) return "checking";
    if (error) return "taken";
    return isAvailable ? "free" : "taken";
  };

  const status = getStatus();

  return (
    <div className="relative w-full max-w-sm">
      <Input
        id="login"
        value={login}
        onChange={(e) => handleLoginChange(e.target.value)}
        placeholder="New login"
        className="pr-10"
      />
      <span className="absolute inset-y-0 right-3 flex items-center">{icons[status]}</span>
    </div>
  );
}
