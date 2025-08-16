
PIXEL + CONVERSIONS API (requires Netlify Functions)
1) Connect to Git or use Netlify CLI. Manual Drop won't deploy functions.
2) Set Environment Variables on Netlify:
   - META_PIXEL_ID = your Pixel ID (numbers)
   - META_CAPI_TOKEN = your Meta access token
3) Deploy (CLI): netlify deploy --prod --dir=. --functions=netlify/functions
4) Test server events: add ?fb_test_event_code=YOURCODE to your site URL.
