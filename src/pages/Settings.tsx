
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeySettings from "@/components/settings/ApiKeySettings";
import AccountSettings from "@/components/settings/AccountSettings";
import { AdminSettings } from "@/components/settings/AdminSettings";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/auth/authService";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { user } = await getCurrentUser();
      setIsAdmin(user?.email === "ogundelerichard27@gmail.com");
    };
    checkAdminAccess();
  }, []);

  return (
    <DashboardLayout headerLeftText="Configure your application settings">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your application settings</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeySettings />
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Notification Settings</h2>
              <p className="text-muted-foreground">
                Configure your notification preferences
              </p>
            </div>
            <div className="rounded-md bg-muted p-8 text-center">
              <p className="text-muted-foreground">Notification settings will be implemented in a future update</p>
            </div>
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin">
            <AdminSettings />
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
