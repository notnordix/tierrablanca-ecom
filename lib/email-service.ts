"use server"

import type { Order } from "./orders"

// Format order items for email
function formatOrderItems(order: Order): string {
  return order.items
    .map((item) => {
      return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size || "-"}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.color || "-"}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.price}</td>
      </tr>
    `
    })
    .join("")
}

// Send order notification email
export async function sendOrderNotification(order: Order): Promise<boolean> {
  try {
    // Dynamically import nodemailer only on the server
    const nodemailer = (await import("nodemailer")).default

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const adminEmail = process.env.ADMIN_EMAIL || "Contact@sofiandco.ma"

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `Nouvelle commande: ${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #415e5a; border-bottom: 2px solid #415e5a; padding-bottom: 10px;">
            Nouvelle commande: ${order.id}
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Informations client:</h3>
            <p><strong>Nom:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Téléphone:</strong> ${order.phone}</p>
            <p><strong>Adresse:</strong> ${order.address}</p>
            <p><strong>Ville:</strong> ${order.city}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Détails de la commande:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 8px; text-align: left;">Produit</th>
                  <th style="padding: 8px; text-align: left;">Quantité</th>
                  <th style="padding: 8px; text-align: left;">Taille</th>
                  <th style="padding: 8px; text-align: left;">Couleur</th>
                  <th style="padding: 8px; text-align: left;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${formatOrderItems(order)}
              </tbody>
            </table>
          </div>
          
          <div style="margin: 20px 0; background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <p><strong>Total:</strong> ${order.totalAmount.toLocaleString()} MAD</p>
            <p><strong>Date:</strong> ${order.date}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Ce message a été envoyé automatiquement depuis le site TierraBlanca.</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending order notification email:", error)
    return false
  }
}
