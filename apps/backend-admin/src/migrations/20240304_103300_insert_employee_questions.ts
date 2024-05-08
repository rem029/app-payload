import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

const escapeApostrophes = (value) => {
  return value.replace(/'/g, "''");
};

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  let itemId = 0;
  for (let pIndex = 0; pIndex < questions.length; pIndex++) {
    const question = questions[pIndex];
    const questionId = pIndex + 1;
    const query = sql.raw(
      `INSERT INTO employee_questions(id, default_title) VALUES(${questionId}, '${escapeApostrophes(
        question.title,
      )}');`,
    );

    await payload.db.drizzle.execute(query);

    for (let cIndex = 0; cIndex < questions[pIndex].items.length; cIndex++) {
      const item = questions[pIndex].items[cIndex];
      itemId++;
      const query = sql.raw(`
      INSERT INTO employee_questions_item(_parent_id,_order,id, type, language, title)
      VALUES(${questionId}, ${itemId},${itemId}, 'text', '${
        item.language
      }', '${escapeApostrophes(item.title)}');
    `);

      await payload.db.drizzle.execute(query);
    }
  }

  await payload.db.drizzle.execute(sql`
        INSERT INTO contents(id)
        VALUES(1);
    `);

  for (let hIndex = 0; hIndex < content.header.length; hIndex++) {
    const h = content.header[hIndex];

    await payload.db.drizzle.execute(
      sql.raw(`
        INSERT INTO contents_header(id,_parent_id, _order, content, language)
        VALUES(${hIndex},1,${hIndex}, '${escapeApostrophes(h.content)}','${
        h.language
      }')
    `),
    );
  }

  for (let iIndex = 0; iIndex < content.info.length; iIndex++) {
    const info = content.info[iIndex];

    await payload.db.drizzle.execute(
      sql.raw(`
        INSERT INTO contents_info(id,_parent_id, _order, content, language)
        VALUES(${iIndex},1,${iIndex}, '${escapeApostrophes(
        JSON.stringify(info.content),
      )}','${info.language}')
    `),
    );
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DELETE FROM employee_questions_item;
`);

  payload.db.drizzle.execute(sql`
    DELETE FROM employee_questions;
`);

  payload.db.drizzle.execute(sql`
    DELETE FROM contents_info;
`);

  payload.db.drizzle.execute(sql`
    DELETE FROM contents_header;
`);

  payload.db.drizzle.execute(sql`
    DELETE FROM contents;
`);
}

const content = {
  header: [
    {
      content: "ENQUÊTE AUPRÈS DES EMPLOYÉS DE PRINTEMPS DOHA",
      language: "fr",
    },
    { content: "PRINTEMPS DOHA EMPLOYEE SURVEY QUESTIONS", language: "en" },
    { content: "أسئلة استبيان موظفي برينتا الدوحة", language: "ar" },
  ],
  info: [
    {
      content: [
        {
          children: [
            {
              text: "Please rate your experience/opinion/feedback on a scale from 1 to 5. Use the scale as follows:",
            },
          ],
        },
        {
          children: [
            {
              text: "1: Very low",
            },
          ],
        },
        {
          children: [
            {
              text: "2: Low",
            },
          ],
        },
        {
          children: [
            {
              text: "3: Neutral",
            },
          ],
        },
        {
          children: [
            {
              text: "4: High",
            },
          ],
        },
        {
          children: [
            {
              text: "5: Very high",
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
              text: "\nThe survey results will be used on a cumulative basis to gather insights and improve overall efficiency and effectiveness. Rest assured that your responses are confidential, and your individual answers will not be disclosed. Your feedback is valuable, and we appreciate your honest input.",
            },
          ],
        },
      ],
      language: "en",
    },
    {
      content: [
        {
          children: [
            {
              text: "Veuillez\névaluer votre expérience/opinion/feedback sur une échelle de 1 à 5. Utilisez\nl'échelle comme suit:",
            },
          ],
        },
        {
          children: [
            {
              text: "1 : Très bas",
            },
          ],
        },
        {
          children: [
            {
              text: "2 : Bas",
            },
          ],
        },
        {
          children: [
            {
              text: "3 : Neutre",
            },
          ],
        },
        {
          children: [
            {
              text: "4 : Élevé",
            },
          ],
        },
        {
          children: [
            {
              text: "5 : Très élevé",
            },
          ],
        },
        {
          children: [
            {
              text: "\n\nLes résultats de l'enquête seront utilisés de\nmanière cumulative pour recueillir des informations et améliorer l'efficacité\ngénérale. Soyez assuré(e) que vos réponses sont confidentielles, et vos\nréponses individuelles ne seront pas divulguées. Votre feedback est précieux,\net nous apprécions votre contribution honnête.",
            },
          ],
        },
      ],
      language: "fr",
    },
    {
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
    },
  ],
};

const questions = [
  {
    title: "How satisfied are you with Printemps Doha as a place to work?",
    subTitle: "",
    items: [
      {
        title:
          "À quel point êtes-vous satisfait(e) de travailler chez Printemps Doha ?",
        subTitle: "",
        type: "text",
        language: "fr",
      },
      {
        title: "ما مدى رضاك عن برينتا الدوحة كمكان للعمل؟",
        subTitle: "",
        type: "text",
        language: "ar",
      },
    ],
  },
  {
    title: "I know what is expected of me at work.",
    subTitle: "",
    items: [
      {
        title: "Je sais ce qui est attendu de moi au travail.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "أعرف ما هو متوقع مني في العمل.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "At work, people are held accountable for their decisions.",
    subTitle: "",
    items: [
      {
        title: "Au travail, les gens sont responsables de leurs décisions.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "في العمل ، يتحمل الناس المسؤولية عن قراراتهم.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "I have the materials and equipment I need to do my work right.",
    subTitle: "",
    items: [
      {
        title:
          "J'ai les matériaux et l'équipement nécessaires pour faire correctement mon travail.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "لدي المواد والمعدات التي أحتاجها للقيام بعملي بشكل صحيح.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "There is good collaboration and teamwork in my department.",
    subTitle: "",
    items: [
      {
        title:
          "Il y a une bonne collaboration et un bon travail d'équipe dans mon service.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "هناك تعاون جيد وعمل جماعي في قسمي.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "I regularly receive recognition or praise for doing good work.",
    subTitle: "",
    items: [
      {
        title:
          "Je reçois régulièrement des reconnaissances ou des éloges pour un bon travail.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "أتلقى بانتظام التقدير أو الثناء على القيام بعمل جيد.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "My supervisor, or someone at work, seems to care about me as a person.",
    subTitle: "",
    items: [
      {
        title:
          "Mon superviseur, ou quelqu'un au travail, semble se soucier de moi en tant que personne.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "يبدو أن مشرفي ، أو أي شخص في العمل ، يهتم بي كشخص.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "There is someone at work who encourages my development.",
    subTitle: "",
    items: [
      {
        title: "Il y a quelqu'un au travail qui encourage mon développement.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "هناك شخص ما في العمل يشجع تطوري.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "At work, my opinions seem to count.",
    subTitle: "",
    items: [
      {
        title: "Au travail, mes opinions semblent compter.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "في العمل ، يبدو أن آرائي مهمة.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "I feel encouraged to come up with new and better ways of doing things.",
    subTitle: "",
    items: [
      {
        title:
          "On m'encourage à trouver de nouvelles et meilleures façons de faire les choses.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "أشعر بالتشجيع للتوصل إلى طرق جديدة وأفضل للقيام بعملي.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title:
      "The mission or purpose of my organization makes me feel my job is important.",
    subTitle: "",
    items: [
      {
        title:
          "La mission ou le but de mon organisation me fait sentir que mon travail est important.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "روؤية ورسالة برنتا الدوحة تجعلني أشعر أن وظيفتي مهمة.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title:
      "The leadership of Printemps Doha communicates effectively with the rest of the organization.",
    subTitle: "",
    items: [
      {
        title:
          "La direction de Printemps Doha communique efficacement avec le reste de l'organisation.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "تتواصل قيادة برنتا الدوحة بشكل فعال مع جميع العاملين.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "My associates or fellow employees are committed to doing quality work.",
    subTitle: "",
    items: [
      {
        title:
          "Mes collègues ou mes employés sont engagés à faire un travail de qualité.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "يلتزم زملائي الموظفون بالقيام بعمل جيد.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title:
      "In the last six months, someone at work has talked to me about my progress.",
    subTitle: "",
    items: [
      {
        title:
          "Au cours des six derniers mois, quelqu'un au travail m'a parlé de mes progrès.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "في الأشهر الستة الماضية ، تحدث معي شخص ما في العمل عن تقدمي.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "This last year, I have had opportunities at work to learn and grow.",
    subTitle: "",
    items: [
      {
        title:
          "Au cours de la dernière année, j'ai eu des opportunités au travail pour apprendre et évoluer.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "في العام الماضي ، أتيحت لي فرص في العمل للتعلم والتطور.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "Printemps Doha cares about my overall wellbeing.",
    subTitle: "",
    items: [
      {
        title: "Printemps Doha se soucie de mon bien-être général.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "تهتم برينتا الدوحة برفاهيتي بشكل عام.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "Systems and procedures in Printemps Doha help me to do my job better.",
    subTitle: "",
    items: [
      {
        title:
          "Les systèmes et procédures chez Printemps Doha m'aident à faire mieux mon travail.",
        subTitle: "",
        language: "fr",
      },
      {
        title:
          "تساعدني الأنظمة والإجراءات في برينتا الدوحة على القيام بعملي بشكل أفضل.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "I trust the leadership of Printemps Doha.",
    subTitle: "",
    items: [
      {
        title: "J'ai confiance dans la direction de Printemps Doha.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "أنا أثق في قيادة برينتا الدوحة.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title: "I would recommend Printemps Doha as a great place to work.",
    subTitle: "",
    items: [
      {
        title:
          "Je recommanderais Printemps Doha comme un excellent endroit pour travailler.",
        subTitle: "",
        language: "fr",
      },
      {
        title: "أود أن أوصي برينتا الدوحة كمكان رائع للعمل.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
  {
    title:
      "I am confident that the issues raised in this survey will be acted upon.",
    subTitle: "",
    items: [
      {
        title:
          "Je suis convaincu(e) que les problèmes soulevés dans cette enquête seront pris en compte.",
        subTitle: "",
        language: "fr",
      },
      {
        title:
          "أنا واثق من أن المسائل التي أثيرت في هذه الدراسة الاستقصائية ستتخذ إجراءات بشأنها.",
        subTitle: "",
        language: "ar",
      },
    ],
  },
];
