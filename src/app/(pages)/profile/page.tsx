import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Input } from "@/components/ui/input";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const login = session?.user?.login || session?.user?.email || "Unknown";

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <p className="mb-4 text-gray-600">
        Current login: <span className="font-semibold">{login}</span>
      </p>

      <Tabs defaultValue="main" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="main">Main</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="login">Change login</Label>
            <Input type="text" placeholder="New login" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
