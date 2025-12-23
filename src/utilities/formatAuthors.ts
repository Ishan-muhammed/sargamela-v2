/**
 * Formats an array of author objects into a comma-separated string
 * @param authors Array of author objects
 * @returns Formatted string of author names
 */
export const formatAuthors = (authors: any[]) => {
  // Ensure we don't have any authors without a name
  const authorNames = authors.map((author) => author.name).filter(Boolean)

  // Return comma-separated string
  return authorNames.join(', ')
}
