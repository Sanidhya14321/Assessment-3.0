
"use client";

import { useState, useMemo } from "react";
import { AssessmentCard } from "@/components/assessments/assessment-card";
import { AssessmentCategoryFilter } from "@/components/assessments/assessment-category-filter";
import { PREDEFINED_ASSESSMENTS } from "@/lib/constants";
import type { Assessment, AssessmentCategory } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search, Star, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function AssessmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<AssessmentCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Predefined assessments are always shown at the top
  const predefinedAssessments = useMemo(() => {
    return PREDEFINED_ASSESSMENTS.filter(assessment => assessment.isPredefined);
  }, []);

  // Other assessments (currently none, this is for future expansion)
  // These would be filterable and searchable.
  const otherAssessments = useMemo(() => {
    return PREDEFINED_ASSESSMENTS.filter((assessment) => {
      if (assessment.isPredefined) return false; // Exclude predefined from this list

      const categoryMatch = selectedCategory ? assessment.category === selectedCategory : true;
      const searchTermMatch = searchTerm
        ? assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return categoryMatch && searchTermMatch;
    });
  }, [selectedCategory, searchTerm]);


  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-headline font-bold text-primary mb-4">Explore Assessments</h1>
        <p className="text-xl text-muted-foreground">
          Test your skills with our curated assessments or explore community contributions.
        </p>
      </motion.div>

      {/* Featured Assessments Section */}
      <section>
        <div className="flex items-center mb-6">
            <Star className="w-7 h-7 text-yellow-400 mr-3" />
            <h2 className="text-3xl font-headline font-semibold text-foreground">Featured Assessments</h2>
        </div>
        {predefinedAssessments.length > 0 ? (
          <motion.div 
            layout 
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {predefinedAssessments.map((assessment) => (
                <motion.div
                  key={assessment.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <AssessmentCard assessment={assessment} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-1">No Featured Assessments</h3>
            <p className="text-muted-foreground">Check back later for curated content.</p>
          </motion.div>
        )}
      </section>

      <Separator className="my-10" />

      {/* Explore Other Assessments Section */}
      <section>
        <div className="flex items-center mb-6">
            <ThumbsUp className="w-7 h-7 text-primary mr-3" />
            <h2 className="text-3xl font-headline font-semibold text-foreground">Explore More</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                  type="text"
                  placeholder="Search other assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
              />
          </div>
        </div>
        
        <AssessmentCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {otherAssessments.length > 0 ? (
          <motion.div 
            layout 
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {otherAssessments.map((assessment) => (
                <motion.div
                  key={assessment.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <AssessmentCard assessment={assessment} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-1">No More Assessments Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory ? "Try adjusting your search or category filters." : "More assessments coming soon!"}
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
