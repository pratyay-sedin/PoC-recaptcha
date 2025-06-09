# PoC-recaptcha


### Ngrok Setup

Setup your [Ngrok](https://ngrok.com/) environment


Adding the auth token in the ngrok.yml file

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

For the free tier in Ngrok you get a single static URL use that and reverse proxy your localhost to that URL:

```bash
ngrok http --url=YOUR_STATIC_URL PORT
```

Forward the frontend application port to the server port or you can use this patch in your next application
```js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
}

export default nextConfig;
```



### [Automation Setup](automation-playwright/README.md)