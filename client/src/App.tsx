import { Router, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Classic from "@/pages/home";
import Themes from "@/pages/themes";
import NotFound from "@/pages/not-found";
import Home from "@/site/home";
import { CasePage } from "@/site/case";
import Hi from "@/site/hi";
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
      <Route path="/hi/:n" component={Hi} />
      <Route path="/hi" component={Hi} />
      {import.meta.env.DEV && <Route path="/themes" component={Themes} />}
      <Route path="/classic" component={Classic} />
      <Route path="/" component={Home} />
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
