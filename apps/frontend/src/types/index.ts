export type themes = "dohaoasis" | "printemps" | "dohaquest";

export interface NetPromoterFeedback {
  visit_date: string; // 'datetimeoffset' translates to a string in ISO format in TypeScript
  receipt_id: string;
  customer_feedback?: string;
  customer_feedback_number?: number;
  customer_comments: string;
  transaction_type: string;
}

export const CustomerRatingOptions: Record<string, number> = {
  Poor: 1,
  Average: 2,
  Good: 3,
  "Very Good": 4,
  Excellent: 5,
};

export const EmployeeRatingOptions: Record<string, number> = {
  "Strongly disagree": 1,
  Disagree: 2,
  "I do not know": 3,
  Agree: 4,
  "Strongly agree": 5,
};

export interface SurveyCustomerFeedback {
  visit_date: string; // 'datetimeoffset' translates to a string in ISO format in TypeScript
  visited_restaurant?: string;
  meal_period?: string;
  visit_frequency?: string;
  rating_greeting?: string; // Optional because not marked as NOT NULL
  rating_service?: string;
  rating_beverage?: string;
  rating_food?: string;
  rating_value_for_money?: string;
  rating_cleanliness?: string;
  discovery_method?: string;
  discovery_text?: string;
  will_visit_again?: string;
  manager_visit?: string;
  favorite_restaurant?: string;
  additional_comments?: string; // 'text' translates to string, optional if it can be null
  name?: string;
  telephone_number?: string;
  birth_date?: string; // 'date' translates to a string in ISO format
  email_address?: string;
  marketing_consent?: boolean;
}

export interface CustomerInfo {
  date: string;
  customerName: string;
}

export interface ContentHeader {
  id: string;
  content: string;
  language: string;
}

export interface ContentInfo {
  id: string;
  content: any[];
  language: string;
}

export interface EmployeeQuestion {
  id: string;
  default_title: string;
  default_subtitle: string;
  item: EmployeeQuestionItem[];
  createdAt: Date;
  updatedAt: Date;
}
export interface EmployeeQuestionItem {
  id: string;
  type: string;
  language: string;
  title: string;
  subtitle?: string;
}

export interface EmployeeResponse {
  anonymousId?: number;
  department: string;
  department_sub: string;
  questions: { question: string; response: string }[];
  employee_comments: string;
}

export interface EmployeeBenefitsTab {
  id: number;
  name: string;
}

export interface Departments {
  id: string;
  name: string;
  department_subs: { id: string; name: string }[];
}

export interface Media {
  id: number;
  alt?: string;
  updatedAt: Date;
  createdAt: Date;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
}

export interface BenefitContent {
  id: string;
  name: string;
  benefits: {
    id: string;
    description?: string;
    title: string;
    printemps: string;
    dohaoasis: string;
    banyantree: string;
  }[];
  contact_info: {
    address: string;
    email: string;
    phone: string;
    point_of_contact: string;
  };
  general_info: {
    category: { createdAt: Date; id: number; name: string; updatedAt: Date };
    media?: Media;
  };
  terms_and_condition: any[];
  createdAt: Date;
  updatedAt: Date;
  expiry_date: Date;
  external_link: string;
  attachments?: {
    id: string;
    media: Media;
  }[];
  _status: string;
}

export interface EmployeeBanner {
  id: number;
  name: string;
  media: number | Media;
  updatedAt: string;
  createdAt: string;
  link?: string;
  _status?: ("draft" | "published") | null;
}

export interface OpenAIResponse {
  response: {
    options: {
      method: string;
      path: string;
      query: any;
      headers: {
        "OpenAI-Beta": string;
      };
    };
    response: {
      size: 0;
      timeout: 0;
    };
    body: {
      object: string;
      data: {
        id: string;
        object: string;
        created_at: number;
        assistant_id: string;
        thread_id: string;
        run_id: string;
        role: string;
        content: [
          {
            type: string;
            text: {
              value: string;
              annotations: any[];
            };
          },
        ];
        file_ids: [];
        metadata: {};
      }[];
      first_id: string;
      last_id: string;
      has_more: boolean;
    };
    data: OpenAIResponseData[];
  };
}

export interface OpenAIResponseData {
  id: string;
  object: string;
  created_at: number;
  assistant_id?: string | null;
  thread_id: string;
  run_id?: string | null;
  role: string;
  content: [
    {
      type: string;
      text: {
        value: string;
        annotations?: [
          {
            type: string;
            text: string;
            start_index: number;
            end_index: number;
            file_citation: {
              file_id: string;
              quote: string;
            };
          },
        ];
      };
    },
  ];
  file_ids: [];
  metadata: {};
}

export interface Item {
  id: number;
  name: string;
  description?: string | null;
  items?:
    | {
        values?:
          | {
              key: string;
              value?: string | null;
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}

export interface IflyWaiverFormDependent {
  id?: string;
  name: string;
  qid: string;
  phone?: string | null;
}

export interface IflyWaiverForm {
  id?: number;
  name: string;
  qid: string;
  phone: string;
  dependents?: IflyWaiverFormDependent[];
  signature_svg: string;
  updatedAt?: string;
  createdAt?: string;
}
