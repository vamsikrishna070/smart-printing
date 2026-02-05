import { useJobs } from "@/hooks/use-jobs.js";
import { useAuth } from "@/hooks/use-auth.js";
import { Layout } from "@/components/layout.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table.jsx";
import { 
  Printer, 
  Play, 
  CheckCircle, 
  CheckCheck, 
  Loader2,
  FileText,
  Search,
  Download,
  Phone
} from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "@/lib/api.js";

export default function StaffDashboard() {
  const { jobs, isLoading, updateStatusMutation } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");

  // Sort: Pending first, then by queue number
  const sortedJobs = jobs?.sort((a, b) => {
    // Priority status order
    const statusOrder = { printing: 0, pending: 1, ready: 2, completed: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return a.queueNumber - b.queueNumber;
  });

  const filteredJobs = sortedJobs?.filter(job => 
    job.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Print Queue Management</h1>
            <p className="text-slate-500 mt-1">Manage and process student print requests</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full md:w-96"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search by file, student, or ID..." 
              className="pl-10 bg-white shadow-sm border-slate-200 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard 
            label="Pending Jobs" 
            value={jobs?.filter(j => j.status === 'pending').length || 0} 
            color="text-yellow-600"
            bg="bg-gradient-to-br from-yellow-50 to-yellow-100/50"
            delay={0.1}
          />
          <StatsCard 
            label="Printing Now" 
            value={jobs?.filter(j => j.status === 'printing').length || 0} 
            color="text-blue-600"
            bg="bg-gradient-to-br from-blue-50 to-blue-100/50"
            delay={0.2}
          />
          <StatsCard 
            label="Ready for Pickup" 
            value={jobs?.filter(j => j.status === 'ready').length || 0} 
            color="text-green-600"
            bg="bg-gradient-to-br from-green-50 to-green-100/50"
            delay={0.3}
          />
          <StatsCard 
            label="Total Completed" 
            value={jobs?.filter(j => j.status === 'completed').length || 0} 
            color="text-slate-600"
            bg="bg-gradient-to-br from-slate-50 to-slate-100/50"
            delay={0.4}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="w-[80px]">Queue #</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                        No jobs found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : filteredJobs?.map((job) => (
                    <TableRow key={job.id} className="group hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-mono font-medium text-slate-500">
                        #{job.queueNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{job.user.name}</span>
                          <span className="text-xs text-slate-500">{job.user.username}</span>
                          {job.user.phone && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                              <Phone className="w-3 h-3" />
                              <span>{job.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="truncate max-w-[200px]" title={job.fileName}>
                            {job.fileName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Badge variant="outline" className="bg-white">
                            {job.copies} {job.copies === 1 ? 'copy' : 'copies'}
                          </Badge>
                          <Badge variant="outline" className={job.printType === 'color' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50'}>
                            {job.printType === 'color' ? 'Color' : 'B&W'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={job.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-primary border-primary/20 hover:bg-primary/5"
                            onClick={() => window.open(getApiUrl(`/uploads/${job.filePath}`), '_blank')}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {job.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleStatusUpdate(job.id, 'printing')}
                              disabled={updateStatusMutation.isPending}
                            >
                              <Play className="w-4 h-4 mr-1" /> Start
                            </Button>
                          )}
                          {job.status === 'printing' && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusUpdate(job.id, 'ready')}
                              disabled={updateStatusMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Ready
                            </Button>
                          )}
                          {job.status === 'ready' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-slate-600 border-slate-200 hover:bg-slate-100"
                              onClick={() => handleStatusUpdate(job.id, 'completed')}
                              disabled={updateStatusMutation.isPending}
                            >
                              <CheckCheck className="w-4 h-4 mr-1" /> Complete
                            </Button>
                          )}
                          {job.status === 'completed' && (
                            <span className="text-xs text-slate-400 italic py-2 px-2">Archived</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

function StatsCard({ label, value, color, bg, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -4 }}
    >
      <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${bg} overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10"></div>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center relative">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring" }}
            className={`text-4xl font-bold mb-1 ${color}`}
          >
            {value}
          </motion.span>
          <span className="text-sm font-medium text-slate-600">{label}</span>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    printing: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    ready: "bg-green-100 text-green-700 hover:bg-green-100",
    completed: "bg-slate-100 text-slate-500 hover:bg-slate-100",
  };
  
  const labels = {
    pending: "Pending",
    printing: "Printing",
    ready: "Ready",
    completed: "Completed",
  };

  return (
    <Badge variant="secondary" className={`${styles[status]} border-0 capitalize`}>
      {labels[status]}
    </Badge>
  );
}
