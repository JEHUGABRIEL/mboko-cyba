/**
 * Service d'envoi d'email via Web3Forms (client-side only, no backend).
 * Nécessite une clé d'accès dans VITE_WEB3FORMS_ACCESS_KEY (.env)
 *
 * Web3Forms reçoit les données du formulaire et les transmet à l'email
 * configuré dans le tableau de bord Web3Forms.
 *
 * Docs : https://web3forms.com/
 */

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

interface EmailPayload {
  access_key: string;
  subject: string;
  from_name?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  company?: string;
  category?: string;
  /** Anti-spam : champ caché, doit être vide */
  botcheck?: string;
}

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

/**
 * Envoie les données du formulaire via Web3Forms.
 * Si un fichier est fourni, la requête est envoyée en `multipart/form-data`
 * (nécessaire pour les pièces jointes). Sinon, un JSON classique est utilisé.
 *
 * Retourne `true` si l'envoi a réussi, `false` en cas d'erreur.
 */
export async function sendContactEmail(
  data: Omit<EmailPayload, "access_key" | "botcheck">,
  attachment?: File
): Promise<boolean> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    console.warn(
      "[emailService] VITE_WEB3FORMS_ACCESS_KEY non définie. " +
        "Ajoutez-la dans le fichier .env ou le tableau de bord Vercel."
    );
    return false;
  }

  try {
    let body: BodyInit;
    let headers: Record<string, string> = { Accept: "application/json" };

    if (attachment) {
      // Mode multipart : nécessaire pour l'upload de fichier
      const formData = new FormData();
      formData.append("access_key", accessKey);
      formData.append("botcheck", "");
      formData.append("subject", data.subject);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("message", data.message);
      if (data.company) formData.append("company", data.company);
      if (data.category) formData.append("category", data.category);
      formData.append("attachment", attachment, attachment.name);
      body = formData;
      // Ne PAS set Content-Type — le navigateur le définit avec le boundary
    } else {
      // Mode JSON standard
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({
        access_key: accessKey,
        botcheck: "",
        ...data,
      });
    }

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers,
      body,
    });

    const result: Web3FormsResponse = await response.json();

    if (!result.success) {
      console.error("[emailService] Web3Forms error:", result.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[emailService] Network error:", error);
    // On relance l'erreur pour que l'appelant puisse afficher un toast d'erreur réseau
    throw error;
  }
}
