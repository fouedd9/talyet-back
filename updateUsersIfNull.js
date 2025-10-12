// updateUsersIfNull.js
import { fakerFR } from "@faker-js/faker"; // ✅ Import direct

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fullstack",
  password: "fartattou",
  port: 5432,
});

async function updateAllUsers() {
  try {
    // Récupérer tous les users
    const result = await pool.query(
      "SELECT id, name, country, job_title, profile_picture, bio FROM users"
    );

    for (const user of result.rows) {
      const updatedFields = {};

      if (!user.country) updatedFields.country = fakerFR.location.country();
      if (!user.job_title) updatedFields.job_title = fakerFR.person.jobTitle();
      if (!user.profile_picture)
        updatedFields.profile_picture = fakerFR.image.avatar();
      if (!user.bio) updatedFields.bio = fakerFR.lorem.sentence();

      if (Object.keys(updatedFields).length > 0) {
        const setClauses = [];
        const values = [];
        let i = 1;

        for (const [key, value] of Object.entries(updatedFields)) {
          setClauses.push(`${key} = $${i}`);
          values.push(value);
          i++;
        }

        values.push(user.id);

        const query = `
          UPDATE users 
          SET ${setClauses.join(", ")}
          WHERE id = $${i}
        `;

        await pool.query(query, values);

        console.log(`✅ User ${user.id} mis à jour avec :`, updatedFields);
      }
    }

    console.log("🎉 Tous les utilisateurs ont été mis à jour !");
  } catch (err) {
    console.error("❌ Erreur :", err);
  } finally {
    await pool.end();
  }
}

updateAllUsers();
