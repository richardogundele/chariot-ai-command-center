
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeySettings from "@/components/settings/ApiKeySettings";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your application settings</p>
      </div>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <ApiKeySettings />
        </TabsContent>

        <TabsContent value="account">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
              <p className="text-muted-foreground">
                Manage your account information and preferences
              </p>
            </div>
            <div className="rounded-md bg-muted p-8 text-center">
              <p className="text-muted-foreground">Account settings will be implemented in a future update</p>
            </div>
          </div>
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
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
