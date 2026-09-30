import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router, Switch } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import type { BrowserLocationHook } from "wouter/use-browser-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Tracker from "./pages/Tracker";

// Vite's BASE_URL is "/" locally and "/victoria-point-design/" on GitHub Pages.
// Wouter appends this string to links, so the root site must use an empty base.
function appBase(): string {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

// GitHub Pages redirects /tracker to /tracker/. Drop the extra slash so the
// route still matches.
const usePagesLocation: BrowserLocationHook = (options) => {
  const [location, navigate] = useBrowserLocation(options);
  const normalized = location.length > 1 ? location.replace(/\/+$/, "") : location;
  return [normalized, navigate];
};

function AppRoutes() {
  return (
    <Router base={appBase()} hook={usePagesLocation}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/tracker"} component={Tracker} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
