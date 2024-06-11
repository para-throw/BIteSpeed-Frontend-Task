import { Button } from "@/components/ui/button";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Position,
} from "reactflow";

import DraggableItem from "@/components/DraggableItem";
import DropableArea from "@/components/DropableArea";
import TextUpdaterNode from "@/components/TextUpdateNode";
import { useStore } from "@/store";
import { MessageTypes } from "@/types";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ConfettiComp from "@/components/Confetti";

const nodeTypes = { textUpdater: TextUpdaterNode };

export default function App() {
  const [error, setError] = useState<MessageTypes>();
  const [visible, setVisible] = useState(false);

  const edges = useStore((state) => state.edges);
  const setEdges = useStore((state) => state.setEdges);
  const onEdgesChange = useStore((state) => state.onEdgesChange);

  const nodes = useStore((state) => state.nodes);
  const setNodes = useStore((state) => state.setNodes);
  const onNodesChange = useStore((state) => state.onNodesChange);

  const activeNode = useStore((state) => state.activeNode);
  const setActiveNode = useStore((state) => state.setActiveNode);

  const onConnect = (params: Edge | Connection) => {
    const sourceNodeHasOutgoing = edges.some(
      (edge) => edge.source === params.source
    );
    if (!sourceNodeHasOutgoing) {
      const newConnection = {
        id: `e${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
      } as Edge;

      setEdges([...edges, newConnection]);
    } else {
      setError({
        type: "error",
        message: "This node cannot have multiple connection",
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.over.id === "react-flow-container") {
      let newNode = [
        ...nodes,

        {
          id: uuidv4(),
          type: "textUpdater",
          position: { x: 480, y: 0 },
          data: { message: "Some other data" },
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
        },
      ];
      setNodes(newNode);
    }
  };

  const handleSave = () => {
    const unconnectedNodes = nodes.filter((node) => {
      const nodeConnected = edges.some(
        (edge) => edge.source === node.id || edge.target === node.id
      );
      return !nodeConnected;
    });

    if (unconnectedNodes.length > 0) {
      setError({
        type: "error",
        message: `Node ${unconnectedNodes
          .map((item) => item.id)
          .join(", ")} is not connected`,
      });
    } else {
      setError({
        type: "success",
        message: "Save successful",
      });
    }
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setActiveNode("");
  };

  const setNewValueFromId = (activeId: string, newVal: string) => {
    const updatedItems = nodes.map((node) => {
      if (node.id === activeId) {
        return {
          ...node,
          data: {
            ...node.data,
            message: newVal,
          },
        };
      }
      return node;
    });
    setNodes(updatedItems);
  };

  const findItemFromId = (activeId: string) => {
    return nodes.find((node) => node.id === activeId);
  };

  useEffect(() => {
    console.log("nodes", nodes);
    if (nodes[2] && nodes[2].data.message.toLowerCase() === "let you down") {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [nodes]);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <ConfettiComp visible={visible} setVisible={setVisible} />
      <div className="grid grid-cols-[1fr_300px] grid-rows-[60px_1fr] h-screen w-screen">
        <div className="col-span-2 flex justify-end items-center px-4 border-b-slate border-b-2 gap-2">
          {error && error.type === "error" && (
            <div className="bg-red-200 rounded-md px-2 py-1 text-xs text-red-600">
              {error.message}
            </div>
          )}
          {error && error.type === "success" && (
            <div className="bg-green-200 rounded-md px-2 py-1 text-xs text-green-600">
              {error.message}
            </div>
          )}
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleClear}>Clear</Button>
        </div>
        <div>
          <DropableArea>
            <ReactFlow
              nodes={nodes}
              nodeTypes={nodeTypes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(e, node) => setActiveNode(node.id)}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </DropableArea>
        </div>

        {activeNode ? (
          <div className="border-l-slate-200 border-l-2">
            <div className="flex items-center justify-center py-2 border-b w-full relative">
              <ArrowLeft
                className="absolute left-2 hover:cursor-pointer hover:bg-black/10 p-1 rounded-md transition-all"
                size={24}
                onClick={() => setActiveNode("")}
              />
              <div>Message</div>
            </div>
            <div className="flex flex-col px-2 py-2 gap-1">
              <span>Text</span>
              <textarea
                value={findItemFromId(activeNode)?.data.message || ""}
                onChange={(e) => setNewValueFromId(activeNode, e.target.value)}
                className="w-[95%] border rounded-sm px-2 py-1"
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 p-2 border-l-2 border-l-slate-200">
            <DraggableItem id="item" />
          </div>
        )}
      </div>
    </DndContext>
  );
}
