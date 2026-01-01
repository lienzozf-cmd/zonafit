
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
      subtotal: string;
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
            <Heading style={heading}>¡Nuevo Pedido #{orderId}!</Heading>
            <Text style={paragraph}>Has recibido un nuevo pedido a través de tu tienda en línea.</Text>
            
            <Section style={section}>
              <Heading as="h2" style={subheading}>Información del Cliente</Heading>
              <Text style={text}><span style={bold}>Nombre:</span> {shippingInfo.firstName} {shippingInfo.lastName}</Text>
              <Text style={text}><span style={bold}>Correo Electrónico:</span> {shippingInfo.email}</Text>
              <Text style={text}><span style={bold}>Teléfono:</span> {shippingInfo.phone}</Text>
              <Text style={text}><span style={bold}>Dirección:</span> {shippingInfo.address}, {shippingInfo.municipality}, {shippingInfo.department}</Text>
              <Text style={text}><span style={bold}>Método de Pago:</span> {paymentMethodText}</Text>
            </Section>
            
            <Hr style={hr} />
  
            <Section style={section}>
              <Heading as="h2" style={subheading}>Detalles del Pedido</Heading>
              <table style={table} cellPadding="0" cellSpacing="0">
                <thead style={tableHead}>
                  <tr>
                    <th style={tableHeaderCell} align="left">Producto</th>
                    <th style={tableHeaderCell} align="center">Cantidad</th>
                    <th style={tableHeaderCell} align="right">Precio Unit.</th>
                    <th style={tableHeaderCell} align="right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id} style={tableRow}>
                       <td style={tableCell}>
                        <Row>
                          <Column style={{ paddingRight: '15px' }}>
                             <Img src={item.image} alt={item.name} width="60" height="60" style={productImage} />
                          </Column>
                          <Column>
                            <Text style={{ ...text, margin: 0, fontWeight: 'bold' }}>{item.name}</Text>
                            <Text style={{ ...text, margin: 0, fontSize: '12px', color: '#666' }}>{item.option}</Text>
                          </Column>
                        </Row>
                      </td>
                      <td style={{...tableCell, textAlign: 'center'}}>{item.quantity}</td>
                      <td style={{...tableCell, textAlign: 'right'}}>Q{item.price.toFixed(2)}</td>
                      <td style={{...tableCell, textAlign: 'right'}}>Q{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
            
            <Hr style={hr} />
  
            <Section style={{ ...section, paddingLeft: '48px', paddingRight: '48px' }}>
                <Row>
                    <Column align="right">
                        <Text style={summaryText}>Subtotal:</Text>
                        {orderDiscount > 0 && (
                            <Text style={summaryText}>Descuento:</Text>
                        )}
                        <Text style={summaryText}>Envío:</Text>
                        {orderCommission > 0 && (
                            <Text style={summaryText}>Comisión (4%):</Text>
                        )}
                        <Text style={totalText}>Total del Pedido:</Text>
                    </Column>
                    <Column align="right" style={{width: '120px'}}>
                        <Text style={summaryText}>Q{orderSubtotal.toFixed(2)}</Text>
                        {orderDiscount > 0 && (
                            <Text style={{ ...summaryText, color: '#22c55e' }}>-Q{orderDiscount.toFixed(2)}</Text>
                        )}
                        <Text style={summaryText}>Q{orderShipping.toFixed(2)}</Text>
                        {orderCommission > 0 && (
                             <Text style={{...summaryText, color: '#f97316'}}>Q{orderCommission.toFixed(2)}</Text>
                        )}
                        <Text style={totalAmount}>Q{orderTotal.toFixed(2)}</Text>
                    </Column>
                </Row>
            </Section>
  
            <Section style={reminderSection}>
              <Text style={reminderText}>
                <span style={bold}>Recordatorio:</span> Debes contactar al cliente para coordinar el costo y la logística del envío.
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
    padding: '20px 0 48px',
    marginBottom: '64px',
    border: '1px solid #eee',
    borderRadius: '5px',
  };
    
  const heading = {
    color: '#E50000',
    fontSize: '28px',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  };
  
  const subheading = {
    color: '#333',
    fontSize: '20px',
    fontWeight: 'bold' as const,
    borderBottom: '2px solid #E50000',
    paddingBottom: '5px',
    margin: '0 0 15px 0',
  };
  
  const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'center' as const,
    color: '#525f7f',
    padding: '0 20px',
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
    lineHeight: '24px',
  };
  
  const bold = {
    fontWeight: 'bold' as const,
  };
  
  const table = {
    width: '100%',
    borderCollapse: 'collapse' as const,
  };
  
  const tableHead = {
    backgroundColor: '#f2f2f2',
  };
  
  const tableHeaderCell = {
    padding: '12px',
    textAlign: 'left' as const,
    fontSize: '12px',
    color: '#333',
    textTransform: 'uppercase' as const,
  };
  
  const tableRow = {
    borderBottom: '1px solid #ddd',
  };
  
  const tableCell = {
    padding: '15px 12px',
    verticalAlign: 'top',
  };
  
  const productImage = {
    borderRadius: '8px',
    marginRight: '15px',
  };

  const summaryText = {
    ...text,
    margin: '0 0 8px 0',
  };
  
  const totalText = {
    ...text,
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#333',
    margin: '8px 0 0 0',
  };
  
  const totalAmount = {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#E50000',
    margin: '8px 0 0 0',
  };
  
  const reminderSection = {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderLeft: '4px solid #E50000',
    margin: '0 48px',
  };
  
  const reminderText = {
    margin: 0,
    lineHeight: '1.5',
    color: '#525f7f',
  };

    