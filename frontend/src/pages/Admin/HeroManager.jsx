import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/api';
import ImageUpload from '../../components/common/ImageUpload';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const emptySlide = { image: '', title: '', subtitle: '', link: '', buttonText: 'SHOP NOW' };

const HeroManager = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data } = await settingsService.getHeroSlides();
                setSlides(data && data.length > 0 ? data : [{ ...emptySlide }]);
            } catch (err) {
                console.error(err);
                setSlides([{ ...emptySlide }]);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...slides];
        updated[index] = { ...updated[index], [field]: value };
        setSlides(updated);
    };

    const handleImageUpload = (index, url) => {
        handleChange(index, 'image', url);
    };

    const addSlide = () => {
        setSlides([...slides, { ...emptySlide }]);
    };

    const removeSlide = (index) => {
        if (slides.length <= 1) {
            toast.error('At least one slide is required');
            return;
        }
        setSlides(slides.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        // Validate
        const valid = slides.every(s => s.image && s.title);
        if (!valid) {
            toast.error('Each slide must have an image and title');
            return;
        }

        setSaving(true);
        try {
            await settingsService.updateHeroSlides(slides);
            toast.success('Hero slides updated successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save hero slides');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="font-bold text-xl">Hero Banner Management</h2>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ gap: '8px' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {slides.map((slide, index) => (
                    <div key={index} className="admin-card" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 className="font-bold" style={{ fontSize: '16px' }}>Slide {index + 1}</h3>
                            <button
                                onClick={() => removeSlide(index)}
                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                title="Remove slide"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* Left: Image */}
                            <div>
                                <ImageUpload
                                    initialImage={slide.image}
                                    label="Slide Image"
                                    onUpload={(url) => handleImageUpload(index, url)}
                                />
                                {slide.image && (
                                    <div style={{
                                        marginTop: '8px',
                                        height: '120px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        backgroundImage: `url(${slide.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        border: '1px solid #e5e7eb'
                                    }} />
                                )}
                            </div>

                            {/* Right: Fields */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input
                                        className="form-input"
                                        value={slide.title}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        placeholder="e.g. WINTER COLLECTION"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subtitle</label>
                                    <input
                                        className="form-input"
                                        value={slide.subtitle}
                                        onChange={(e) => handleChange(index, 'subtitle', e.target.value)}
                                        placeholder="e.g. Stay cozy this season"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Link URL</label>
                                        <input
                                            className="form-input"
                                            value={slide.link}
                                            onChange={(e) => handleChange(index, 'link', e.target.value)}
                                            placeholder="/collections/winter"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Button Text</label>
                                        <input
                                            className="form-input"
                                            value={slide.buttonText}
                                            onChange={(e) => handleChange(index, 'buttonText', e.target.value)}
                                            placeholder="SHOP NOW"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addSlide}
                style={{
                    marginTop: '16px',
                    padding: '14px 24px',
                    border: '2px dashed #9ca3af',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                }}
            >
                <FiPlus /> Add New Slide
            </button>
        </div>
    );
};

export default HeroManager;
