import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { useTRBulksEdit } from "../provider";
import { cn } from "@/lib/utils";

export default function DataCarousel() {
  const { taskReviews, selectedIds, toggleSelect, isLoading } =
    useTRBulksEdit();

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <Carousel className="relative" opts={{ loop: true }}>
        <CarouselContent className="-ml-3 md:-ml-4">
          {taskReviews.map((item, i) => {
            const isSelected = selectedIds.includes(item.id!);
            return (
              <CarouselItem
                key={item.id ?? i}
                className="pl-3 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 py-8"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn(
                    "h-48 flex flex-col justify-between bg-white text-slate-800 rounded-xl shadow-lg px-4 py-8 relative cursor-pointer border-2 border-transparent",
                    isSelected && "border-blue-500",
                    isLoading && "pointer-events-none opacity-60"
                  )}
                  onClick={() => toggleSelect(item.id!)}
                >
                  <div
                    className="absolute top-3 left-3 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(item.id!)}
                    />
                  </div>

                  {/* Badge Data # */}
                  <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full shadow">
                    Data #{i + 1}
                  </span>

                  <div>
                    <p className="text-sm font-medium text-slate-500 truncate">
                      {item.user?.email ?? "No Email"}
                    </p>
                    <h3 className="text-lg font-semibold mt-1 truncate">
                      {item.task?.title ?? "No Task Title"}
                    </h3>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Controls */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-md hover:bg-white rounded-full" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-md hover:bg-white rounded-full" />
      </Carousel>
    </div>
  );
}
