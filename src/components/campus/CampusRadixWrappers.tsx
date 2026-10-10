import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

/**
 * Campus-Scoped SelectContent wrapper that injects .campus-theme onto the portaled container
 */
export const CampusSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={`campus-theme bg-white text-slate-900 border border-slate-300 shadow-xl rounded-xl p-1 z-50 overflow-hidden ${className || ""}`}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
CampusSelectContent.displayName = "CampusSelectContent";

/**
 * Campus-Scoped PopoverContent wrapper
 */
export const CampusPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      className={`campus-theme bg-white text-slate-900 border border-slate-300 shadow-xl rounded-xl p-4 z-50 ${className || ""}`}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
CampusPopoverContent.displayName = "CampusPopoverContent";

/**
 * Campus-Scoped DropdownMenuContent wrapper
 */
export const CampusDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      className={`campus-theme bg-white text-slate-900 border border-slate-300 shadow-xl rounded-xl p-1 z-50 min-w-[8rem] ${className || ""}`}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
));
CampusDropdownMenuContent.displayName = "CampusDropdownMenuContent";
