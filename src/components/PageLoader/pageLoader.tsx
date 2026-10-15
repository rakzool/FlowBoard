import Paper from "../DesignComponents/Paper";

const PageLoader = () => {
  return (
    <Paper className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
    </Paper>
  );
};

export default PageLoader;
