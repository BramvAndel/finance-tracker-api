/**
 * Dynamic validation middleware
 * @param {Object} rules - Validation rules object
 * @param {Array} rules.required - Array of required field names
 * @param {Object} rules.types - Object mapping field names to their expected types
 * @param {Object} rules.custom - Object mapping field names to custom validation functions
 * @returns {Function} Express middleware function
 */
export const validate = (rules = {}) => {
  return (req, res, next) => {
    const { required = [], types = {}, custom = {} } = rules;
    const errors = [];

    // Check required fields
    for (const field of required) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        errors.push(`Field '${field}' is required`);
      }
    }

    // Check types
    for (const [field, expectedType] of Object.entries(types)) {
      const value = req.body[field];
      
      if (value !== undefined && value !== null && value !== '') {
        switch (expectedType) {
          case 'number':
            if (isNaN(value)) {
              errors.push(`Field '${field}' must be a number`);
            }
            break;
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`Field '${field}' must be a string`);
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`Field '${field}' must be an array`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`Field '${field}' must be a boolean`);
            }
            break;
        }
      }
    }

    // Run custom validations
    for (const [field, validator] of Object.entries(custom)) {
      const value = req.body[field];
      
      if (value !== undefined && value !== null && value !== '') {
        const error = validator(value, req.body);
        if (error) {
          errors.push(error);
        }
      }
    }

    // If there are errors, return 400
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    next();
  };
};

// Predefined custom validators
export const validators = {
  positiveNumber: (value) => {
    if (isNaN(value) || Number(value) <= 0) {
      return 'Must be a positive number';
    }
  },
  
  dateFormat: (value) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return 'Invalid date format. Use YYYY-MM-DD';
    }
  },
  
  role: (value) => {
    if (!['user', 'admin'].includes(value)) {
      return 'Role must be either "user" or "admin"';
    }
  },
  
  minLength: (min) => (value) => {
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
  },
  
  maxLength: (max) => (value) => {
    if (value.length > max) {
      return `Must be at most ${max} characters long`;
    }
  }
};
