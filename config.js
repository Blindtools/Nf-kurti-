// Business Configuration for Nukkad Fabrics
const businessConfig = {
    name: "Nukkad Fabrics",
    category: "Apparel & Clothing",
    description: "We provide kurti collection wholesale",
    phone: "+91 78598 43042",
    whatsappChannel: "https://whatsapp.com/channel/0029VaHAHDtGE56n45w8930k",
    whatsappGroup: "https://chat.whatsapp.com/IwGIwsv02hsLByaidXJpXe?mode=ems_copy_c",
    
    // Business Hours
    businessHours: {
        open: "09:00",
        close: "21:00",
        timezone: "Asia/Kolkata"
    },
    
    // Welcome Messages
    welcomeMessage: `🙏 *Welcome to Nukkad Fabrics!* 🙏

🌟 *Premium Kurti Collection Wholesale* 🌟

We are delighted to serve you with our exclusive range of kurtis at wholesale prices!

📱 *Quick Menu:*
1️⃣ View Our Collection
2️⃣ Wholesale Pricing
3️⃣ Place Order
4️⃣ Contact Information
5️⃣ Join Our Channel
6️⃣ Business Hours

Simply type the number or use the buttons below to get started!

✨ *Quality • Variety • Best Prices* ✨`,

    // Product Categories
    productCategories: [
        "Cotton Kurtis",
        "Rayon Kurtis", 
        "Georgette Kurtis",
        "Silk Kurtis",
        "Printed Kurtis",
        "Embroidered Kurtis",
        "Designer Kurtis",
        "Casual Kurtis"
    ],
    
    // Common Responses
    responses: {
        greeting: "🙏 Namaste! Welcome to Nukkad Fabrics. How can we help you today?",
        thanks: "🙏 Thank you for choosing Nukkad Fabrics! We appreciate your business.",
        goodbye: "👋 Thank you for visiting Nukkad Fabrics! Have a great day!",
        unknownCommand: "🤔 I didn't understand that. Please use our menu options or type 'menu' to see available options.",
        businessHours: `🕒 *Business Hours:*
Monday to Sunday: 9:00 AM - 9:00 PM (IST)

We're currently ${getCurrentBusinessStatus()}

For urgent inquiries, please call: +91 78598 43042`,
        
        collection: `👗 *Our Kurti Collection:*

🌟 *Categories Available:*
• Cotton Kurtis - Starting ₹180
• Rayon Kurtis - Starting ₹220  
• Georgette Kurtis - Starting ₹280
• Silk Kurtis - Starting ₹350
• Printed Kurtis - Starting ₹200
• Embroidered Kurtis - Starting ₹320
• Designer Kurtis - Starting ₹450
• Casual Kurtis - Starting ₹160

📦 *Minimum Order:* 12 pieces
🚚 *Free Shipping* on orders above ₹5000

For detailed catalog, please contact: +91 78598 43042`,

        pricing: `💰 *Wholesale Pricing:*

📊 *Quantity Slabs:*
• 12-24 pieces: Regular wholesale price
• 25-49 pieces: 5% additional discount
• 50-99 pieces: 8% additional discount  
• 100+ pieces: 12% additional discount

💳 *Payment Terms:*
• 50% advance, 50% before dispatch
• UPI, Bank Transfer accepted

📞 For exact pricing, call: +91 78598 43042`,

        contact: `📞 *Contact Information:*

🏢 *Nukkad Fabrics*
📱 Phone: +91 78598 43042
📍 Category: Apparel & Clothing
🛍️ Speciality: Kurti Collection Wholesale

🔗 *Join Our Community:*
📢 Channel: https://whatsapp.com/channel/0029VaHAHDtGE56n45w8930k
👥 Group: https://chat.whatsapp.com/IwGIwsv02hsLByaidXJpXe

⏰ Business Hours: 9 AM - 9 PM (Daily)`
    }
};

// Helper function to check if business is open
function isBusinessOpen() {
    const now = new Date();
    const currentHour = now.getHours();
    const openHour = 9; // 9 AM
    const closeHour = 21; // 9 PM
    
    return currentHour >= openHour && currentHour < closeHour;
}

// Helper function to get current business status
function getCurrentBusinessStatus() {
    return isBusinessOpen() ? '🟢 OPEN' : '🔴 CLOSED';
}

module.exports = { businessConfig, isBusinessOpen, getCurrentBusinessStatus };

