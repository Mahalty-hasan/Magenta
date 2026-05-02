import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Play, 
  Clock, 
  Activity,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Workflow as WorkflowIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/auth-context';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    tasksToday: 24, // Mock for now
    successRate: '98.5%'
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'workflows'),
      where('ownerId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkflows(docs);
      setStats(prev => ({
        ...prev,
        total: docs.length,
        active: docs.filter((w: any) => w.status === 'active').length
      }));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const createNewWorkflow = async () => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, 'workflows'), {
        name: 'Untitled Workflow',
        description: 'New automated process',
        ownerId: user.uid,
        status: 'draft',
        steps: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      navigate(`/builder/${docRef.id}`);
    } catch (error) {
      console.error("Error creating workflow:", error);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Ops Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your automation ecosystem.</p>
        </div>
        <Button onClick={createNewWorkflow} size="lg" className="rounded-xl gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          Create Workflow
        </Button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active Workflows', value: stats.active, icon: <Zap className="w-5 h-5 text-primary" />, color: 'bg-primary/10' },
          { label: 'Total Tasks', value: '1.2k', icon: <Activity className="w-5 h-5 text-blue-600" />, color: 'bg-blue-50' },
          { label: 'Avg Success Rate', value: stats.successRate, icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, color: 'bg-emerald-50' },
          { label: 'Queue Status', value: 'Optimal', icon: <Clock className="w-5 h-5 text-amber-600" />, color: 'bg-amber-50' }
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflows List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold font-display">Your Workflows</h2>
            <div className="flex items-center gap-2">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 w-48 h-9 rounded-lg" />
               </div>
               <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
               </Button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
              ))
            ) : workflows.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
                <WorkflowIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No workflows found. Let's create your first one.</p>
                <Button variant="link" onClick={createNewWorkflow} className="mt-2">Create New workflow</Button>
              </div>
            ) : (
              workflows.map((workflow) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-background border border-border/60 p-5 rounded-2xl hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/builder/${workflow.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${workflow.status === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <WorkflowIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{workflow.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{workflow.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                           <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'} className="rounded-full font-medium">
                              {workflow.status}
                           </Badge>
                           <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Updated {new Date(workflow.updatedAt?.seconds * 1000).toLocaleDateString()}
                           </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 fill-current" />
                       </Button>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                             <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreHorizontal className="w-4 h-4" />
                             </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                             <DropdownMenuItem>Edit Details</DropdownMenuItem>
                             <DropdownMenuItem>Duplicate</DropdownMenuItem>
                             <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-6">
           <Card className="border-border/50 bg-muted/10">
              <CardHeader className="pb-3">
                 <CardTitle className="text-lg font-display">Task Queue</CardTitle>
                 <CardDescription>Live processing status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {[
                   { label: 'Data Enrichment', status: 'Processing', progress: 45, icon: <Activity className="w-4 h-4 text-blue-500" /> },
                   { label: 'Lead Validation', status: 'Completed', progress: 100, icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
                   { label: 'CRM Sync', status: 'Stalled', progress: 12, icon: <AlertCircle className="w-4 h-4 text-amber-500" /> }
                 ].map((item, i) => (
                    <div key={i} className="p-3 bg-background rounded-lg border border-border/40 shadow-sm">
                       <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                             {item.icon}
                             {item.label}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.status}</span>
                       </div>
                       <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                             className={`h-full transition-all ${item.status === 'Completed' ? 'bg-emerald-500' : item.status === 'Stalled' ? 'bg-amber-500' : 'bg-primary'}`} 
                             style={{ width: `${item.progress}%` }} 
                          />
                       </div>
                    </div>
                 ))}
                 <Button variant="ghost" className="w-full text-xs text-muted-foreground">View All Activity</Button>
              </CardContent>
           </Card>

           <Card className="border-border/50 bg-primary text-primary-foreground overflow-hidden relative">
              <Zap className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
              <CardHeader>
                 <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
                 <CardDescription className="text-primary-foreground/70">Enable multi-step workflows and parallel execution.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Button variant="secondary" className="w-full font-bold">Try for 14 Days</Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
