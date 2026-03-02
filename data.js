// data.js

const levels = {
  1: { title: "المحور الأول: دول الاندماج العضوي", desc: "تطبيع كامل" },
  2: { title: "المحور الثاني: دول الارتهان الجغرافي", desc: "تبعية القسر" },
  3: { title: "المحور الثالث: دول التنسيق الوظيفي", desc: "تطبيع الظل" },
  4: { title: "المحور الرابع: دول الحصانة الشعبية", desc: "خندق الرفض" },
  5: { title: "المحور الخامس: دول الصدام والسيادة", desc: "محور المواجهة" }
};

const countriesData = [
  // ===== المستوى الأول =====
  { id: 1, name: "الإمارات", level: 1, subtitle: "الشريك الاستراتيجي", events: "تفاصيل العلاقات...", links: [] },
  { id: 2, name: "المغرب", level: 1, subtitle: "تطبيع مقابل اعتراف", events: "تفاصيل العلاقات...", links: [] },
  { id: 3, name: "البحرين", level: 1, subtitle: "قاعدة العمليات", events: "تفاصيل العلاقات...", links: [] },
  // ===== المستوى الثاني =====
  { id: 4, name: "الأردن", level: 2, subtitle: "حارس الحدود", events: "تفاصيل العلاقات...", links: [] },
  { id: 5, name: "مصر", level: 2, subtitle: "من القيادة إلى التبعية", events: "تفاصيل العلاقات...", links: [] },
  { id: 6, name: "السودان", level: 2, subtitle: "تطبيع تحت الضغط", events: "تفاصيل العلاقات...", links: [] },
  // ===== المستوى الثالث =====
  { id: 7, name: "السعودية", level: 3, subtitle: "التمهيد الاقتصادي", events: "تفاصيل العلاقات...", links: [] },
  { id: 8, name: "قطر", level: 3, subtitle: "الوسيط المالي", events: "تفاصيل العلاقات...", links: [] },
  { id: 9, name: "عُمان", level: 3, subtitle: "الدبلوماسية الخلفية", events: "تفاصيل العلاقات...", links: [] },
  // ===== المستوى الرابع =====
  { id: 10, name: "الكويت", level: 4, subtitle: "الحصن القانوني", events: "تفاصيل العلاقات...", links: [] },
  { id: 11, name: "الجزائر", level: 4, subtitle: "الرادع المغاربي", events: "تفاصيل العلاقات...", links: [] },
  { id: 12, name: "تونس", level: 4, subtitle: "صوت الشعوب", events: "تفاصيل العلاقات...", links: [] },
  // ===== المستوى الخامس =====
  { id: 16, name: "العراق", level: 5, subtitle: "الرفض المسلح", events: "تفاصيل العلاقات...", links: [] },
  { id: 17, name: "لبنان", level: 5, subtitle: "المقاومة والدمار", events: "تفاصيل العلاقات...", links: [] },
  { id: 18, name: "سوريا", level: 5, subtitle: "قلعة الممانعة", events: "تفاصيل العلاقات...", links: [] },
  { id: 19, name: "اليمن", level: 5, subtitle: "سيف باب المندب", events: "تفاصيل العلاقات...", links: [] },
  
  // ===== فلسطين =====
  { id: 100, name: "فلسطين", level: 0, subtitle: "الأرض والإنسان والمقاومة", events: "ملف القضية الفلسطينية...", links: [] },

  // ===== السيادة المخطوفة (Updated) =====
  { id: 101, name: "السيادة المخطوفة", level: 0, subtitle: "ثمن السلام", events: "تقرير شامل...", links: [] },
  { id: 102, name: "BTC War", level: 0, subtitle: "حرب العملات", events: "العملات المشفرة...", links: [] },
  { id: 103, name: "Windows", level: 0, subtitle: "نوافذ المراقبة", events: "أنظمة التشغيل...", links: [] },
  { id: 104, name: "Meta", level: 0, subtitle: "ميتافيرس السيطرة", events: "العالم الافتراضي...", links: [] },
  { id: 105, name: "Matrix", level: 0, subtitle: "المصفوفة الحقيقية", events: "الخيط الذي يربط...", links: [] },
  { id: 106, name: "Money Flow", level: 0, subtitle: "تدفق الأموال", events: "تحليل حركة رؤوس الأموال...", links: [] },
  { id: 107, name: "Music", level: 0, subtitle: "ترددات التأثير", events: "الموسيقى والتأثير على العقل...", links: [] },
  { id: 108, name: "AI", level: 0, subtitle: "الذكاء الاصطناعي", events: "مخاطر وتطلعات AI...", links: [] },

  // ===== الأكاذيب المسيطرة =====
  { id: 200, name: "أمريكا", level: 0, subtitle: "أداة التنفيذ", events: "ملف العلاقات...", links: [] },
  { id: 201, name: "داعش", level: 0, subtitle: "أداة التفكيك", events: "تدمير الدول...", links: [] },
  { id: 202, name: "911", level: 0, subtitle: "The Day That Changed Everything", events: "أحداث 11 سبتمبر...", links: [] },
  { id: 203, name: "Project Blue Beam", level: 0, subtitle: "مسرحية الفضائيين", events: "الخدعة الكبرى...", links: [] },
  { id: 204, name: "The Illusion", level: 0, subtitle: "وهم القوة", events: "تحليل القوة الزائفة...", links: [] }
];
