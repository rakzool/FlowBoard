import { Suspense, lazy } from "react";
import { ErrorBoundry } from "./components/ErrorBoundry/ErrorBoundry";
import PageLoader from "./components/PageLoader/pageLoader";


const Dashboard = lazy(() => import("./pages/DashBoard/DashBoard"));

function App() {
  return (
    <>
      <ErrorBoundry>
        <Suspense fallback={<PageLoader/>}>
          <Dashboard />
        </Suspense>
      </ErrorBoundry>
    </>
  );
}

export default App;
