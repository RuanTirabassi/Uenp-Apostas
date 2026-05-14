import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// AES-256-CBC exige uma chave de exatamente 32 bytes (256 bits).
// Para evitar erros caso a senha cadastrada seja menor ou maior, passamos um hash SHA-256
// no segredo, que SEMPRE gera um buffer de exatamente 32 bytes de forma segura.
const SECRET_RAW = process.env.CRYPTO_SECRET || "12345678901234567890123456789012";
const ENCRYPTION_KEY = crypto.createHash("sha256").update(SECRET_RAW).digest();
const IV_LENGTH = 16; // Para AES, isso é sempre 16

export function encrypt(text: string): string {
  // Gera um vetor de inicialização (IV) aleatório para cada criptografia
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Retorna o IV junto com o texto criptografado (necessário para descriptografar)
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  try {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift()!, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    // Caso falhe ao descriptografar (ex: dado legado que não estava criptografado)
    console.warn("Aviso: Falha ao descriptografar dado. Retornando valor original.", error);
    return text;
  }
}
