import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Settings, 
  Play, 
  Save, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  MoveHorizontal,
  LayoutGrid,
  Bot,
  Database,
  Globe,
  Mail,
  MoreVertical,
  CheckCircle2,
  XCircle,
  FileJson,
  Cpu
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action';
  name: string;
  tool: string;
  config: any;
}

const STEP_TYPES = [
  { id: 'webhook', name: 'Webhook', icon: <Globe className="w-4 h-4" />, color: 'bg-blue-500' },
  { id: 'ai', name: 'AI Processor', icon: <Bot className="w-4 h-4" />, color: 'bg-purple-500' },
  { id: 'db', name: 'Database', icon: <Database className="w-4 h-4" />, color: 'bg-emerald-500' },
  { id: 'email', name: 'Email Send', icon: <Mail className="w-4 h-4" />, color: 'bg-amber-500' },
  { id: 'json', name: 'JSON Parser', icon: <FileJson className="w-4 h-4" />, color: 'bg-slate-500' },
];

const WorkflowBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'workflows', id), (doc) => {
      if (doc.exists()) {
        setWorkflow({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [id]);

  const addStep = async () => {
    if (!workflow) return;
    const newStep: WorkflowStep = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'action',
      name: 'New Action',
      tool: 'ai',
      config: {}
    };
    
    const newSteps = [...(workflow.steps || []), newStep];
    await updateDoc(doc(db, 'workflows', workflow.id), {
      steps: newSteps,
      updatedAt: serverTimestamp()
    });
    toast.success("Step added successfully");
  };

  const removeStep = async (stepId: string) => {
    const newSteps = workflow.steps.filter((s: any) => s.id !== stepId);
    await updateDoc(doc(db, 'workflows', workflow.id), {
      steps: newSteps,
      updatedAt: serverTimestamp()
    });
    if (selectedStepId === stepId) setSelectedStepId(null);
  };

  const saveWorkflow = async () => {
    await updateDoc(doc(db, 'workflows', workflow.id), {
      updatedAt: serverTimestamp()
    });
    toast.success("Workflow saved");
  };

  if (loading) return <div className="pt-24 text-center">Loading builder...</div>;
  if (!workflow) return <div className="pt-24 text-center">Workflow not found</div>;

  return (
    <div className="h-screen bg-muted/20 flex flex-col pt-16 overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-background border-b border-border/40 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-lg h-9 w-9">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Input 
              value={workflow.name} 
              onChange={async (e) => await updateDoc(doc(db, 'workflows', workflow.id), { name: e.target.value })}
              className="font-bold text-base h-8 border-transparent hover:border-border transition-all w-fit bg-transparent focus:bg-background" 
            />
            <Badge variant="outline" className="rounded-full text-[10px] uppercase font-bold tracking-wider">{workflow.status}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Settings className="w-4 h-4" />
            Config
          </Button>
          <Button size="sm" onClick={saveWorkflow} className="h-9 gap-2 shadow-sm">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button variant="default" size="sm" className="h-9 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 shadow-lg">
            <Play className="w-4 h-4 fill-current" />
            Run Flow
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Components */}
        <div className="w-72 bg-background border-r border-border/40 flex flex-col">
          <div className="p-4 border-b border-border/40">
             <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Step Library</h3>
             <div className="grid grid-cols-1 gap-2">
                {STEP_TYPES.map((type) => (
                   <div 
                    key={type.id} 
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-primary hover:bg-primary/5 transition-all cursor-grab active:cursor-grabbing group"
                   >
                      <div className={`p-2 rounded-lg ${type.color} text-white`}>
                         {type.icon}
                      </div>
                      <span className="text-sm font-semibold">{type.name}</span>
                      <Plus className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                ))}
             </div>
          </div>
          <ScrollArea className="flex-1">
             <div className="p-4">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                   <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">Platform Stats</span>
                   </div>
                   <div className="text-xs text-muted-foreground">Version: 2.1.0-alpha</div>
                   <div className="text-xs text-muted-foreground mt-1">Status: Operational</div>
                </div>
             </div>
          </ScrollArea>
        </div>

        {/* Builder Canvas */}
        <div className="flex-1 overflow-auto bg-dot-pattern relative">
           <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
           
           <div className="max-w-3xl mx-auto py-20 px-8 flex flex-col items-center">
              {/* Trigger */}
              <div className="relative group mb-12">
                 <div className="w-64 p-6 bg-background rounded-2xl border-2 border-primary shadow-xl relative z-10 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                       <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <h4 className="font-bold">Entry Point</h4>
                    <p className="text-xs text-muted-foreground mt-1">Webhook listener active</p>
                 </div>
                 <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background z-20" />
                 <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-linear-to-b from-primary to-border/40" />
              </div>

              {/* Steps */}
              <div className="space-y-12 flex flex-col items-center w-full">
                 <AnimatePresence mode="popLayout">
                    {workflow.steps.map((step: any, index: number) => (
                      <motion.div 
                        key={step.id} 
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`relative group w-full max-w-md ${selectedStepId === step.id ? 'z-30' : 'z-10'}`}
                      >
                         <div 
                          onClick={() => setSelectedStepId(step.id)}
                          className={`p-6 bg-background rounded-2xl border ${selectedStepId === step.id ? 'border-primary ring-4 ring-primary/10 shadow-2xl' : 'border-border/60 shadow-lg'} transition-all cursor-pointer relative group`}
                         >
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${STEP_TYPES.find(t => t.id === step.tool)?.color || 'bg-muted'} text-white`}>
                                     {STEP_TYPES.find(t => t.id === step.tool)?.icon || <Cpu className="w-4 h-4" />}
                                  </div>
                                  <div>
                                     <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5 block">Step {index + 1}</span>
                                     <h4 className="font-bold flex items-center gap-2">
                                        {step.name}
                                     </h4>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={(e) => { e.stopPropagation(); removeStep(step.id); }}>
                                     <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                     <MoreVertical className="w-4 h-4" />
                                  </Button>
                               </div>
                            </div>
                            <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-between">
                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Cpu className="w-4 h-4" />
                                  <span>Automated reasoning...</span>
                               </div>
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                         </div>

                         {/* Connection Line */}
                         {index < workflow.steps.length - 1 && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-border/40" />
                         )}
                         
                         {/* Selection Drawer for mobile/tablet feel */}
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              {/* Add Step Button */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-12"
              >
                 <Button 
                  onClick={addStep}
                  variant="outline" 
                  className="rounded-full h-12 px-6 gap-2 border-2 border-dashed border-primary/50 text-primary hover:bg-primary/5 hover:border-primary transition-all"
                 >
                    <Plus className="w-5 h-5" />
                    New Automation Step
                 </Button>
              </motion.div>
           </div>
        </div>

        {/* Right Configuration Inspector */}
        <div className={`w-96 bg-background border-l border-border/40 overflow-auto transition-transform ${selectedStepId ? 'translate-x-0' : 'translate-x-full'}`}>
           {selectedStepId ? (
              <div className="flex flex-col h-full">
                 <div className="p-4 border-b border-border/40 flex items-center justify-between">
                    <h3 className="font-bold font-display">Configure Step</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedStepId(null)}>
                       <XCircle className="w-5 h-5 text-muted-foreground" />
                    </Button>
                 </div>
                 <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-muted-foreground">Step Name</label>
                          <Input value={workflow.steps.find((s: any) => s.id === selectedStepId)?.name} />
                       </div>
                       
                       <Tabs defaultValue="settings">
                          <TabsList className="w-full grid grid-cols-2 mb-6">
                             <TabsTrigger value="settings">Settings</TabsTrigger>
                             <TabsTrigger value="output">Output</TabsTrigger>
                          </TabsList>
                          <TabsContent value="settings" className="space-y-4">
                             <div className="p-4 rounded-xl border border-border bg-muted/20">
                                <span className="text-sm font-semibold flex items-center gap-2 mb-4">
                                   <Bot className="w-4 h-4 text-purple-500" />
                                   Prompt Engineering
                                </span>
                                <textarea 
                                   className="w-full h-32 bg-background border border-border rounded-lg p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                                   placeholder="Analyze this input and extract key sentiment..."
                                />
                             </div>
                             <div className="flex items-center justify-between p-2">
                                <span className="text-sm font-medium">Retry on failure</span>
                                <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase font-bold">Enabled</Button>
                             </div>
                          </TabsContent>
                          <TabsContent value="output">
                             <div className="bg-slate-950 text-slate-400 p-4 rounded-xl font-mono text-[10px] leading-relaxed">
                                &#123;<br/>
                                &nbsp;&nbsp;"status": "success",<br/>
                                &nbsp;&nbsp;"tokens": 128,<br/>
                                &nbsp;&nbsp;"completion": "Analyzed data suggests positive..."<br/>
                                &#125;
                             </div>
                          </TabsContent>
                       </Tabs>
                    </div>
                 </ScrollArea>
                 <div className="p-6 border-t border-border/40">
                    <Button className="w-full rounded-xl">Apply Changes</Button>
                 </div>
              </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-muted/5 opacity-40">
                <Settings className="w-12 h-12 mb-4" />
                <p className="text-sm font-medium">Select a step to configure its parameters</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
