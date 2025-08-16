// /.netlify/functions/meta-capi (ESM)
import fetch from 'node-fetch';
export async function handler(event) {
  try {
    const PIXEL_ID = process.env.META_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing META_PIXEL_ID or META_CAPI_TOKEN env vars' }) };
    }
    const body = JSON.parse(event.body || '{}');
    const event_name = body.event_name || 'CustomEvent';
    const event_id = body.event_id;
    const event_source_url = body.event_source_url || '';
    const test_event_code = body.test_event_code || (event.queryStringParameters && event.queryStringParameters.test_event_code) || '';
    const client_ip_address = event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || '';
    const client_user_agent = event.headers['user-agent'] || '';
    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now()/1000),
        event_source_url,
        event_id,
        action_source: 'website',
        user_data: { client_ip_address, client_user_agent },
        ...(test_event_code ? { test_event_code } : {})
      }]
    };
    const url = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const resp = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await resp.json();
    return { statusCode: resp.ok ? 200 : resp.status, body: JSON.stringify(json) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
}
