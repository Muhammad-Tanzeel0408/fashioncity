import React, { useState } from 'react';
import api from '../../services/api';

const ImageUpload = ({ onUpload, initialImage = '', label = 'Upload Image' }) => {
    const [image, setImage] = useState(initialImage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('File size should be less than 10MB');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const uploadedUrl = response.data.url;
            setImage(uploadedUrl);
            if (onUpload) onUpload(uploadedUrl);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setImage('');
        if (onUpload) onUpload('');
    };

    const styles = {
        wrapper: {
            width: '100%',
            marginBottom: '8px'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '8px'
        },
        error: {
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '8px'
        },
        dropzone: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '30px 20px',
            border: '2px dashed #9ca3af',
            borderRadius: '8px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'border-color 0.2s ease',
            backgroundColor: '#fafafa',
            minHeight: '150px'
        },
        fileInput: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
        },
        iconText: {
            textAlign: 'center'
        },
        icon: {
            fontSize: '36px',
            color: '#9ca3af',
            marginBottom: '8px'
        },
        uploadLabel: {
            fontSize: '14px',
            color: '#6366f1',
            fontWeight: 500,
            cursor: 'pointer'
        },
        hint: {
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '4px'
        },
        previewContainer: {
            position: 'relative',
            width: '100%',
            height: '180px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #d1d5db'
        },
        previewImage: {
            width: '100%',
            height: '100%',
            objectFit: 'contain'
        },
        removeBtn: {
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            lineHeight: 1
        }
    };

    return (
        <div style={styles.wrapper}>
            {label && <label style={styles.label}>{label}</label>}

            {error && <p style={styles.error}>{error}</p>}

            {!image ? (
                <div style={styles.dropzone}>
                    <input
                        type="file"
                        style={styles.fileInput}
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={loading}
                    />
                    <div style={styles.iconText}>
                        <div style={styles.icon}>{loading ? '⏳' : '📁'}</div>
                        <div style={styles.uploadLabel}>
                            {loading ? 'Uploading...' : 'Click to upload'}
                        </div>
                        <p style={styles.hint}>PNG, JPG, GIF, WebP up to 10MB</p>
                    </div>
                </div>
            ) : (
                <div style={styles.previewContainer}>
                    <img src={image} alt="Uploaded" style={styles.previewImage} />
                    <button
                        type="button"
                        onClick={handleRemove}
                        style={styles.removeBtn}
                        title="Remove"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
