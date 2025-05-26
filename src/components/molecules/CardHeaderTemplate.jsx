import { CardDescription, CardHeader, CardTitle } from "../ui/card";

export const CardHeaderTemplate = ({ title, description }) => {
  return (
    <CardHeader>
      <CardTitle className="text-3xl font-bold tracking-tight">
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
  );
};
