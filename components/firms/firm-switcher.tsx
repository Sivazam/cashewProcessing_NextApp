"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFirmsStore } from "@/lib/store";
import { AddFirmDialog } from "@/components/firms/add-firm-dialog";

export function FirmSwitcher() {
  const [open, setOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { firms, selectedFirmId, selectFirm } = useFirmsStore();

  const selectedFirm = firms.find((firm) => firm.id === selectedFirmId);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a firm"
            className="w-[200px] justify-between"
          >
            {selectedFirm ? selectedFirm.name : "Select firm..."}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search firm..." />
              <CommandEmpty>No firm found.</CommandEmpty>
              {firms.length > 0 && (
                <CommandGroup heading="Firms">
                  {firms.map((firm) => (
                    <CommandItem
                      key={firm.id}
                      onSelect={() => {
                        selectFirm(firm.id);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedFirmId === firm.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {firm.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowAddDialog(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add New Firm
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <AddFirmDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </>
  );
}