import { cn } from '@/lib/utils';

describe('cn utility', () => {
    it('should merge class names correctly', () => {
        expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should handle conditionals', () => {
        expect(cn('bg-red-500', false && 'text-white')).toBe('bg-red-500');
        expect(cn('bg-red-500', true && 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should resolve conflicting tailwind classes', () => {
        // tailwind-merge should keep the last one
        expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
        expect(cn('p-4', 'p-2')).toBe('p-2');
    });
});
