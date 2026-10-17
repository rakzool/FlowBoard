import { lazy, Suspense, type ComponentType } from "react";
import PageLoader from "../components/PageLoader/pageLoader";
type TLazyModule<TProps extends object> = {
  default: ComponentType<TProps>;
};

export default function withSuspense<TProps extends object>(
  loader: () => Promise<TLazyModule<TProps>>,
) {
  const LazyComponent = lazy(loader);

  return function SuspenseComponent(props: TProps) {
    return (
      <Suspense fallback={<PageLoader />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
