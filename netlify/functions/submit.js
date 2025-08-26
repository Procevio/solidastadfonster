exports.handler = async (event, context) => {
    console.log('🎯 Netlify Function anropad - Solida Städ & Fönsterputs AB');
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        console.log('⚡ CORS preflight request behandlad');
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        console.log(`❌ Otillåten HTTP-metod: ${event.httpMethod}`);
        return {
            statusCode: 405,
            headers: headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        console.log('📝 Behandlar POST-begäran...');
        
        // Parse request body
        let anbudsData;
        try {
            anbudsData = JSON.parse(event.body);
            console.log('✅ Anbudsdata parsad framgångsrikt');
        } catch (parseError) {
            console.error('❌ Fel vid parsning av JSON:', parseError);
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ error: 'Invalid JSON format' })
            };
        }

        // Validate required fields
        if (!anbudsData.kundInfo || (!anbudsData.kundInfo.företag && !anbudsData.kundInfo.namn)) {
            console.log('❌ Saknade obligatoriska fält');
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ error: 'Missing required customer information' })
            };
        }

        // Get Zapier webhook URL from environment variable
        const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
        if (!webhookUrl) {
            console.error('❌ ZAPIER_WEBHOOK_URL miljövariabel saknas');
            return {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ error: 'Webhook configuration missing' })
            };
        }

        console.log('🔄 Vidarebefordrar till Zapier webhook...');

        // Enhanced data payload
        const enhancedData = {
            ...anbudsData,
            källa: 'Solida Städ & Fönsterputs AB - Anbudsapp',
            tidsstämpel: new Date().toISOString(),
            användarAgent: event.headers['user-agent'] || 'Unknown',
            ipAdress: event.headers['x-forwarded-for'] || event.headers['x-bb-ip'] || 'Unknown'
        };

        // Forward to Zapier webhook
        const zapierResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Solida-Fonsterputs-Netlify-Function/1.0'
            },
            body: JSON.stringify(enhancedData)
        });

        console.log(`🎯 Zapier svar status: ${zapierResponse.status}`);

        if (zapierResponse.ok) {
            console.log('✅ Framgångsrik vidarebefordran till Zapier');
            
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Anbudsdata skickad till Zapier framgångsrikt',
                    anbudsNummer: anbudsData.anbudsNummer,
                    tidsstämpel: enhancedData.tidsstämpel,
                    zapierStatus: zapierResponse.status
                })
            };
        } else {
            const zapierErrorText = await zapierResponse.text().catch(() => 'Unknown error');
            console.error('❌ Zapier webhook fel:', zapierResponse.status, zapierErrorText);
            
            return {
                statusCode: 502,
                headers: headers,
                body: JSON.stringify({
                    error: 'Webhook delivery failed',
                    zapierStatus: zapierResponse.status
                })
            };
        }

    } catch (error) {
        console.error('❌ Funktionsfel:', error.name, error.message);
        console.error('📍 Stack trace:', error.stack);

        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: 'En systemfel uppstod vid bearbetning av anbudet'
            })
        };
    }
};