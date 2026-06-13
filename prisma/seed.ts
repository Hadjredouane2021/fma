import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding FMA database...");

  // ── Admin user ──
  const hashedPwd = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@FMA2026!", 12);
  await prisma.user.upsert({
    where: { email: "admin@fma.org.ma" },
    update: {},
    create: { email: "admin@fma.org.ma", password: hashedPwd, name: "Administrateur FMA", role: "ADMIN" },
  });
  console.log("✅ Admin user created");

  // ── Categories ──
  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: "actualites-secteur" }, update: {}, create: { slug: "actualites-secteur", nameFr: "Actualités secteur", nameEn: "Sector News", nameAr: "أخبار القطاع", color: "#941F49", order: 1 } }),
    prisma.category.upsert({ where: { slug: "reglementation" }, update: {}, create: { slug: "reglementation", nameFr: "Réglementation", nameEn: "Regulation", nameAr: "التنظيم", color: "#B39988", order: 2 } }),
    prisma.category.upsert({ where: { slug: "evenements" }, update: {}, create: { slug: "evenements", nameFr: "Événements", nameEn: "Events", nameAr: "الأحداث", color: "#3A7BAB", order: 3 } }),
    prisma.category.upsert({ where: { slug: "statistiques" }, update: {}, create: { slug: "statistiques", nameFr: "Statistiques", nameEn: "Statistics", nameAr: "الإحصاء", color: "#7C3AED", order: 4 } }),
  ]);
  console.log("✅ Categories created");

  // ── Posts ──
  const postsData = [
    {
      slug: "resultats-marche-assurance-2024",
      titleFr: "Résultats du marché marocain de l'assurance en 2024",
      titleEn: "Results of the Moroccan insurance market in 2024",
      titleAr: "نتائج سوق التأمين المغربي في عام 2024",
      excerptFr: "Le marché marocain de l'assurance a enregistré un chiffre d'affaires de 47 milliards de dirhams en 2024, soit une croissance de 5,8% par rapport à 2023.",
      excerptEn: "The Moroccan insurance market recorded a turnover of 47 billion dirhams in 2024, a growth of 5.8% compared to 2023.",
      excerptAr: "سجل سوق التأمين المغربي رقم أعمال بلغ 47 مليار درهم في عام 2024، بنمو 5.8% مقارنة بعام 2023.",
      contentFr: "<p>Le marché marocain de l'assurance confirme sa résilience et sa dynamique de croissance. En 2024, le chiffre d'affaires global s'est établi à 47 milliards de dirhams, enregistrant une progression de 5,8% comparativement à l'exercice 2023.</p><h2>Principales tendances</h2><p>La branche vie continue sa progression soutenue, portée notamment par les produits d'épargne et de retraite. La branche non-vie maintient son positionnement solide, avec l'assurance automobile qui représente la part la plus importante du marché.</p><h2>Perspectives</h2><p>La FMA anticipe une poursuite de cette dynamique positive, soutenue par les réformes réglementaires et le développement de nouveaux produits innovants adaptés aux besoins des Marocains.</p>",
      contentEn: "<p>The Moroccan insurance market confirms its resilience and growth dynamic. In 2024, the overall turnover stood at 47 billion dirhams, recording a 5.8% increase compared to 2023.</p>",
      contentAr: "<p>يؤكد سوق التأمين المغربي مرونته وديناميكيته في النمو. في عام 2024، بلغ رقم الأعمال الإجمالي 47 مليار درهم، مسجلاً نمواً بنسبة 5.8% مقارنة بعام 2023.</p>",
      status: "PUBLISHED" as const,
      featured: true,
      publishedAt: new Date("2024-12-15"),
      categoryId: cats[3].id,
    },
    {
      slug: "conference-annuelle-fma-2024",
      titleFr: "Conférence annuelle de la FMA 2024 : Vers une assurance inclusive",
      titleEn: "FMA Annual Conference 2024: Towards Inclusive Insurance",
      titleAr: "المؤتمر السنوي للاتحاد 2024: نحو تأمين شامل",
      excerptFr: "La FMA a organisé sa conférence annuelle sous le thème : 'L'assurance inclusive, levier de développement économique et social'.",
      excerptEn: "The FMA organized its annual conference under the theme: 'Inclusive insurance, a lever for economic and social development'.",
      excerptAr: "نظّم الاتحاد مؤتمره السنوي تحت شعار: 'التأمين الشامل، رافعة للتنمية الاقتصادية والاجتماعية'.",
      contentFr: "<p>La Fédération Marocaine de l'Assurance a tenu sa conférence annuelle à Casablanca, rassemblant plus de 500 professionnels du secteur, des régulateurs et des partenaires internationaux.</p><h2>Thématiques abordées</h2><p>Les participants ont débattu de l'extension de la couverture assurantielle, de la digitalisation des services et des nouvelles tendances en matière de gestion des risques climatiques.</p>",
      contentEn: "<p>The Moroccan Insurance Federation held its annual conference in Casablanca, bringing together more than 500 sector professionals, regulators and international partners.</p>",
      contentAr: "<p>عقد الاتحاد المغربي للتأمين مؤتمره السنوي في الدار البيضاء، بمشاركة أكثر من 500 متخصص في القطاع ومنظمين وشركاء دوليين.</p>",
      status: "PUBLISHED" as const,
      featured: false,
      publishedAt: new Date("2024-11-20"),
      categoryId: cats[2].id,
    },
    {
      slug: "reforme-code-assurances-maroc",
      titleFr: "Réforme du Code des Assurances : Les principaux changements",
      titleEn: "Insurance Code Reform: Key Changes",
      titleAr: "إصلاح مدونة التأمينات: أبرز التغييرات",
      excerptFr: "Le gouvernement marocain a engagé une réforme importante du Code des Assurances, visant à moderniser le cadre juridique du secteur.",
      excerptEn: "The Moroccan government has undertaken a major reform of the Insurance Code, aimed at modernizing the legal framework of the sector.",
      excerptAr: "شرعت الحكومة المغربية في إصلاح هام لمدونة التأمينات، بهدف تحديث الإطار القانوني للقطاع.",
      contentFr: "<p>La réforme du Code des Assurances représente une étape majeure dans la modernisation du secteur de l'assurance au Maroc. Cette réforme vise à aligner le cadre réglementaire marocain avec les meilleures pratiques internationales.</p><h2>Principaux axes de la réforme</h2><ul><li>Renforcement de la protection des assurés</li><li>Amélioration de la solvabilité des compagnies</li><li>Digitalisation des processus</li><li>Extension de la couverture obligatoire</li></ul>",
      contentEn: "<p>The reform of the Insurance Code represents a major step in the modernization of the insurance sector in Morocco.</p>",
      contentAr: "<p>يمثل إصلاح مدونة التأمينات خطوة رئيسية في تحديث قطاع التأمين في المغرب.</p>",
      status: "PUBLISHED" as const,
      featured: false,
      publishedAt: new Date("2024-10-08"),
      categoryId: cats[1].id,
    },
  ];

  for (const post of postsData) {
    await prisma.post.upsert({ where: { slug: post.slug }, update: {}, create: post });
  }
  console.log("✅ Posts created");

  // ── Publications ──
  const publicationsData = [
    {
      slug: "chiffres-cles-assurance-maroc-2024",
      type: "chiffres-cles",
      titleFr: "Chiffres Clés du Secteur 2024",
      titleEn: "Key Figures 2024",
      titleAr: "الأرقام الرئيسية 2024",
      descriptionFr: "Rapport annuel des statistiques du marché marocain de l'assurance pour l'exercice 2024.",
      descriptionEn: "Annual report of Moroccan insurance market statistics for 2024.",
      descriptionAr: "التقرير السنوي لإحصاءات سوق التأمين المغربي لعام 2024.",
      year: 2024,
      status: "PUBLISHED" as const,
      featured: true,
      publishedAt: new Date("2024-12-01"),
    },
    {
      slug: "faits-marquants-2024",
      type: "faits-marquants",
      titleFr: "Faits Marquants 2024",
      titleEn: "Highlights 2024",
      titleAr: "أبرز أحداث 2024",
      descriptionFr: "Les événements et réalisations majeurs du secteur de l'assurance marocain en 2024.",
      descriptionEn: "Major events and achievements of the Moroccan insurance sector in 2024.",
      descriptionAr: "الأحداث والإنجازات الرئيسية لقطاع التأمين المغربي في عام 2024.",
      year: 2024,
      status: "PUBLISHED" as const,
      featured: false,
      publishedAt: new Date("2024-11-01"),
    },
    {
      slug: "courrier-assurance-n45-2024",
      type: "courrier",
      titleFr: "Le Courrier de l'Assurance N°45 - 2024",
      titleEn: "Insurance Newsletter N°45 - 2024",
      titleAr: "نشرة التأمين رقم 45 - 2024",
      descriptionFr: "Revue trimestrielle de la FMA : actualités, analyses et perspectives du secteur de l'assurance.",
      descriptionEn: "FMA quarterly review: news, analysis and insurance sector outlook.",
      descriptionAr: "المراجعة الفصلية للاتحاد: الأخبار والتحليلات وآفاق قطاع التأمين.",
      year: 2024,
      status: "PUBLISHED" as const,
      featured: false,
      publishedAt: new Date("2024-10-01"),
    },
    {
      slug: "chiffres-cles-assurance-maroc-2023",
      type: "chiffres-cles",
      titleFr: "Chiffres Clés du Secteur 2023",
      titleEn: "Key Figures 2023",
      titleAr: "الأرقام الرئيسية 2023",
      descriptionFr: "Rapport annuel des statistiques du marché marocain de l'assurance pour l'exercice 2023.",
      year: 2023,
      status: "PUBLISHED" as const,
      featured: false,
      publishedAt: new Date("2023-12-01"),
    },
  ];

  for (const pub of publicationsData) {
    await prisma.publication.upsert({ where: { slug: pub.slug }, update: {}, create: pub });
  }
  console.log("✅ Publications created");

  // ── Members ──
  const membersData = [
    { nameFr: "Wafa Assurance", website: "https://www.wafaassurance.ma", category: "assureurs", order: 1 },
    { nameFr: "SAHAM Assurance", website: "https://www.sahamassurance.ma", category: "assureurs", order: 2 },
    { nameFr: "AXA Assurance Maroc", website: "https://www.axa.ma", category: "assureurs", order: 3 },
    { nameFr: "RMA Watanya", website: "https://www.rma.ma", category: "assureurs", order: 4 },
    { nameFr: "MAMDA - MCMA", website: "https://www.mamda-mcma.ma", category: "assureurs", order: 5 },
    { nameFr: "Atlanta Assurance", website: "https://www.atlanta.ma", category: "assureurs", order: 6 },
    { nameFr: "CNIA Saada", website: "https://www.cniasaada.ma", category: "assureurs", order: 7 },
    { nameFr: "Allianz Maroc", website: "https://www.allianz.ma", category: "assureurs", order: 8 },
    { nameFr: "Zurich Assurance Maroc", website: "https://www.zurich.ma", category: "assureurs", order: 9 },
    { nameFr: "CAT (Compagnie Africaine des Travaux)", website: "#", category: "assureurs", order: 10 },
    { nameFr: "SCR - Société Centrale de Réassurance", website: "https://www.scr.ma", category: "reassureurs", order: 1 },
  ];

  for (const member of membersData) {
    const existing = await prisma.member.findFirst({ where: { nameFr: member.nameFr } });
    if (!existing) await prisma.member.create({ data: { ...member, active: true } });
  }
  console.log("✅ Members created");

  // ── Team ──
  const teamData = [
    { nameFr: "Hassan Boubrik", nameEn: "Hassan Boubrik", nameAr: "حسن بوبريك", titleFr: "Directeur Général", titleEn: "General Director", titleAr: "المدير العام", department: "direction", order: 1 },
    { nameFr: "Directeur Technique", nameEn: "Technical Director", nameAr: "المدير التقني", titleFr: "Directeur Technique", department: "direction", order: 2 },
    { nameFr: "Directeur Financier", nameEn: "Financial Director", nameAr: "المدير المالي", titleFr: "Directeur Financier", department: "direction", order: 3 },
  ];

  for (const member of teamData) {
    const existing = await prisma.teamMember.findFirst({ where: { nameFr: member.nameFr } });
    if (!existing) await prisma.teamMember.create({ data: { ...member, active: true } });
  }
  console.log("✅ Team created");

  // ── Glossary terms ──
  const glossaryData = [
    { termFr: "Assuré", termEn: "Insured", termAr: "المؤمَّن عليه", definitionFr: "Personne physique ou morale sur laquelle pèse le risque couvert par l'assurance et au profit de laquelle les prestations sont versées.", definitionEn: "Natural or legal person covered by insurance risk and for whose benefit benefits are paid.", definitionAr: "الشخص الطبيعي أو الاعتباري الذي يتحمل الخطر المغطى بالتأمين والذي تُدفع لصالحه المزايا.", letter: "A", order: 1 },
    { termFr: "Assureur", termEn: "Insurer", termAr: "شركة التأمين", definitionFr: "Société d'assurance qui s'engage, moyennant la prime versée par le souscripteur, à indemniser le bénéficiaire en cas de réalisation du risque.", definitionEn: "Insurance company that undertakes, in exchange for the premium paid by the policyholder, to compensate the beneficiary in the event of a risk occurring.", definitionAr: "شركة التأمين التي تتعهد، مقابل القسط الذي يدفعه المكتتب، بتعويض المستفيد في حالة وقوع الخطر.", letter: "A", order: 2 },
    { termFr: "Avenant", termEn: "Endorsement", termAr: "ملحق العقد", definitionFr: "Document écrit qui modifie les conditions du contrat d'assurance initial.", definitionEn: "Written document that modifies the terms of the original insurance contract.", definitionAr: "وثيقة مكتوبة تُعدِّل شروط عقد التأمين الأصلي.", letter: "A", order: 3 },
    { termFr: "Bénéficiaire", termEn: "Beneficiary", termAr: "المستفيد", definitionFr: "Personne désignée pour recevoir les prestations dues au titre du contrat d'assurance.", definitionEn: "Person designated to receive benefits due under the insurance contract.", definitionAr: "الشخص المعيَّن لتلقي المزايا المستحقة بموجب عقد التأمين.", letter: "B", order: 1 },
    { termFr: "Bonus-Malus", termEn: "No-Claims Discount", termAr: "نظام المكافأة والعقوبة", definitionFr: "Système de modulation de la prime d'assurance automobile en fonction du comportement de l'assuré.", definitionEn: "System for adjusting car insurance premiums based on the insured's behavior.", definitionAr: "نظام لتعديل أقساط التأمين على السيارات بناءً على سلوك المؤمَّن عليه.", letter: "B", order: 2 },
    { termFr: "Cotisation", termEn: "Contribution", termAr: "الاشتراك", definitionFr: "Montant versé par l'assuré pour obtenir la couverture d'assurance.", definitionEn: "Amount paid by the insured to obtain insurance coverage.", definitionAr: "المبلغ الذي يدفعه المؤمَّن عليه للحصول على التغطية التأمينية.", letter: "C", order: 1 },
    { termFr: "Franchise", termEn: "Deductible", termAr: "الاستقطاع", definitionFr: "Part du sinistre qui reste à la charge de l'assuré et n'est pas remboursée par l'assureur.", definitionEn: "The portion of a loss that remains the responsibility of the insured and is not reimbursed by the insurer.", definitionAr: "الجزء من الضرر الذي يبقى على عاتق المؤمَّن عليه ولا تسدده شركة التأمين.", letter: "F", order: 1 },
    { termFr: "Police d'assurance", termEn: "Insurance Policy", termAr: "وثيقة التأمين", definitionFr: "Document contractuel qui formalise les engagements réciproques de l'assureur et du souscripteur.", definitionEn: "Contractual document that formalizes the mutual commitments of the insurer and policyholder.", definitionAr: "وثيقة تعاقدية تُضفي طابعاً رسمياً على الالتزامات المتبادلة بين شركة التأمين والمكتتب.", letter: "P", order: 1 },
    { termFr: "Prime", termEn: "Premium", termAr: "القسط", definitionFr: "Montant versé par le souscripteur à l'assureur en contrepartie de la garantie accordée.", definitionEn: "Amount paid by the policyholder to the insurer in exchange for the guarantee granted.", definitionAr: "المبلغ الذي يدفعه المكتتب لشركة التأمين مقابل الضمان الممنوح.", letter: "P", order: 2 },
    { termFr: "Réassurance", termEn: "Reinsurance", termAr: "إعادة التأمين", definitionFr: "Opération par laquelle un assureur transfère une partie des risques qu'il a pris en charge à un autre assureur, appelé réassureur.", definitionEn: "Operation whereby an insurer transfers part of the risks it has assumed to another insurer, called a reinsurer.", definitionAr: "عملية يتنازل بموجبها المؤمِّن عن جزء من المخاطر التي تحمَّلها إلى مؤمِّن آخر يُسمى معيد التأمين.", letter: "R", order: 1 },
    { termFr: "Sinistre", termEn: "Claim", termAr: "الضرر/الحادثة", definitionFr: "Réalisation du risque couvert par le contrat d'assurance, donnant lieu à l'indemnisation.", definitionEn: "Occurrence of the risk covered by the insurance contract, giving rise to compensation.", definitionAr: "تحقُّق الخطر المغطى بعقد التأمين، مما يستوجب التعويض.", letter: "S", order: 1 },
  ];

  for (const term of glossaryData) {
    const existing = await prisma.glossaryTerm.findFirst({ where: { termFr: term.termFr } });
    if (!existing) await prisma.glossaryTerm.create({ data: term });
  }
  console.log("✅ Glossary terms created");

  // ── Useful links ──
  const links = [
    { titleFr: "Ministère des Finances", titleEn: "Ministry of Finance", titleAr: "وزارة المالية", url: "https://www.finances.gov.ma", category: "gouvernement", order: 1 },
    { titleFr: "ACAPS - Autorité de Contrôle", titleEn: "ACAPS", titleAr: "هيئة مراقبة التأمينات", url: "https://www.acaps.ma", category: "regulateurs", order: 2 },
    { titleFr: "Bank Al-Maghrib", titleEn: "Bank Al-Maghrib", titleAr: "بنك المغرب", url: "https://www.bkam.ma", category: "regulateurs", order: 3 },
    { titleFr: "AMRAE - Association des Risk Managers", titleEn: "AMRAE", titleAr: "جمعية مديري المخاطر", url: "https://www.amrae.fr", category: "associations", order: 4 },
    { titleFr: "Insurance Europe", titleEn: "Insurance Europe", titleAr: "اتحاد التأمين الأوروبي", url: "https://www.insuranceeurope.eu", category: "international", order: 5 },
    { titleFr: "FANAF - Fédération Africaine", titleEn: "FANAF", titleAr: "الاتحاد الأفريقي للتأمين", url: "https://www.fanaf.com", category: "international", order: 6 },
  ];

  for (const link of links) {
    const existing = await prisma.usefulLink.findFirst({ where: { url: link.url } });
    if (!existing) await prisma.usefulLink.create({ data: { ...link, active: true } });
  }
  console.log("✅ Useful links created");

  // ── Formations ──
  const formations = [
    {
      slug: "formation-tarification-assurance-2025",
      titleFr: "Tarification en assurance non-vie",
      titleEn: "Non-life insurance pricing",
      titleAr: "تسعير التأمين غير الحياة",
      descriptionFr: "Formation avancée sur les méthodes actuarielles de tarification des produits d'assurance non-vie.",
      organizer: "FMA / IFAM",
      duration: "3 jours",
      format: "presentiel",
      level: "avance",
      location: "Casablanca",
      startDate: new Date("2025-03-10"),
      endDate: new Date("2025-03-12"),
      status: "PUBLISHED" as const,
    },
    {
      slug: "formation-distribution-assurance-2025",
      titleFr: "Distribution et commercialisation des produits d'assurance",
      titleEn: "Distribution and marketing of insurance products",
      titleAr: "توزيع وتسويق منتجات التأمين",
      descriptionFr: "Programme de formation destiné aux intermédiaires d'assurance sur les techniques de vente et les obligations légales.",
      organizer: "FMA",
      duration: "2 jours",
      format: "hybride",
      level: "intermediaire",
      location: "Rabat",
      startDate: new Date("2025-04-07"),
      endDate: new Date("2025-04-08"),
      status: "PUBLISHED" as const,
    },
  ];

  for (const f of formations) {
    const existing = await prisma.formation.findUnique({ where: { slug: f.slug } });
    if (!existing) await prisma.formation.create({ data: f });
  }
  console.log("✅ Formations created");

  // ── Settings ──
  await prisma.setting.upsert({
    where: { key: "site_name" },
    update: {},
    create: { key: "site_name", value: "FMA - Fédération Marocaine de l'Assurance", group: "general" },
  });
  await prisma.setting.upsert({
    where: { key: "site_email" },
    update: {},
    create: { key: "site_email", value: "contact@fma.org.ma", group: "general" },
  });
  console.log("✅ Settings created");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("📧 Admin: admin@fma.org.ma / Admin@FMA2026!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
