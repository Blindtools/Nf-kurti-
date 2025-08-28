const express = require("express");
const qrcode = require("qrcode");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    isJidGroup,
    DisconnectReason,
    generateWAMessageFromContent,
    proto
} = require("@whiskeysockets/baileys");

const { businessConfig, isBusinessOpen, getCurrentBusinessStatus } = require("./config");
const MessageHandler = require("./messageHandler");
const ButtonHandler = require("./buttonHandler");
const logger = require("./logger");

// --- Global Variables ---
const app = express();
let qrCodeImage = "";
let isConnected = false;
let sock;
let userSessions = new Map(); // Store user session data

// Initialize message handler and button handler
const messageHandler = new MessageHandler(businessConfig);
const buttonHandler = new ButtonHandler(businessConfig);

/**
 * User Session Management
 */
function getUserSession(jid) {
    if (!userSessions.has(jid)) {
        userSessions.set(jid, {
            isFirstTime: true,
            lastInteraction: new Date(),
            currentMenu: 'main',
            orderData: {},
            preferences: {}
        });
    }
    return userSessions.get(jid);
}

function updateUserSession(jid, updates) {
    const session = getUserSession(jid);
    Object.assign(session, updates, { lastInteraction: new Date() });
    userSessions.set(jid, session);
}

/**
 * Send Button Message
 */
async function sendButtonMessage(jid, text, buttons, footer = "") {
    const buttonMessage = {
        text: text,
        footer: footer,
        buttons: buttons.map((btn, index) => ({
            buttonId: btn.id || `btn_${index}`,
            buttonText: { displayText: btn.text },
            type: 1
        })),
        headerType: 1
    };

    try {
        await sock.sendMessage(jid, buttonMessage);
    } catch (error) {
        console.error("Error sending button message:", error);
        // Fallback to regular text message
        await sock.sendMessage(jid, { text: text + "\n\n" + buttons.map((btn, i) => `${i + 1}. ${btn.text}`).join("\n") });
    }
}

/**
 * Send List Message
 */
async function sendListMessage(jid, text, buttonText, sections, footer = "") {
    const listMessage = {
        text: text,
        footer: footer,
        title: "Nukkad Fabrics",
        buttonText: buttonText,
        sections: sections
    };

    try {
        const msg = generateWAMessageFromContent(jid, {
            listMessage: listMessage
        }, {});
        await sock.relayMessage(jid, msg.message, {});
    } catch (error) {
        console.error("Error sending list message:", error);
        // Fallback to regular text message
        let fallbackText = text + "\n\n";
        sections.forEach((section, sIndex) => {
            fallbackText += `*${section.title}:*\n`;
            section.rows.forEach((row, rIndex) => {
                fallbackText += `${sIndex + 1}.${rIndex + 1} ${row.title}\n`;
            });
            fallbackText += "\n";
        });
        await sock.sendMessage(jid, { text: fallbackText });
    }
}

/**
 * Main WhatsApp Bot Logic
 */
async function startWhatsApp() {
    try {
        // Using multi-file authentication
        const { state, saveCreds } = await useMultiFileAuthState("auth_info_multi");
        const { version } = await fetchLatestBaileysVersion();

        // Create WhatsApp socket with optimized configuration
        sock = makeWASocket({
            version,
            auth: state,
            logger: pino({ level: 'silent' }),
            qrTimeout: 60000,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 60000,
            keepAliveIntervalMs: 30000,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            markOnlineOnConnect: true,
        });

        // Connection and Reconnection Logic
        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                logger.connection('QR_GENERATED', 'QR Code generated for WhatsApp connection');
                qrCodeImage = await qrcode.toDataURL(qr);
            }
            
            if (connection === "open") {
                isConnected = true;
                logger.connection('CONNECTED', {
                    business: businessConfig.name,
                    phone: businessConfig.phone
                });
            } else if (connection === "close") {
                isConnected = false;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                
                logger.connection('DISCONNECTED', { statusCode });
                
                // Smart reconnection logic
                if (statusCode !== DisconnectReason.loggedOut) {
                    logger.connection('RECONNECTING', 'Attempting to reconnect in 5 seconds');
                    setTimeout(() => startWhatsApp(), 5000);
                } else {
                    logger.connection('LOGGED_OUT', 'User logged out, QR code required');
                    qrCodeImage = "";
                }
            }
        });

        // Save credentials
        sock.ev.on("creds.update", saveCreds);

        // --- Main Message Handling Logic ---
        sock.ev.on("messages.upsert", async ({ messages }) => {
            const msg = messages[0];

            // Skip own messages, group messages, and empty messages
            if (!msg.message || msg.key.fromMe || isJidGroup(msg.key.remoteJid)) {
                return;
            }

            const remoteJid = msg.key.remoteJid;
            const userSession = getUserSession(remoteJid);
            
            // Extract message text and button responses
            const messageText = (
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                ""
            ).trim().toLowerCase();

            const buttonResponse = (
                msg.message.buttonsResponseMessage?.selectedButtonId ||
                msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
                ""
            ).trim();

            const inputText = messageText || buttonResponse;

            if (!inputText) return;

            try {
                // Mark message as read and show typing indicator
                await sock.readMessages([msg.key]);
                await sock.sendPresenceUpdate('composing', remoteJid);

                logger.business('MESSAGE_RECEIVED', remoteJid, inputText);

                // Handle first-time users
                if (userSession.isFirstTime) {
                    await handleFirstTimeUser(remoteJid);
                    updateUserSession(remoteJid, { isFirstTime: false });
                    return;
                }

                let response;

                // Check if it's a button response
                if (buttonResponse) {
                    userSession.jid = remoteJid; // Add jid to session for logging
                    response = await buttonHandler.handleButton(buttonResponse, userSession);
                } else {
                    // Process regular text message
                    response = await messageHandler.processMessage(inputText, userSession);
                }
                
                if (response.type === 'text') {
                    await sock.sendMessage(remoteJid, { text: response.content });
                } else if (response.type === 'buttons') {
                    await sendButtonMessage(remoteJid, response.content, response.buttons, response.footer);
                } else if (response.type === 'list') {
                    await sendListMessage(remoteJid, response.content, response.buttonText, response.sections, response.footer);
                }

                // Update user session if needed
                if (response.sessionUpdate) {
                    updateUserSession(remoteJid, response.sessionUpdate);
                }

            } catch (error) {
                logger.error("Error in message handler", error);
                await sock.sendMessage(remoteJid, { 
                    text: "🙏 Sorry, there was a technical issue. Please try again or contact us at " + businessConfig.phone 
                });
            } finally {
                await sock.sendPresenceUpdate('paused', remoteJid);
            }
        });

    } catch (error) {
        logger.error("Error starting WhatsApp", error);
        setTimeout(() => startWhatsApp(), 10000);
    }
}

/**
 * Handle First Time Users
 */
async function handleFirstTimeUser(jid) {
    // Send welcome message with buttons
    const welcomeButtons = [
        { id: 'menu_collection', text: '👗 View Collection' },
        { id: 'menu_pricing', text: '💰 Wholesale Pricing' },
        { id: 'menu_contact', text: '📞 Contact Info' }
    ];

    await sendButtonMessage(
        jid, 
        businessConfig.welcomeMessage,
        welcomeButtons,
        "🌟 Nukkad Fabrics - Your Wholesale Partner 🌟"
    );
}

// --- Express Server Setup ---
app.use(express.json());
app.use(express.static('public'));

// Route to display the QR code
app.get("/qr", (req, res) => {
    if (isConnected) {
        res.send(`
            <div style="text-align: center; font-family: Arial; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh;">
                <h1>✅ Nukkad Fabrics WhatsApp Bot</h1>
                <h2>🟢 Connected Successfully!</h2>
                <p>Your WhatsApp business bot is now active and ready to serve customers.</p>
                <div style="background: white; color: #333; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 500px;">
                    <h3>📊 Bot Status</h3>
                    <p><strong>Business:</strong> ${businessConfig.name}</p>
                    <p><strong>Status:</strong> 🟢 Online</p>
                    <p><strong>Phone:</strong> ${businessConfig.phone}</p>
                </div>
            </div>
        `);
    } else if (qrCodeImage) {
        res.send(`
            <div style="text-align: center; font-family: Arial; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh;">
                <h1>📱 Nukkad Fabrics WhatsApp Bot</h1>
                <h2>Scan QR Code to Connect</h2>
                <div style="background: white; padding: 20px; border-radius: 15px; display: inline-block; margin: 20px;">
                    <img src="${qrCodeImage}" alt="WhatsApp QR Code" style="width: 300px; height: 300px;"/>
                </div>
                <p>Open WhatsApp → Settings → Linked Devices → Link a Device</p>
                <p style="font-size: 14px; opacity: 0.8;">This page will automatically refresh when connected.</p>
                <script>setTimeout(() => location.reload(), 10000);</script>
            </div>
        `);
    } else {
        res.send(`
            <div style="text-align: center; font-family: Arial; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh;">
                <h1>⏳ Nukkad Fabrics WhatsApp Bot</h1>
                <h2>Initializing...</h2>
                <p>Please wait while we generate your QR code.</p>
                <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin: 20px auto;"></div>
                <script>
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    setTimeout(() => location.reload(), 5000);
                </script>
            </div>
        `);
    }
});

// Route for server status
app.get("/", (req, res) => {
    const status = isConnected ? '🟢 Connected' : '🔴 Disconnected';
    res.send(`
        <div style="text-align: center; font-family: Arial; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh;">
            <h1>🏢 Nukkad Fabrics WhatsApp Bot</h1>
            <div style="background: white; color: #333; padding: 30px; border-radius: 15px; margin: 20px auto; max-width: 600px;">
                <h2>📊 Server Status</h2>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Business:</strong> ${businessConfig.name}</p>
                <p><strong>Category:</strong> ${businessConfig.category}</p>
                <p><strong>Phone:</strong> ${businessConfig.phone}</p>
                <p><strong>Server Time:</strong> ${new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})}</p>
                <hr>
                <p><a href="/qr" style="color: #667eea; text-decoration: none; font-weight: bold;">🔗 Get QR Code</a></p>
            </div>
            <p style="font-size: 14px; opacity: 0.8;">Powered by Baileys WhatsApp API</p>
        </div>
    `);
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: isConnected ? 'connected' : 'disconnected',
        business: businessConfig.name,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start the bot
logger.info("Starting Nukkad Fabrics WhatsApp Bot", {
    business: businessConfig.name,
    phone: businessConfig.phone
});
startWhatsApp();

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    logger.info("Server started", {
        port: PORT,
        qrUrl: `http://localhost:${PORT}/qr`,
        statusUrl: `http://localhost:${PORT}/`
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('Shutting down Nukkad Fabrics WhatsApp Bot');
    if (sock) {
        sock.end();
    }
    process.exit(0);
});

