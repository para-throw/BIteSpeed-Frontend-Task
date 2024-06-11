import { useStore } from "@/store";
import { MessageCircleMore } from "lucide-react";
import { Handle, NodeProps, Position } from "reactflow";

type CustomNodeData = {
  message: string;
  label: string;
};

type CustomNodeProps = NodeProps<CustomNodeData>;

function TextUpdateNode(props: CustomNodeProps) {
  return (
    <div className="bg-white rounded-md border-black border w-[200px]">
      <div className="bg-[#ABEEE3] flex gap-1 text-xs items-center rounded-t-md px-2 font-bold py-1">
        <MessageCircleMore size={12} />
        <span>Send message</span>
      </div>
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={props.isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={props.isConnectable}
      />

      <div className="py-1 px-1 rounded-b-md text-sm truncate">
        {props.data.message}
      </div>
    </div>
  );
}

export default TextUpdateNode;
