const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fullstack",
  password: "fartattou",
  port: 5432,
});

function buildPasswordFromName(name, emailFallback) {
  if (!name || name.trim().length === 0) {
    // fallback: use local-part of email if name missing
    if (emailFallback && emailFallback.includes("@")) {
      return (
        emailFallback.split("@")[0].replace(/\W+/g, "").toLowerCase() + "123"
      );
    }
    return "user123";
  }
  // remove diacritics, non-alphanumeric, spaces; lowercase
  const normalized = name
    .normalize("NFD") // décompose les accents
    .replace(/\p{Diacritic}/gu, "") // supprime diacritics (accent marks)
    .replace(/[^0-9a-zA-Z]/g, "") // supprime tout sauf alnum
    .toLowerCase();
  return normalized + "123";
}

async function run() {
  console.log("==> Début du remplacement des mots de passe (hashés)...");
  try {
    const res = await pool.query("SELECT id, name, email FROM users");
    console.log(`Trouvé ${res.rowCount} users.`);

    for (const row of res.rows) {
      const id = row.id;
      const name = row.name || "";
      const email = row.email || "";
      const plain = buildPasswordFromName(name, email);

      // hash bcrypt
      const hash = await bcrypt.hash(plain, 10);

      // update DB
      await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
        hash,
        id,
      ]);

      // log (ne pas afficher le hash en clair)
      console.log(`ID=${id}  -> mot de passe défini sur (plain) : ${plain}`);
    }

    console.log("==> Tous les mots de passe ont été remplacés (hashés).");
    console.log(
      "⚠️ Rappels : ces mots de passe en clair ont été affichés au log pour debug ; supprime ces logs si nécessaire."
    );
  } catch (err) {
    console.error("Erreur :", err);
  } finally {
    await pool.end();
  }
}

run();
