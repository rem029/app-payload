import path from "path";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { Config, buildConfig } from "payload/config";

import Users from "./collections/users";

import Media from "./collections/media";

import { CollectionConfig } from "payload/types";
import { MAX_FILE_SIZE, WEB_TYPE } from "./constant";
import UserRoles from "./collections/users/roles";

import UserAccess from "./collections/users/access";
import Logo, { LogoSM } from "./components/common/logo";

import Variables from "./collections/variables";
import { HealthCheckStatus } from "./components/health-check-status";
import { CustomLinks } from "./components/custom-links";
import HealthCheck from "./collections/health-check";
import { healthEndpoint } from "./routes/health";
import { healthStatusEndPoint } from "./routes/health-status";
import { aiEndpoint } from "./routes/ai";

import "../tailwind.css";
import { emailSenderEndpoint } from "./routes/email";
import Items from "./collections/items";

const collection_default = [
  Users,
  UserRoles,
  UserAccess,
  Media,
  Variables,
  HealthCheck,
  Items,
];

export const collections: Record<string, CollectionConfig[]> = {
  default: [...collection_default],
};

const mockModulePath = path.resolve(__dirname, "mocks/modules.js");
const fullFilePath = path.resolve(__dirname, "collections/hooks");

export const config: Config = {
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    css: path.resolve(__dirname, "./css/compiledTailwind.css"),
    webpack: (config) => {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve.alias,
            [fullFilePath]: mockModulePath,
          },
          fallback: {
            ...config.resolve.fallback,
          },
        },
        module: {
          ...config.module,
          rules: [
            ...config.module.rules,
            {
              test: /\tailwind.css$/i,
              use: ["css-loader", "postcss-loader"],
            },
          ],
        },
      };
    },
    components: {
      graphics: { Icon: LogoSM, Logo: Logo },
      views: {
        CustomHealthCheck: {
          Component: HealthCheckStatus,
          path: "/health-check",
        },
      },
      afterNavLinks: [CustomLinks],
    },
    meta: {
      favicon: "/payload/media/favicon.ico",
      titleSuffix: " - Rem Apps",
    },
  },
  endpoints: [healthEndpoint, healthStatusEndPoint, aiEndpoint, emailSenderEndpoint],
  serverURL: process.env.PAYLOAD_PUBLIC_BACKEND_URL || "http://localhost:3005",
  routes: {
    admin: "/payload/admin",
    api: "/payload/api",
    graphQL: "/payload/graphql",
    graphQLPlayground: "/payload/graphql-playground",
  },
  localization: {
    locales: [
      {
        label: "English",
        code: "en",
      },
      {
        label: "Arabic",
        code: "ar",
        rtl: true,
      },
      {
        label: "French",
        code: "fr",
      },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  debug: process.env.NODE_ENV !== "production",
  editor: slateEditor({}),
  collections: collections[WEB_TYPE],
  upload: {
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  },
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
};

export default buildConfig(config);
