# PayPhone Tokenización - Notas de Implementación

## Flujo de Tokenización

### 1. Primera Transacción
- Cliente paga con botón de pago normal (cajita de pagos)
- PayPhone genera un `cardToken` único para la tarjeta
- PayPhone envía el `cardToken` en la respuesta a la URL de respuesta (callback)
- Solo funciona con Visa y Mastercard

### 2. Transacciones Subsiguientes (Cobros Recurrentes)
- Usar el `cardToken` guardado para cobrar sin pedir datos de tarjeta nuevamente
- PayPhone NO es un sistema de pagos recurrentes automático
- NOSOTROS debemos implementar la lógica de cobros periódicos con el token

## API para Cobros con Token

### Endpoint
```
POST https://pay.payphonetodoesposible.com/api/transaction/web
```

### Headers
```
Authorization: bearer TU_TOKEN (mismo token de la app PayPhone)
Content-type: application/json
```

### Body (JSON)
```json
{
  "cardHolder": "{{cardHolder}}",
  "cardToken": "{{ctoken_user}}",
  "documentId": "1234567890",
  "phoneNumber": "593999999999",
  "email": "aloy@mail.com",
  "amount": 699,
  "amountWithoutTax": 699,
  "amountWithTax": 0,
  "tax": 0,
  "service": null,
  "tip": null,
  "clientTransactionId": "ID_UNICO_X_TRX-101",
  "currency": "USD",
  "storeId": "your_storeId",
  "optionalParameter": "Suscripción mensual PlanificaDoc"
}
```

## Consideraciones Clave
- Solo Visa y Mastercard
- Consentimiento explícito del cliente para guardar token
- Guardar: cardToken, cardHolder, email, documentId, phoneNumber
- amount en CENTAVOS (699 = $6.99)
- clientTransactionId ÚNICO por transacción
- storeId = ID de la tienda en PayPhone

## Implementación para PlanificaDoc
- Plan Mensual: $6.99 = 699 centavos, cobrar cada 30 días
- Plan Anual: $4.89/mes = $58.68/año = 5868 centavos, cobrar cada 365 días
- Guardar cardToken en BD al primer pago exitoso
- Cron job que revise suscripciones vencidas y cobre automáticamente
- Si falla el cobro: marcar suscripción como "pendiente", dar 3 días de gracia, luego suspender
