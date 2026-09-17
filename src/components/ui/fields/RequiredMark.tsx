export const RequiredMark: React.FC = () => (
  <>
    <span aria-hidden="true" className="text-brand-blue">
      {" *"}
    </span>
    <span className="sr-only"> (required)</span>
  </>
);
