import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fmsar.org.ma";

/* ── Shared layout — full inline styles for email client compatibility ── */
function emailLayout(content: string, previewText: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>FMA</title>
</head>
<body style="margin:0;padding:0;background-color:#f2eff6;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif">
<!-- preview -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${previewText}&nbsp;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;</div>

<!-- WRAPPER -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2eff6">
<tr><td align="center" style="padding:40px 16px">

  <!-- CONTAINER -->
  <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden">

    <!-- ACCENT TOP -->
    <tr><td style="height:4px;background-color:#ac1949;font-size:0">&nbsp;</td></tr>

    <!-- HEADER -->
    <tr>
      <td align="center" style="background-color:#ac1949;padding:36px 40px 28px">
        <!-- Logo on white pill -->
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="background-color:#ffffff;border-radius:12px;padding:10px 24px">
              <img src="${BASE_URL}/logo-fma-full.jpg" alt="Fédération Marocaine de l'Assurance" width="180" height="auto" style="display:block;border:0;width:180px;height:auto" />
            </td>
          </tr>
        </table>
        <!-- Badge -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:18px">
          <tr>
            <td align="center" style="background-color:#8a1038;border-radius:100px;padding:5px 18px">
              <span style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif">Fédération Marocaine de l'Assurance</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    ${content}

    <!-- DIVIDER -->
    <tr><td style="padding:0 40px"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background-color:#f0e8ed;font-size:0">&nbsp;</td></tr></table></td></tr>

    <!-- FOOTER -->
    <tr>
      <td align="center" style="background-color:#1a0a0f;padding:32px 40px">
        <!-- Footer logo -->
        <img src="${BASE_URL}/logo-fma-full.jpg" alt="FMA" width="120" height="auto" style="display:block;margin:0 auto 16px;border:0;opacity:0.7;width:120px" />
        <!-- Footer links -->
        <p style="margin:0 0 12px;font-size:13px;font-family:Arial,sans-serif">
          <a href="${BASE_URL}/fr" style="color:#c9a0b0;text-decoration:none;margin:0 8px">Site web</a>
          <span style="color:#4a2535">|</span>
          <a href="${BASE_URL}/fr/contact" style="color:#c9a0b0;text-decoration:none;margin:0 8px">Contact</a>
          <span style="color:#4a2535">|</span>
          <a href="${BASE_URL}/fr/publications" style="color:#c9a0b0;text-decoration:none;margin:0 8px">Publications</a>
        </p>
        <!-- Address -->
        <p style="margin:0 0 8px;font-size:12px;color:#6b3d4e;line-height:1.7;font-family:Arial,sans-serif">
          154, Boulevard d'Anfa — Casablanca 20050, Maroc<br>
          Tél : +212 0522 391 850 &nbsp;·&nbsp; contact@fma.org.ma
        </p>
        <p style="margin:0;font-size:11px;color:#3d1c28;font-family:Arial,sans-serif">© ${year} FMA — Tous droits réservés</p>
      </td>
    </tr>

    <!-- ACCENT BOTTOM -->
    <tr><td style="height:4px;background-color:#9c96b0;font-size:0">&nbsp;</td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

/* ── Contact confirmation ── */
export async function sendContactConfirmation(to: string, name: string) {
  const content = `
    <tr>
      <td style="padding:40px 40px 32px">
        <!-- Greeting -->
        <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a0a0f;font-family:Arial,sans-serif">Bonjour ${name},</p>
        <p style="margin:0 0 28px;font-size:15px;color:#6b5060;line-height:1.7;font-family:Arial,sans-serif">Nous avons bien reçu votre message et nous vous en remercions. Notre équipe va l'examiner et vous répondra dans les meilleurs délais.</p>

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px">
          <tr>
            <td style="background-color:#faf5f8;border:1px solid #f0e8ed;border-radius:12px;padding:24px">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#ac1949;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif">✅ &nbsp;Message reçu</p>
              <p style="margin:0;font-size:15px;color:#2d1520;line-height:1.7;font-family:Arial,sans-serif">Votre demande a été enregistrée avec succès. Un membre de notre équipe prendra contact avec vous très prochainement.</p>
            </td>
          </tr>
        </table>

        <!-- Info rows -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px">
          <tr>
            <td width="14" valign="top" style="padding-top:6px"><div style="width:8px;height:8px;background-color:#ac1949;border-radius:50%;font-size:0">&nbsp;</div></td>
            <td style="padding:0 0 10px 10px;font-size:14px;color:#4a2535;line-height:1.6;font-family:Arial,sans-serif">Délai de réponse habituel : <strong>2 à 3 jours ouvrés</strong></td>
          </tr>
          <tr>
            <td width="14" valign="top" style="padding-top:6px"><div style="width:8px;height:8px;background-color:#ac1949;border-radius:50%;font-size:0">&nbsp;</div></td>
            <td style="padding:0 0 10px 10px;font-size:14px;color:#4a2535;line-height:1.6;font-family:Arial,sans-serif">Pensez à vérifier votre dossier <strong>Spam</strong> si vous ne recevez pas de réponse</td>
          </tr>
          <tr>
            <td width="14" valign="top" style="padding-top:6px"><div style="width:8px;height:8px;background-color:#ac1949;border-radius:50%;font-size:0">&nbsp;</div></td>
            <td style="padding:0 0 10px 10px;font-size:14px;color:#4a2535;line-height:1.6;font-family:Arial,sans-serif">Pour toute urgence, contactez-nous au <strong>+212 0522 391 850</strong></td>
          </tr>
        </table>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
          <tr>
            <td align="center" style="background-color:#ac1949;border-radius:100px;padding:14px 36px">
              <a href="${BASE_URL}/fr" style="color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;font-family:Arial,sans-serif;display:block">Visiter notre site web</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  await transporter.sendMail({
    from: `"FMA — Fédération Marocaine de l'Assurance" <${process.env.SMTP_FROM}>`,
    to,
    subject: "✅ Votre message a bien été reçu — FMA",
    html: emailLayout(content, `Bonjour ${name}, votre message a bien été reçu par la FMA. Nous vous répondrons dans les meilleurs délais.`),
  });
}

/* ── Newsletter confirmation ── */
export async function sendNewsletterConfirmation(to: string, token: string) {
  const url = `${BASE_URL}/api/newsletter/confirm?token=${token}`;

  const content = `
    <tr>
      <td style="padding:40px 40px 32px">
        <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a0a0f;font-family:Arial,sans-serif">Confirmez votre inscription</p>
        <p style="margin:0 0 28px;font-size:15px;color:#6b5060;line-height:1.7;font-family:Arial,sans-serif">Vous avez demandé à recevoir la newsletter de la Fédération Marocaine de l'Assurance. Un seul clic pour finaliser votre inscription.</p>

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px">
          <tr>
            <td style="background-color:#faf5f8;border:1px solid #f0e8ed;border-radius:12px;padding:24px">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#ac1949;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif">📬 &nbsp;Newsletter FMA</p>
              <p style="margin:0;font-size:15px;color:#2d1520;line-height:1.7;font-family:Arial,sans-serif">Restez informé des dernières actualités, publications et formations du secteur de l'assurance au Maroc.</p>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px">
          <tr>
            <td align="center" style="background-color:#ac1949;border-radius:100px;padding:14px 36px">
              <a href="${url}" style="color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;font-family:Arial,sans-serif;display:block">Confirmer mon inscription</a>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 8px;font-size:13px;color:#8a6070;text-align:center;font-family:Arial,sans-serif">Si vous n'avez pas effectué cette demande, ignorez simplement cet email.<br>Le lien expire dans <strong>24 heures</strong>.</p>
        <p style="margin:0;font-size:12px;color:#b89aaa;text-align:center;word-break:break-all;font-family:Arial,sans-serif"><a href="${url}" style="color:#b89aaa">${url}</a></p>
      </td>
    </tr>`;

  await transporter.sendMail({
    from: `"FMA — Fédération Marocaine de l'Assurance" <${process.env.SMTP_FROM}>`,
    to,
    subject: "📬 Confirmez votre inscription à la newsletter FMA",
    html: emailLayout(content, "Confirmez votre inscription à la newsletter de la Fédération Marocaine de l'Assurance."),
  });
}
