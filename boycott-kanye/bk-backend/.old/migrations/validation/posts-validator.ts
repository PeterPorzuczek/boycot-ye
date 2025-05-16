/**
 * Posts validation module
 */

/**
 * Validates a post object
 * 
 * @param post Post object to validate
 * @returns Validation result with errors if any
 */
export function validatePost(post: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if post is an object
  if (!post || typeof post !== 'object') {
    return { valid: false, errors: ['Post must be an object'] };
  }
  
  // Validate title
  if (!post.title) {
    errors.push('Title is required');
  } else if (typeof post.title !== 'string') {
    errors.push('Title must be a string');
  } else if (post.title.length < 2) {
    errors.push('Title must be at least 2 characters long');
  } else if (post.title.length > 100) {
    errors.push('Title must be at most 100 characters long');
  }
  
  // Validate content
  if (post.content !== undefined && typeof post.content !== 'string') {
    errors.push('Content must be a string if provided');
  }
  
  // Validate published
  if (post.published !== undefined && typeof post.published !== 'boolean') {
    errors.push('Published must be a boolean if provided');
  }
  
  // Validate created date
  if (post.created !== undefined) {
    try {
      new Date(post.created);
    } catch (e) {
      errors.push('Created must be a valid date if provided');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
} 