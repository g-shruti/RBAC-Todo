import { Button } from "reactstrap";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="soft-card bg-white p-5 text-center">
      <h3 className="h5 mb-2">{title}</h3>
      <p className="mb-4 text-secondary">{description}</p>
      {actionLabel && onAction ? (
        <Button color="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
