import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminService, categoryService, productService } from '../../services/api';
import { toast } from 'react-hot-toast';
import ImageUpload from '../../components/common/ImageUpload';

const PRESET_COLORS = [
    // Basics
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Off White', hex: '#FAF9F6' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Ivory', hex: '#FFFFF0' },
    { name: 'Beige', hex: '#D2B48C' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Charcoal', hex: '#36454F' },
    { name: 'Silver', hex: '#C0C0C0' },
    // Reds & Pinks
    { name: 'Red', hex: '#EF4444' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Wine', hex: '#722F37' },
    { name: 'Rust', hex: '#B7410E' },
    { name: 'Coral', hex: '#FF7F50' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Hot Pink', hex: '#FF69B4' },
    { name: 'Baby Pink', hex: '#F4C2C2' },
    { name: 'Rose', hex: '#FF007F' },
    { name: 'Magenta', hex: '#FF00FF' },
    { name: 'Peach', hex: '#FFDAB9' },
    // Blues
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Navy', hex: '#1E3A5F' },
    { name: 'Royal Blue', hex: '#4169E1' },
    { name: 'Sky Blue', hex: '#87CEEB' },
    { name: 'Baby Blue', hex: '#89CFF0' },
    { name: 'Teal', hex: '#14B8A6' },
    { name: 'Turquoise', hex: '#40E0D0' },
    { name: 'Aqua', hex: '#00FFFF' },
    // Greens
    { name: 'Green', hex: '#22C55E' },
    { name: 'Emerald', hex: '#50C878' },
    { name: 'Forest Green', hex: '#228B22' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Sage', hex: '#BCB88A' },
    { name: 'Mint', hex: '#98FF98' },
    { name: 'Sea Green', hex: '#2E8B57' },
    // Yellows & Oranges
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Mustard', hex: '#FFDB58' },
    { name: 'Gold', hex: '#D4A017' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Burnt Orange', hex: '#CC5500' },
    // Purples
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Plum', hex: '#8E4585' },
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Mauve', hex: '#E0B0FF' },
    { name: 'Lilac', hex: '#C8A2C8' },
    { name: 'Indigo', hex: '#4B0082' },
    // Browns & Earthy
    { name: 'Brown', hex: '#92400E' },
    { name: 'Chocolate', hex: '#7B3F00' },
    { name: 'Tan', hex: '#D2B48C' },
    { name: 'Camel', hex: '#C19A6B' },
    { name: 'Khaki', hex: '#BDB76B' },
    { name: 'Taupe', hex: '#483C32' },
    { name: 'Coffee', hex: '#6F4E37' },
    { name: 'Copper', hex: '#B87333' },
];

const ProductForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [customColor, setCustomColor] = useState('#000000');
    const [customColorName, setCustomColorName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sale_price: '',
        category_ids: [],
        stock: '',
        sizes: '',
        colors: []
    });

    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await categoryService.getAll();
                setCategories(data);

                if (isEdit) {
                    const { data: prod } = await adminService.getProduct(id);
                    setFormData({
                        name: prod.name,
                        description: prod.description,
                        price: prod.price,
                        sale_price: prod.sale_price || '',
                        category_ids: prod.category_ids || (prod.category_id ? [prod.category_id] : []),
                        stock: prod.stock,
                        sizes: prod.sizes ? prod.sizes.join(', ') : '',
                        colors: prod.colors || []
                    });
                    setImages(prod.images || []);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isUnstitched = categories.some(c =>
            formData.category_ids.includes(c.id) && c.slug === 'unstitched'
        );

        const payload = {
            ...formData,
            images: images.filter(Boolean),
            sizes: isUnstitched ? [] : formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            colors: formData.colors,
            sale_price: formData.sale_price || null
        };

        try {
            if (isEdit) {
                await adminService.updateProduct(id, payload);
                toast.success('Product updated');
            } else {
                await adminService.createProduct(payload);
                toast.success('Product created');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (index, url) => {
        const newImages = [...images];
        if (url) {
            newImages[index] = url;
        } else {
            newImages.splice(index, 1);
        }
        setImages(newImages);
    };

    const addImageSlot = () => {
        setImages([...images, '']);
    };

    // Check if unstitched category is selected
    const isUnstitched = categories.some(c =>
        formData.category_ids.includes(c.id) && c.slug === 'unstitched'
    );

    const toggleColor = (colorName) => {
        setFormData(prev => {
            const exists = prev.colors.includes(colorName);
            return {
                ...prev,
                colors: exists
                    ? prev.colors.filter(c => c !== colorName)
                    : [...prev.colors, colorName]
            };
        });
    };

    const addCustomColor = () => {
        const name = customColorName.trim() || customColor;
        if (!formData.colors.includes(name)) {
            setFormData(prev => ({ ...prev, colors: [...prev.colors, name] }));
        }
        setCustomColorName('');
    };

    const removeColor = (colorName) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== colorName)
        }));
    };

    return (
        <div className="admin-card" style={{ maxWidth: '700px' }}>
            <h2 className="font-bold" style={{ fontSize: '20px', marginBottom: '24px' }}>
                {isEdit ? 'Edit Product' : 'New Product'}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input
                        className="form-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Categories</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                        {categories.map(c => (
                            <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.category_ids.includes(c.id)}
                                    onChange={(e) => {
                                        const { checked } = e.target;
                                        setFormData(prev => {
                                            const newIds = checked
                                                ? [...prev.category_ids, c.id]
                                                : prev.category_ids.filter(id => id !== c.id);
                                            return { ...prev, category_ids: newIds };
                                        });
                                    }}
                                />
                                {c.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">Price</label>
                        <input
                            type="number"
                            className="form-input"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Sale Price (Optional)</label>
                        <input
                            type="number"
                            className="form-input"
                            name="sale_price"
                            value={formData.sale_price}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input
                        type="number"
                        className="form-input"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-input"
                        rows="4"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Image Upload Section */}
                <div className="form-group">
                    <label className="form-label" style={{ marginBottom: '12px', fontSize: '15px' }}>
                        Product Images
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        {images.map((img, index) => (
                            <ImageUpload
                                key={index}
                                initialImage={img}
                                label={`Image ${index + 1}`}
                                onUpload={(url) => handleImageUpload(index, url)}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addImageSlot}
                        style={{
                            marginTop: '12px',
                            padding: '10px 20px',
                            border: '2px dashed #9ca3af',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            color: '#6b7280',
                            cursor: 'pointer',
                            fontSize: '14px',
                            width: '100%',
                            transition: 'all 0.2s'
                        }}
                    >
                        + Add Image
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {/* Sizes - hidden for unstitched products */}
                    {!isUnstitched && (
                        <div className="form-group">
                            <label className="form-label">Sizes (Comma separated)</label>
                            <input
                                className="form-input"
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleChange}
                                placeholder="S, M, L, XL"
                            />
                        </div>
                    )}
                    {isUnstitched && (
                        <div className="form-group">
                            <label className="form-label" style={{ color: '#9ca3af' }}>
                                Sizes — Not applicable for unstitched products
                            </label>
                        </div>
                    )}

                    {/* Colors - Dropdown picker */}
                    <div className="form-group">
                        <label className="form-label">Colors</label>

                        {/* Selected colors display */}
                        {formData.colors.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                {formData.colors.map(color => {
                                    const preset = PRESET_COLORS.find(p => p.name === color);
                                    const bgColor = preset ? preset.hex : color;
                                    const isLight = ['White', 'Off White', 'Cream', 'Ivory', 'Beige', 'Peach', 'Lavender', 'Silver', 'Baby Pink', 'Baby Blue', 'Sky Blue', 'Mint', 'Mustard', 'Mauve', 'Lilac', 'Sage', 'Khaki'].some(l => l === color || l === bgColor);
                                    return (
                                        <span
                                            key={color}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 10px 4px 6px',
                                                borderRadius: '20px',
                                                border: '1px solid #e5e7eb',
                                                backgroundColor: '#f9fafb',
                                                fontSize: '13px'
                                            }}
                                        >
                                            <span style={{
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                backgroundColor: bgColor,
                                                border: isLight ? '1px solid #d1d5db' : '1px solid transparent',
                                                flexShrink: 0
                                            }} />
                                            {color}
                                            <button
                                                type="button"
                                                onClick={() => removeColor(color)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#9ca3af',
                                                    fontSize: '16px',
                                                    padding: '0 2px',
                                                    lineHeight: 1
                                                }}
                                            >×</button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Color dropdown */}
                        <select
                            className="form-input"
                            value=""
                            onChange={(e) => {
                                if (e.target.value) {
                                    toggleColor(e.target.value);
                                }
                            }}
                            style={{ marginBottom: '10px', cursor: 'pointer' }}
                        >
                            <option value="">— Select a color to add —</option>
                            {PRESET_COLORS.map(({ name, hex }) => (
                                <option
                                    key={name}
                                    value={name}
                                    disabled={formData.colors.includes(name)}
                                    style={{
                                        padding: '6px 10px',
                                        color: formData.colors.includes(name) ? '#9ca3af' : '#111'
                                    }}
                                >
                                    {formData.colors.includes(name) ? `✓ ${name}` : `● ${name}`}
                                </option>
                            ))}
                        </select>

                        {/* Custom color picker */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px',
                            border: '1px dashed #d1d5db',
                            borderRadius: '8px'
                        }}>
                            <input
                                type="color"
                                value={customColor}
                                onChange={(e) => setCustomColor(e.target.value)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            />
                            <input
                                type="text"
                                className="form-input"
                                value={customColorName}
                                onChange={(e) => setCustomColorName(e.target.value)}
                                placeholder="Custom color name (e.g. Sky Blue)"
                                style={{ flex: 1, marginBottom: 0 }}
                            />
                            <button
                                type="button"
                                onClick={addCustomColor}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    whiteSpace: 'nowrap'
                                }}
                            >+ Add</button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
