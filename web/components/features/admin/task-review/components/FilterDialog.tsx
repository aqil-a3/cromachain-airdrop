import { Button } from "@/components/ui/button";
import { FaFilter } from "react-icons/fa6";
import { useTaskReviewData } from "../provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { SetStateAction, useState } from "react";
import { taskUserColumnDefs } from "../variables/columnDef";
import { Plus, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ColumnFiltersState } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type ValueLabel = {
  value: string;
  label: string;
};

const columnOptions: ValueLabel[] = taskUserColumnDefs
  .map((tur) => ({
    value: tur.id as string,
    label: tur.header as string,
  }))
  .filter((tur) => tur.label !== "Actions");

export default function FilterDialog() {
  const { columnFilters, setColumnFilters } = useTaskReviewData();
  const [filter, setFilter] = useState<ColumnFiltersState>(columnFilters);
  const totalRules = columnFilters.length;

  const addHandler = () => {
    setFilter([
      ...filter,
      {
        id: columnOptions[0].value,
        value: "",
      },
    ]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-300">
          <FaFilter className="text-gray-100" />{" "}
          {totalRules === 0
            ? "Filter"
            : `Filtered by ${totalRules} ${totalRules > 1 ? "rules" : "rule"}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[540px] space-y-4">
        {filter.length === 0 ? (
          <div>
            <strong>No filters applied to this view</strong>
            <p>Add a column below to filter the view</p>
          </div>
        ) : (
          filter.map((_, index) => (
            <FilterSelect
              key={index + 1}
              filter={filter}
              index={index}
              items={columnOptions}
              setFilter={setFilter}
            />
          ))
        )}
        <Separator />
        <div className="flex justify-between">
          <Button variant="outline" size={"sm"} onClick={addHandler}>
            <Plus /> Add Filter
          </Button>
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => setColumnFilters(filter)}
          >
            Apply Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const FilterSelect: React.FC<{
  items: ValueLabel[];
  index: number;
  filter: ColumnFiltersState;
  setFilter: React.Dispatch<SetStateAction<ColumnFiltersState>>;
}> = ({ items, index, setFilter, filter }) => {
  const deleteHandler = () => {
    setFilter(filter.filter((_, i) => i !== index));
  };

  const idUpdate = (e: string) => {
    setFilter((prev) => {
      const newFilters = [...prev];
      newFilters[index].id = e;
      return newFilters;
    });
  };

  const valueUpdate = (e: string) => {
    setFilter((prev) => {
      const newFilters = [...prev];
      newFilters[index].value = e;
      return newFilters;
    });
  };

  return (
    <div className="flex gap-4">
      <Select value={filter[index].id} onValueChange={(e) => idUpdate(e)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={"ID"} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        value={filter[index].value as string}
        onChange={(e) => valueUpdate(e.target.value)}
      />
      <Button variant={"ghost"} size={"icon"} onClick={deleteHandler}>
        <X />
      </Button>
    </div>
  );
};
