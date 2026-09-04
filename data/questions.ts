import type { Answers, Question } from "@/types/questionnaire";

export const questions: Question[] = [
  {
    id: "program_name",
    section: "Το πρόγραμμα",
    title: "Ποιο ακριβώς πρόγραμμα ξεκινά στις 6 Οκτωβρίου;",
    description: "Γράψτε την πλήρη ονομασία όπως θέλετε να εμφανίζεται στην επικοινωνία.",
    type: "text",
    required: true,
    placeholder: "π.χ. The Art & Science of Coaching™"
  },
  {
    id: "program_url",
    section: "Το πρόγραμμα",
    title: "Υπάρχει συγκεκριμένη σελίδα του site για αυτό το πρόγραμμα;",
    description: "Αν υπάρχει, στείλτε μας το link. Διαφορετικά μπορείτε να το αφήσετε κενό.",
    type: "url",
    placeholder: "https://..."
  },
  {
    id: "delivery_format",
    section: "Το πρόγραμμα",
    title: "Πώς πραγματοποιείται το πρόγραμμα;",
    type: "single",
    required: true,
    options: ["Online", "Δια ζώσης", "Hybrid"]
  },
  {
    id: "language",
    section: "Το πρόγραμμα",
    title: "Σε ποια γλώσσα πραγματοποιείται;",
    type: "single",
    required: true,
    options: ["Ελληνικά", "Αγγλικά", "Ελληνικά & Αγγλικά", "Άλλο"]
  },
  {
    id: "price",
    section: "Το πρόγραμμα",
    title: "Ποια είναι η τιμή συμμετοχής;",
    description: "Μπορείτε να γράψετε το συνολικό ποσό και, αν χρειάζεται, μια σύντομη διευκρίνιση.",
    type: "text",
    required: true,
    placeholder: "π.χ. €2.400 + ΦΠΑ"
  },
  {
    id: "payment_options",
    section: "Το πρόγραμμα",
    title: "Υπάρχουν δόσεις, early bird ή κάποια άλλη οικονομική διευκόλυνση;",
    type: "single",
    required: true,
    options: ["Ναι", "Όχι"]
  },
  {
    id: "payment_details",
    section: "Το πρόγραμμα",
    title: "Ποια είναι η διαθέσιμη επιλογή;",
    type: "textarea",
    required: true,
    condition: { questionId: "payment_options", equals: "Ναι" },
    placeholder: "Περιγράψτε σύντομα τις δόσεις, το early bird ή άλλη δυνατότητα."
  },
  {
    id: "available_seats",
    section: "Στόχος της καμπάνιας",
    title: "Πόσες θέσεις είναι ακόμη διαθέσιμες για τον κύκλο της 6ης Οκτωβρίου;",
    type: "number",
    required: true,
    placeholder: "π.χ. 12"
  },
  {
    id: "campaign_goal",
    section: "Στόχος της καμπάνιας",
    title: "Ποιο αποτέλεσμα θα θεωρούσατε επιτυχημένο για αυτή την καμπάνια;",
    type: "single",
    required: true,
    options: [
      "Να καλυφθούν όλες οι διαθέσιμες θέσεις",
      "Να αποκτήσουμε συγκεκριμένο αριθμό νέων εγγραφών",
      "Να δημιουργήσουμε ποιοτικά leads ώστε να δουλευτούν από την ομάδα μας",
      "Δεν έχω συγκεκριμένο αριθμητικό στόχο ακόμη"
    ]
  },
  {
    id: "enrollment_target",
    section: "Στόχος της καμπάνιας",
    title: "Πόσες νέες εγγραφές θέλετε να πετύχουμε;",
    type: "number",
    required: true,
    condition: {
      questionId: "campaign_goal",
      equals: "Να αποκτήσουμε συγκεκριμένο αριθμό νέων εγγραφών"
    },
    placeholder: "π.χ. 8"
  },
  {
    id: "registration_deadline",
    section: "Στόχος της καμπάνιας",
    title: "Μέχρι ποια ημερομηνία μπορεί κάποιος να εγγραφεί;",
    type: "date",
    required: true
  },
  {
    id: "audience_profiles",
    section: "Το κοινό",
    title: "Ποιοι είναι συνήθως οι άνθρωποι που επιλέγουν το συγκεκριμένο πρόγραμμα;",
    description: "Επιλέξτε όσες απαντήσεις ταιριάζουν.",
    type: "multi",
    required: true,
    options: [
      "Υφιστάμενοι coaches",
      "Άτομα που θέλουν να ξεκινήσουν καριέρα στο coaching",
      "Managers / Team Leaders",
      "HR professionals",
      "Consultants",
      "Business owners / επιχειρηματίες",
      "Ψυχολόγοι / επαγγελματίες ψυχικής υγείας",
      "Trainers / εκπαιδευτικοί",
      "Άτομα που βρίσκονται σε αλλαγή καριέρας",
      "Άλλο"
    ]
  },
  {
    id: "motivations",
    section: "Το κοινό",
    title: "Ποιο είναι συνήθως το βασικό κίνητρο για να συμμετάσχει κάποιος;",
    description: "Επιλέξτε έως 3 απαντήσεις.",
    type: "multi",
    required: true,
    maxSelections: 3,
    options: [
      "Να γίνει επαγγελματίας coach",
      "Να αποκτήσει αναγνωρισμένη εκπαίδευση / πιστοποίηση",
      "Να εξελιχθεί στον υπάρχοντα επαγγελματικό του ρόλο",
      "Να αποκτήσει coaching skills για τη διοίκηση ομάδων",
      "Να αλλάξει καριέρα",
      "Προσωπική ανάπτυξη",
      "Άλλο"
    ]
  },
  {
    id: "objections",
    section: "Από το ενδιαφέρον στην εγγραφή",
    title: "Ποιοι είναι οι συχνότεροι λόγοι που ένας ενδιαφερόμενος τελικά δεν προχωρά;",
    description: "Επιλέξτε έως 3 απαντήσεις.",
    type: "multi",
    required: true,
    maxSelections: 3,
    options: [
      "Κόστος",
      "Χρόνος / διάρκεια",
      "Δεν είναι ακόμη σίγουρος ότι θέλει να γίνει coach",
      "Δεν καταλαβαίνει πλήρως την αξία της πιστοποίησης",
      "Δεν βλέπει ξεκάθαρα την επαγγελματική εφαρμογή",
      "Συγκρίνει με άλλες σχολές / προγράμματα",
      "Δεν είναι η κατάλληλη χρονική στιγμή",
      "Άλλο"
    ]
  },
  {
    id: "previous_ads",
    section: "Προηγούμενη προώθηση",
    title: "Έχετε προωθήσει ξανά αντίστοιχο πρόγραμμα με πληρωμένη διαφήμιση;",
    type: "single",
    required: true,
    options: ["Ναι", "Όχι"]
  },
  {
    id: "previous_ad_platforms",
    section: "Προηγούμενη προώθηση",
    title: "Σε ποιες πλατφόρμες;",
    type: "multi",
    required: true,
    condition: { questionId: "previous_ads", equals: "Ναι" },
    options: ["Facebook / Instagram", "Google", "LinkedIn", "Άλλο"]
  },
  {
    id: "previous_results",
    section: "Προηγούμενη προώθηση",
    title: "Αν υπάρχουν διαθέσιμα στοιχεία, τι αποτέλεσμα είχε περίπου;",
    description: "Ενδεικτικά leads, εγγραφές, κόστος ή συνολικό budget. Αν δεν τα έχετε πρόχειρα, αφήστε το κενό.",
    type: "textarea",
    condition: { questionId: "previous_ads", equals: "Ναι" },
    placeholder: "Ό,τι στοιχεία έχετε διαθέσιμα είναι χρήσιμα."
  },
  {
    id: "creative_assets",
    section: "Υλικό για την καμπάνια",
    title: "Τι είδους υλικό από το global είναι διαθέσιμο για χρήση;",
    type: "multi",
    required: true,
    options: [
      "Static visuals",
      "Videos",
      "Testimonials",
      "Alumni stories",
      "Trainer videos",
      "Brochures / παρουσιάσεις",
      "Brand guidelines",
      "Άλλο"
    ]
  },
  {
    id: "asset_adaptation",
    section: "Υλικό για την καμπάνια",
    title: "Μπορούμε να προσαρμόσουμε το global υλικό για την ελληνική αγορά;",
    type: "single",
    required: true,
    options: [
      "Ναι",
      "Ναι, αλλά χρειάζεται έγκριση από το global",
      "Μπορούμε να αλλάξουμε μόνο τα κείμενα",
      "Υπάρχουν συγκεκριμένοι περιορισμοί",
      "Δεν γνωρίζω ακόμη"
    ]
  },
  {
    id: "asset_restrictions",
    section: "Υλικό για την καμπάνια",
    title: "Τι πρέπει να γνωρίζουμε για τους περιορισμούς;",
    type: "textarea",
    required: true,
    condition: { questionId: "asset_adaptation", equals: "Υπάρχουν συγκεκριμένοι περιορισμοί" },
    placeholder: "Περιγράψτε σύντομα τι επιτρέπεται και τι όχι."
  },
  {
    id: "lead_sources",
    section: "Διαχείριση leads",
    title: "Όταν κάποιος εκδηλώσει ενδιαφέρον σήμερα, τι συμβαίνει στη συνέχεια;",
    description: "Επιλέξτε όσα ισχύουν.",
    type: "multi",
    required: true,
    options: [
      "Συμπληρώνει φόρμα στο site",
      "Στέλνει email",
      "Τηλεφωνεί",
      "Στέλνει μήνυμα στα social",
      "Κλείνει ενημερωτικό call",
      "Κάποιος από την ομάδα επικοινωνεί μαζί του",
      "Άλλο"
    ]
  },
  {
    id: "lead_storage",
    section: "Διαχείριση leads",
    title: "Πώς καταγράφετε σήμερα τα νέα leads;",
    type: "single",
    required: true,
    options: [
      "Μόνο μέσω email",
      "Excel / Google Sheets",
      "CRM",
      "Άλλο σύστημα",
      "Δεν υπάρχει οργανωμένη καταγραφή"
    ]
  },
  {
    id: "lead_storage_tool",
    section: "Διαχείριση leads",
    title: "Ποιο σύστημα χρησιμοποιείτε;",
    type: "text",
    required: true,
    condition: { questionId: "lead_storage", oneOf: ["CRM", "Άλλο σύστημα"] },
    placeholder: "π.χ. HubSpot"
  },
  {
    id: "lead_owner",
    section: "Διαχείριση leads",
    title: "Ποιος αναλαμβάνει σήμερα την επικοινωνία με ένα νέο ενδιαφερόμενο;",
    type: "text",
    required: true,
    placeholder: "π.χ. Μαρία / γραμματεία / συνεργάτης"
  },
  {
    id: "enrollment_process",
    section: "Διαχείριση leads",
    title: "Ποια είναι συνήθως η διαδικασία μέχρι την εγγραφή;",
    description: "Μας ενδιαφέρει η πραγματική διαδρομή που ακολουθεί σήμερα ένας ενδιαφερόμενος.",
    type: "textarea",
    required: true,
    placeholder: "π.χ. Φόρμα → τηλεφωνική επικοινωνία → ενημερωτικό Zoom → εγγραφή"
  },
  {
    id: "spam_issue",
    section: "Τεχνικά θέματα",
    title: "Όταν αναφέρετε ότι τα emails καταλήγουν στο Spam, ποιο από τα παρακάτω συμβαίνει;",
    type: "single",
    required: true,
    options: [
      "Οι ειδοποιήσεις από τις φόρμες του site καταλήγουν στο Spam",
      "Τα emails που στέλνουμε στους ενδιαφερόμενους καταλήγουν στο Spam",
      "Συμβαίνουν και τα δύο",
      "Δεν είμαι σίγουρη"
    ]
  },
  {
    id: "site_access",
    section: "Τεχνικά θέματα",
    title: "Υπάρχει κάποια πρόσβαση στο site ή στο hosting όσο απουσιάζει ο Αντώνης;",
    type: "single",
    required: true,
    options: ["Ναι", "Όχι", "Δεν γνωρίζω", "Πρόσβαση έχει μόνο ο Αντώνης"]
  },
  {
    id: "meta_account",
    section: "Διαφήμιση",
    title: "Υπάρχει ήδη Meta Ads account από το οποίο έχουν τρέξει καμπάνιες για το Erickson Greece;",
    type: "single",
    required: true,
    options: ["Ναι", "Όχι", "Δεν γνωρίζω"]
  },
  {
    id: "media_budget",
    section: "Διαφήμιση",
    title: "Τι διαφημιστικό budget σκέφτεστε να διαθέσετε μέχρι την έναρξη του προγράμματος;",
    description: "Το ποσό αφορά αποκλειστικά το media spend προς τις διαφημιστικές πλατφόρμες και όχι την αμοιβή διαχείρισης.",
    type: "single",
    required: true,
    options: [
      "Έως €500",
      "€500–€1.000",
      "€1.000–€2.000",
      "€2.000–€3.000",
      "Πάνω από €3.000",
      "Δεν έχω αποφασίσει — θα ήθελα πρόταση"
    ]
  },
  {
    id: "existing_database",
    section: "Διαφήμιση",
    title: "Υπάρχει ήδη βάση παλαιότερων ενδιαφερομένων ή επαφών που μπορούμε να αξιοποιήσουμε;",
    description: "Επιλέξτε όσα υπάρχουν διαθέσιμα.",
    type: "multi",
    required: true,
    options: [
      "Παλαιότερα leads",
      "Newsletter subscribers",
      "Alumni",
      "Συμμετέχοντες σε προηγούμενα events / webinars",
      "CRM / contact database",
      "Δεν υπάρχει",
      "Δεν γνωρίζω"
    ]
  },
  {
    id: "additional_notes",
    section: "Τελευταίο βήμα",
    title: "Υπάρχει κάτι ακόμη που θεωρείτε σημαντικό να γνωρίζουμε;",
    description: "Οτιδήποτε μπορεί να επηρεάσει την πρόταση ή την καμπάνια είναι χρήσιμο. Προαιρετικά.",
    type: "textarea",
    placeholder: "Γράψτε εδώ οποιαδήποτε επιπλέον πληροφορία."
  }
];

export function isQuestionVisible(question: Question, answers: Answers) {
  if (!question.condition) return true;

  const currentAnswer = answers[question.condition.questionId];
  if (Array.isArray(currentAnswer)) return false;

  if (question.condition.equals !== undefined) {
    return currentAnswer === question.condition.equals;
  }

  if (question.condition.oneOf) {
    return question.condition.oneOf.includes(currentAnswer ?? "");
  }

  return true;
}
