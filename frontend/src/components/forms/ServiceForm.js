import React, { useState, useEffect } from 'react';

const ServiceForm = ({ onSubmit, service, categories, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    unit: 'fixed',
    category: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        basePrice: service.basePrice || '',
        unit: service.unit || 'fixed',
        category: service.category?._id || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        basePrice: '',
        unit: 'fixed',
        category: categories.length > 0 ? categories[0]._id : '',
      });
    }
  }, [service, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            value={formData.basePrice}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="per hour">Per Hour</option>
            <option value="fixed">Fixed</option>
            <option value="per square foot">Per Square Foot</option>
            <option value="per item">Per Item</option>
            <option value="per day">Per Day</option>
            <option value="per visit">Per Visit</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Service'}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm; 