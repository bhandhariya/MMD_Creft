import workshopData from '../data/workshop.json';

export interface WhatsAppOrderParams {
  productName: string;
  category?: string;
  material: string;
  thickness: string;
  dimensions?: string;
  shape?: string;
  finish?: string;
  customText?: string;
  quantity: number;
  estimatedPrice?: number;
  notes?: string;
}

export function generateWhatsAppOrderUrl(params: WhatsAppOrderParams): string {
  const phone = workshopData.contact.whatsappNumber || '919876543210';

  const lines = [
    `⚡ *NEW ORDER INQUIRY - MMD CRAFT STUDIO* ⚡`,
    `----------------------------------------`,
    `📦 *Item:* ${params.productName}`,
    params.category ? `📂 *Category:* ${params.category}` : null,
    `🪵 *Material:* ${params.material}`,
    `📏 *Thickness:* ${params.thickness}`,
    params.dimensions ? `📐 *Dimensions:* ${params.dimensions}` : null,
    params.shape ? `🔷 *Shape:* ${params.shape}` : null,
    params.finish ? `✨ *Finish:* ${params.finish}` : null,
    params.customText ? `✍️ *Engraving/Custom Text:* "${params.customText}"` : null,
    `🔢 *Quantity:* ${params.quantity} Units`,
    params.estimatedPrice ? `💰 *Est. Quote:* $${params.estimatedPrice.toFixed(2)} USD` : null,
    params.notes ? `📝 *Notes:* ${params.notes}` : null,
    `----------------------------------------`,
    `Please confirm fabrication lead-time, DXF file preparation guidelines, and shipping details.`
  ].filter(Boolean);

  const fullMessage = lines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;
}

export function generateBulkWhatsAppUrl(company: string, material: string, estimatedQty: string, notes: string): string {
  const phone = workshopData.contact.whatsappNumber || '919876543210';
  const text = [
    `🏭 *ENTERPRISE BULK ENQUIRY - MMD CRAFT* 🏭`,
    `----------------------------------------`,
    `🏢 *Company / Brand:* ${company || 'Direct Client'}`,
    `🪵 *Material Interest:* ${material}`,
    `📦 *Estimated Batch Size:* ${estimatedQty}`,
    `📋 *Project Scope:* ${notes || 'Requesting B2B tier pricing and material sample kit.'}`,
    `----------------------------------------`,
    `Please connect me with your production engineer.`
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
