const validateProduct = (data) => {
    const errors = [];
  
    if (!data.p_name) {
      errors.push("Product name is required.");
    }
  
    return errors;
  };
  
  module.exports = { validateProduct };
  