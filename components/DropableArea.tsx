import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

const DropableArea = ({ children }: { children: ReactNode }) => {
  const { setNodeRef } = useDroppable({
    id: "react-flow-container",
  });

  return (
    <div ref={setNodeRef} className="w-full h-full">
      {children}
    </div>
  );
};

export default DropableArea;
