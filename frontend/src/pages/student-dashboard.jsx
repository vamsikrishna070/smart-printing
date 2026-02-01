import { useState, useRef } from "react";
import { useJobs } from "@/hooks/use-jobs.js";
import { useAuth } from "@/hooks/use-auth.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { 
  Upload, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Printer, 
  MoreHorizontal 
} from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/layout.jsx";
import { motion, AnimatePresence } from "framer-motion";

const jobFormSchema = z.object({
  copies: z.coerce.number().min(1, "At least 1 copy required").max(100, "Max 100 copies"),
  printType: z.enum(["bw", "color"]),
});

export default function StudentDashboard() {
  const { user } = useAuth();
  const { jobs, isLoading, createJobMutation } = useJobs();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: { copies: 1, printType: "bw" },
  });

  // Backend already filters jobs by user, so we can use them directly
  const myJobs = jobs || [];
  
  // Calculate stats
  const pendingJobs = myJobs.filter(j => j.status === "pending" || j.status === "printing");
  const completedJobs = myJobs.filter(j => j.status === "completed" || j.status === "ready");
  
  // Calculate estimated wait time (simplified logic)
  const totalWaitTime = pendingJobs.reduce((acc, job) => acc + (job.estimatedTime || 0), 0);

  const onSubmit = (data) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("copies", String(data.copies));
    formData.append("printType", data.printType);

    createJobMutation.mutate(formData, {
      onSuccess: () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        form.reset();
      }
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-3 gap-8"
      >
        
        {/* Left Column: Stats & Upload */}
        <div className="lg:col-span-1 space-y-6">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary via-indigo-600 to-indigo-700 text-white border-0 shadow-xl shadow-primary/30 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
              <CardContent className="pt-6 relative">
                <h2 className="text-2xl font-bold mb-2">Hello, {user?.name.split(' ')[0]}!</h2>
                <div className="flex items-center gap-2 text-indigo-100 mb-6">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Est. Wait Time: {totalWaitTime} mins</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/15 rounded-xl p-3 backdrop-blur-sm border border-white/20"
                  >
                    <div className="text-2xl font-bold">{pendingJobs.length}</div>
                    <div className="text-xs text-indigo-200">Pending</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/15 rounded-xl p-3 backdrop-blur-sm border border-white/20"
                  >
                    <div className="text-2xl font-bold">{completedJobs.length}</div>
                    <div className="text-xs text-indigo-200">Completed</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl border-indigo-100/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  Upload Document
                </CardTitle>
                <CardDescription>PDF, DOCX, or Images accepted</CardDescription>
              </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <div 
                      className={`
                        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                        ${file ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'}
                      `}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                      />
                      {file ? (
                        <div className="flex flex-col items-center">
                          <FileText className="w-10 h-10 text-primary mb-2" />
                          <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-500">
                          <Upload className="w-8 h-8 mb-2 opacity-50" />
                          <p className="text-sm font-medium">Click to browse</p>
                          <p className="text-xs">or drag and drop</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="copies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Copies</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="printType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bw">B&W</SelectItem>
                              <SelectItem value="color">Color</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200" 
                    disabled={!file || createJobMutation.isPending}
                  >
                    {createJobMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Printer className="w-4 h-4 mr-2" />
                        Submit Job
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          </motion.div>
        </div>

        {/* Right Column: Queue List */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full shadow-xl border-indigo-100/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center">
                    <Printer className="w-4 h-4 text-white" />
                  </div>
                  My Print Queue
                </CardTitle>
                <CardDescription>Track the status of your documents in real-time</CardDescription>
              </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : myJobs.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Printer className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No print jobs found. Upload a document to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {myJobs.map((job) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        whileHover={{ scale: 1.02, translateX: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50/50 hover:from-white hover:to-primary/5 hover:border-primary/20 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className={`
                              w-12 h-12 rounded-full flex items-center justify-center shadow-sm
                              ${job.status === 'completed' || job.status === 'ready' ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600 border border-green-200' : 
                                job.status === 'printing' ? 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 border border-blue-200' : 
                                'bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600 border border-yellow-200'}
                            `}>
                              <FileText className="w-6 h-6" />
                            </motion.div>
                            <div>
                              <h4 className="font-semibold text-slate-900">{job.fileName}</h4>
                              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                <span>{job.copies} cop{job.copies > 1 ? 'ies' : 'y'}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="uppercase">{job.printType}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{format(new Date(job.createdAt), "MMM d, h:mm a")}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <JobStatusBadge status={job.status} />
                            {job.status === 'pending' && (
                              <span className="text-xs text-slate-400">Queue #{job.queueNumber}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}

function JobStatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    printing: "bg-blue-100 text-blue-700 hover:bg-blue-100 animate-pulse",
    ready: "bg-green-100 text-green-700 hover:bg-green-100",
    completed: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  };

  const labels = {
    pending: "In Queue",
    printing: "Printing...",
    ready: "Ready for Pickup",
    completed: "Completed",
  };

  return (
    <Badge variant="secondary" className={`${styles[status]} font-medium border-0`}>
      {labels[status]}
    </Badge>
  );
}
