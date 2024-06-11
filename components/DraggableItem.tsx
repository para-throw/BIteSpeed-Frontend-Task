import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { MessageCircleMore } from "lucide-react";

const DraggableItem = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border-[#0ea5e9] border h-fit flex flex-col items-center justify-center py-2 rounded-sm text-sm gap-1 text-[#0ea5e9]"
    >
      <MessageCircleMore size={18} color="#0ea5e9" />
      <span className="font-semibold">Message</span>
    </div>
  );
};

export default DraggableItem;
