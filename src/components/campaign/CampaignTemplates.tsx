
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Save, FileTemplate } from "lucide-react";
import { toast } from "sonner";

interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  objective: string;
  budget: number;
  targetAudience: string;
  platforms: string[];
}

interface CampaignTemplatesProps {
  onTemplateSelect: (template: CampaignTemplate) => void;
  onTemplateSave: (template: Omit<CampaignTemplate, 'id'>) => void;
}

const defaultTemplates: CampaignTemplate[] = [
  {
    id: '1',
    name: 'E-commerce Sales',
    description: 'High-converting template for product sales',
    objective: 'Purchase',
    budget: 50,
    targetAudience: 'Shopping enthusiasts, age 25-45',
    platforms: ['Facebook', 'Instagram']
  },
  {
    id: '2',
    name: 'Brand Awareness',
    description: 'Build brand recognition and reach',
    objective: 'Brand Awareness',
    budget: 30,
    targetAudience: 'Broad audience, interests-based',
    platforms: ['Facebook', 'Instagram']
  },
  {
    id: '3',
    name: 'Lead Generation',
    description: 'Capture leads and contact information',
    objective: 'Lead Generation',
    budget: 40,
    targetAudience: 'Business professionals, B2B',
    platforms: ['Facebook']
  }
];

export const CampaignTemplates = ({ onTemplateSelect, onTemplateSave }: CampaignTemplatesProps) => {
  const [templates, setTemplates] = useState<CampaignTemplate[]>(defaultTemplates);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    objective: '',
    budget: 0,
    targetAudience: '',
    platforms: [] as string[]
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTemplateSelect = (template: CampaignTemplate) => {
    onTemplateSelect(template);
    toast.success(`Template "${template.name}" selected`);
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    const template = {
      ...newTemplate,
      id: Date.now().toString()
    };

    setTemplates([...templates, template]);
    onTemplateSave(newTemplate);
    
    // Reset form
    setNewTemplate({
      name: '',
      description: '',
      objective: '',
      budget: 0,
      targetAudience: '',
      platforms: []
    });
    
    setIsDialogOpen(false);
    toast.success("Template saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileTemplate className="h-5 w-5" />
              Campaign Templates
            </CardTitle>
            <CardDescription>Use pre-built templates to quickly create campaigns</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Campaign Template</DialogTitle>
                <DialogDescription>Create a reusable template for future campaigns</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <Label htmlFor="templateDescription">Description</Label>
                  <Textarea
                    id="templateDescription"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    placeholder="Describe this template"
                  />
                </div>
                <div>
                  <Label htmlFor="templateObjective">Objective</Label>
                  <Input
                    id="templateObjective"
                    value={newTemplate.objective}
                    onChange={(e) => setNewTemplate({...newTemplate, objective: e.target.value})}
                    placeholder="Campaign objective"
                  />
                </div>
                <div>
                  <Label htmlFor="templateBudget">Default Budget</Label>
                  <Input
                    id="templateBudget"
                    type="number"
                    value={newTemplate.budget}
                    onChange={(e) => setNewTemplate({...newTemplate, budget: Number(e.target.value)})}
                    placeholder="Daily budget"
                  />
                </div>
                <div>
                  <Label htmlFor="templateAudience">Target Audience</Label>
                  <Textarea
                    id="templateAudience"
                    value={newTemplate.targetAudience}
                    onChange={(e) => setNewTemplate({...newTemplate, targetAudience: e.target.value})}
                    placeholder="Describe target audience"
                  />
                </div>
                <Button onClick={handleSaveTemplate} className="w-full">
                  Save Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {templates.map((template) => (
            <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{template.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Objective:</span> {template.objective}
                </div>
                <div>
                  <span className="font-medium">Budget:</span> ${template.budget}/day
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Platforms:</span> {template.platforms.join(', ')}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Audience:</span> {template.targetAudience}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
