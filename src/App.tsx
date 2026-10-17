import { Suspense } from "react";
import { ErrorBoundry } from "./components/ErrorBoundry/ErrorBoundry";
import PageLoader from "./components/PageLoader/pageLoader";

import Layout from "./pages/layout";




function App() {
  return (
    <>
      <ErrorBoundry>
        <Suspense fallback={<PageLoader />}>
          <Layout />
        </Suspense>
      </ErrorBoundry>
    </>
  );
}

export default App;
