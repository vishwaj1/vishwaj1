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
  const roots = Array.from(
    new Set(
      [import.meta.env.BASE_URL.replace(/\/$/, ""), "/vishwaj1", ""].filter(
        (value, index, list) => list.indexOf(value) === index,
      ),
    ),
  );

  return (
    <Switch>
      {roots.map((root) => (
        <Route key={`${root}-themes`} path={`${root}/themes`} component={Themes} />
      ))}
      {roots.map((root) => (
        <Route key={`${root}-classic`} path={`${root}/classic`} component={Home} />
      ))}
      {roots.map((root) => (
        <Route key={`${root}-work`} path={`${root}/work/:slug`} component={WorkRoute} />
      ))}
      <Route path="/" component={Walk} />
      {roots.filter(Boolean).map((root) => (
        <Route key={`${root}-home`} path={root} component={Walk} />
      ))}
      {roots.filter(Boolean).map((root) => (
        <Route key={`${root}-home-slash`} path={`${root}/`} component={Walk} />
      ))}
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
