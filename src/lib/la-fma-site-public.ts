/**
 * Types, constantes et valeurs par défaut « La FMA » utilisables depuis des Client Components.
 * Ne pas importer `next/cache` ni `prisma` ici — voir `site-content.ts`.
 */

export type LocalizedString = { fr: string; en: string; ar: string };

export interface LaFmaStat {
  value: string;
  label: LocalizedString;
}

export interface LaFmaMission {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface LaFmaOrgBloc {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface LaFmaValeur {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface LaFmaContent {
  heroBadge: LocalizedString;
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  presentationTitle: LocalizedString;
  presentationP1: LocalizedString;
  presentationP2: LocalizedString;
  stats: LaFmaStat[];
  missionsSectionTitle: LocalizedString;
  missions: LaFmaMission[];
  valeursSectionTitle: LocalizedString;
  valeursDescription: LocalizedString;
  valeurs: LaFmaValeur[];
  organisationSectionTitle: LocalizedString;
  organisationDescription: LocalizedString;
  orgBlocs: LaFmaOrgBloc[];
  directionSectionTitle: LocalizedString;
  membersSectionTitle: LocalizedString;
}

export const LA_FMA_STATS_MIN = 1;
export const LA_FMA_STATS_MAX = 8;
export const LA_FMA_MISSIONS_MAX = 24;
export const LA_FMA_VALEURS_MAX = 12;

export function createEmptyLaFmaStat(): LaFmaStat {
  return {
    value: "",
    label: { fr: "", en: "", ar: "" },
  };
}

export function createEmptyLaFmaMission(): LaFmaMission {
  return {
    icon: "📌",
    title: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "", ar: "" },
  };
}

export function createEmptyLaFmaValeur(): LaFmaValeur {
  return {
    icon: "⭐",
    title: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "", ar: "" },
  };
}

export function createEmptyLaFmaOrgBloc(): LaFmaOrgBloc {
  return {
    icon: "📌",
    title: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "", ar: "" },
  };
}

export const DEFAULT_LA_FMA_CONTENT: LaFmaContent = {
  heroBadge: { fr: "La FMA", en: "The FMA", ar: "الاتحاد" },
  heroTitle: {
    fr: "Fédération Marocaine de l'Assurance",
    en: "Moroccan Insurance Federation",
    ar: "الاتحاد المغربي للتأمين",
  },
  heroSubtitle: {
    fr: "L'organe représentatif des sociétés d'assurance et de réassurance au Maroc depuis 1958",
    en: "The representative body of insurance and reinsurance companies in Morocco since 1958",
    ar: "الهيئة التمثيلية لشركات التأمين وإعادة التأمين في المغرب منذ 1958",
  },
  presentationTitle: { fr: "Présentation", en: "About FMA", ar: "تقديم الاتحاد" },
  presentationP1: {
    fr: "Fondée en 1958, la Fédération Marocaine de l'Assurance (FMA) regroupe l'ensemble des sociétés d'assurances et de réassurance opérant au Maroc.",
    en: "Founded in 1958, the Moroccan Insurance Federation (FMA) brings together all insurance and reinsurance companies operating in Morocco.",
    ar: "أُسِّس الاتحاد المغربي للتأمين عام 1958، ويضم مجموع شركات التأمين وإعادة التأمين العاملة في المغرب.",
  },
  presentationP2: {
    fr: "La FMA œuvre au développement et à la modernisation du secteur et contribue à l'élaboration du cadre réglementaire régissant l'activité de l'assurance au Maroc.",
    en: "The FMA works to develop and modernize the sector and contributes to establishing the regulatory framework governing insurance activity in Morocco.",
    ar: "يعمل الاتحاد على تطوير القطاع وتحديثه، ويساهم في وضع الإطار التنظيمي الذي يحكم نشاط التأمين في المغرب.",
  },
  stats: [
    { value: "1958", label: { fr: "Année de fondation", en: "Year founded", ar: "سنة التأسيس" } },
    { value: "25+", label: { fr: "Sociétés membres", en: "Member companies", ar: "شركة عضو" } },
    { value: "47 Mds", label: { fr: "MAD de CA", en: "MAD revenue", ar: "درهم" } },
    { value: "3%", label: { fr: "du PIB national", en: "of national GDP", ar: "من الناتج الداخلي" } },
  ],
  missionsSectionTitle: { fr: "Nos Missions", en: "Our Missions", ar: "مهامنا" },
  missions: [
    {
      icon: "🏛️",
      title: { fr: "Représentation & Défense", en: "Representation & Advocacy", ar: "التمثيل والدفاع" },
      description: {
        fr: "La FMA représente et défend les intérêts collectifs du secteur auprès des pouvoirs publics et des institutions nationales et internationales.",
        en: "The FMA represents and defends the collective interests of the insurance sector before public authorities and national and international institutions.",
        ar: "يمثل الاتحاد ويدافع عن المصالح الجماعية لقطاع التأمين أمام السلطات العامة والمؤسسات الوطنية والدولية.",
      },
    },
    {
      icon: "📊",
      title: { fr: "Études & Statistiques", en: "Studies & Statistics", ar: "الدراسات والإحصاء" },
      description: {
        fr: "Production et diffusion des statistiques du marché marocain de l'assurance, réalisation d'études sectorielles.",
        en: "Production and dissemination of Moroccan insurance market statistics, conducting sector studies.",
        ar: "إنتاج ونشر إحصاءات سوق التأمين المغربي، وإجراء الدراسات القطاعية.",
      },
    },
    {
      icon: "🤝",
      title: { fr: "Relations Sociales", en: "Social Relations", ar: "العلاقات الاجتماعية" },
      description: {
        fr: "Gestion du dialogue social et des conventions collectives du secteur de l'assurance.",
        en: "Managing social dialogue and collective agreements in the insurance sector.",
        ar: "إدارة الحوار الاجتماعي والاتفاقيات الجماعية في قطاع التأمين.",
      },
    },
    {
      icon: "🎓",
      title: { fr: "Formation", en: "Training", ar: "التكوين" },
      description: {
        fr: "Organisation de formations professionnelles et soutien au développement des compétences.",
        en: "Organizing professional training and supporting skills development.",
        ar: "تنظيم التدريبات المهنية ودعم تطوير المهارات.",
      },
    },
    {
      icon: "🌐",
      title: { fr: "Relations Internationales", en: "International Relations", ar: "العلاقات الدولية" },
      description: {
        fr: "Développement des relations avec les fédérations d'assurance étrangères et les organismes internationaux.",
        en: "Developing relations with foreign insurance federations and international bodies.",
        ar: "تطوير العلاقات مع اتحادات التأمين الأجنبية والهيئات الدولية.",
      },
    },
    {
      icon: "📢",
      title: { fr: "Communication", en: "Communication", ar: "التواصل" },
      description: {
        fr: "Information du grand public et promotion de la culture assurantielle au Maroc.",
        en: "Informing the public and promoting insurance culture in Morocco.",
        ar: "إعلام عامة الجمهور وتعزيز ثقافة التأمين في المغرب.",
      },
    },
  ],
  valeursSectionTitle: { fr: "Nos Valeurs", en: "Our Values", ar: "قيمنا" },
  valeursDescription: {
    fr: "Les principes qui guident l'action de la Fédération Marocaine de l'Assurance au quotidien.",
    en: "The principles that guide the daily action of the Moroccan Insurance Federation.",
    ar: "المبادئ التي توجه عمل الاتحاد المغربي للتأمين يوميًا.",
  },
  valeurs: [
    {
      icon: "🤝",
      title: { fr: "Solidarité", en: "Solidarity", ar: "التضامن" },
      description: {
        fr: "Nous œuvrons collectivement pour renforcer la cohésion du secteur et défendre les intérêts communs de nos membres.",
        en: "We work collectively to strengthen sector cohesion and defend the common interests of our members.",
        ar: "نعمل بشكل جماعي لتعزيز تماسك القطاع والدفاع عن المصالح المشتركة لأعضائنا.",
      },
    },
    {
      icon: "🏆",
      title: { fr: "Excellence", en: "Excellence", ar: "التميز" },
      description: {
        fr: "Nous visons les plus hauts standards de qualité dans toutes nos activités, publications et services aux membres.",
        en: "We aim for the highest quality standards in all our activities, publications and services to members.",
        ar: "نسعى إلى أعلى معايير الجودة في جميع أنشطتنا ومنشوراتنا وخدماتنا للأعضاء.",
      },
    },
    {
      icon: "💡",
      title: { fr: "Innovation", en: "Innovation", ar: "الابتكار" },
      description: {
        fr: "Nous accompagnons la transformation digitale et réglementaire du secteur de l'assurance au Maroc.",
        en: "We support the digital and regulatory transformation of the insurance sector in Morocco.",
        ar: "نواكب التحول الرقمي والتنظيمي لقطاع التأمين في المغرب.",
      },
    },
    {
      icon: "🔍",
      title: { fr: "Transparence", en: "Transparency", ar: "الشفافية" },
      description: {
        fr: "Nous produisons et diffusons des données fiables sur le marché marocain de l'assurance pour informer les décideurs.",
        en: "We produce and disseminate reliable data on the Moroccan insurance market to inform decision-makers.",
        ar: "ننتج ونشر بيانات موثوقة حول سوق التأمين المغربي لإرشاد صانعي القرار.",
      },
    },
  ],
  organisationSectionTitle: { fr: "Organisation", en: "Organisation", ar: "الهيكل التنظيمي" },
  organisationDescription: {
    fr: "La FMA est structurée autour d'instances décisionnelles et de comités spécialisés qui assurent la gouvernance et le pilotage stratégique du secteur de l'assurance.",
    en: "The FMA is structured around decision-making bodies and specialized committees that ensure governance and strategic management of the insurance sector.",
    ar: "يتمحور هيكل الاتحاد حول هيئات قرارية ولجان متخصصة تضمن الحوكمة والتوجيه الاستراتيجي لقطاع التأمين.",
  },
  orgBlocs: [
    {
      icon: "🏛️",
      title: { fr: "Assemblée Générale", en: "General Assembly", ar: "الجمعية العامة" },
      description: {
        fr: "Instance suprême de la FMA. Elle regroupe l'ensemble des sociétés membres et se réunit au moins une fois par an pour approuver les orientations stratégiques.",
        en: "The supreme body of the FMA. It brings together all member companies and meets at least once a year to approve strategic orientations.",
        ar: "الهيئة العليا للاتحاد. تضم جميع الشركات الأعضاء وتجتمع مرة واحدة على الأقل سنوياً للمصادقة على التوجهات الاستراتيجية.",
      },
    },
    {
      icon: "👥",
      title: { fr: "Conseil d'Administration", en: "Board of Directors", ar: "مجلس الإدارة" },
      description: {
        fr: "Organe de gouvernance élu par l'Assemblée Générale. Il fixe les orientations de la fédération, supervise les activités et veille à l'application des décisions.",
        en: "Governance body elected by the General Assembly. It sets the federation's orientations, supervises activities and ensures decisions are implemented.",
        ar: "هيئة حوكمة منتخبة من الجمعية العامة. تحدد توجهات الاتحاد وتشرف على الأنشطة وتسهر على تطبيق القرارات.",
      },
    },
    {
      icon: "📋",
      title: { fr: "Bureau Directeur", en: "Executive Bureau", ar: "المكتب التنفيذي" },
      description: {
        fr: "Émanation du Conseil d'Administration, le Bureau Directeur prend en charge la gestion courante et assure le suivi des dossiers entre les sessions du Conseil.",
        en: "An emanation of the Board of Directors, the Executive Bureau handles day-to-day management and monitors files between Board sessions.",
        ar: "امتداد لمجلس الإدارة، يتولى المكتب التنفيذي الإدارة اليومية ومتابعة الملفات بين دورات المجلس.",
      },
    },
    {
      icon: "⚙️",
      title: { fr: "Comités Techniques", en: "Technical Committees", ar: "اللجان التقنية" },
      description: {
        fr: "Plusieurs comités spécialisés (techniques, juridiques, communication…) travaillent en concertation avec les membres pour faire avancer les dossiers sectoriels.",
        en: "Several specialized committees (technical, legal, communication…) work in consultation with members to advance sector-wide issues.",
        ar: "تعمل لجان متخصصة متعددة (تقنية وقانونية وتواصل...) بالتشاور مع الأعضاء لتطوير الملفات القطاعية.",
      },
    },
  ],
  directionSectionTitle: { fr: "Direction Générale", en: "General Management", ar: "الإدارة العامة" },
  membersSectionTitle: { fr: "Nos Membres", en: "Our Members", ar: "أعضاؤنا" },
};
