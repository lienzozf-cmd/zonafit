import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

// Esta interfaz coincide con lo que envía tu route.ts
interface OrderDetails {
  shippingInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    department: string;
    municipality: string;
    email: string;
    paymentMethod: 'deposit' | 'cod';
  };
  orderItems: {
    id: string;
    name: string;
    price: number;
    image: string;
    option: string;
    quantity: number;
    subtotal: string; // Viene como string desde el API (toFixed)
  }[];
  orderSubtotal: number;
  orderDiscount: number;
  orderShipping: number;
  orderCommission: number;
  orderTotal: number;
  orderId: string;
}

interface OrderConfirmationEmailProps {
  orderDetails: OrderDetails;
}

export const OrderConfirmationEmail = ({ orderDetails }: OrderConfirmationEmailProps) => {
  const { 
      shippingInfo, 
      orderItems, 
      orderSubtotal,
      orderDiscount,
      orderShipping,
      orderCommission,
      orderTotal, 
      orderId 
  } = orderDetails;

  const paymentMethodText = shippingInfo.paymentMethod === 'cod' ? 'Pago Contra Entrega' : 'Previo Depósito';
  
  return (
    <Html>
      <Head />
      <Preview>¡Nuevo Pedido en ZONA FIT GT! #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header con Logo o Título */}
          <Section style={headerSection}>
             <Heading style={heading}>Confirmación de Pedido</Heading>
             <Text style={orderIdText}>#{orderId}</Text>
          </Section>
          
          <Text style={paragraph}>Hola {shippingInfo.firstName}, gracias por tu compra.</Text>
          <Text style={paragraph}>Hemos recibido tu pedido correctamente. A continuación los detalles:</Text>
          
          <Hr style={hr} />

          {/* Información del Cliente */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>Datos de Envío</Heading>
            <Row>
                <Column>
                    <Text style={text}><span style={bold}>Cliente:</span> {shippingInfo.firstName} {shippingInfo.lastName}</Text>
                    <Text style={text}><span style={bold}>Teléfono:</span> {shippingInfo.phone}</Text>
                    <Text style={text}><span style={bold}>Email:</span> {shippingInfo.email}</Text>
                </Column>
                <Column>
                    <Text style={text}><span style={bold}>Dirección:</span> {shippingInfo.address}</Text>
                    <Text style={text}>{shippingInfo.municipality}, {shippingInfo.department}</Text>
                    <Text style={text}><span style={bold}>Pago:</span> {paymentMethodText}</Text>
                </Column>
            </Row>
          </Section>
          
          <Hr style={hr} />

          {/* Tabla de Productos */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>Tu Pedido</Heading>
            <table style={table} cellPadding="0" cellSpacing="0">
              <thead style={tableHead}>
                <tr>
                  <th style={tableHeaderCell} align="left">Producto</th>
                  <th style={tableHeaderCell} align="center">Cant.</th>
                  <th style={tableHeaderCell} align="right">Precio</th>
                  <th style={tableHeaderCell} align="right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id} style={tableRow}>
                     <td style={tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                         {/* Asegúrate que item.image sea una URL absoluta (http...) */}
                         <Img 
                            src={item.image} 
                            alt={item.name} 
                            width="50" 
                            height="50" 
                            style={productImage} 
                         />
                         <div style={{ marginLeft: '10px' }}>
                            <Text style={{ ...text, margin: 0, fontWeight: 'bold', fontSize: '13px' }}>{item.name}</Text>
                            <Text style={{ ...text, margin: 0, fontSize: '11px', color: '#666' }}>{item.option}</Text>
                         </div>
                      </div>
                    </td>
                    <td style={{...tableCell, textAlign: 'center', verticalAlign: 'middle'}}>{item.quantity}</td>
                    <td style={{...tableCell, textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap'}}>Q{item.price.toFixed(2)}</td>
                    <td style={{...tableCell, textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap'}}>Q{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
          
          <Hr style={hr} />

          {/* Resumen de Totales */}
          <Section style={{ ...section, paddingRight: '48px' }}>
              <Row>
                  <Column style={{ width: '60%' }}></Column>
                  <Column style={{ width: '40%' }}>
                      <Row>
                          <Column align="right"><Text style={summaryText}>Subtotal:</Text></Column>
                          <Column align="right"><Text style={summaryText}>Q{orderSubtotal.toFixed(2)}</Text></Column>
                      </Row>
                      {orderDiscount > 0 && (
                          <Row>
                              <Column align="right"><Text style={summaryText}>Descuento:</Text></Column>
                              <Column align="right"><Text style={{ ...summaryText, color: '#22c55e' }}>-Q{orderDiscount.toFixed(2)}</Text></Column>
                          </Row>
                      )}
                      <Row>
                          <Column align="right"><Text style={summaryText}>Envío:</Text></Column>
                          <Column align="right"><Text style={summaryText}>Q{orderShipping.toFixed(2)}</Text></Column>
                      </Row>
                      {orderCommission > 0 && (
                          <Row>
                              <Column align="right"><Text style={summaryText}>Comisión:</Text></Column>
                              <Column align="right"><Text style={{...summaryText, color: '#f97316'}}>Q{orderCommission.toFixed(2)}</Text></Column>
                          </Row>
                      )}
                      <Hr style={{ borderColor: '#ddd', margin: '10px 0' }} />
                      <Row>
                          <Column align="right"><Text style={totalText}>TOTAL:</Text></Column>
                          <Column align="right"><Text style={totalAmount}>Q{orderTotal.toFixed(2)}</Text></Column>
                      </Row>
                  </Column>
              </Row>
          </Section>

          {/* Recordatorio / Footer */}
          <Section style={reminderSection}>
            <Text style={reminderText}>
              <span style={bold}>Importante:</span> Un asesor te contactará pronto para confirmar el envío.
            </Text>
          </Section>

          <Section style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text style={{ fontSize: '12px', color: '#999' }}>
              © {new Date().getFullYear()} Zona Fit GT. Todos los derechos reservados.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmationEmail;

// --- Styles ---

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginBottom: '64px',
  border: '1px solid #eee',
  borderRadius: '8px',
  overflow: 'hidden',
  maxWidth: '600px',
};

const headerSection = {
    backgroundColor: '#000000', // Cabecera negra para contraste
    padding: '30px 20px',
    textAlign: 'center' as const,
};
  
const heading = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold' as const,
  margin: '0',
};

const orderIdText = {
    color: '#cccccc',
    fontSize: '14px',
    marginTop: '5px',
    marginBottom: '0',
};

const subheading = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px',
  margin: '20px 0 15px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  color: '#525f7f',
  padding: '0 48px',
};

const section = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const text = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '5px 0',
};

const bold = {
  fontWeight: 'bold' as const,
  color: '#333',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const tableHead = {
  backgroundColor: '#f8f9fa',
};

const tableHeaderCell = {
  padding: '10px',
  textAlign: 'left' as const,
  fontSize: '11px',
  color: '#666',
  textTransform: 'uppercase' as const,
  fontWeight: '600',
};

const tableRow = {
  borderBottom: '1px solid #eee',
};

const tableCell = {
  padding: '12px 5px',
  verticalAlign: 'top',
};

const productImage = {
  borderRadius: '6px',
  objectFit: 'cover' as const,
  display: 'block', // Importante para emails
};

const summaryText = {
  fontSize: '14px',
  color: '#666',
  margin: '2px 0',
};

const totalText = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#333',
  margin: '0',
};

const totalAmount = {
  fontSize: '20px',
  fontWeight: 'bold' as const,
  color: '#E50000',
  margin: '0',
};

const reminderSection = {
  marginTop: '30px',
  padding: '20px 48px',
  backgroundColor: '#fff5f5',
  borderTop: '1px solid #ffebeb',
};

const reminderText = {
  margin: 0,
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#E50000',
  textAlign: 'center' as const,
};

    