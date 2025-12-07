/**
 * Calculate reading time for a given text
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
    // Remove markdown syntax and code blocks for more accurate count
    const cleanText = text
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`[^`]*`/g, '') // Remove inline code
        .replace(/[#*_~\[\]()]/g, '') // Remove markdown symbols
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\[.*?\]\(.*?\)/g, ''); // Remove links

    // Count words
    const words = cleanText.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Calculate reading time (minimum 1 minute)
    const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    return readingTime;
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadingTime(minutes: number): string {
    return `${minutes} min read`;
}
