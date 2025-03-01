"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainNav } from "@/components/layout/main-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerCard } from "@/components/workers/worker-card";
import { AddWorkerDialog } from "@/components/workers/add-worker-dialog";
import { useWorkersStore, useFirmsStore } from "@/lib/store";
import { Plus, Search } from "lucide-react";

export default function WorkersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { workers, getWorkersByFirm } = useWorkersStore();
  const { selectedFirmId, firms } = useFirmsStore();
  const [filteredWorkers, setFilteredWorkers] = useState(workers);

  useEffect(() => {
    if (!selectedFirmId) return;
    
    const firmWorkers = getWorkersByFirm(selectedFirmId);
    const filtered = firmWorkers.filter(worker => 
      worker.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredWorkers(filtered);
  }, [searchQuery, workers, selectedFirmId, getWorkersByFirm]);

  const selectedFirm = firms.find(firm => firm.id === selectedFirmId);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 pb-20 md:pb-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Workers</h2>
            {selectedFirm && (
              <p className="text-muted-foreground">
                Manage workers for {selectedFirm.name}
              </p>
            )}
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)} 
            disabled={!selectedFirmId}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Worker
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
        
        {!selectedFirmId ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex h-[200px] items-center justify-center rounded-md border border-dashed"
          >
            <div className="text-center">
              <h3 className="text-lg font-medium">No firm selected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please select a firm to view and manage workers
              </p>
            </div>
          </motion.div>
        ) : filteredWorkers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex h-[200px] items-center justify-center rounded-md border border-dashed"
          >
            <div className="text-center">
              <h3 className="text-lg font-medium">No workers found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery 
                  ? "No workers match your search criteria" 
                  : "Get started by adding a worker"}
              </p>
              {!searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Worker
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredWorkers.map((worker) => (
                <motion.div
                  key={worker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <WorkerCard worker={worker} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      
      <AddWorkerDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}


