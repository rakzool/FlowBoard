import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorFallback from "./ErrorFallBack";

type TProps  = {
  children: ReactNode;
}

type TState  = {
  hasError: boolean;
}

export class ErrorBoundry extends Component<TProps, TState> {
  public state: TState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): TState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
       <ErrorFallback />
      );
    }

    return this.props.children;
  }
}
