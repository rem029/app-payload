import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

const escapeApostrophes = (value) => {
  return value.replace(/'/g, "''");
};

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  let departmentSubId = 0;
  for (let pIndex = 0; pIndex < departments.length; pIndex++) {
    const department = departments[pIndex];
    console.log("@inserting", department.name);
    const query = sql.raw(
      `INSERT INTO department(name) VALUES('${escapeApostrophes(
        department.name,
      )}') RETURNING id;`,
    );

    const response = await payload.db.drizzle.execute(query);
    if (response.rows && response.rows.length > 0) {
      const parentId = response.rows[0].id;

      for (let cIndex = 0; cIndex < department.subs.length; cIndex++) {
        departmentSubId++;
        const query = sql.raw(
          `INSERT INTO department_department_subs(_order, id, _parent_id, department_sub) VALUES(${cIndex}, ${departmentSubId}, ${parentId}, '${escapeApostrophes(
            department.subs[cIndex],
          )}')`,
        );

        await payload.db.drizzle.execute(query);
      }
    }
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  for (let pIndex = 0; pIndex < departments.length; pIndex++) {
    const department = departments[pIndex];
    const query = sql.raw(
      `DELETE FROM department WHERE name = '${department.name}' RETURNING id`,
    );

    const response = await payload.db.drizzle.execute(query);

    if (response.rows && response.rows.length > 0) {
      for (let cIndex = 0; cIndex < department.subs.length; cIndex++) {
        const query = sql.raw(
          `DELETE FROM department_department_subs WHERE department_sub = '${escapeApostrophes(
            department.subs[cIndex],
          )}'`,
        );

        await payload.db.drizzle.execute(query);
      }
    }
  }
}

const departments = [
  {
    name: "Buying",
    subs: [
      "Women's RTW",
      "Men's, Home & Tech, Kids",
      "Women's Bags, Accessories and Jewelry",
    ],
  },
  {
    name: "DO Centralized Engineering",
    subs: ["Maintenance"],
  },
  {
    name: "DO Centralized Executive Office",
    subs: [" "],
  },
  {
    name: "DO Centralized F&B",
    subs: [" ", "F&B"],
  },
  {
    name: "DO Centralized Finance",
    subs: ["Accounts"],
  },
  {
    name: "DO Centralized Gov Relations",
    subs: ["Gov Relations", " "],
  },
  {
    name: "DO Centralized HR",
    subs: [" "],
  },
  {
    name: "DO Centralized IT",
    subs: ["Media Application", "IT Support"],
  },
  {
    name: "DO Centralized Marketing",
    subs: [
      " ",
      "Creatives",
      "Administrative",
      "F&B Marketing",
      "Digital",
      "Padel Court",
      "Padel",
    ],
  },
  {
    name: "DO Centralized Purchasing",
    subs: ["Procurement", "General Stores"],
  },
  {
    name: "F&B",
    subs: [
      "Russo , Wild & the moon ",
      "Crazy Pizza , Twiga ",
      "COVA",
      "Russo's",
      "Salon de The",
      "Crazy Pizza",
      "Mosavalli Resraurant",
      "TWIGA",
      "F&B BOH",
      "wild and the moon",
      "Pierre Marcolini",
      "Matthew Kenney",
      "Central Kitchen - Pastry",
      "F&B BOH - Management",
      "Central Kitchen ",
      "Stewarding",
      "Duck Donuts",
      "Mosavali Georgian Restaurant",
      "DAR YEMA",
      "Mosavali Georgian Restaurant & Dar Yema",
      "Support Office",
      "Central Kitchen - Management",
      "TWIGA",
    ],
  },
  {
    name: "Finance",
    subs: [
      "Management",
      "Accounts",
      "Process & Compliance",
      "Payroll",
      "Cost Control",
      "Store",
    ],
  },
  {
    name: "Human Resources",
    subs: ["Management", "Recruitment & Training", "Business Support", "HR"],
  },
  {
    name: "Management",
    subs: ["Management"],
  },
  {
    name: "Marketing",
    subs: ["Digital", "Communications", "Communication & Events"],
  },
  {
    name: "Merchandise Planning & Supply Chain",
    subs: [
      "Management",
      "Logistics",
      "Supply Chain",
      "Loading Bay",
      "Merchandise Planning",
    ],
  },
  {
    name: "Store",
    subs: [
      " ",
      "Management",
      "Kids",
      "Security & Maintenance Facilities",
      "Footwear",
      "Standalone",
      "Accessible Jewellery",
      "Mens",
      "Womens ",
      "Footwear, Womens, Kids",
      "Luxury",
      "Womens",
      "Guest Relations",
      "Personal Shopping",
      "Home & Tech",
      "Luxury - Balmain",
      "Tailoring - Women",
      "Watches & Jewellery",
      "Home & Tech - Cities",
      "Beauty",
      "Home & Tech - MID",
      "Luxury - Collector Square",
      "Home & Tech - Dubai Audio",
      "Luxury - Pinel & Pinel",
      "Watches & Jewellery, Accessible Jewellery",
      "Maintenance",
      "Luxury - Pinel x Pinton",
      "Watches & Jewelry",
    ],
  },
  {
    name: "Visual Merchandising",
    subs: [
      "Store",
      "Kids",
      "Women's RTW",
      "Leather, Footwear, Bags, Luxury & Jewelry",
      "Home & Tech",
      "Mens Wear",
    ],
  },
];
