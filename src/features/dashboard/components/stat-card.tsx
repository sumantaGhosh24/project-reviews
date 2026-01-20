import {Card, CardContent} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const StatCard = ({title, value, icon}: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
