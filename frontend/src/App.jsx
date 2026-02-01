import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { useAuth } from "@/hooks/use-auth.js";
import { Loader2 } from "lucide-react";

import AuthPage from "@/pages/auth-page.jsx";
import StudentDashboard from "@/pages/student-dashboard.jsx";
import StaffDashboard from "@/pages/staff-dashboard.jsx";
import SettingsPage from "@/pages/settings-page.jsx";
import NotFound from "@/pages/not-found.jsx";

function ProtectedRoute({ component: Component, allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access wrong role page
    return <Redirect to={user.role === "staff" ? "/staff" : "/student"} />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      <Route path="/student">
        <ProtectedRoute component={StudentDashboard} allowedRoles={['student']} />
      </Route>
      
      <Route path="/staff">
        <ProtectedRoute component={StaffDashboard} allowedRoles={['staff']} />
      </Route>

      <Route path="/settings">
        <ProtectedRoute component={SettingsPage} />
      </Route>

      <Route path="/">
        {/* Redirect root to appropriate dashboard or auth */}
        <RootRedirect />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function RootRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Redirect to="/auth" />;
  return <Redirect to={user.role === "staff" ? "/staff" : "/student"} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
