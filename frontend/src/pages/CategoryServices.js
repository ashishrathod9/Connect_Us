import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../services/api';

const CategoryServices = () => {
    const { categoryId } = useParams();
    const [services, setServices] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategoryServices();
    }, [categoryId]);

    const fetchCategoryServices = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await ApiService.getServicesByCategory(categoryId);
            setServices(data.services || []);
            setCategory(data.category);
            
        } catch (error) {
            console.error('Error fetching category services:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">Error loading services</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link 
                        to="/services"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
                        <li>/</li>
                        <li><Link to="/services" className="hover:text-blue-500">Services</Link></li>
                        <li>/</li>
                        <li className="text-gray-800">{category?.name}</li>
                    </ol>
                </nav>

                {/* Category Header */}
                {category && (
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <div className="flex items-center mb-4">
                            {category.imageUrl && (
                                <img 
                                    src={category.imageUrl} 
                                    alt={category.name}
                                    className="w-20 h-20 object-cover rounded-full mr-6"
                                />
                            )}
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800 mb-2">{category.name}</h1>
                                <p className="text-xl text-gray-600">{category.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Services Grid */}
                {services && services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div 
                                key={service._id} 
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {service.imageUrl && (
                                    <div className="h-48 overflow-hidden rounded-t-xl">
                                        <img 
                                            src={service.imageUrl} 
                                            alt={service.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-2xl font-bold text-blue-600">
                                            ${service.basePrice}
                                            <span className="text-sm text-gray-500 font-normal">/{service.unit}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            service.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                            service.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {service.difficulty}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-500">
                                            Duration: {service.duration} mins
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            service.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {service.isActive ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>
                                    
                                    {service.keywords && service.keywords.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {service.keywords.slice(0, 3).map((keyword, index) => (
                                                    <span 
                                                        key={index}
                                                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <Link 
                                        to={`/services/${service._id}`}
                                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-center block"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🔧</div>
                        <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Services Available</h3>
                        <p className="text-gray-500 mb-6">
                            We're working on adding services for this category. Please check back later.
                        </p>
                        <Link 
                            to="/services"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Browse Other Categories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryServices;