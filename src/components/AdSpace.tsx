
import { Card, CardContent } from "@/components/ui/card";

const AdSpace = () => {
  return (
    <Card className="shadow-sm overflow-hidden bg-gradient-to-r from-accent1/10 to-accent1/5 border border-accent1/20">
      <CardContent className="p-0">
        <div className="p-4 text-center">
          <div className="mb-2 text-xs text-muted-foreground">ADVERTISEMENT</div>
          <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Ad Space Available</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Interested in advertising here?<br />
                Contact us at ads@indianmacro.com
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdSpace;
