
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Users, Lock, Settings, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AdminSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const handleSaveSettings = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: "Your admin settings have been updated successfully.",
      });
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Admin Settings</CardTitle>
            <CardDescription>Manage administrator-only settings</CardDescription>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Lock className="h-4 w-4 mr-2" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="system">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">User Access Control</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-users">Maximum Users</Label>
                  <Input id="max-users" type="number" defaultValue={50} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-role">Default User Role</Label>
                  <select 
                    id="default-role"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="viewer"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approval-required">Registration Approval</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch id="approval-required" />
                    <span className="text-sm">Require admin approval</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium mb-3">User Registration</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="allow-registration" defaultChecked />
                    <Label htmlFor="allow-registration">Allow new registrations</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="require-email-verification" defaultChecked />
                    <Label htmlFor="require-email-verification">Require email verification</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Deactivation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inactive-timeout">Auto-deactivation after inactivity (days)</Label>
                  <Input id="inactive-timeout" type="number" defaultValue={90} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="failed-login">Account lockout after failed logins</Label>
                  <Input id="failed-login" type="number" defaultValue={5} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="permissions">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Role Permissions</h3>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3">Permission</th>
                        <th className="text-center p-3">Admin</th>
                        <th className="text-center p-3">Editor</th>
                        <th className="text-center p-3">Viewer</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3">View campaigns</td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">Create campaigns</td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked={false} /></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">Edit campaigns</td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked={false} /></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">Delete campaigns</td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked /></td>
                        <td className="text-center p-3"><Switch defaultChecked={false} /></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">Manage API keys</td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked={false} /></td>
                        <td className="text-center p-3"><Switch defaultChecked={false} /></td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">View analytics</td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="system">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Configuration</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily-limit">Daily API Rate Limit</Label>
                    <Input id="daily-limit" type="number" defaultValue={1000} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch Processing Size</Label>
                    <Input id="batch-size" type="number" defaultValue={50} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                    <Input id="timeout" type="number" defaultValue={30} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cache">Cache Duration (minutes)</Label>
                    <Input id="cache" type="number" defaultValue={15} />
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium mb-2">System Features</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="maintenance-mode" />
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="debug-mode" />
                      <Label htmlFor="debug-mode">Debug Mode</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="enable-cache" defaultChecked />
                      <Label htmlFor="enable-cache">Enable Caching</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="api-throttling" defaultChecked />
                      <Label htmlFor="api-throttling">API Throttling</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Analytics Configuration</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tracking-id">Google Analytics Tracking ID</Label>
                    <Input id="tracking-id" placeholder="UA-XXXXXXXX-X or G-XXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
                    <Input id="facebook-pixel" placeholder="XXXXXXXXXXXXXXXXXX" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Analytics Features</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="user-tracking" defaultChecked />
                      <Label htmlFor="user-tracking">User Behavior Tracking</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="campaign-tracking" defaultChecked />
                      <Label htmlFor="campaign-tracking">Campaign Analytics</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="error-tracking" defaultChecked />
                      <Label htmlFor="error-tracking">Error Tracking</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="event-logging" defaultChecked />
                      <Label htmlFor="event-logging">Event Logging</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
