"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    RowSelectionState,
    Table as TableCore,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React from "react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    columnFilters?: ColumnFiltersState;
    onColumnFiltersChange?: React.Dispatch<
        React.SetStateAction<ColumnFiltersState>
    >;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: React.Dispatch<
        React.SetStateAction<RowSelectionState>
    >;
    enableRowSelection?: boolean;
    enableMultiRowSelection?: boolean;
    HeaderComponent?: (table: TableCore<TData>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    columnFilters,
    rowSelection,
    onRowSelectionChange,
    onColumnFiltersChange,
    enableMultiRowSelection,
    enableRowSelection,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
            rowSelection,
        },
        onColumnFiltersChange,
        onRowSelectionChange,
        enableRowSelection,
        enableMultiRowSelection,
    });

    return (
        <div className="rounded-xl border border-slate-700 bg-slate-900 text-white shadow-sm overflow-hidden my-4">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-slate-800">
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="text-slate-300 text-sm font-medium px-4 py-2"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            const isSelected =
                                row.getIsSelected() && "selected";

                            return (
                                <TableRow
                                    key={row.id}
                                    data-state={isSelected}
                                    className={cn(
                                        "hover:bg-slate-800 transition-colors",
                                        isSelected && "!bg-slate-600",
                                    )}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-4 py-2 text-sm text-slate-100"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-slate-400"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
