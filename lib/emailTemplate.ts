// Profesjonalny szablon HTML dla maili

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://feliztradeltd.com'

export function createEmailTemplate(content: string, language: 'pl' | 'en' = 'pl'): string {
  const footerText = language === 'en' 
    ? 'Best regards' 
    : 'Z poważaniem'
  
  const contactTitle = language === 'en' ? 'Contact' : 'Kontakt'
  
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FelizTrade</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <img src="${baseUrl}/logo-wsp-edu.png" alt="FelizTrade Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;">
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; color: #333333; font-size: 16px; line-height: 1.6;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 30px; color: #ffffff;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">${footerText},</p>
                    <p style="margin: 0; font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">FelizTrade Team</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #333; padding-top: 20px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="text-align: center; padding-bottom: 15px;">
                          <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #667eea;">${contactTitle}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="text-align: center; font-size: 14px; line-height: 1.8; color: #aaaaaa;">
                          <p style="margin: 5px 0;">
                            📧 <a href="mailto:${'contact@feliztradeltd.com'}" style="color: #667eea; text-decoration: none;">${'contact@feliztradeltd.com'}</a>
                          </p>
                          <p style="margin: 5px 0;">
                            📞 <a href="tel:+48502600739" style="color: #667eea; text-decoration: none;">+48 502 600 739</a>
                          </p>
                          <p style="margin: 5px 0;">
                            🌐 <a href="https://feliztradeltd.com" style="color: #667eea; text-decoration: none;">feliztradeltd.com</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 20px; font-size: 12px; color: #666666;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} FelizTrade. ${language === 'en' ? 'All rights reserved.' : 'Wszelkie prawa zastrzeżone.'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function formatEmailContent(greeting: string, body: string, details: string): string {
  return `
    <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">👋 ${greeting}!</p>
    <p style="margin: 0 0 30px 0; line-height: 1.8;">${body}</p>
    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
      ${details}
    </div>
  `
}
