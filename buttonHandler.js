const logger = require('./logger');

class ButtonHandler {
    constructor(businessConfig) {
        this.config = businessConfig;
        this.setupButtonHandlers();
    }

    setupButtonHandlers() {
        this.buttonHandlers = {
            // Main menu buttons
            'menu_collection': this.handleCollectionMenu.bind(this),
            'menu_pricing': this.handlePricingMenu.bind(this),
            'menu_order': this.handleOrderMenu.bind(this),
            'menu_contact': this.handleContactMenu.bind(this),
            'menu_channel': this.handleChannelMenu.bind(this),
            'menu_hours': this.handleHoursMenu.bind(this),

            // Collection category buttons
            'cat_cotton': this.handleCategoryDetails.bind(this, 'Cotton Kurtis'),
            'cat_rayon': this.handleCategoryDetails.bind(this, 'Rayon Kurtis'),
            'cat_georgette': this.handleCategoryDetails.bind(this, 'Georgette Kurtis'),
            'cat_silk': this.handleCategoryDetails.bind(this, 'Silk Kurtis'),
            'cat_printed': this.handleCategoryDetails.bind(this, 'Printed Kurtis'),
            'cat_embroidered': this.handleCategoryDetails.bind(this, 'Embroidered Kurtis'),
            'cat_designer': this.handleCategoryDetails.bind(this, 'Designer Kurtis'),
            'cat_casual': this.handleCategoryDetails.bind(this, 'Casual Kurtis'),

            // Pricing buttons
            'pricing_bulk': this.handleBulkPricing.bind(this),
            'pricing_payment': this.handlePaymentTerms.bind(this),

            // Order buttons
            'order_whatsapp': this.handleWhatsAppOrder.bind(this),
            'order_call': this.handleCallOrder.bind(this),
            'order_catalog': this.handleCatalogRequest.bind(this),

            // Contact buttons
            'contact_call': this.handleCallContact.bind(this),
            'contact_location': this.handleLocationShare.bind(this),
            'contact_business_card': this.handleBusinessCard.bind(this),

            // Channel buttons
            'join_channel': this.handleJoinChannel.bind(this),
            'join_group': this.handleJoinGroup.bind(this),
            'get_updates': this.handleGetUpdates.bind(this),

            // Category action buttons
            'cat_pricing': this.handleCategoryPricing.bind(this),
            'cat_order': this.handleCategoryOrder.bind(this),
            'cat_sizes': this.handleSizeChart.bind(this),
            'cat_colors': this.handleColorOptions.bind(this),

            // Quick action buttons
            'quick_quote': this.handleQuickQuote.bind(this),
            'quick_catalog': this.handleQuickCatalog.bind(this),
            'quick_support': this.handleQuickSupport.bind(this),

            // Navigation buttons
            'back_to_menu': this.handleBackToMenu.bind(this),
            'back_to_collection': this.handleBackToCollection.bind(this),
            'back_to_pricing': this.handleBackToPricing.bind(this)
        };
    }

    async handleButton(buttonId, userSession) {
        logger.business('BUTTON_CLICK', userSession.jid || 'unknown', buttonId);

        if (this.buttonHandlers[buttonId]) {
            return await this.buttonHandlers[buttonId](userSession);
        }

        // Fallback for unknown buttons
        return this.handleUnknownButton(buttonId, userSession);
    }

    async handleCollectionMenu(userSession) {
        return {
            type: 'list',
            content: `👗 *${this.config.name} - Product Collection*\n\nExplore our premium kurti collection with wholesale pricing:`,
            buttonText: "👗 Select Category",
            sections: [
                {
                    title: "🌟 Premium Fabric Collection",
                    rows: [
                        { rowId: "cat_cotton", title: "Cotton Kurtis", description: "₹180+ | Breathable & Comfortable" },
                        { rowId: "cat_rayon", title: "Rayon Kurtis", description: "₹220+ | Soft & Elegant" },
                        { rowId: "cat_georgette", title: "Georgette Kurtis", description: "₹280+ | Light & Flowy" },
                        { rowId: "cat_silk", title: "Silk Kurtis", description: "₹350+ | Luxurious & Rich" }
                    ]
                },
                {
                    title: "🎨 Design Collection",
                    rows: [
                        { rowId: "cat_printed", title: "Printed Kurtis", description: "₹200+ | Trendy Patterns" },
                        { rowId: "cat_embroidered", title: "Embroidered Kurtis", description: "₹320+ | Handwork Details" },
                        { rowId: "cat_designer", title: "Designer Kurtis", description: "₹450+ | Latest Fashion" },
                        { rowId: "cat_casual", title: "Casual Kurtis", description: "₹160+ | Daily Wear" }
                    ]
                }
            ],
            footer: "📦 Min Order: 12 pieces | 🚚 Free shipping above ₹5000",
            sessionUpdate: { currentMenu: 'collection' }
        };
    }

    async handlePricingMenu(userSession) {
        return {
            type: 'buttons',
            content: `💰 *Wholesale Pricing Information*\n\n📊 *Quantity-Based Pricing:*\n• 12-24 pieces: Regular wholesale price\n• 25-49 pieces: 5% additional discount\n• 50-99 pieces: 8% additional discount\n• 100+ pieces: 12% additional discount\n\n💳 *Payment Terms:*\n• 50% advance payment\n• 50% before dispatch\n• UPI, Bank Transfer accepted\n\n🚚 *Shipping:*\n• Free shipping above ₹5000\n• 3-5 business days delivery\n• Pan India delivery available`,
            buttons: [
                { id: 'pricing_bulk', text: '📊 Bulk Discounts' },
                { id: 'pricing_payment', text: '💳 Payment Options' },
                { id: 'quick_quote', text: '💬 Get Quote' }
            ],
            footer: "Best wholesale prices guaranteed!",
            sessionUpdate: { currentMenu: 'pricing' }
        };
    }

    async handleOrderMenu(userSession) {
        return {
            type: 'buttons',
            content: `🛒 *Place Your Order*\n\n📋 *Easy Order Process:*\n1️⃣ Browse our collection\n2️⃣ Select categories & quantities\n3️⃣ Get instant price quote\n4️⃣ Confirm order details\n5️⃣ Make advance payment (50%)\n6️⃣ We prepare your order\n7️⃣ Final payment & dispatch\n\n📞 *Quick Order Options:*\n• WhatsApp: Send requirements\n• Call: Direct phone order\n• Catalog: Request detailed catalog\n\n⚡ *Express Service Available*`,
            buttons: [
                { id: 'order_whatsapp', text: '💬 Order via WhatsApp' },
                { id: 'order_call', text: '📞 Call to Order' },
                { id: 'order_catalog', text: '📋 Request Catalog' }
            ],
            footer: "🚚 Fast delivery across India",
            sessionUpdate: { currentMenu: 'order' }
        };
    }

    async handleContactMenu(userSession) {
        return {
            type: 'buttons',
            content: `📞 *Contact ${this.config.name}*\n\n🏢 *Business Information:*\n• Name: ${this.config.name}\n• Category: ${this.config.category}\n• Phone: ${this.config.phone}\n• Speciality: Kurti Collection Wholesale\n\n🕒 *Business Hours:*\n• Monday to Sunday: 9:00 AM - 9:00 PM\n• Currently: ${this.isBusinessOpen() ? '🟢 OPEN' : '🔴 CLOSED'}\n\n📍 *Service Areas:*\n• Pan India delivery\n• Wholesale supply nationwide`,
            buttons: [
                { id: 'contact_call', text: '📞 Call Now' },
                { id: 'contact_location', text: '📍 Get Location' },
                { id: 'contact_business_card', text: '💼 Business Card' }
            ],
            footer: "We're here to help you!",
            sessionUpdate: { currentMenu: 'contact' }
        };
    }

    async handleChannelMenu(userSession) {
        return {
            type: 'buttons',
            content: `📢 *Join Our Community*\n\n🔗 *WhatsApp Channel:*\n${this.config.whatsappChannel}\n• Latest collection updates\n• Special offers & discounts\n• New arrival notifications\n• Exclusive wholesale deals\n\n👥 *WhatsApp Group:*\n${this.config.whatsappGroup}\n• Connect with retailers\n• Share experiences\n• Get instant support\n• Business networking\n\n🌟 *Community Benefits:*\n• Early access to collections\n• Priority customer support\n• Bulk order assistance`,
            buttons: [
                { id: 'join_channel', text: '📢 Join Channel' },
                { id: 'join_group', text: '👥 Join Group' },
                { id: 'get_updates', text: '🔔 Get Updates' }
            ],
            footer: "Stay connected with Nukkad Fabrics!",
            sessionUpdate: { currentMenu: 'channel' }
        };
    }

    async handleHoursMenu(userSession) {
        const currentTime = new Date().toLocaleTimeString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            hour12: true 
        });
        
        return {
            type: 'buttons',
            content: `🕒 *Business Hours*\n\n⏰ *Operating Hours:*\n• Monday to Sunday\n• 9:00 AM - 9:00 PM (IST)\n• No weekly offs\n\n🕐 *Current Time:* ${currentTime}\n📍 *Status:* ${this.isBusinessOpen() ? '🟢 OPEN' : '🔴 CLOSED'}\n\n📞 *For Urgent Inquiries:*\n• Call: ${this.config.phone}\n• WhatsApp: Available 24/7\n\n💡 *Best Time to Call:*\n• Morning: 10:00 AM - 12:00 PM\n• Evening: 6:00 PM - 8:00 PM`,
            buttons: [
                { id: 'contact_call', text: '📞 Call Now' },
                { id: 'quick_support', text: '💬 Quick Support' },
                { id: 'back_to_menu', text: '🏠 Main Menu' }
            ],
            footer: "We're committed to serving you!",
            sessionUpdate: { currentMenu: 'hours' }
        };
    }

    async handleCategoryDetails(category, userSession) {
        const categoryInfo = this.getCategoryInfo(category);
        
        return {
            type: 'buttons',
            content: categoryInfo.details,
            buttons: [
                { id: 'cat_pricing', text: '💰 Get Pricing' },
                { id: 'cat_order', text: '🛒 Order Now' },
                { id: 'cat_sizes', text: '📏 Size Chart' },
                { id: 'cat_colors', text: '🎨 Color Options' }
            ],
            footer: `${category} - Premium Quality Guaranteed`,
            sessionUpdate: { 
                currentMenu: 'category_details',
                selectedCategory: category 
            }
        };
    }

    async handleBulkPricing(userSession) {
        return {
            type: 'buttons',
            content: `📊 *Bulk Discount Structure*\n\n💰 *Quantity-Based Discounts:*\n\n🔹 **12-24 pieces**\n   • Regular wholesale price\n   • Standard terms apply\n\n🔹 **25-49 pieces**\n   • 5% additional discount\n   • Priority processing\n\n🔹 **50-99 pieces**\n   • 8% additional discount\n   • Free quality check\n   • Dedicated support\n\n🔹 **100+ pieces**\n   • 12% additional discount\n   • Premium packaging\n   • Express delivery\n   • Account manager assigned\n\n💡 *Special Offers:*\n• Festival seasons: Extra 2-3% off\n• Repeat customers: Loyalty discounts\n• Mixed orders: Flexible pricing`,
            buttons: [
                { id: 'quick_quote', text: '💬 Get Custom Quote' },
                { id: 'pricing_payment', text: '💳 Payment Terms' },
                { id: 'back_to_pricing', text: '⬅️ Back to Pricing' }
            ],
            footer: "Bigger orders = Better savings!"
        };
    }

    async handlePaymentTerms(userSession) {
        return {
            type: 'buttons',
            content: `💳 *Payment Terms & Options*\n\n💰 **Payment Structure:**\n• 50% advance payment required\n• 50% balance before dispatch\n• No hidden charges\n\n🏦 **Accepted Payment Methods:**\n• UPI (Google Pay, PhonePe, Paytm)\n• Bank Transfer (NEFT/RTGS)\n• IMPS (Instant transfer)\n• Cheque (for regular customers)\n\n📱 **UPI Details:**\n• UPI ID: Available on request\n• QR Code: Provided with invoice\n\n🏛️ **Bank Details:**\n• Account details shared after order confirmation\n• GST invoice provided\n\n⚡ **Quick Payment Benefits:**\n• Faster order processing\n• Priority in queue\n• Better customer support`,
            buttons: [
                { id: 'quick_quote', text: '💬 Get Payment Details' },
                { id: 'pricing_bulk', text: '📊 Bulk Discounts' },
                { id: 'back_to_pricing', text: '⬅️ Back to Pricing' }
            ],
            footer: "Secure & convenient payment options"
        };
    }

    async handleWhatsAppOrder(userSession) {
        return {
            type: 'text',
            content: `💬 *Order via WhatsApp*\n\n📝 **To place your order, please send us:**\n\n1️⃣ **Product Details:**\n   • Category (Cotton/Rayon/Silk etc.)\n   • Quantity required\n   • Size preferences\n\n2️⃣ **Business Information:**\n   • Your business name\n   • Delivery address\n   • Contact number\n\n3️⃣ **Special Requirements:**\n   • Color preferences\n   • Any specific designs\n   • Delivery timeline\n\n📞 **Send your requirements to:**\n${this.config.phone}\n\n⚡ **Quick Template:**\n"Hi, I want to order [quantity] pieces of [category] kurtis for my business [business name]. Please share pricing and details."\n\n🔄 **We'll respond with:**\n• Detailed quotation\n• Product images\n• Payment details\n• Delivery timeline`,
            sessionUpdate: { 
                currentMenu: 'order_whatsapp',
                orderMethod: 'whatsapp' 
            }
        };
    }

    async handleCallOrder(userSession) {
        return {
            type: 'buttons',
            content: `📞 *Call to Order*\n\n🎯 **Direct Phone Ordering:**\n📱 Call: ${this.config.phone}\n\n⏰ **Best Time to Call:**\n• Morning: 10:00 AM - 12:00 PM\n• Evening: 6:00 PM - 8:00 PM\n• Currently: ${this.isBusinessOpen() ? '🟢 Available' : '🔴 Closed'}\n\n💬 **What to Prepare:**\n• Your business details\n• Required quantities\n• Preferred categories\n• Delivery location\n\n🚀 **Call Benefits:**\n• Instant quotation\n• Real-time discussion\n• Custom requirements\n• Immediate order confirmation\n\n📋 **Our team will help with:**\n• Product selection\n• Pricing calculation\n• Payment process\n• Delivery scheduling`,
            buttons: [
                { id: 'contact_call', text: '📞 Call Now' },
                { id: 'order_whatsapp', text: '💬 WhatsApp Order' },
                { id: 'back_to_menu', text: '🏠 Main Menu' }
            ],
            footer: "Speak directly with our sales team!"
        };
    }

    async handleQuickQuote(userSession) {
        return {
            type: 'text',
            content: `💬 *Get Quick Quote*\n\n📝 **For instant pricing, send us:**\n\n"QUOTE: [Category] - [Quantity] pieces"\n\n**Example:**\n"QUOTE: Cotton Kurtis - 50 pieces"\n"QUOTE: Mixed categories - 100 pieces"\n\n📞 **Contact for Quote:**\n• WhatsApp: ${this.config.phone}\n• Call: ${this.config.phone}\n\n⚡ **Quick Response:**\n• Pricing within 30 minutes\n• Product images available\n• Custom requirements welcome\n\n💡 **Pro Tip:**\nMention your location for accurate shipping costs and delivery timeline.`,
            sessionUpdate: { 
                currentMenu: 'quick_quote',
                action: 'quote_request' 
            }
        };
    }

    async handleJoinChannel(userSession) {
        return {
            type: 'text',
            content: `📢 *Join Our WhatsApp Channel*\n\n🔗 **Channel Link:**\n${this.config.whatsappChannel}\n\n📱 **How to Join:**\n1. Click the link above\n2. Tap "Follow" on the channel\n3. Enable notifications for updates\n\n🌟 **What You'll Get:**\n• New collection previews\n• Special wholesale offers\n• Festival season discounts\n• Industry trends & tips\n• Flash sales notifications\n\n📈 **Channel Benefits:**\n• First access to new arrivals\n• Exclusive subscriber discounts\n• Market insights\n• Business growth tips\n\n🔔 **Stay Updated:**\nTurn on notifications to never miss our latest offers and collections!`,
            sessionUpdate: { 
                currentMenu: 'join_channel',
                action: 'channel_join' 
            }
        };
    }

    async handleCatalogRequest(userSession) {
        return {
            type: 'text',
            content: `📋 *Request Detailed Catalog*\n\n📞 **To get our complete catalog:**\nCall: ${this.config.phone}\nWhatsApp: ${this.config.phone}\n\n📧 **What we'll send you:**\n• High-quality product images\n• Detailed specifications\n• Complete price list\n• Size charts\n• Color options\n\n⚡ **Instant Catalog:**\nCall now for immediate WhatsApp catalog sharing!`,
            sessionUpdate: { currentMenu: 'catalog_request' }
        };
    }

    async handleCallContact(userSession) {
        return {
            type: 'text',
            content: `📞 *Call ${this.config.name}*\n\n📱 **Phone Number:** ${this.config.phone}\n\n⏰ **Best Time to Call:**\n• Morning: 10:00 AM - 12:00 PM\n• Evening: 6:00 PM - 8:00 PM\n• Currently: ${this.isBusinessOpen() ? '🟢 Available' : '🔴 Closed'}\n\n💬 **What to Discuss:**\n• Product requirements\n• Bulk pricing\n• Custom orders\n• Delivery details\n\n🚀 **Call Benefits:**\n• Instant responses\n• Personal assistance\n• Custom quotations\n• Direct order placement`,
            sessionUpdate: { currentMenu: 'call_contact' }
        };
    }

    async handleLocationShare(userSession) {
        return {
            type: 'text',
            content: `📍 *${this.config.name} Location*\n\n🏢 **Business Details:**\n• Name: ${this.config.name}\n• Category: ${this.config.category}\n• Phone: ${this.config.phone}\n\n🚚 **Service Areas:**\n• Pan India delivery\n• Wholesale supply nationwide\n• Express delivery available\n\n📞 **For exact location and directions:**\nCall: ${this.config.phone}\n\n💡 **Note:** We primarily operate as a wholesale supplier with delivery services across India.`,
            sessionUpdate: { currentMenu: 'location_share' }
        };
    }

    async handleBusinessCard(userSession) {
        return {
            type: 'text',
            content: `💼 *${this.config.name} - Business Card*\n\n🏢 **Company Information:**\n• Business Name: ${this.config.name}\n• Category: ${this.config.category}\n• Speciality: Kurti Collection Wholesale\n\n📞 **Contact Details:**\n• Phone: ${this.config.phone}\n• WhatsApp: ${this.config.phone}\n\n🔗 **Online Presence:**\n• Channel: ${this.config.whatsappChannel}\n• Group: ${this.config.whatsappGroup}\n\n⏰ **Business Hours:**\n• Monday to Sunday: 9:00 AM - 9:00 PM\n\n🌟 **Our Promise:**\n"Quality • Variety • Best Prices"`,
            sessionUpdate: { currentMenu: 'business_card' }
        };
    }

    async handleJoinGroup(userSession) {
        return {
            type: 'text',
            content: `👥 *Join Our WhatsApp Group*\n\n🔗 **Group Link:**\n${this.config.whatsappGroup}\n\n📱 **How to Join:**\n1. Click the link above\n2. Tap "Join Group"\n3. Introduce yourself to the community\n\n🤝 **Group Benefits:**\n• Connect with other retailers\n• Share business experiences\n• Get instant support\n• Network with wholesalers\n• Share market insights\n\n💬 **Group Guidelines:**\n• Business discussions welcome\n• Respectful communication\n• No spam or irrelevant content\n• Help fellow members\n\n🌟 **Active Community:**\nJoin 500+ retailers and wholesalers!`,
            sessionUpdate: { currentMenu: 'join_group' }
        };
    }

    async handleGetUpdates(userSession) {
        return {
            type: 'buttons',
            content: `🔔 *Get Latest Updates*\n\n📢 **Stay Updated With:**\n• New collection launches\n• Special wholesale offers\n• Festival season discounts\n• Market trends & insights\n• Business tips & strategies\n\n📱 **Update Channels:**\n• WhatsApp Channel (Latest collections)\n• WhatsApp Group (Community discussions)\n• Direct WhatsApp (Personal updates)\n\n⚡ **Instant Notifications:**\nNever miss our exclusive offers and new arrivals!`,
            buttons: [
                { id: 'join_channel', text: '📢 Join Channel' },
                { id: 'join_group', text: '👥 Join Group' },
                { id: 'quick_support', text: '💬 Personal Updates' }
            ],
            footer: "Choose your preferred update method",
            sessionUpdate: { currentMenu: 'get_updates' }
        };
    }

    async handleCategoryPricing(userSession) {
        const category = userSession.selectedCategory || 'Cotton Kurtis';
        return {
            type: 'text',
            content: `💰 *${category} - Pricing Details*\n\n📊 **Wholesale Pricing:**\n• 12-24 pieces: Regular wholesale price\n• 25-49 pieces: 5% additional discount\n• 50-99 pieces: 8% additional discount\n• 100+ pieces: 12% additional discount\n\n💳 **Payment Terms:**\n• 50% advance payment\n• 50% before dispatch\n\n📞 **For exact pricing:**\nCall: ${this.config.phone}\nWhatsApp: ${this.config.phone}\n\n💡 **Price depends on:**\n• Quantity ordered\n• Design complexity\n• Fabric quality\n• Seasonal demand`,
            sessionUpdate: { currentMenu: 'category_pricing' }
        };
    }

    async handleCategoryOrder(userSession) {
        const category = userSession.selectedCategory || 'Cotton Kurtis';
        return {
            type: 'buttons',
            content: `🛒 *Order ${category}*\n\n📝 **Order Process:**\n1. Specify quantity (Min: 12 pieces)\n2. Choose size preferences\n3. Select color options\n4. Get instant quotation\n5. Confirm order details\n6. Make advance payment\n7. Receive your order\n\n⚡ **Quick Order Options:**`,
            buttons: [
                { id: 'order_whatsapp', text: '💬 WhatsApp Order' },
                { id: 'order_call', text: '📞 Call to Order' },
                { id: 'quick_quote', text: '💰 Get Quote' }
            ],
            footer: `${category} - Ready to ship!`,
            sessionUpdate: { currentMenu: 'category_order' }
        };
    }

    async handleSizeChart(userSession) {
        return {
            type: 'text',
            content: `📏 *Size Chart - Kurtis*\n\n📐 **Available Sizes:**\n\n🔹 **Small (S)**\n   • Bust: 36 inches\n   • Length: 44-46 inches\n\n🔹 **Medium (M)**\n   • Bust: 38 inches\n   • Length: 44-46 inches\n\n🔹 **Large (L)**\n   • Bust: 40 inches\n   • Length: 44-46 inches\n\n🔹 **Extra Large (XL)**\n   • Bust: 42 inches\n   • Length: 44-46 inches\n\n🔹 **Double XL (XXL)**\n   • Bust: 44 inches\n   • Length: 44-46 inches\n\n📞 **Custom Sizes Available:**\nCall: ${this.config.phone}`,
            sessionUpdate: { currentMenu: 'size_chart' }
        };
    }

    async handleColorOptions(userSession) {
        const category = userSession.selectedCategory || 'Cotton Kurtis';
        return {
            type: 'text',
            content: `🎨 *${category} - Color Options*\n\n🌈 **Available Colors:**\n\n🔴 **Vibrant Colors:**\n• Red, Maroon, Pink, Magenta\n\n🔵 **Cool Colors:**\n• Blue, Navy, Sky Blue, Teal\n\n🟢 **Nature Colors:**\n• Green, Olive, Mint, Forest\n\n🟡 **Warm Colors:**\n• Yellow, Orange, Peach, Coral\n\n⚫ **Classic Colors:**\n• Black, White, Grey, Beige\n\n🟤 **Earth Tones:**\n• Brown, Tan, Cream, Khaki\n\n📞 **For color catalog:**\nCall: ${this.config.phone}\n\n💡 **Note:** Color availability may vary by design and season.`,
            sessionUpdate: { currentMenu: 'color_options' }
        };
    }

    async handleQuickCatalog(userSession) {
        return {
            type: 'text',
            content: `📋 *Quick Catalog Access*\n\n⚡ **Instant Catalog:**\nCall: ${this.config.phone}\n\n📱 **WhatsApp Catalog:**\nSend "CATALOG" to: ${this.config.phone}\n\n📧 **What You'll Get:**\n• Latest collection images\n• Price list (wholesale)\n• Size charts\n• Color options\n• Fabric details\n\n🚀 **Express Service:**\n• Catalog shared within 30 minutes\n• High-quality product images\n• Detailed specifications\n• Custom requirements welcome\n\n💡 **Pro Tip:**\nMention your business type for customized catalog!`,
            sessionUpdate: { currentMenu: 'quick_catalog' }
        };
    }

    async handleQuickSupport(userSession) {
        return {
            type: 'buttons',
            content: `💬 *Quick Support*\n\n🆘 **Need Help With:**\n• Product information\n• Pricing queries\n• Order assistance\n• Technical support\n• Business guidance\n\n📞 **Support Options:**\n• Instant WhatsApp support\n• Direct phone assistance\n• Community group help\n\n⏰ **Support Hours:**\n• 9:00 AM - 9:00 PM (Daily)\n• Emergency: ${this.config.phone}\n\n🌟 **Our Commitment:**\nQuick responses, helpful solutions!`,
            buttons: [
                { id: 'contact_call', text: '📞 Call Support' },
                { id: 'order_whatsapp', text: '💬 WhatsApp Help' },
                { id: 'join_group', text: '👥 Community Help' }
            ],
            footer: "We're here to help you succeed!",
            sessionUpdate: { currentMenu: 'quick_support' }
        };
    }

    async handleBackToCollection(userSession) {
        return this.handleCollectionMenu(userSession);
    }

    async handleBackToPricing(userSession) {
        return this.handlePricingMenu(userSession);
    }

    async handleBackToMenu(userSession) {
        return {
            type: 'list',
            content: `🏢 *${this.config.name} - Main Menu*\n\nWelcome back! Select an option to continue:`,
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
            footer: "Nukkad Fabrics - Your Wholesale Partner",
            sessionUpdate: { currentMenu: 'main' }
        };
    }

    async handleUnknownButton(buttonId, userSession) {
        logger.warn('Unknown button clicked', { buttonId, userSession: userSession.jid });
        
        return {
            type: 'buttons',
            content: `🤔 *Unknown Option*\n\nSorry, that option is not available right now. Please choose from the menu below:`,
            buttons: [
                { id: 'back_to_menu', text: '🏠 Main Menu' },
                { id: 'menu_collection', text: '👗 View Collection' },
                { id: 'quick_support', text: '💬 Get Help' }
            ],
            footer: "We're here to help!"
        };
    }

    getCategoryInfo(category) {
        const categoryDetails = {
            'Cotton Kurtis': {
                details: `👗 *Cotton Kurtis Collection*\n\n💰 *Starting Price:* ₹180 (Wholesale)\n\n✨ *Premium Features:*\n• 100% Pure Cotton fabric\n• Breathable & comfortable\n• Easy care & maintenance\n• Perfect for daily wear\n• Shrink-resistant\n\n📏 *Available Sizes:* S, M, L, XL, XXL\n🎨 *Color Options:* 15+ vibrant colors\n📦 *Minimum Order:* 12 pieces\n🚚 *Delivery:* 3-5 business days\n\n💡 *Perfect For:*\n• Retail stores\n• Online sellers\n• Boutique owners\n• Wholesale distributors`
            },
            'Rayon Kurtis': {
                details: `👗 *Rayon Kurtis Collection*\n\n💰 *Starting Price:* ₹220 (Wholesale)\n\n✨ *Premium Features:*\n• Soft rayon fabric\n• Elegant drape & fall\n• Wrinkle-resistant\n• Vibrant color retention\n• Lightweight comfort\n\n📏 *Available Sizes:* S, M, L, XL, XXL\n🎨 *Color Options:* 20+ stunning colors\n📦 *Minimum Order:* 12 pieces\n🚚 *Delivery:* 3-5 business days\n\n💡 *Perfect For:*\n• Office wear\n• Casual outings\n• Party wear\n• Festive occasions`
            }
            // Add more categories as needed
        };

        return categoryDetails[category] || categoryDetails['Cotton Kurtis'];
    }

    isBusinessOpen() {
        const now = new Date();
        const currentHour = now.getHours();
        return currentHour >= 9 && currentHour < 21; // 9 AM to 9 PM
    }
}

module.exports = ButtonHandler;

