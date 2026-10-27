import { Router, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Themes from "@/pages/themes";
import NotFound from "@/pages/not-found";
import Walk, { CasePage } from "@/site/walk";
import { routerBase } from "@/lib/router-base";

function WorkRoute({ params }: { params?: { slug?: string } }) {
  return <CasePage slug={params?.slug ?? ""} />;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/work/:slug" component={WorkRoute} />
      {import.meta.env.DEV && (
        <Route path="/vishwaj1/work/:slug" component={WorkRoute} />
      )}
      <Route path="/themes" component={Themes} />
      <Route path="/classic" component={Home} />
      <Route path="/" component={Walk} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router base={routerBase}>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
