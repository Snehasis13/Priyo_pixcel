export const products = [
    {
        id: 1,
        name: '3D Hologram Fan',
        brand: 'TechVision',
        sku: 'HOLO-3D-42',
        price: 3999,
        originalPrice: 6999,
        image: 'https://images.unsplash.com/photo-1549423547-d34e6f2129d2?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1549423547-d34e6f2129d2?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?q=80&w=600&auto=format&fit=crop'
        ],
        category: 'LED Frames',
        shortDescription: 'Revolutionary 3D visual display for advertising and home decor.',
        description: `
            <p>Experience the future of display technology with our 3D Hologram Fan. Perfect for advertising, events, or adding a futuristic touch to your home decor.</p>
            <p>This high-resolution LED fan creates stunning floating 3D visuals that appear to exist in mid-air. Upload your own videos and images easily via the companion app.</p>
            <h3>Key Features:</h3>
            <ul>
                <li>High-resolution 3D display</li>
                <li>App control via WiFi</li>
                <li>Low power consumption</li>
                <li>Easy installation</li>
            </ul>
        `,
        specifications: {
            'Diameter': '42cm',
            'Resolution': '1024x1024',
            'Viewing Angle': '170°',
            'Voltage': '12V',
            'Warranty': '1 Year'
        },
        inStock: false,
        stockQuantity: 0,
        isSale: true,
        rating: 4.8,
        tags: ['3D', 'Tech', 'Advertising', 'LED']
    },
    {
        id: 2,
        name: 'BEST BROTHER',
        brand: 'Priyo Styles',
        sku: 'TS-BRO-001',
        price: 999,
        originalPrice: 1499,
        image: 'https://images.unsplash.com/photo-1522202613583-05b630dc9961?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1522202613583-05b630dc9961?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop'
        ],
        category: 'T-Shirts',
        shortDescription: 'Premium cotton t-shirt for your superhero brother.',
        description: `
            <p>Show your love with this high-quality "BEST BROTHER" printed t-shirt. Made from 100% combed cotton for maximum comfort and durability.</p>
            <p>The print is high-definition and fade-resistant, ensuring it looks great wash after wash.</p>
        `,
        specifications: {
            'Material': '100% Cotton',
            'Fit': 'Regular Fit',
            'GSM': '180',
            'Wash Care': 'Machine Wash Cold',
            'Origin': 'Made in India'
        },
        inStock: true,
        stockQuantity: 50,
        isSale: true,
        rating: 4.9,
        tags: ['Gift', 'Brother', 'Cotton', 'Apparel']
    },
    {
        id: 3,
        name: 'BEST SISTER',
        brand: 'Priyo Styles',
        sku: 'TS-SIS-001',
        price: 999,
        originalPrice: 1499,
        image: 'https://images.unsplash.com/photo-1529139574466-a302d2d4f521?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1529139574466-a302d2d4f521?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'
        ],
        category: 'T-Shirts',
        shortDescription: 'Comfortable and stylish t-shirt for the best sister ever.',
        description: 'Celebrate the bond with your sister with this premium t-shirt.',
        specifications: { 'Material': 'Cotton', 'Fit': 'Slim Fit' },
        inStock: true,
        stockQuantity: 45,
        isSale: true,
        rating: 4.9,
        tags: ['Gift', 'Sister', 'Fashion']
    },
    {
        id: 4,
        name: 'HAPPY FAMILY',
        brand: 'Memoirs',
        sku: 'PF-FAM-02',
        price: 999,
        originalPrice: 1499,
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop'
        ],
        category: 'Photo Frames',
        shortDescription: 'Capture your happy family moments in a beautiful frame.',
        description: 'High-quality photo frame to cherish your family memories forever.',
        specifications: { 'Material': 'Wood', 'Size': '12x18 inch' },
        inStock: true,
        stockQuantity: 20,
        isSale: false,
        rating: 4.7,
        tags: ['Family', 'Decor', 'Memories']
    },
    {
        id: 5,
        name: 'MAGIC MUG',
        brand: 'Priyo Mugs',
        sku: 'MUG-MAG-01',
        price: 349,
        originalPrice: 449,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop'],
        category: 'Mugs',
        shortDescription: 'Reveal your photo with hot liquid!',
        description: 'This ceramic magic mug changes color when hot liquid is poured in, revealing your printed photo or message.',
        specifications: { 'Capacity': '325ml', 'Material': 'Ceramic', 'Type': 'Color Changing' },
        inStock: true,
        stockQuantity: 100,
        isSale: true,
        rating: 4.6,
        tags: ['Gift', 'Mug', 'Magic']
    },
    {
        id: 6,
        name: 'NFC Business card',
        brand: 'TapConnect',
        sku: 'NFC-STD-01',
        price: 499,
        originalPrice: 799,
        image: 'https://images.unsplash.com/photo-1563276632-4464cc483bea?q=80&w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1563276632-4464cc483bea?q=80&w=600&auto=format&fit=crop'],
        category: 'Business Cards',
        shortDescription: 'Smart business card with NFC technology.',
        description: 'Share your contact details instantly with a single tap. No app required.',
        specifications: { 'Material': 'PVC', 'Technology': 'NFC + QR', 'Compatibility': 'All Smartphones' },
        inStock: true,
        stockQuantity: 200,
        isSale: false,
        rating: 4.5,
        tags: ['Business', 'Tech', 'Smart']
    },
    {
        id: 7,
        name: 'PVC ID CARD',
        brand: 'Priyo Office',
        sku: 'PVC-ID-01',
        price: 99,
        originalPrice: 149,
        image: 'https://images.unsplash.com/photo-1589330694653-4a8b26149209?q=80&w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1589330694653-4a8b26149209?q=80&w=600&auto=format&fit=crop'],
        category: 'Business Cards',
        shortDescription: 'Durable PVC ID cards for employees.',
        description: 'High-quality PVC ID card printing with sharp colors and long-lasting finish.',
        specifications: { 'Material': 'PVC', 'Thickness': '0.76mm' },
        inStock: true,
        stockQuantity: 500,
        isSale: false,
        rating: 4.4,
        tags: ['Office', 'ID', 'Bulk']
    },
    {
        id: 8,
        name: 'Rotating Photo Frames',
        brand: 'Memoirs',
        sku: 'PF-ROT-01',
        price: 999,
        originalPrice: 1199,
        image: 'https://images.unsplash.com/photo-1534349762913-96c87130f5bf?q=80&w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1534349762913-96c87130f5bf?q=80&w=600&auto=format&fit=crop'],
        category: 'Photo Frames',
        shortDescription: 'Unique rotating photo lamp.',
        description: 'A beautiful rotating photo frame that glows. Perfect for bedside tables.',
        specifications: { 'Material': 'Acrylic + Wood', 'Power': 'USB' },
        inStock: true,
        stockQuantity: 15,
        isSale: false,
        rating: 4.8,
        tags: ['Decor', 'Lamp', 'Gift']
    },
    {
        id: 9,
        name: 'TSHIRT',
        brand: 'Priyo Basics',
        sku: 'TS-STD-002',
        price: 199,
        originalPrice: 299,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop'],
        category: 'T-Shirts',
        shortDescription: 'Everyday cotton t-shirt.',
        description: 'Soft and breathable cotton t-shirt for daily wear.',
        specifications: { 'Material': 'Cotton Blend', 'Fit': 'Regular' },
        inStock: true,
        stockQuantity: 100,
        isSale: false,
        rating: 4.3,
        tags: ['Basics', 'Daily Wear']
    }
];
