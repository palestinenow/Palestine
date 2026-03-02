// data.js

const levels = {
  1: { title: "المحور الأول: دول الاندماج العضوي", desc: "تطبيع كامل" },
  2: { title: "المحور الثاني: دول الارتهان الجغرافي", desc: "تبعية القسر" },
  3: { title: "المحور الثالث: دول التنسيق الوظيفي", desc: "تطبيع الظل" },
  4: { title: "المحور الرابع: دول الحصانة الشعبية", desc: "خندق الرفض" },
  5: { title: "المحور الخامس: دول الصدام والسيادة", desc: "محور المواجهة" }
};

const countriesData = [
  // ... (Previous countries data remains the same, abbreviated here for brevity) ...
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

  // Sovereignty (101-199)
  { id: 101, name: "السيادة المخطوفة", level: 0, subtitle: "ثمن السلام", events: "تقرير شامل...", links: [] },
  { id: 102, name: "BTC War", level: 0, subtitle: "حرب العملات", events: "العملات المشفرة...", links: [] },
  { id: 103, name: "Windows", level: 0, subtitle: "نوافذ المراقبة", events: "أنظمة التشغيل...", links: [] },
  { id: 104, name: "Meta", level: 0, subtitle: "ميتافيرس السيطرة", events: "العالم الافتراضي...", links: [] },
  { id: 105, name: "Matrix", level: 0, subtitle: "المصفوفة الحقيقية", events: "الخيط الذي يربط...", links: [] },
  
  // NEW BOXES REQUESTED
  { id: 106, name: "Money Flow", level: 0, subtitle: "تدفق الأموال", events: "تحليل حركة رؤوس الأموال العالمية وتأثيرها على القرارات السياسية.", links: [] },
  { id: 107, name: "Music", level: 0, subtitle: "ترددات التأثير", events: "كيف تُستخدم الموسيقى والترددات الصوتية للتأثير على العقل البشري.", links: [] },
  { id: 108, name: "AI", level: 0, subtitle: "الذكاء الاصطناعي", events: "مخاطر وتطلعات الذكاء الاصطناعي في السيطرة على مستقبل البشرية.", links: [] },

  // External (200+)
  { id: 200, name: "أمريكا", level: 0, subtitle: "أداة التنفيذ", events: "ملف العلاقات...", links: [] },
  { id: 201, name: "داعش", level: 0, subtitle: "أداة التفكيك", events: "تدمير الدول...", links: [] }
];
