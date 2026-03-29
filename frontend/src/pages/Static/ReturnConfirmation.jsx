import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { FiCheckCircle, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import './StaticPages.css';

const STORE_INFO = {
    name: 'FashionCity',
    address: 'Shop #12, Ground Floor, Dolmen Mall Clifton, Karachi, Pakistan',
    phone: '+92 333 1234567',
    email: 'ask@fashioncity.com',
    website: 'www.fashioncity.com',
};

const ReturnConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const returnData = location.state?.returnData;

    // Redirect if accessed directly without form data
    if (!returnData) {
        return <Navigate to="/pages/return-and-exchange" replace />;
    }

    const returnId = `RET-${Date.now()}`;

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        // ---- Header ----
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('FASHIONCITY', pageWidth / 2, y, { align: 'center' });
        y += 8;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Return / Exchange Slip', pageWidth / 2, y, { align: 'center' });
        y += 6;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Return ID: ${returnId}`, pageWidth / 2, y, { align: 'center' });
        doc.setTextColor(0);
        y += 4;

        // Divider
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(20, y, pageWidth - 20, y);
        y += 10;

        // ---- Customer Details ----
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Customer Details', 20, y);
        y += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const customerFields = [
            ['Name', returnData.customerName],
            ['Phone', returnData.phone],
            ['Email', returnData.email || 'N/A'],
            ['Order Number', returnData.orderNumber],
        ];

        customerFields.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, 24, y);
            doc.setFont('helvetica', 'normal');
            doc.text(value, 70, y);
            y += 7;
        });

        y += 6;

        // ---- Return Details ----
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Return Details', 20, y);
        y += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const reasonLabels = {
            defective: 'Defective Product',
            wrong_item: 'Wrong Item Received',
            not_as_described: 'Not as Described',
            size_issue: 'Size Issue',
            changed_mind: 'Changed Mind',
            other: 'Other',
        };

        const resolutionLabels = {
            exchange: 'Exchange for different size/color',
            refund: 'Refund',
            store_credit: 'Store Credit',
        };

        const returnFields = [
            ['Item', returnData.itemDetails || 'N/A'],
            ['Resolution', resolutionLabels[returnData.preferredResolution] || returnData.preferredResolution],
            ['Reason', reasonLabels[returnData.reasonCategory] || returnData.reasonCategory],
        ];

        returnFields.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, 24, y);
            doc.setFont('helvetica', 'normal');
            doc.text(value, 70, y);
            y += 7;
        });

        // Reason description (may be multi-line)
        if (returnData.reason) {
            y += 2;
            doc.setFont('helvetica', 'bold');
            doc.text('Description:', 24, y);
            y += 7;
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(returnData.reason, pageWidth - 48);
            doc.text(lines, 24, y);
            y += lines.length * 6 + 4;
        }

        y += 6;

        // Divider
        doc.line(20, y, pageWidth - 20, y);
        y += 10;

        // ---- Store Address (where to send the return) ----
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Send Your Return To:', 20, y);
        y += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(STORE_INFO.name, 24, y); y += 6;
        doc.text(STORE_INFO.address, 24, y); y += 6;
        doc.text(`Phone: ${STORE_INFO.phone}`, 24, y); y += 6;
        doc.text(`Email: ${STORE_INFO.email}`, 24, y); y += 6;
        doc.text(`Website: ${STORE_INFO.website}`, 24, y);
        y += 12;

        // Divider
        doc.line(20, y, pageWidth - 20, y);
        y += 10;

        // ---- Instructions ----
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Instructions', 20, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const instructions = [
            '1. Print this slip and place it inside the return package.',
            '2. Pack the item securely in its original packaging with all tags attached.',
            '3. Drop off or courier the package to the store address above.',
            '4. Your return will be processed within 7-10 business days after receipt.',
        ];
        instructions.forEach((line) => {
            doc.text(line, 24, y);
            y += 6;
        });

        y += 10;

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(130);
        doc.text(
            `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            pageWidth / 2, y, { align: 'center' }
        );
        y += 5;
        doc.text('Thank you for shopping with FashionCity!', pageWidth / 2, y, { align: 'center' });

        // Save
        doc.save(`FashionCity_Return_${returnId}.pdf`);
    };

    const reasonLabels = {
        defective: 'Defective Product',
        wrong_item: 'Wrong Item Received',
        not_as_described: 'Not as Described',
        size_issue: 'Size Issue',
        changed_mind: 'Changed Mind',
        other: 'Other',
    };

    const resolutionLabels = {
        exchange: 'Exchange for different size/color',
        refund: 'Refund',
        store_credit: 'Store Credit',
    };

    return (
        <div className="static-page container">
            <div className="rc-page">
                {/* Success Header */}
                <div className="rc-header">
                    <FiCheckCircle className="rc-icon" />
                    <h1>Return Request Submitted!</h1>
                    <p>Your return request <strong>{returnId}</strong> has been received. Please download the return slip below, print it, and include it with your return package.</p>
                </div>

                {/* Summary Card */}
                <div className="rc-summary">
                    <h3>Return Summary</h3>
                    <div className="rc-detail-grid">
                        <div className="rc-detail-row">
                            <span className="rc-label">Order Number</span>
                            <span className="rc-value">{returnData.orderNumber}</span>
                        </div>
                        <div className="rc-detail-row">
                            <span className="rc-label">Name</span>
                            <span className="rc-value">{returnData.customerName}</span>
                        </div>
                        <div className="rc-detail-row">
                            <span className="rc-label">Phone</span>
                            <span className="rc-value">{returnData.phone}</span>
                        </div>
                        {returnData.email && (
                            <div className="rc-detail-row">
                                <span className="rc-label">Email</span>
                                <span className="rc-value">{returnData.email}</span>
                            </div>
                        )}
                        {returnData.itemDetails && (
                            <div className="rc-detail-row">
                                <span className="rc-label">Item</span>
                                <span className="rc-value">{returnData.itemDetails}</span>
                            </div>
                        )}
                        <div className="rc-detail-row">
                            <span className="rc-label">Resolution</span>
                            <span className="rc-value">{resolutionLabels[returnData.preferredResolution]}</span>
                        </div>
                        <div className="rc-detail-row">
                            <span className="rc-label">Reason</span>
                            <span className="rc-value">{reasonLabels[returnData.reasonCategory] || returnData.reasonCategory}</span>
                        </div>
                    </div>
                </div>

                {/* Store Address */}
                <div className="rc-store">
                    <h3>Send Your Return To</h3>
                    <p className="rc-store-name">{STORE_INFO.name}</p>
                    <p>{STORE_INFO.address}</p>
                    <p>Phone: {STORE_INFO.phone}</p>
                    <p>Email: {STORE_INFO.email}</p>
                </div>

                {/* Download Button */}
                <button className="rc-download-btn" onClick={generatePDF}>
                    <FiDownload size={18} />
                    Download Return Slip (PDF)
                </button>

                <p className="rc-instruction">Print this slip and paste it with your return package before sending.</p>

                {/* Back */}
                <button className="rc-back-btn" onClick={() => navigate('/')}>
                    <FiArrowLeft size={16} />
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default ReturnConfirmation;
