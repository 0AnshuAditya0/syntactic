import { PanelResizeHandle } from 'react-resizable-panels';
import { GripVertical, GripHorizontal } from 'lucide-react';

interface ResizeHandleProps {
  direction?: 'horizontal' | 'vertical';
}

export function ResizeHandle({ direction = 'horizontal' }: ResizeHandleProps) {
  return (
    <PanelResizeHandle 
      className={`
        bg-[#D1D5DB] hover:bg-[#9CA3AF] active:bg-[#3B82F6] transition-colors group flex items-center justify-center outline-none z-10 relative
        ${direction === 'horizontal' 
          ? 'w-1.5 h-full cursor-col-resize' 
          : 'h-1.5 w-full cursor-row-resize'
        }
      `}
    >
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 rounded-sm">
        {direction === 'horizontal' ? (
          <GripVertical className="w-4 h-4 text-white drop-shadow-md" />
        ) : (
          <GripHorizontal className="w-4 h-4 text-white drop-shadow-md" />
        )}
      </div>
    </PanelResizeHandle>
  );
}
