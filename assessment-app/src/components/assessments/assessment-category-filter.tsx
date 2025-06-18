"use client";

import { Button } from "@/components/ui/button";
import { ASSESSMENT_CATEGORIES } from "@/lib/constants";
import type { AssessmentCategory } from "@/lib/types";
import { ListFilter } from "lucide-react";

interface AssessmentCategoryFilterProps {
  selectedCategory: AssessmentCategory | null;
  onSelectCategory: (category: AssessmentCategory | null) => void;
}

export function AssessmentCategoryFilter({
  selectedCategory,
  onSelectCategory,
}: AssessmentCategoryFilterProps) {
  const categories: (AssessmentCategory | null)[] = [null, ...ASSESSMENT_CATEGORIES];

  return (
    <div className="mb-8 p-4 bg-card rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <ListFilter className="w-5 h-5 mr-2 text-primary" />
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category || "all"}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onSelectCategory(category)}
            className={`transition-all duration-150 ease-in-out ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent/50 hover:border-accent"
            }`}
          >
            {category || "All Categories"}
          </Button>
        ))}
      </div>
    </div>
  );
}
