import { Spinner } from "reactstrap";

interface PageLoaderProps {
  label?: string;
}

export const PageLoader = ({ label = "Loading..." }: PageLoaderProps) => {
  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center">
      <div className="text-center">
        <Spinner color="primary" />
        <p className="mb-0 mt-3 text-secondary">{label}</p>
      </div>
    </div>
  );
};
