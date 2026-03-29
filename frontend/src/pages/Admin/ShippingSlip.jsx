import React, { forwardRef } from 'react';

const BRAND_NAME = 'FASHION CITY';
const BRAND_TAGLINE = 'CLOTHING BRAND';
const SHIPPER_ADDRESS = 'Near hamdard chowk sector A 2 Township, Lahore';
const SHIPPER_PHONE = '03295877778';

const ShippingSlip = forwardRef(({ order }, ref) => {
    if (!order) return null;

    const customerName = order.guest_name || order.user?.name || 'N/A';
    const totalQty = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalPacks = 1;
    const codAmount = order.total_amount || order.total || 0;
    const orderDate = new Date(order.created_at);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    }) + ' ' + orderDate.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true
    });

    // Build item description
    const description = order.order_items?.map(item => {
        const parts = [`${item.quantity} x ${item.product_name}`];
        if (item.color) parts.push(item.color);
        if (item.size) parts.push(item.size);
        return parts.join(' ');
    }).join(', ') || '';

    return (
        <div ref={ref} className="shipping-slip">
            {/* Header */}
            <div className="slip-header">
                <div className="slip-brand">
                    <h1>{BRAND_NAME}</h1>
                    <span>{BRAND_TAGLINE}</span>
                </div>
                <div className="slip-order-barcode">
                    <div className="slip-order-label">Order Number:</div>
                    <div className="slip-order-number">{order.order_number}</div>
                </div>
            </div>

            {/* Main body - two columns */}
            <div className="slip-body">
                {/* Left column - Shipping address */}
                <div className="slip-left">
                    <table className="slip-address-table">
                        <thead>
                            <tr><th colSpan="2">Shipping Address</th></tr>
                        </thead>
                        <tbody>
                            <tr><td colSpan="2" className="slip-name">{customerName}</td></tr>
                            <tr><td colSpan="2">{order.shipping_address}</td></tr>
                            <tr><td colSpan="2">{order.phone}</td></tr>
                            <tr><td colSpan="2">Pakistan</td></tr>
                            <tr><td colSpan="2">{order.city}</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Right column - Order info */}
                <div className="slip-right">
                    <table className="slip-info-table">
                        <tbody>
                            <tr>
                                <td className="slip-info-label">Order</td>
                                <td className="slip-info-label">Weight</td>
                            </tr>
                            <tr>
                                <td className="slip-info-value">{order.order_number}</td>
                                <td className="slip-info-value">1KG</td>
                            </tr>
                            <tr>
                                <td className="slip-info-label">Service</td>
                                <td className="slip-info-label">Date</td>
                            </tr>
                            <tr>
                                <td className="slip-info-value">COD</td>
                                <td className="slip-info-value">{formattedDate}</td>
                            </tr>
                            <tr>
                                <td className="slip-info-label">Packs / Qty</td>
                                <td className="slip-info-label">COD Amount</td>
                            </tr>
                            <tr>
                                <td className="slip-info-value">{totalPacks} / {totalQty}</td>
                                <td className="slip-info-value slip-cod-amount">Rs{codAmount.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="slip-footer">
                <div className="slip-shipper">
                    <strong>Shipper Address:</strong> {SHIPPER_ADDRESS}
                </div>
                <div className="slip-contact">
                    <strong>Contact Us at</strong> ({SHIPPER_PHONE})
                </div>
            </div>
            <div className="slip-description">
                <strong>Description:</strong> {description}
            </div>
        </div>
    );
});

ShippingSlip.displayName = 'ShippingSlip';

export default ShippingSlip;
