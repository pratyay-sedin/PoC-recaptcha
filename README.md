# PoC-recaptcha


### Ngrok Setup

Adding the auth token in the ngrok.yml file

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
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

For the free tier in Ngrok you get a single static URL use that and reverse proxy your localhost to that URL:

```bash
ngrok http --url=amused-mallard-typically.ngrok-free.app PORT
```


### [Automation Setup](automation-playwright/README.md)