// src/components/categories/CategoryList.jsx
import Button from '../ui/Button';
import { Pencil, Trash2 } from 'lucide-react';

const CategoryList = ({ categories = [], onEdit, onDelete }) => {
  if (!categories.length) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm">
        <p className="text-3xl mb-2">🏷️</p>
        <p>No categories yet. Add one above.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/10">
      {categories.map((cat) => (
        <li
          key={cat._id}
          className="flex items-center justify-between py-3 px-2 hover:bg-white/5 rounded-xl transition-colors group"
        >
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-sm font-medium text-slate-200">{cat.name}</span>
            {cat.isDefault && (
              <span className="text-xs text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">Default</span>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => onEdit(cat)} className="!px-2">
              <Pencil size={15} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(cat)}
              className="!px-2 hover:!text-rose-400 hover:!bg-rose-500/10"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
