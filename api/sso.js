import jwt from 'jsonwebtoken';

// Hàm cấu hình Serverless của Vercel (Production)
export default function handler(req, res) {
  // Bật CORS nếu cần cho phép domain khác gọi API (Tùy chọn)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Xử lý luồng gởi tuỳ chọn (Options)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Bắt đầu Logic xử lý chức năng chính
  if (req.method === 'POST') {
    try {
      // Vì là JSON Body, Vercel tự động phân tích (parse) cú pháp.
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Thiếu thông tin email' });
      }

      // 1. Tạo Payload chứa email
      const payload = { email };
      
      // 2. Secret Key bắt buộc
      const secret = 'UPBANK_SECRET_KEY';
      
      // 3. Thời hạn của Link (5 phút)
      const options = { expiresIn: '5m' };

      // Sinh mã bảo mật JWT
      const token = jwt.sign(payload, secret, options);

      return res.status(200).json({ 
        success: true, 
        url: `https://www.upbank.asia/sso?token=${token}` 
      });
      
    } catch (err) {
      console.error('SSO Token Error:', err);
      return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
  }

  // Báo lỗi nếu dùng Method khác
  return res.status(405).json({ error: 'Method Not Allowed' });
}
