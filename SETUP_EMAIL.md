# Configurazione EmailJS - Guida Setup

Per abilitare l'invio reale delle email dal tuo sito web, segui questi passaggi per configurare EmailJS.

## 🚀 Passo 1: Registrazione su EmailJS

1. Vai su [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clicca su **"Sign Up"** e crea un account gratuito
3. Conferma la tua email

## 📧 Passo 2: Configurazione Gmail

1. Nel dashboard EmailJS, vai su **"Email Services"**
2. Clicca **"Add New Service"**
3. Seleziona **"Gmail"**
4. Inserisci la tua email: `iacovici95@gmail.com`
5. Autorizza EmailJS ad accedere al tuo Gmail
6. Annota il **Service ID** (es: `service_4yiu7ts`)

## 📝 Passo 3: Creazione Template Email

1. Vai su **"Email Templates"**
2. Clicca **"Create New Template"**
3. Usa questo template:

```html
Nuova richiesta da Iacovici.it

-----------------------------------
TIPO: {{form_type}}
-----------------------------------

👤 Nome: {{from_name}}
📧 Email: {{from_email}}
📱 Telefono: {{phone}}
🛠️ Servizio: {{service}}

💬 Messaggio:
{{message}}

-----------------------------------
Inviato dal sito Iacovici.it
```

4. Imposta:
   - **To Email**: `iacovici95@gmail.com`
   - **From Name**: `{{from_name}}`
   - **From Email**: `{{from_email}}`
   - **Subject**: `Nuova richiesta - {{service}} - {{from_name}}`

5. Salva e annota il **Template ID** (es: `template_vect5fp`)

## 🔑 Passo 4: Configurazione Public Key

1. Vai su **"Integration"** > **"Browser"**
2. Copia la tua **Public Key** (es: `B7K1wbag_l9sz5D0D`)

## ⚙️ Passo 5: Aggiornamento Codice

Ora aggiorna il file `js/main.js`:

**Trova queste righe (circa riga 8-12):**
```javascript
// EmailJS Configuration - REPLACE THESE WITH YOUR ACTUAL CREDENTIALS
const EMAILJS_CONFIG = {
    serviceID: 'YOUR_SERVICE_ID',    // Replace with your EmailJS service ID
    templateID: 'YOUR_TEMPLATE_ID',  // Replace with your EmailJS template ID
    publicKey: 'YOUR_PUBLIC_KEY'     // Replace with your EmailJS public key
};
```

**Sostituisci con i tuoi dati:**
```javascript
const EMAILJS_CONFIG = {
    serviceID: 'service_xyz123',     // Il tuo Service ID
    templateID: 'template_abc456',   // Il tuo Template ID
    publicKey: 'YOUR_PUBLIC_KEY_HERE' // La tua Public Key
};
```

**E trova questa riga (circa riga 4):**
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key
```

**Sostituisci con:**
```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE"); // La tua Public Key
```

## ✅ Passo 6: Test

1. Apri il sito web
2. Compila uno dei form (hero o contatti)
3. Invia la richiesta
4. Controlla la tua email `iacovici95@gmail.com`

## 🎯 Risultato

Dopo la configurazione, ogni richiesta inviata dai form arriverà automaticamente a **iacovici95@gmail.com** con tutte le informazioni del cliente.

## 🆓 Limite Piano Gratuito

- **200 email/mese** nel piano gratuito
- Per volumi maggiori, considera l'upgrade a piano pagamento

## 🔧 Risoluzione Problemi

**Se le email non arrivano:**

1. Controlla la console del browser per errori
2. Verifica che Service ID, Template ID e Public Key siano corretti
3. Assicurati che il template EmailJS sia attivo
4. Controlla la cartella SPAM in Gmail

**Errore CORS:**
Se vedi errori CORS, aggiungi il tuo dominio nelle impostazioni EmailJS.

## 📞 Supporto

Per problemi tecnici:
- Documentazione EmailJS: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- Community EmailJS: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)

---

⚡ **Setup completato!** Ora il tuo sito invierà automaticamente tutte le richieste a iacovici95@gmail.com 