import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Themes from "@/pages/themes";
import NotFound from "@/pages/not-found";
import Walk, { CasePage } from "@/site/walk";

function WorkRoute() {
  const [location] = useLocation();
  const slug = location.split("?")[0].split("/").filter(Boolean).pop() ?? "";
  return <CasePage slug={slug} />;
}

function Router() {
  // Dynamically determine base path from Vite config
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <Switch>
      <Route path={`${basePath}/`} component={Walk} />
      <Route path={`${basePath}/themes`} component={Themes} />
      <Route path={`${basePath}/classic`} component={Home} />
      <Route path={`${basePath}/work/:slug`} component={WorkRoute} />
      <Route path={`${basePath}/*`} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
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
