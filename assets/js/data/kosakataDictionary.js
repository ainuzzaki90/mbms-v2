/* ==========================================================================
   MBMS — data/kosakataDictionary.js
   ----------------------------------------------------------------------
   A curated local dictionary (Indonesian -> Arabic + example sentence,
   Indonesian -> English + example sentence) used by the "Generate"
   feature in the Kosakata Harian module. This is a static, hand-vetted
   reference bundled with the app — NOT a live translation API call —
   so results are accurate and consistent, with zero external dependency
   or API key risk. Staff can still add any word manually if it isn't
   in this dictionary yet (see kosakata.js).
   ========================================================================== */

const KOSAKATA_DICTIONARY = {
  // ---- Salam & Sapaan ----
  "selamat pagi": { kategori:"Salam & Sapaan", arab:"صباح الخير", contohArab:"صباح الخير يا صديقي", inggris:"Good morning", contohInggris:"Good morning, my friend." },
  "selamat malam": { kategori:"Salam & Sapaan", arab:"مساء الخير", contohArab:"مساء الخير يا أستاذ", inggris:"Good evening", contohInggris:"Good evening, teacher." },
  "terima kasih": { kategori:"Salam & Sapaan", arab:"شكرا", contohArab:"شكرا جزيلا على مساعدتك", inggris:"Thank you", contohInggris:"Thank you very much for your help." },
  "maaf": { kategori:"Salam & Sapaan", arab:"آسف", contohArab:"أنا آسف على التأخير", inggris:"Sorry", contohInggris:"I am sorry for being late." },
  "sampai jumpa": { kategori:"Salam & Sapaan", arab:"إلى اللقاء", contohArab:"إلى اللقاء غدا", inggris:"See you", contohInggris:"See you tomorrow." },

  // ---- Aktivitas Harian ----
  "bangun tidur": { kategori:"Aktivitas Harian", arab:"الاستيقاظ", contohArab:"أستيقظ من النوم مبكرا", inggris:"Wake up", contohInggris:"I wake up early in the morning." },
  "mandi": { kategori:"Aktivitas Harian", arab:"الاستحمام", contohArab:"أستحم قبل الذهاب إلى المدرسة", inggris:"Take a bath", contohInggris:"I take a bath before going to school." },
  "makan": { kategori:"Aktivitas Harian", arab:"الأكل", contohArab:"نأكل الطعام معا", inggris:"Eat", contohInggris:"We eat food together." },
  "tidur": { kategori:"Aktivitas Harian", arab:"النوم", contohArab:"أذهب إلى النوم مبكرا", inggris:"Sleep", contohInggris:"I go to sleep early." },
  "belajar": { kategori:"Aktivitas Harian", arab:"الدراسة", contohArab:"أدرس دروسي كل ليلة", inggris:"Study", contohInggris:"I study my lessons every night." },
  "mencuci": { kategori:"Aktivitas Harian", arab:"الغسيل", contohArab:"أغسل ملابسي بنفسي", inggris:"Wash", contohInggris:"I wash my own clothes." },
  "piket": { kategori:"Aktivitas Harian", arab:"المناوبة", contohArab:"اليوم دوري في المناوبة", inggris:"On duty", contohInggris:"Today is my turn for duty." },

  // ---- Sekolah & Belajar ----
  "guru": { kategori:"Sekolah & Belajar", arab:"المعلم", contohArab:"الأستاذ يشرح الدرس", inggris:"Teacher", contohInggris:"The teacher explains the lesson." },
  "murid": { kategori:"Sekolah & Belajar", arab:"الطالب", contohArab:"الطالب يستمع بانتباه", inggris:"Student", contohInggris:"The student listens attentively." },
  "buku": { kategori:"Sekolah & Belajar", arab:"الكتاب", contohArab:"أقرأ الكتاب كل يوم", inggris:"Book", contohInggris:"I read the book every day." },
  "pena": { kategori:"Sekolah & Belajar", arab:"القلم", contohArab:"كتبت الواجب بالقلم", inggris:"Pen", contohInggris:"I wrote the homework with a pen." },
  "kelas": { kategori:"Sekolah & Belajar", arab:"الفصل", contohArab:"الفصل نظيف اليوم", inggris:"Classroom", contohInggris:"The classroom is clean today." },
  "pelajaran": { kategori:"Sekolah & Belajar", arab:"الدرس", contohArab:"الدرس اليوم عن الفقه", inggris:"Lesson", contohInggris:"Today's lesson is about Fiqh." },
  "ujian": { kategori:"Sekolah & Belajar", arab:"الامتحان", contohArab:"الامتحان غدا صباحا", inggris:"Exam", contohInggris:"The exam is tomorrow morning." },
  "papan tulis": { kategori:"Sekolah & Belajar", arab:"السبورة", contohArab:"كتب المعلم على السبورة", inggris:"Whiteboard", contohInggris:"The teacher wrote on the whiteboard." },

  // ---- Ibadah ----
  "sholat": { kategori:"Ibadah", arab:"الصلاة", contohArab:"نصلي خمس مرات في اليوم", inggris:"Prayer", contohInggris:"We pray five times a day." },
  "masjid": { kategori:"Ibadah", arab:"المسجد", contohArab:"نذهب إلى المسجد للصلاة", inggris:"Mosque", contohInggris:"We go to the mosque to pray." },
  "wudhu": { kategori:"Ibadah", arab:"الوضوء", contohArab:"أتوضأ قبل الصلاة", inggris:"Ablution", contohInggris:"I perform ablution before prayer." },
  "al-quran": { kategori:"Ibadah", arab:"القرآن", contohArab:"أقرأ القرآن كل صباح", inggris:"The Quran", contohInggris:"I read the Quran every morning." },
  "doa": { kategori:"Ibadah", arab:"الدعاء", contohArab:"أدعو الله بعد الصلاة", inggris:"Supplication", contohInggris:"I supplicate to God after prayer." },
  "puasa": { kategori:"Ibadah", arab:"الصيام", contohArab:"نصوم في شهر رمضان", inggris:"Fasting", contohInggris:"We fast in the month of Ramadan." },
  "dzikir": { kategori:"Ibadah", arab:"الذكر", contohArab:"نذكر الله بعد الصلاة", inggris:"Remembrance of Allah", contohInggris:"We remember Allah after prayer." },

  // ---- Keluarga ----
  "ayah": { kategori:"Keluarga", arab:"الأب", contohArab:"أبي يعمل في المدرسة", inggris:"Father", contohInggris:"My father works at the school." },
  "ibu": { kategori:"Keluarga", arab:"الأم", contohArab:"أمي تطبخ الطعام", inggris:"Mother", contohInggris:"My mother cooks the food." },
  "saudara laki-laki": { kategori:"Keluarga", arab:"الأخ", contohArab:"أخي أكبر مني", inggris:"Brother", contohInggris:"My brother is older than me." },
  "saudara perempuan": { kategori:"Keluarga", arab:"الأخت", contohArab:"أختي تدرس في الجامعة", inggris:"Sister", contohInggris:"My sister studies at university." },
  "keluarga": { kategori:"Keluarga", arab:"العائلة", contohArab:"أحب عائلتي كثيرا", inggris:"Family", contohInggris:"I love my family very much." },

  // ---- Waktu ----
  "hari ini": { kategori:"Waktu", arab:"اليوم", contohArab:"اليوم يوم جميل", inggris:"Today", contohInggris:"Today is a beautiful day." },
  "besok": { kategori:"Waktu", arab:"غدا", contohArab:"سنسافر غدا", inggris:"Tomorrow", contohInggris:"We will travel tomorrow." },
  "kemarin": { kategori:"Waktu", arab:"أمس", contohArab:"ذهبت إلى السوق أمس", inggris:"Yesterday", contohInggris:"I went to the market yesterday." },
  "pagi": { kategori:"Waktu", arab:"الصباح", contohArab:"أستيقظ في الصباح الباكر", inggris:"Morning", contohInggris:"I wake up early in the morning." },
  "malam": { kategori:"Waktu", arab:"الليل", contohArab:"أدرس في الليل", inggris:"Night", contohInggris:"I study at night." },
  "minggu": { kategori:"Waktu", arab:"الأسبوع", contohArab:"الأسبوع له سبعة أيام", inggris:"Week", contohInggris:"A week has seven days." },

  // ---- Makanan ----
  "nasi": { kategori:"Makanan", arab:"الأرز", contohArab:"نأكل الأرز كل يوم", inggris:"Rice", contohInggris:"We eat rice every day." },
  "air": { kategori:"Makanan", arab:"الماء", contohArab:"أشرب الماء كثيرا", inggris:"Water", contohInggris:"I drink a lot of water." },
  "roti": { kategori:"Makanan", arab:"الخبز", contohArab:"أحب الخبز الطازج", inggris:"Bread", contohInggris:"I love fresh bread." },
  "buah": { kategori:"Makanan", arab:"الفاكهة", contohArab:"الفاكهة مفيدة للصحة", inggris:"Fruit", contohInggris:"Fruit is good for health." },

  // ---- Perasaan ----
  "senang": { kategori:"Perasaan", arab:"سعيد", contohArab:"أنا سعيد اليوم", inggris:"Happy", contohInggris:"I am happy today." },
  "sedih": { kategori:"Perasaan", arab:"حزين", contohArab:"هو حزين لأنه مريض", inggris:"Sad", contohInggris:"He is sad because he is sick." },
  "lelah": { kategori:"Perasaan", arab:"متعب", contohArab:"أنا متعب بعد الدراسة", inggris:"Tired", contohInggris:"I am tired after studying." },
  "semangat": { kategori:"Perasaan", arab:"متحمس", contohArab:"نحن متحمسون للمسابقة", inggris:"Enthusiastic", contohInggris:"We are enthusiastic about the competition." },

  // ---- Tempat ----
  "kamar": { kategori:"Tempat", arab:"الغرفة", contohArab:"غرفتي نظيفة ومرتبة", inggris:"Room", contohInggris:"My room is clean and tidy." },
  "sekolah": { kategori:"Tempat", arab:"المدرسة", contohArab:"أذهب إلى المدرسة كل يوم", inggris:"School", contohInggris:"I go to school every day." },
  "perpustakaan": { kategori:"Tempat", arab:"المكتبة", contohArab:"أقرأ الكتب في المكتبة", inggris:"Library", contohInggris:"I read books in the library." },
  "kantin": { kategori:"Tempat", arab:"المقصف", contohArab:"نأكل في المقصف وقت الاستراحة", inggris:"Canteen", contohInggris:"We eat in the canteen during break time." },

  // ---- Angka ----
  "satu": { kategori:"Angka", arab:"واحد", contohArab:"عندي كتاب واحد", inggris:"One", contohInggris:"I have one book." },
  "dua": { kategori:"Angka", arab:"اثنان", contohArab:"عندي أخوان اثنان", inggris:"Two", contohInggris:"I have two brothers." },
  "tiga": { kategori:"Angka", arab:"ثلاثة", contohArab:"في الفصل ثلاثة معلمين", inggris:"Three", contohInggris:"There are three teachers in the class." },
  "empat": { kategori:"Angka", arab:"أربعة", contohArab:"عندي أربعة كتب", inggris:"Four", contohInggris:"I have four books." },
  "lima": { kategori:"Angka", arab:"خمسة", contohArab:"نصلي خمس مرات في اليوم", inggris:"Five", contohInggris:"We pray five times a day." },
  "enam": { kategori:"Angka", arab:"ستة", contohArab:"الساعة السادسة الآن", inggris:"Six", contohInggris:"It is six o'clock now." },
  "tujuh": { kategori:"Angka", arab:"سبعة", contohArab:"الأسبوع سبعة أيام", inggris:"Seven", contohInggris:"A week has seven days." },
  "delapan": { kategori:"Angka", arab:"ثمانية", contohArab:"استيقظت الساعة الثامنة", inggris:"Eight", contohInggris:"I woke up at eight o'clock." },
  "sembilan": { kategori:"Angka", arab:"تسعة", contohArab:"عمري تسعة عشر عاما", inggris:"Nine", contohInggris:"I am nineteen years old." },
  "sepuluh": { kategori:"Angka", arab:"عشرة", contohArab:"عندي عشرة أصدقاء", inggris:"Ten", contohInggris:"I have ten friends." },

  // ---- Warna ----
  "merah": { kategori:"Warna", arab:"أحمر", contohArab:"القميص أحمر", inggris:"Red", contohInggris:"The shirt is red." },
  "putih": { kategori:"Warna", arab:"أبيض", contohArab:"الجدار أبيض", inggris:"White", contohInggris:"The wall is white." },
  "hitam": { kategori:"Warna", arab:"أسود", contohArab:"القلم أسود", inggris:"Black", contohInggris:"The pen is black." },
  "hijau": { kategori:"Warna", arab:"أخضر", contohArab:"السبورة خضراء", inggris:"Green", contohInggris:"The board is green." },
  "kuning": { kategori:"Warna", arab:"أصفر", contohArab:"الشمس صفراء", inggris:"Yellow", contohInggris:"The sun is yellow." },
  "biru": { kategori:"Warna", arab:"أزرق", contohArab:"السماء زرقاء", inggris:"Blue", contohInggris:"The sky is blue." },

  // ---- Anggota Tubuh ----
  "kepala": { kategori:"Anggota Tubuh", arab:"الرأس", contohArab:"رأسي يؤلمني", inggris:"Head", contohInggris:"My head hurts." },
  "tangan": { kategori:"Anggota Tubuh", arab:"اليد", contohArab:"أغسل يدي قبل الأكل", inggris:"Hand", contohInggris:"I wash my hand before eating." },
  "kaki": { kategori:"Anggota Tubuh", arab:"القدم", contohArab:"قدمي متعبة", inggris:"Foot", contohInggris:"My foot is tired." },
  "mata": { kategori:"Anggota Tubuh", arab:"العين", contohArab:"عيناي جميلتان", inggris:"Eye", contohInggris:"My eyes are beautiful." },
  "telinga": { kategori:"Anggota Tubuh", arab:"الأذن", contohArab:"أستمع بأذني", inggris:"Ear", contohInggris:"I listen with my ear." },

  // ---- Cuaca ----
  "hujan": { kategori:"Cuaca", arab:"المطر", contohArab:"المطر ينزل اليوم", inggris:"Rain", contohInggris:"It is raining today." },
  "panas": { kategori:"Cuaca", arab:"حار", contohArab:"الجو حار اليوم", inggris:"Hot", contohInggris:"The weather is hot today." },
  "dingin": { kategori:"Cuaca", arab:"بارد", contohArab:"الماء بارد", inggris:"Cold", contohInggris:"The water is cold." },
  "angin": { kategori:"Cuaca", arab:"الريح", contohArab:"الريح قوية اليوم", inggris:"Wind", contohInggris:"The wind is strong today." },

  // ---- Pakaian ----
  "baju": { kategori:"Pakaian", arab:"القميص", contohArab:"قميصي جديد", inggris:"Shirt", contohInggris:"My shirt is new." },
  "sepatu": { kategori:"Pakaian", arab:"الحذاء", contohArab:"حذائي نظيف", inggris:"Shoes", contohInggris:"My shoes are clean." },
  "peci": { kategori:"Pakaian", arab:"الطاقية", contohArab:"ألبس الطاقية للصلاة", inggris:"Cap", contohInggris:"I wear the cap for prayer." },
  "sarung": { kategori:"Pakaian", arab:"الإزار", contohArab:"ألبس الإزار في الصلاة", inggris:"Sarong", contohInggris:"I wear the sarong for prayer." },

  // ---- Transportasi ----
  "mobil": { kategori:"Transportasi", arab:"السيارة", contohArab:"ذهبنا بالسيارة", inggris:"Car", contohInggris:"We went by car." },
  "sepeda": { kategori:"Transportasi", arab:"الدراجة", contohArab:"أركب الدراجة كل صباح", inggris:"Bicycle", contohInggris:"I ride the bicycle every morning." },

  // ---- Kata Kerja ----
  "menulis": { kategori:"Kata Kerja", arab:"الكتابة", contohArab:"أكتب الواجب المنزلي", inggris:"Write", contohInggris:"I write my homework." },
  "membaca": { kategori:"Kata Kerja", arab:"القراءة", contohArab:"أقرأ القرآن كل يوم", inggris:"Read", contohInggris:"I read the Quran every day." },
  "berbicara": { kategori:"Kata Kerja", arab:"الكلام", contohArab:"تكلم المعلم بصوت عال", inggris:"Speak", contohInggris:"The teacher spoke in a loud voice." },
  "mendengar": { kategori:"Kata Kerja", arab:"السمع", contohArab:"أسمع صوت الأذان", inggris:"Hear", contohInggris:"I hear the call to prayer." },
  "berjalan": { kategori:"Kata Kerja", arab:"المشي", contohArab:"نمشي إلى المسجد", inggris:"Walk", contohInggris:"We walk to the mosque." },
  "berlari": { kategori:"Kata Kerja", arab:"الجري", contohArab:"يجري الطلاب في الملعب", inggris:"Run", contohInggris:"The students run on the field." },
  "bermain": { kategori:"Kata Kerja", arab:"اللعب", contohArab:"نلعب كرة القدم بعد الدراسة", inggris:"Play", contohInggris:"We play football after school." },
  "bekerja": { kategori:"Kata Kerja", arab:"العمل", contohArab:"يعمل أبي في المدرسة", inggris:"Work", contohInggris:"My father works at the school." },

  // ---- Sifat ----
  "baik": { kategori:"Sifat", arab:"جيد", contohArab:"هذا الكتاب جيد", inggris:"Good", contohInggris:"This book is good." },
  "buruk": { kategori:"Sifat", arab:"سيء", contohArab:"الطقس سيء اليوم", inggris:"Bad", contohInggris:"The weather is bad today." },
  "besar": { kategori:"Sifat", arab:"كبير", contohArab:"البيت كبير", inggris:"Big", contohInggris:"The house is big." },
  "kecil": { kategori:"Sifat", arab:"صغير", contohArab:"القط صغير", inggris:"Small", contohInggris:"The cat is small." },
  "baru": { kategori:"Sifat", arab:"جديد", contohArab:"عندي كتاب جديد", inggris:"New", contohInggris:"I have a new book." },
  "lama": { kategori:"Sifat", arab:"قديم", contohArab:"هذا الكتاب قديم", inggris:"Old", contohInggris:"This book is old." },
  "cepat": { kategori:"Sifat", arab:"سريع", contohArab:"القطار سريع", inggris:"Fast", contohInggris:"The train is fast." },
  "lambat": { kategori:"Sifat", arab:"بطيء", contohArab:"السلحفاة بطيئة", inggris:"Slow", contohInggris:"The turtle is slow." },
  "mudah": { kategori:"Sifat", arab:"سهل", contohArab:"هذا السؤال سهل", inggris:"Easy", contohInggris:"This question is easy." },
  "sulit": { kategori:"Sifat", arab:"صعب", contohArab:"هذا الدرس صعب", inggris:"Difficult", contohInggris:"This lesson is difficult." },

  // ---- Hewan ----
  "kucing": { kategori:"Hewan", arab:"القط", contohArab:"القط ينام على الكرسي", inggris:"Cat", contohInggris:"The cat is sleeping on the chair." },
  "anjing": { kategori:"Hewan", arab:"الكلب", contohArab:"الكلب يجري في الحديقة", inggris:"Dog", contohInggris:"The dog is running in the garden." },
  "burung": { kategori:"Hewan", arab:"الطائر", contohArab:"الطائر يطير في السماء", inggris:"Bird", contohInggris:"The bird flies in the sky." },
  "ayam": { kategori:"Hewan", arab:"الدجاجة", contohArab:"نأكل لحم الدجاجة", inggris:"Chicken", contohInggris:"We eat chicken meat." },

  // ---- Akhlak & Nilai Pesantren ----
  "izin": { kategori:"Akhlak & Nilai", arab:"الإذن", contohArab:"طلبت الإذن من المعلم", inggris:"Permission", contohInggris:"I asked permission from the teacher." },
  "disiplin": { kategori:"Akhlak & Nilai", arab:"الانضباط", contohArab:"الانضباط مهم في الحياة", inggris:"Discipline", contohInggris:"Discipline is important in life." },
  "amanah": { kategori:"Akhlak & Nilai", arab:"الأمانة", contohArab:"الأمانة صفة المؤمن", inggris:"Trustworthiness", contohInggris:"Trustworthiness is a believer's trait." },
  "sabar": { kategori:"Akhlak & Nilai", arab:"الصبر", contohArab:"الصبر مفتاح الفرج", inggris:"Patience", contohInggris:"Patience is the key to relief." },
  "jujur": { kategori:"Akhlak & Nilai", arab:"صادق", contohArab:"كن صادقا دائما", inggris:"Honest", contohInggris:"Always be honest." },
  "rajin": { kategori:"Akhlak & Nilai", arab:"مجتهد", contohArab:"الطالب المجتهد ينجح", inggris:"Diligent", contohInggris:"The diligent student succeeds." },
  "malas": { kategori:"Akhlak & Nilai", arab:"كسول", contohArab:"لا تكن كسولا", inggris:"Lazy", contohInggris:"Do not be lazy." },
};

/**
 * Look up an Indonesian word (case/space-insensitive) in the local dictionary.
 * Returns the translation entry or null if not found.
 */
function findTranslation(kataIndonesia){
  const key = (kataIndonesia || "").trim().toLowerCase();
  return KOSAKATA_DICTIONARY[key] || null;
}
