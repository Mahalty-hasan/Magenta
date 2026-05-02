import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      orderBy('startedAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20 gap-1"><XCircle className="w-3 h-3" /> Failed</Badge>;
      case 'human_check':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 gap-1"><AlertCircle className="w-3 h-3" /> Human Lab</Badge>;
      case 'running':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 animate-pulse gap-1"><Clock className="w-3 h-3" /> Running</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-3">
             Task History
             <Badge variant="outline" className="text-xs font-normal">Live</Badge>
          </h1>
          <p className="text-muted-foreground mt-1">Audit and debug every execution across your workflows.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm">Export CSV</Button>
           <Button variant="outline" size="sm">Clear History</Button>
        </div>
      </header>

      <div className="bg-background border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/40 flex flex-wrap items-center gap-4 bg-muted/5">
           <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search task ID or workflow..." className="pl-9 h-10 rounded-xl" />
           </div>
           <Button variant="outline" className="gap-2 rounded-xl">
              <Filter className="w-4 h-4" />
              All Statuses
           </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[200px]">Task ID</TableHead>
              <TableHead>Workflow</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                  <TableCell><div className="h-4 w-28 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center text-muted-foreground">
                   <div className="flex flex-col items-center justify-center gap-2">
                      <History className="w-12 h-12 opacity-10 mb-2" />
                      <p>No execution history yet.</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task, i) => (
                <TableRow key={task.id} className="group cursor-pointer">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{task.id.substring(0, 8)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {task.workflowName || 'Sales Automation'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(task.status)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(task.startedAt?.seconds * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {task.duration || '2.4s'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-primary/5 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TasksPage;
