import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

const escapeApostrophes = (value) => {
  return value.replace(/'/g, "''");
};

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(
    sql.raw(`
      UPDATE contents_info
      SET content = '${escapeApostrophes(JSON.stringify(new_item.content))}'
      WHERE id = '${Number(new_item.id)}'
  `),
  );
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(
    sql.raw(`
      UPDATE contents_info
      SET content = '${escapeApostrophes(JSON.stringify(old_item.content))}'
      WHERE id = '${Number(new_item.id)}'
  `),
  );
}

const new_item = {
  id: "2",
  content: [
    {
      children: [
        {
          text: "يرجى تقييم\nتجربتك / رأيك / ملاحظاتك على مقياس من 1 إلى 5. استخدم المقياس كما يلي:",
        },
      ],
    },
    {
      children: [
        {
          text: "1: منخفض جدا",
        },
      ],
    },
    {
      children: [
        {
          text: "2: منخفض",
        },
      ],
    },
    {
      children: [
        {
          text: "3: محايد",
        },
      ],
    },
    {
      children: [
        {
          text: "4: مرتفع",
        },
      ],
    },
    {
      children: [
        {
          text: "5: مرتفع جدا",
        },
      ],
    },
    {
      children: [
        {
          text: "",
        },
      ],
    },
    {
      children: [
        {
          text: "\n\n\n",
        },
      ],
    },
    {
      children: [
        {
          text: "     سيتم استخدام نتائج\nالاستطلاع على أساس تراكمي لجمع الأفكار وتحسين الكفاءة والفعالية بشكل عام.  كن مطمئنا أن ردودك سرية ، ولن يتم الكشف عن\nإجاباتك الفردية. ملاحظاتك قيمة ، ونحن نقدر مدخلاتك الصادقة.",
        },
      ],
    },
    {
      children: [
        {
          text: "\n\n",
        },
      ],
    },
  ],
  language: "ar",
};

const old_item = {
  id: "2",
  content: [
    {
      children: [
        {
          text: "يرجى تقييم\nتجربتك / رأيك / ملاحظاتك على مقياس من 1 إلى 5. استخدم المقياس كما يلي:",
        },
      ],
    },
    {
      children: [
        {
          text: "1: منخفض جدا",
        },
      ],
    },
    {
      children: [
        {
          text: "2: منخفض",
        },
      ],
    },
    {
      children: [
        {
          text: "3: محايد",
        },
      ],
    },
    {
      children: [
        {
          text: "4: عالية",
        },
      ],
    },
    {
      children: [
        {
          text: "5: مرتفع جدا",
        },
      ],
    },
    {
      children: [
        {
          text: "",
        },
      ],
    },
    {
      children: [
        {
          text: "\n\n\n",
        },
      ],
    },
    {
      children: [
        {
          text: "     سيتم استخدام نتائج\nالاستطلاع على أساس تراكمي لجمع الأفكار وتحسين الكفاءة والفعالية بشكل عام.  كن مطمئنا أن ردودك سرية ، ولن يتم الكشف عن\nإجاباتك الفردية. ملاحظاتك قيمة ، ونحن نقدر مدخلاتك الصادقة.",
        },
      ],
    },
    {
      children: [
        {
          text: "\n\n",
        },
      ],
    },
  ],
  language: "ar",
};
