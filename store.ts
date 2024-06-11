import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  Position,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Node,
} from "reactflow";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  activeNode: string;
  setActiveNode: (node: string) => void;
};

export const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: uuidv4(),
      type: "textUpdater",
      position: { x: 0, y: 0 },
      data: { message: "Never gona give" },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: uuidv4(),
      type: "textUpdater",
      position: { x: 240, y: 0 },
      data: { message: "You up, never gona" },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
    },
  ],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  activeNode: "",
  setActiveNode: (node: string) => set({ activeNode: node }),
}));
