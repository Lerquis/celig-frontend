import { CardHeaderTemplate } from "../../molecules/CMS/CardHeaderTemplate";
import { Card, CardContent } from "../../ui/card";

export const CardTemplate = ({ title, description, children }) => {
  return (
    <Card>
      <CardHeaderTemplate title={title} description={description} />
      <CardContent>{children}</CardContent>
    </Card>
  );
};
