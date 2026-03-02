// data.js

const levels = {
  1: { title: "المحور الأول: دول الاندماج العضوي", desc: "تطبيع كامل" },
  2: { title: "المحور الثاني: دول الارتهان الجغرافي", desc: "تبعية القسر" },
  3: { title: "المحور الثالث: دول التنسيق الوظيفي", desc: "تطبيع الظل" },
  4: { title: "المحور الرابع: دول الحصانة الشعبية", desc: "خندق الرفض" },
  5: { title: "المحور الخامس: دول الصدام والسيادة", desc: "محور المواجهة" }
};

const countriesData = [
  // Level 1
  { id: 1, name: "الإمارات", level: 1, subtitle: "الشريك الاستراتيجي", events: "تفاصيل الأحداث...", links: [] },
  { id: 2, name: "المغرب", level: 1, subtitle: "تطبيع مقابل اعتراف", events: "تفاصيل الأحداث...", links: [] },
  { id: 3, name: "البحرين", level: 1, subtitle: "قاعدة العمليات", events: "تفاصيل الأحداث...", links: [] },
  // Level 2
  { id: 4, name: "الأردن", level: 2, subtitle: "حارس الحدود", events: "تفاصيل الأحداث...", links: [] },
  { id: 5, name: "مصر", level: 2, subtitle: "من القيادة إلى التبعية", events: "تفاصيل الأحداث...", links: [] },
  { id: 6, name: "السودان", level: 2, subtitle: "تطبيع تحت الضغط", events: "تفاصيل الأحداث...", links: [] },
  // Level 3
  { id: 7, name: "السعودية", level: 3, subtitle: "التمهيد الاقتصادي", events: "تفاصيل الأحداث...", links: [] },
  { id: 8, name: "قطر", level: 3, subtitle: "الوسيط المالي", events: "تفاصيل الأحداث...", links: [] },
  { id: 9, name: "عُمان", level: 3, subtitle: "الدبلوماسية الخلفية", events: "تفاصيل الأحداث...", links: [] },
  // Level 4
  { id: 10, name: "الكويت", level: 4, subtitle: "الحصن القانوني", events: "تفاصيل الأحداث...", links: [] },
  { id: 11, name: "الجزائر", level: 4, subtitle: "الرادع المغاربي", events: "تفاصيل الأحداث...", links: [] },
  { id: 12, name: "تونس", level: 4, subtitle: "صوت الشعوب", events: "تفاصيل الأحداث...", links: [] },
  // Level 5
  { id: 16, name: "العراق", level: 5, subtitle: "الرفض المسلح", events: "تفاصيل الأحداث...", links: [] },
  { id: 17, name: "لبنان", level: 5, subtitle: "المقاومة والدمار", events: "تفاصيل الأحداث...", links: [] },
  { id: 18, name: "سوريا", level: 5, subtitle: "قلعة الممانعة", events: "تفاصيل الأحداث...", links: [] },
  { id: 19, name: "اليمن", level: 5, subtitle: "سيف باب المندب", events: "تفاصيل الأحداث...", links: [] },
  
  // Palestine
  { id: 100, name: "فلسطين", level: 0, subtitle: "الأرض والإنسان", events: "ملف القضية الفلسطينية...", links: [] },

  // Sovereignty
  { id: 101, name: "السيادة المخطوفة", level: 0, subtitle: "ثمن السلام", events: "تقرير شامل...", links: [] },
  { id: 102, name: "BTC War", level: 0, subtitle: "حرب العملات", events: "العملات المشفرة...", links: [] },
  { id: 103, name: "Windows", level: 0, subtitle: "نوافذ المراقبة", events: "أنظمة التشغيل...", links: [] },
  { id: 104, name: "Meta", level: 0, subtitle: "ميتافيرس السيطرة", events: "العالم الافتراضي...", links: [] },
  { id: 105, name: "Matrix", level: 0, subtitle: "المصفوفة الحقيقية", events: "الخيط الذي يربط...", links: [] },
  { id: 106, name: "Money Flow", level: 0, subtitle: "تدفق الأموال", events: "تحليل حركة رؤوس الأموال.", links: [] },
  { id: 107, name: "Music", level: 0, subtitle: "ترددات التأثير", events: "تأثير الموسيقى على العقل.", links: [] },
  { id: 108, name: "AI", level: 0, subtitle: "الذكاء الاصطناعي", events: "مخاطر وتطلعات AI.", links: [] },

  // External / Lies
  { id: 200, name: "أمريكا", level: 0, subtitle: "أداة التنفيذ", events: "ملف العلاقات الأمريكية الإسرائيلية:\nالسنة\tالحدث\tرد فعل أمريكا\n1967\tإسرائيل تحتل الضفة وغزة والجولان\tصمت كامل + أسلحة\n1973\tإسرائيل ترفض الانسحاب من الأراضي المحتلة\tأمريكا تنقذها عسكرياً\n1982\tمجزرة صبرا وشاتيلا\t\"تحقيق إسرائيلي يكفي\"\n2001\tعملاء إسرائيليون يرقصون في 11 سبتمبر\tإغلاق التحقيق \"دبلوماسياً\"\n2003\tإسرائيل تقترح ترحيل الفلسطينيين\t\"فكرة مثيرة للاهتمام\"\n2016\tإسرائيل تستمر في الاستيطان\tأوباما يمتنع عن التصويت (مرة واحدة)\n2017\tترامب يعترف بالقدس\tالعالم يغضب، أمريكا لا تهتم\n2021\tبيغاسوس يخترق البيت الأبيض\t\"نحن نثق بإسرائيل\"\n2024\tإسرائيل تقتل 42,000 في غزة\t\"أرسلوا المزيد من القنابل\"\n2024\tأمريكا تستخدم الفيتو ضد فلسطين وحدها\t14 دولة مع فلسطين، أمريكا ضدها وحدها", links: [] },
  { id: 201, name: "داعش", level: 0, subtitle: "أداة التفكيك", events: "تدمير الدول...", links: [] },
  { id: 202, name: "911", level: 0, subtitle: "The Day That Changed", events: "أحداث سبتمبر...", links: [] },
  { id: 203, name: "Aliens", level: 0, subtitle: "Project Blue Beam", events: "تضليل إعلامي...", links: [] },
  { id: 204, name: "Illusion", level: 0, subtitle: "وهم القوة", events: "القوة الزائفة...", links: [] },
  { id: 205, name: "Darkweb", level: 0, subtitle: "الشبكة المظلمة", events: "ما يحدث في الخفاء...", links: [] },
  { id: 206, name: "Israel", level: 0, subtitle: "الكيان الصهيوني", events: "تاريخ الإنشاء...", links: [] }
];
