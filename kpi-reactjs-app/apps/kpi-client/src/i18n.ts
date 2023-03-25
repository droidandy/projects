﻿import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          hi: `Hi, `,
        },
      },
      ar: {
        translations: {
          'Sign In To PMP': `تسجيل الدخول لنظام أداء`,
          Username: `اسم المستخدم`,
          Password: `كلمة المرور`,
          'Sign in': `تسجيل الدخول`,
          Dashboards: `الرئيسية`,
          'KPI Reports': `المؤشرات الخاصة بي`,
          'KPI Name': `المؤشر`,
          Type: `نوع المؤشر`,
          Target: `المستهدف`,
          Actual: `المحقق`,
          Performance: `الإنجاز`,
          'Yearly Progress': `الإنجاز السنوي`,
          Evidences: `التعليقات/الأدلة`,
          'No Attachment Available Right Now': `لا يوجد أدلة أو مرفقات`,
          'Please enter username!': `الرجاء ادخال اسم المستخدم`,
          'Please enter password!': `الرجاء ادخال كلمة المرور`,
          'ADFD PERFORMANCE': `أداء الصندوق`,
          'ADFD EXCELLENCE': `أداء متطلبات التميز للصندوق`,
          'Overall ADFD Performance': `أداء الصندوق لعام`,
          'ADFD Performance': `أداء الصندوق`,
          'No Performance': 'لا يوجد',
          Below: `لم يتم الإنجاز`,
          Nearly: `أنجزت تقريبا`,
          Achieved: `تم الإنجاز`,
          Exceeded: `تجاوزت الإنجاز`,
          Reports: `التقارير`,
          'KPIs and Data Entry': `إدخال النتائج`,
          Scorecard: `بطاقة الأداء`,
          Excellence: `متطلبات التميز`,
          Initiatives: `المشاريع`,
          Alerts: `التنبيهات`,
          'My Tasks': `المهام الخاصة بي`,
          'Educational Contents': `التعلم المستمر`,
          'My Space': `صفحاتي`,
          'No Tasks Available Right Now': `لا يوجد لديك مهام حاليا`,
          'No Alerts Available Right Now': `لا يوجد لديك اشعارات حاليا`,
          'Shows all the information about the Reports': `استعراض جميع التقارير الخاصة بي`,
          'Shows all the information about the Data Entry': `صفحة تحديث نتائج المؤشرات الخاصة بي`,
          'Shows all the information about the Scorecard': `صفحة بطاقة الأداء الخاصة بالصندوق والإدارات `,
          'Shows all the information about the Excellence': `صفحة متابعة متطلبات التميز الخاصة بي`,
          'Shows all the information about the Initiatives': `صفحة متابعة المشاريع`,
          'Excellence Requirements': `متطلبات التميز`,
          Filters: `الفرز`,
          Id: `الرقم التعريفي`,
          Name: `الاسم`,
          Status: `الحالة`,
          'Start Date': `تاريخ البداية`,
          'End Date': `تاريخ الانتهاء`,
          'Not Exist': `غير موجودة`,
          Exist: `موجودة`,
          Active: `مفعلة`,
          Completed: `مكتملة`,
          'In Progress': `قيد التنفيذ`,
          Late: `متأخرة`,
          'Projects Widget': `أداء المشاريع`,
          'Challenges Widget': `سجل التحديات`,
          Color: 'الحالة',
          Frequencies: `دورية القياس`,
          'Aggregation Types': `نوع المؤشر`,
          'KPI Types': `نمط المؤشر`,
          'Overall ADFD Excellence': `أداء متطلبات التميز للصندوق`,
          'ADFD Excellence': `متطلبات التميز`,
          hi: `مرحبا`,
          'No Challenges Available Right Now': `لا يوجد تحديات في الصندوق حاليا`,
          'My KPIs': `مؤشرات الإدارة`,
          'Shows all the information about the My KPIs': `صفحة استعراض مؤشرات الأداء الخاصة بي`,
          Nr: ``,
          'ATTACHED FILES': `الملفات/الأدلة`,
          'No Comments Found': `لايوجد أي تعليقات`,
          'Start Discussion': `ابدأ المحادثة`,
          Comment: `إرسال`,
          'Write a comment': `إضافة تعليق`,
          'Create TODO': `إضافة مهمة`,
          'Add new Files': `إضافة ملفات`,
          'Attach files': `إضافة ملفات`,
          'Max file size is 1MB And max number of files is 5': `يمكنك إضافة ملفات الأدلة والوثائق`,
          Level: `المستوى`,
          Value: `المحقق`,
          H1: `النصف الأول`,
          H2: `النصف الثاني`,
          Q1: `الربع الأول`,
          Q2: `الربع الثاني`,
          Q3: `الربع الثالث`,
          Q4: `الربع الرابع`,
          Annually: `سنوي`,
          'Semi-Annually': `نصف سنوي`,
          Quarterly: `ربع سنوي`,
          Vision: `رؤية`,
          Mission: `مهمة`,
          'Number of Projects': `عدد المشاريع`,
          'All Units': `جميع الوحدات`,
          Contact: `أتصل`,
          Team: `فريق`,
          'Terms of Use': `تعليمات الاستخدام`,
          'Organization Unit': `وحدة التنظيم`,
          'Shows the KPI for ADFD Excellence': `عرض مؤشر صندوق ابو ظبي للتميز`,
          'Shows the KPI for ADFD Performance': `عرض مؤشر اداء صندوق ابو ظبي `,
          Frequency: `دورية القياس`,
          None: `لا شيء`,
          Sum: `مجموع`,
          Average: `معدل`,
          Last: `الاخير`,
          Min: `الحد الادنى`,
          Max: `الحد الاعلى`,
          Blue: `ازرق`,
          Green: `اخضر`,
          Yellow: `اصفر`,
          Red: `احمر`,
          Gray: `رمادي`,
          Unit: `وحدة`,
          'KPI Level': `مرحلة المؤشر`,
          Strategic: `استراتيجي`,
          Operational: `تشغيلي`,
          'Responsible Unit': `الوحدة المسؤولة`,
          'Focal Point': `النقطة المحورية`,
          'KPI Measurement frequency': `تردد قياس المؤشر`,
          'KPI Type': `نوع المؤشر`,
          'KPI Baseline': `مؤشر خط الاساس`,
          'KPI Value': `قيمة المؤشر`,
          'KPI Target': `هدف المؤشر`,
          'KPI Performance': `اداء المؤشر`,
          Monthly: `شهري`,
          Apply: `تطبيق`,
          Actions: 'أجراءات',
          'Aggregation Type': 'نوع الاحتساب',
          'Scoring Type': 'نمط القياس',
          Title: 'العنوان',
          'Sign out': 'خروج',
          Search: 'بحث',
          'Select Type': 'اختر صنف',
          'Name of report': 'اسم التقرير',
          'Unit Performance': 'أداء الإدارة',
          'Shows the KPI for Unit Performance':
            'أداء المؤشرات الاستراتيجية للإدارة',
          'Unit Excellence': 'أداء متطلبات التميز للإدارة',
          'Shows the KPI for Unit Excellence': 'أداء متطلبات التميز للإدارة',
          Filter: 'البحث',
          Theme: 'المحور',
          Yes: 'نعم',
          No: 'لا',
          Criteria: 'المعيار',
          Subcriteria: 'المعيار الفرعي',
          'Unit KPI Performance': 'أداء الإدارة',
          'Overall Unit KPI Performance': 'أداء المؤشرات الاستراتيجية للإدارة',
          'Unit Excellence Performance': 'أداء متطلبات التميز للإدارة',
          'Overall ADFD Excellence Performance': 'أداء متطلبات التميز للإدارة',
          Budget: 'الميزانية',
          Progress: 'الإنجاز',
          'Clear Filter': 'إعادة تعيين',
          Completed: 'مكتمل',
          Late: 'متأخرة',
          'In Progress': 'جاري العمل',
          'Add New': 'إضافة جديدة',
          'KPI Code': 'رمز المؤشر',
          Period: 'فترة القياس',
          'KPI Details': 'تفاصيل المؤشر',
          Discussion: 'المحادثة',
          History: 'التغييرات',
          'No History Available Right Now': 'لا يوجد سجل للتغيررات حاليا',
          Edit: 'تعديل',
          'Basic Info': 'المعلومات الأساسية',
          Description: 'التفاصيل',
          'Measure Details': 'تفاصيل القياس',
          'Data Type': 'نوع البيانات',
          'Max. Limit': 'أعلى قيمة',
          Aggregation: 'التراكمية',
          'Is Value Aggregated?': 'القيمة تراكمية ؟',
          'Series Details': 'تفاصيل المستهدفات',
          'Actual Value': 'المحقق',
          Goal: 'المستهدف',
          'User Details': 'المسؤوول',
          'Attached Files': 'المرفقات',
          ID: '#',
          'Challenge Title': 'عنوان التحدي',
          'Affected Unit': 'الإدارة المتأثرة',
		  'Filter' : 'البحث',
          'Theme' : 'المحور',
          'Yes' : 'نعم',
          'No' : 'لا',
          'Criteria' : 'المعيار',
          'Subcriteria' : 'المعيار الفرعي',
          'Start': `البداية`,
          'Progress': `تقدم`,
          'No History Available Right Now': `لا يوجد سجل متاح الآن`,
'Project Details' : 'تفاصيل المشروع',
'User Management' : 'إدارة المستخدم',
'Project Phases' : 'مراحل المشروع',
'Project Resources' : 'موارد المشروع ',
'Project Risks' : 'مخاطر المشروع',
'Change Management' : 'إدارة التغيير',
'Review Submit' : 'ارسال المراجعة',
'Project Name' : 'اسم المشروع',
'Project Description': 'تفاصيل المشروع',
'Please enter your Project Description' : 'يرجى ادخال تفاصيل مشروعك',
'Project Budget' : 'ميزانية المشروع',
'Please enter your Project Budget' :'يرجى ادخال ميزانية مشروعك',
'Please enter your Start date' : 'يرجى ادخال تاريخ البداية',
'Please enter your End date' : 'يرجى ادخال تاريخ النهاية',
'Add' : 'إضافة',
'Requirements and specifications' : 'المتطلبات و المواصفات',
'Existing or Potential Challenges' : 'التحديات القائمة او المحتملة',
'Related Projects' : 'مشاريع ذات صلة',
'Start Tying' : 'ابدأ بالكتابة',
'Action' : 'عمل', 
'Select Item' : 'إختر بند',
'Next Step' : 'الخطوة التالية',
'Save Draft' : 'حفظ لوقت لاحق',
'Cancel' : 'إلغاء',
'Please enter your Project Name' : 'يرجى إدخال اسم المشروع',
'Please enter your State': 'يرجى ادخال اسم الولاية',
'Project Owner' : 'صاحب المشروع',
'Project Manager' : 'مدير المشروع',
'Please enter your Project Onwer' : 'يرجى إدخال المشروع الخاص بك',
'Please enter your Project Manager': 'يرجى إدخال مدير المشروع الخاص بك',
'Project Members' : 'أعضاء المشروع',
'Username/Department' :'إسم المستخدم / الادارة',
'Role' : 'الوظيفة',
'Delete' : 'حذف',
'Outcome' : 'النتيجة',
'Notes' : 'ملاحظات',
'Add New Field' : 'إضافة خانة جديدة',
'Phase Name Here' : 'إسم المرحلة',
'Write note Here' : 'اضف ملاحظة هنا',
'Project Communication Plan' : 'خطة تواصل المشروع',
'Message' : 'رسالة',
'Target Audience' : 'الجمهور المستهدف',
'Communication channel' : 'قنوات الأتصال',
'Efficiency measurement' : 'قياس الكفاءة',
'Project Setup' : 'إعداد مشروع',
'Enter Text' : 'إضافة نص',
'During execution/Implementation' : 'أثناء التنفيذ / التنفيذ',
'Post Implementation' : 'بعد التنفيذ',
'Budget planning table' : 'جدول تخطيط الميزانية',
'Phase/Activity' : 'المرحلة / الانشطة',
'Details' :'التفاصيل',
'Financial Item' : 'البند المالي',
'Main Budget' : 'الميزانية الرئيسية',
'Extra Cost' : 'تكلفة إضافية',
'Total Cost' : 'التكلفة الاضافية',
'Payment Procedure' :'إجراءات الدفع',
'Timeline' : 'الجدول الزمني',
'Other Resources' : 'مصادر أخرى',
'Risk Management' : 'سجل المخاطر',
'Risk Type' :'نوع الخطر',
'Probability' : 'الاحتمال',
'Impact' : 'الأثر',
'Risk Index' : 'مستوى الخطر',
'Responsibility' : 'المسؤولية',
'Counter Measures' : 'الاجراءات البديلة',
'Project Onwer' : 'صاحب المشروع',
'Phase name' : 'اسم المرحلة',
'Select' : 'إختر',
'Resource' : 'المصدر',
'Need for Change' : 'الحاجة للتغيير',
'Change Scope' : 'تغيير النطاق',
'Affected Parties' : 'الأطراف المتضررة',
'Required Action' : 'الأجراءات المطلوبة',
'Text Area' : 'إضافة نص',
'Review your Details and Submit' : 'مراجعة التفاصيل الخاصة بك',
'Project Objectives' : 'أهداف المشروع',
'Innovation Factor of this project' : 'عامل الابتكار لهذا المشروع',
'Project Main Phases' : 'مراحل المشروع الرئيسية',
'Submit' : 'إرسال',
'SD Goals' : 'أهداف الأمم المتحدة',
'UAE Goals' : 'أهداف وزارة الخارجية',
'AD Goals' : 'أهداف خطة أبوظبي',
'Enablers' : 'برامج خطة أبوظبي',
'Outcomes' : 'المخرجات',
'Themes' : 'المحاور',
'Objectives' : 'أهداف الإدارة',
'KPIs' : 'المؤشرات',
'Overall KPI Performance Status' : 'أداء المؤشرات الكلي',
'Total KPIs' : 'المجموع',
'Almost Achieved' : 'أنجزت تقريبا',
'Missed Target' : 'لم يتم الإنجاز',
'No Data' : 'لا يوجد',
'Switch to Table View' : 'استعراض كجدول',
'Switch to Tree View' : 'استعراض تسلسل شجري',
'Create New Item' : 'إضافة عنصر جديد',
'Create New Excellence' : 'إضافة جديدة',
'Create New KPI' : 'إضافة جديدة',
'Create KPI' : 'إضافة مؤشر',
'BASIC INFO' : 'التفاصيل الأساسية',
'OWNER DETAILS' :  '',
'Strategy Link' : 'الربط الإستراتيجي',
'MEASURE DETAILS' : 'تفاصيل قياس المؤشر',
'OWNER DETAILS' : 'الوحدة المعنية',
'THRESHOLD VALUES' : 'معايير نمط القياس',
'SERIES DETAILS' : 'تفاصيل المستهدفات',
'Requirement Status' : 'حالة المتطلب',
'Is Active' : 'فعال ؟',
'Is Completed' : 'مكتمل ؟',
'Start date' : 'تاريخ البداية',
'End date' : 'تاريخ الإنتهاء',
'Excellence Criteria' : 'معيار التميز',
'Excellence Theme' : 'المحور',
'Owner Unit' : 'الوحدة المعنية',
'Create Excellence' : 'إضافة متطلب تميز',
'Save' : 'إرسال'
          }, 
		 },
		},
		fallbackLng: 'ar',
		whitelist: ['ar'],
		debug: false,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    react: {
      wait: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
