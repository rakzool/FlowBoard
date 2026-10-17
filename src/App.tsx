import { Suspense } from "react";
import { ErrorBoundry } from "./components/ErrorBoundry/ErrorBoundry";
import PageLoader from "./components/PageLoader/pageLoader";

import Layout from "./pages/layout";
import ToastProvider from "./components/DesignComponents/ToastProvider";
import BoardFeedbackToaster from "./components/Notifications/BoardFeedbackToaster";




function App() {
  return (
    <ToastProvider>
      <BoardFeedbackToaster />
      <ErrorBoundry>
        <Suspense fallback={<PageLoader />}>
          <Layout />
        </Suspense>
      </ErrorBoundry>
    </ToastProvider>
  );
}

export default App;
