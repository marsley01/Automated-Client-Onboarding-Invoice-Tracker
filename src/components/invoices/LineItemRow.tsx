"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatKES } from "@/lib/utils";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface LineItemRowProps {
  item: LineItem;
  index: number;
  onChange: (index: number, field: keyof LineItem, value: string | number) => void;
  onRemove: (index: number) => void;
}

export default function LineItemRow({ item, index, onChange, onRemove }: LineItemRowProps) {
  return (
    <div className="grid grid-cols-12 gap-3 items-start">
      <div className="col-span-5">
        <Input
          value={item.description}
          onChange={(e) => onChange(index, "description", e.target.value)}
          placeholder="Description of service..."
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          step="1"
          min="0"
          value={item.quantity}
          onChange={(e) => onChange(index, "quantity", parseFloat(e.target.value) || 0)}
          placeholder="Qty"
        />
      </div>
      <div className="col-span-3">
        <Input
          type="number"
          step="0.01"
          min="0"
          value={item.unit_price}
          onChange={(e) => onChange(index, "unit_price", parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          icon={<span className="text-xs">KES</span>}
        />
      </div>
      <div className="col-span-1 flex items-center justify-end h-[42px]">
        <span className="text-sm font-medium text-[var(--text-primary)]">{formatKES(item.total)}</span>
      </div>
      <div className="col-span-1 flex items-center justify-center h-[42px]">
        <Button variant="ghost" size="sm" onClick={() => onRemove(index)} className="text-[var(--error)]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
