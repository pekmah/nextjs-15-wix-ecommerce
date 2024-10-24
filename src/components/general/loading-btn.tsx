import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ILoadingBtnProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingBtn({
  loading,
  disabled,
  className,
  ...props
}: ILoadingBtnProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Loader2 className={"size-5 animate-spin"} />}
      {props.children}
    </Button>
  );
}
