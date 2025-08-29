"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { checkLoginAvailability } from "@/server-actions/check-login-availability";
import { updateLogin } from "@/server-actions/update-login";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { showToast } from "@/lib/showToast";

const LOGIN_REGEX = /^[a-zA-Z0-9_.-]{3,20}$/;

const icons = {
  idle: null,
  checking: <AiOutlineLoading3Quarters className="animate-spin text-gray-400" />,
  free: <AiOutlineCheck className="text-green-600" />,
  taken: <AiOutlineClose className="text-red-600" />,
};

export default function ChangeLoginInput() {
  const [login, setLogin] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "free" | "taken">("idle");

  const handleConfirmUpdate = async () => {
    try {
      await updateLogin(login);
      showToast("Success", "Login updated successfully", "success");
    } catch (err: any) {
      showToast("Error", err.message || "Error updating login", "error");
    }
  };

  useEffect(() => {
    if (!login) {
      setStatus("idle");
      return;
    }

    if (!LOGIN_REGEX.test(login)) {
      setStatus("taken");
      return;
    }

    setStatus("checking");
    const handler = setTimeout(async () => {
      const available = await checkLoginAvailability(login);
      setStatus(available ? "free" : "taken");
    }, 1000);

    return () => clearTimeout(handler);
  }, [login]);

  useEffect(() => {
    if (status === "free") {
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
  }, [status]);

  return (
    <div className="relative w-full max-w-sm">
      <Input
        id="login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="New login"
        className="pr-10"
      />
      <span className="absolute inset-y-0 right-3 flex items-center">{icons[status]}</span>
    </div>
  );
}
