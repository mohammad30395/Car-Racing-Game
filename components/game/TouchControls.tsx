import { Button } from "@/components/ui/Button";

interface TouchControlsProps {
  onLeft: () => void;
  onRight: () => void;
}

export function TouchControls({ onLeft, onRight }: TouchControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:hidden">
      <Button onClick={onLeft} size="lg" variant="secondary">
        Left
      </Button>
      <Button onClick={onRight} size="lg" variant="secondary">
        Right
      </Button>
    </div>
  );
}
