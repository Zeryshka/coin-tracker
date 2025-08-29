"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import ChangeLoginInput from "@/components/profile/change-login-input";

export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <Tabs defaultValue="main" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="main">Основные</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="login">Сменить логин</Label>
            <ChangeLoginInput />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
