import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'

// Plugin đóng vai trò như Backend cục bộ để xử lý API sinh JWT token
const ssoBackendPlugin = () => ({
  name: 'sso-backend',
  configureServer(server: any) {
    server.middlewares.use('/api/sso', (req: any, res: any) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const email = data.email;

            if (!email) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Thiếu thông tin email' }));
            }

            // 1. Tạo Payload chứa email
            const payload = { email };

            // 2. Secret Key bắt buộc
            const secret = 'UPBANK_SECRET_KEY';

            // Sinh mã bảo mật JWT
            const token = jwt.sign(payload, secret, { expiresIn: '5m' } as SignOptions);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              url: `https://www.upbank.asia/sso?token=${token}`
            }));
          } catch (err) {
            console.error('SSO Token Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Lỗi máy chủ nội bộ' }));
          }
        });
      } else {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ssoBackendPlugin()],
})
