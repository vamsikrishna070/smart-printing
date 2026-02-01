import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth.js";
import { 
  LogOut, 
  Printer, 
  LayoutDashboard, 
  Settings,
  UserCircle,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { motion } from "framer-motion";

export function Layout({ children }) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/25"
            >
              <Printer className="w-5 h-5" />
            </motion.div>
            <Link href={user.role === "staff" ? "/staff" : "/student"} className="text-xl font-bold font-display bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              SmartPrint
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href={user.role === "staff" ? "/staff" : "/student"}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`text-slate-600 hover:text-primary hover:bg-primary/10 transition-all ${location === (user.role === 'staff' ? '/staff' : '/student') ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <Home className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full border border-slate-200/50">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                <span className="text-xs text-slate-500 capitalize flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'staff' ? 'bg-purple-500' : 'bg-green-500'} animate-pulse`}></span>
                  {user.role}
                </span>
              </div>
            </div>
            
            <Link href="/settings">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`text-slate-600 hover:text-primary hover:bg-primary/10 transition-all ${location === '/settings' ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <Settings className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Settings</span>
                </Button>
              </motion.div>
            </Link>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
