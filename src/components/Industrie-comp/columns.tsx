import { ColumnDef } from "@tanstack/react-table";

export type Industrie = {
  id: string;
  industryName?: string | null;
  prompt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Industrie>[] = [
  {
    accessorKey: "industryName",
    header: "Industry name",
  },
  {
    accessorKey: "prompt",
    header: "Prompt",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at",
  },
];
