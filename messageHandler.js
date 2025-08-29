class MessageHandler {
    constructor(businessConfig) {
        this.config = businessConfig;
        this.setupCommands();
    }

    setupCommands() {
        // Define command patterns and their handlers
        this.commands = {
            // Greetings
            greetings: {
                patterns: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening'],
                handler: this.handleGreeting.bind(this)
            },
            
            // Menu commands
            menu: {
                patterns: ['menu', 'options', 'help', 'start', '0'],
                handler: this.handleMainMenu.bind(this)
            },
            
            // Collection/Products
            collection: {
                patterns: ['collection', 'products', 'kurtis', 'catalog', '1', 'menu_collection', 'btn_0'],
                handler: this.handleCollection.bind(this)
            },
            
            // Pricing
            pricing: {
                patterns: ['price', 'pricing', 'wholesale', 'rates', 'cost', '2', 'menu_pricing', 'btn_1'],
                handler: this.handlePricing.bind(this)
            },
            
            // Order
            order: {
                patterns: ['order', 'buy', 'purchase', 'place order', '3', 'menu_order'],
                handler: this.handleOrder.bind(this)
            },
            
            // Contact
            contact: {
                patterns: ['contact', 'phone', 'number', 'address', '4', 'menu_contact', 'btn_2'],
                handler: this.handleContact.bind(this)
            },
            
            // Channel/Group
            channel: {
                patterns: ['channel', 'group', 'join', 'community', '5', 'menu_channel'],
                handler: this.handleChannel.bind(this)
            },
            
            // Business Hours
            hours: {
                patterns: ['hours', 'time', 'timing', 'open', 'close', '6', 'menu_hours'],
                handler: this.handleBusinessHours.bind(this)
            },
            
            // Specific product categories
            cotton: {
                patterns: ['cotton', 'cotton kurti', 'cotton kurtis'],
                handler: this.handleProductCategory.bind(this, 'Cotton Kurtis')
            },
            
            rayon: {
                patterns: ['rayon', 'rayon kurti', 'rayon kurtis'],
                handler: this.handleProductCategory.bind(this, 'Rayon Kurtis')
            },
            
            georgette: {
                patterns: ['georgette', 'georgette kurti', 'georgette kurtis'],
                handler: this.handleProductCategory.bind(this, 'Georgette Kurtis')
            },
            
            silk: {
                patterns: ['silk', 'silk kurti', 'silk kurtis'],
                handler: this.handleProductCategory.bind(this, 'Silk Kurtis')
            },
            
            // Thanks/Goodbye
            thanks: {
                patterns: ['thank', 'thanks', 'thank you', 'bye', 'goodbye', 'see you'],
                handler: this.handleThanks.bind(this)
            }
        };
    }

    async processMessage(messageText, userSession) {
        const text = messageText.toLowerCase().trim();
        
        // Find matching command
        for (const [commandName, command] of Object.entries(this.commands)) {
            if (command.patterns.some(pattern => 
                text.includes(pattern) || text === pattern || text.startsWith(pattern)
            )) {
                return await command.handler(text, userSession);
            }
        }
        
        // If no command matches, return unknown command response
        return this.handleUnknownCommand(text, userSession);
    }

    async handleGreeting(text, userSession) {
        const greetingResponses = [
            this.config.responses.greeting,
            "🙏 Welcome to Nukkad Fabrics! How can we assist you with our kurti collection today?",
            "🌟 Hello! Thank you for choosing Nukkad Fabrics. What would you like to know about our wholesale kurtis?"
        ];
        
        const randomGreeting = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
        
        return {
            type: 'buttons',
            content: randomGreeting,
            buttons: [
                { id: 'menu_collection', text: '👗 View Collection' },
                { id: 'menu_pricing', text: '💰 Pricing Info' },
                { id: 'menu_contact', text: '📞 Contact Us' }
            ],
            footer: "Choose an option to continue"
        };
    }

    async handleMainMenu(text, userSession) {
        return {
            type: 'list',
            content: `🏢 *${this.config.name} - Main Menu*\n\nSelect an option from the menu below:`,
            buttonText: "📋 Select Option",
            sections: [
                {
                    title: "🛍️ Products & Services",
                    rows: [
                        { rowId: "menu_collection", title: "👗 View Collection", description: "Browse our kurti categories" },
                        { rowId: "menu_pricing", title: "💰 Wholesale Pricing", description: "Get pricing information" },
                        { rowId: "menu_order", title: "🛒 Place Order", description: "Start your order process" }
                    ]
                },
                {
                    title: "📞 Contact & Info",
                    rows: [
                        { rowId: "menu_contact", title: "📱 Contact Information", description: "Phone, address & details" },
                        { rowId: "menu_channel", title: "📢 Join Our Channel", description: "Latest updates & offers" },
                        { rowId: "menu_hours", title: "🕒 Business Hours", description: "Our working hours" }
                    ]
                }
            ],
            footer: "Nukkad Fabrics - Your Wholesale Partner"
        };
    }

    async handleCollection(text, userSession) {
        return {
            type: 'list',
            content: this.config.responses.collection,
            buttonText: "👗 Select Category",
            sections: [
                {
                    title: "🌟 Premium Collection",
                    rows: [
                        { rowId: "cat_cotton", title: "Cotton Kurtis", description: "Starting ₹180 - Comfortable & Breathable" },
                        { rowId: "cat_rayon", title: "Rayon Kurtis", description: "Starting ₹220 - Soft & Elegant" },
                        { rowId: "cat_georgette", title: "Georgette Kurtis", description: "Starting ₹280 - Light & Flowy" },
                        { rowId: "cat_silk", title: "Silk Kurtis", description: "Starting ₹350 - Luxurious & Rich" }
                    ]
                },
                {
                    title: "🎨 Design Collection",
                    rows: [
                        { rowId: "cat_printed", title: "Printed Kurtis", description: "Starting ₹200 - Trendy Patterns" },
                        { rowId: "cat_embroidered", title: "Embroidered Kurtis", description: "Starting ₹320 - Handwork Details" },
                        { rowId: "cat_designer", title: "Designer Kurtis", description: "Starting ₹450 - Latest Fashion" },
                        { rowId: "cat_casual", title: "Casual Kurtis", description: "Starting ₹160 - Daily Wear" }
                    ]
                }
            ],
            footer: "📦 Minimum Order: 12 pieces | 🚚 Free shipping above ₹5000"
        };
    }

    async handlePricing(text, userSession) {
        return {
            type: 'buttons',
            content: this.config.responses.pricing,
            buttons: [
                { id: 'pricing_bulk', text: '📊 Bulk Discounts' },
                { id: 'pricing_payment', text: '💳 Payment Terms' },
                { id: 'menu_contact', text: '📞 Get Quote' }
            ],
            footer: "💰 Best wholesale prices guaranteed!"
        };
    }

    async handleOrder(text, userSession) {
        const orderText = `🛒 *Place Your Order*

📋 *Order Process:*
1️⃣ Select your preferred categories
2️⃣ Specify quantities (Min: 12 pieces)
3️⃣ Get price quotation
4️⃣ Confirm order details
5️⃣ Make advance payment (50%)
6️⃣ We prepare your order
7️⃣ Final payment & dispatch

📞 *Quick Order:*
Call directly: ${this.config.phone}

💬 *WhatsApp Order:*
Send us your requirements with:
• Category preferences
• Quantity needed
• Size requirements
• Delivery location`;

        return {
            type: 'buttons',
            content: orderText,
            buttons: [
                { id: 'order_whatsapp', text: '💬 Order via WhatsApp' },
                { id: 'order_call', text: '📞 Call to Order' },
                { id: 'menu_collection', text: '👗 View Collection' }
            ],
            footer: "🚚 Fast delivery across India"
        };
    }

    async handleContact(text, userSession) {
        return {
            type: 'buttons',
            content: this.config.responses.contact,
            buttons: [
                { id: 'contact_call', text: '📞 Call Now' },
                { id: 'contact_location', text: '📍 Share Location' },
                { id: 'menu_channel', text: '📢 Join Channel' }
            ],
            footer: "We're here to help you!"
        };
    }

    async handleChannel(text, userSession) {
        const channelText = `📢 *Join Our Community*

🔗 *WhatsApp Channel:*
${this.config.whatsappChannel}
• Latest collection updates
• Special offers & discounts
• New arrival notifications

👥 *WhatsApp Group:*
${this.config.whatsappGroup}
• Connect with other retailers
• Share experiences
• Get instant support

🌟 *Benefits of Joining:*
• Early access to new collections
• Exclusive wholesale discounts
• Direct communication with team
• Priority customer support`;

        return {
            type: 'buttons',
            content: channelText,
            buttons: [
                { id: 'join_channel', text: '📢 Join Channel' },
                { id: 'join_group', text: '👥 Join Group' },
                { id: 'menu', text: '🏠 Main Menu' }
            ],
            footer: "Stay connected with Nukkad Fabrics!"
        };
    }

    async handleBusinessHours(text, userSession) {
        return {
            type: 'buttons',
            content: this.config.responses.businessHours,
            buttons: [
                { id: 'menu_contact', text: '📞 Contact Now' },
                { id: 'menu_order', text: '🛒 Place Order' },
                { id: 'menu', text: '🏠 Main Menu' }
            ],
            footer: "We're here to serve you!"
        };
    }

    async handleProductCategory(category, text, userSession) {
        const categoryInfo = this.getCategoryInfo(category);
        
        return {
            type: 'buttons',
            content: categoryInfo,
            buttons: [
                { id: 'cat_pricing', text: '💰 Get Pricing' },
                { id: 'cat_order', text: '🛒 Order Now' },
                { id: 'menu_collection', text: '👗 More Categories' }
            ],
            footer: `${category} - Premium Quality Guaranteed`
        };
    }

    getCategoryInfo(category) {
        const categoryDetails = {
            'Cotton Kurtis': {
                price: '₹180',
                features: ['100% Pure Cotton', 'Breathable Fabric', 'Easy Care', 'Comfortable Fit'],
                sizes: 'S, M, L, XL, XXL',
                colors: '15+ Color Options'
            },
            'Rayon Kurtis': {
                price: '₹220',
                features: ['Soft Rayon Fabric', 'Elegant Drape', 'Wrinkle Resistant', 'Vibrant Colors'],
                sizes: 'S, M, L, XL, XXL',
                colors: '20+ Color Options'
            },
            'Georgette Kurtis': {
                price: '₹280',
                features: ['Light Weight', 'Flowy Texture', 'Party Wear', 'Premium Finish'],
                sizes: 'S, M, L, XL, XXL',
                colors: '12+ Color Options'
            },
            'Silk Kurtis': {
                price: '₹350',
                features: ['Pure Silk Fabric', 'Luxurious Feel', 'Festival Special', 'Rich Texture'],
                sizes: 'S, M, L, XL, XXL',
                colors: '10+ Color Options'
            }
        };

        const details = categoryDetails[category] || categoryDetails['Cotton Kurtis'];
        
        return `👗 *${category}*

💰 *Starting Price:* ${details.price} (Wholesale)

✨ *Features:*
${details.features.map(f => `• ${f}`).join('\n')}

📏 *Available Sizes:* ${details.sizes}
🎨 *Colors:* ${details.colors}

📦 *Minimum Order:* 12 pieces
🚚 *Delivery:* 3-5 business days

📞 For detailed catalog and bulk pricing, contact: ${this.config.phone}`;
    }

    async handleThanks(text, userSession) {
        const thankResponses = [
            this.config.responses.thanks,
            "🙏 Thank you for your interest in Nukkad Fabrics! We look forward to serving you.",
            "✨ It was our pleasure helping you! Feel free to contact us anytime for your kurti needs."
        ];
        
        const randomThanks = thankResponses[Math.floor(Math.random() * thankResponses.length)];
        
        return {
            type: 'buttons',
            content: randomThanks + "\n\n" + this.config.responses.goodbye,
            buttons: [
                { id: 'menu_collection', text: '👗 Browse Again' },
                { id: 'menu_contact', text: '📞 Contact Us' },
                { id: 'join_channel', text: '📢 Join Channel' }
            ],
            footer: "Visit us again soon!"
        };
    }

    async handleUnknownCommand(text, userSession) {
        // Try to provide helpful suggestions based on keywords
        let suggestion = "";
        
        if (text.includes('price') || text.includes('cost') || text.includes('rate')) {
            suggestion = "\n\n💡 Try: Type 'pricing' for wholesale rates";
        } else if (text.includes('product') || text.includes('kurti') || text.includes('dress')) {
            suggestion = "\n\n💡 Try: Type 'collection' to see our products";
        } else if (text.includes('order') || text.includes('buy')) {
            suggestion = "\n\n💡 Try: Type 'order' to place an order";
        } else if (text.includes('contact') || text.includes('phone')) {
            suggestion = "\n\n💡 Try: Type 'contact' for our details";
        }

        return {
            type: 'buttons',
            content: this.config.responses.unknownCommand + suggestion,
            buttons: [
                { id: 'menu', text: '📋 Main Menu' },
                { id: 'menu_collection', text: '👗 View Collection' },
                { id: 'menu_contact', text: '📞 Contact Us' }
            ],
            footer: "We're here to help!"
        };
    }
}

module.exports = MessageHandler;

