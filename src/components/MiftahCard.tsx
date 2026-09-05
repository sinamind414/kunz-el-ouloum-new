// src/components/MiftahCard.tsx — Carte MIFTAH v3.1 recto/verso fidèle au HTML autonome
// Pro : styles isolés (préfixe miftah-) pour ne pas fuir, print natif, aucune logique
import React from 'react';
import { MIFTAH_VERSION } from '../data/miftahSpec';

export default function MiftahCard() {
  return (
    <div dir="rtl" lang="ar" className="miftah-root">
      <style>{`
        .miftah-root{ --gold:#c8962e; --gold-l:#fbf3e2; --gold-d:#8a6116; --teal:#0f6b6b; --teal-l:#e5f3f3; --red:#b23a3a; --red-l:#fdecec; --ink:#1f2328; --mute:#5b6470; --line:#e3e6ea; --bg:#fff; font-family:"Noto Naskh Arabic","Cairo",serif; color:var(--ink); line-height:1.75; font-size:14.5px }
        .miftah-root .latin{font-family:"Inter","Cairo",sans-serif; direction:ltr; unicode-bidi:isolate}
        .miftah-page{background:var(--bg); max-width:960px; margin:18px auto; padding:28px 34px; border-radius:14px; box-shadow:0 2px 14px rgba(0,0,0,.06)}
        .miftah-root h1{font-family:"Cairo","Noto Naskh Arabic",sans-serif; margin:0; font-size:30px; font-weight:800; color:var(--gold-d)}
        .miftah-root h2{font-family:"Cairo","Noto Naskh Arabic",sans-serif; margin:0; font-size:21px; font-weight:800; color:var(--teal); border-bottom:2px solid var(--teal); padding-bottom:6px; margin:22px 0 12px}
        .miftah-root h3{font-family:"Cairo","Noto Naskh Arabic",sans-serif; margin:0; font-size:16.5px; font-weight:800; color:var(--ink); margin:18px 0 8px; display:flex; align-items:center; gap:8px}
        .miftah-root h3 .num{display:inline-flex; align-items:center; justify-content:center; width:26px;height:26px;border-radius:50%; background:var(--gold); color:#fff; font-size:14px}
        .miftah-brand{display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; border-bottom:3px solid var(--gold); padding-bottom:14px}
        .miftah-brand .app{font-size:13px; color:var(--mute)}
        .miftah-tag{color:var(--mute); font-size:14px; margin-top:4px}
        .miftah-teacher{background:#f7f8fa; border:1px dashed #c9cfd6; border-radius:10px; padding:10px 14px; font-size:12.5px; color:var(--mute); margin:14px 0}
        .miftah-root table{width:100%; border-collapse:collapse; margin:8px 0 14px; font-size:14px}
        .miftah-root th,.miftah-root td{border:1px solid var(--line); padding:8px 10px; vertical-align:top; text-align:right}
        .miftah-root th{background:var(--teal-l); color:var(--teal); font-family:"Cairo",sans-serif; font-weight:800}
        .miftah-root td.c{text-align:center; font-weight:800; color:var(--gold-d); font-family:"Cairo",sans-serif; white-space:nowrap}
        .miftah-root td.corr{background:var(--red-l); font-size:13.3px}
        .miftah-root th.corr{background:#f6dada; color:var(--red)}
        .miftah-box{border-radius:10px; padding:12px 16px; margin:10px 0}
        .miftah-gold{background:var(--gold-l); border:1px solid #ecd9ad}
        .miftah-teal{background:var(--teal-l); border:1px solid #bcdcdc}
        .miftah-red{background:var(--red-l); border:1px solid #f0c9c9}
        .miftah-corr-note{background:var(--red-l); border-right:4px solid var(--red); padding:8px 12px; border-radius:6px; font-size:13.3px; margin:8px 0}
        .miftah-gate{background:#fbfbfc; border:1px solid var(--line); border-radius:10px; padding:14px 18px; margin:10px 0}
        .miftah-gate .q{font-family:"Cairo",sans-serif; font-weight:800; font-size:16px; color:var(--gold-d)}
        .miftah-gate .opt{margin:6px 22px 6px 0; padding:6px 10px; border-radius:8px}
        .miftah-gate .opt.a{background:var(--gold-l)} .miftah-gate .opt.b{background:var(--teal-l)}
        .miftah-path{font-family:"Inter",sans-serif; direction:ltr; unicode-bidi:isolate; background:#fff; border:1px solid var(--line); border-radius:6px; padding:1px 8px; font-weight:600; color:var(--teal); white-space:nowrap}
        .miftah-chain{display:flex; align-items:center; gap:6px; flex-wrap:wrap; justify-content:center; background:#fbfbfc; border:1px solid var(--line); border-radius:10px; padding:12px; margin:10px 0}
        .miftah-chain .node{background:#fff; border:2px solid var(--teal); border-radius:8px; padding:4px 10px; font-family:"Cairo",sans-serif; font-weight:800; color:var(--teal); font-size:13.5px}
        .miftah-chain .node.z{border-color:var(--gold); color:var(--gold-d)} .miftah-chain .node.s{border-color:var(--red); color:var(--red)}
        .miftah-chain .ar{color:var(--mute); font-size:18px}
        .miftah-sent{margin:6px 0; padding:8px 12px; background:#fff; border:1px solid var(--line); border-radius:8px; border-right:4px solid var(--gold)}
        .miftah-check{display:flex; flex-wrap:wrap; gap:8px}
        .miftah-check div{flex:1 1 200px; background:var(--gold-l); border-radius:8px; padding:8px 12px; font-size:13.5px}
        .miftah-check b{color:var(--gold-d); font-family:"Cairo",sans-serif; font-size:16px}
        .miftah-key-wrap{display:flex; align-items:center; gap:18px; flex-wrap:wrap; margin:10px 0}
        .miftah-teeth{display:flex; gap:8px; flex-wrap:wrap}
        .miftah-teeth span{background:var(--gold); color:#fff; border-radius:8px; padding:6px 12px; font-family:"Cairo",sans-serif; font-weight:800}
        .miftah-card-label{display:inline-block; background:var(--teal); color:#fff; border-radius:999px; padding:2px 14px; font-family:"Cairo",sans-serif; font-weight:800; font-size:13px; margin-bottom:6px}
        .miftah-card-label.plus{background:var(--gold-d)}
        .miftah-root footer{color:var(--mute); font-size:12px; text-align:center; margin:20px 0 6px}
        @media print{ .miftah-page{box-shadow:none; margin:0; border-radius:0; max-width:none; padding:12mm 12mm} .miftah-teacher{display:none} .miftah-break{page-break-before:always} }
      `}</style>

      {/* RECTO */}
      <div className="miftah-page">
        <div className="miftah-brand">
          <div>
            <h1>🔑 المِفْتَاح · <span className="latin">MIFTAH</span></h1>
            <div className="miftah-tag">مفتاح الكنز — منهجية الإجابة في علوم الحياة والأرض · بكالوريا</div>
            <div className="miftah-tag latin" style={{textAlign:'left', direction:'ltr'}}>4 dents · 2 portes · une réponse qui ouvre le point</div>
          </div>
          <div className="app latin" style={{textAlign:'right'}}>
            <b>كنز العلوم</b> · Kunz El Ouloum<br/>v{MIFTAH_VERSION} · fiche élève · recto = المفتاح · verso = المفتاح+
          </div>
        </div>
        <div className="miftah-teacher"><b>Note enseignant :</b> le noyau compte 10 éléments (la <b>بوابة 1</b> et le <b>وضع الحفظ</b> y sont : ce sont les points les moins chers de l&apos;exercice 1). Les cases « 📝 المصحح » décrivent la logique réelle du barème. Ne distribuer le verso (المفتاح+) qu&apos;après maîtrise du recto. Cette note n&apos;est pas imprimée.</div>
        <span className="miftah-card-label">البطاقة الأولى · للجميع، من اليوم الأول</span>
        <h2>🧬 المفتاح — 4 أسنان تفتح كل إجابة</h2>
        <div className="miftah-key-wrap">
          <svg width={230} height={80} viewBox="0 0 230 80" aria-label="مفتاح بأربعة أسنان">
            <circle cx={40} cy={40} r={28} fill="none" stroke="#c8962e" strokeWidth={8}/>
            <circle cx={40} cy={40} r={9} fill="#fff" stroke="#c8962e" strokeWidth={4}/>
            <rect x={66} y={33} width={150} height={14} rx={4} fill="#c8962e"/>
            <g fill="#c8962e"><rect x={90} y={47} width={14} height={22} rx={2}/><rect x={120} y={47} width={14} height={16} rx={2}/><rect x={150} y={47} width={14} height={24} rx={2}/><rect x={185} y={47} width={14} height={18} rx={2}/></g>
            <g fontFamily="Inter,Cairo,sans-serif" fontSize={11} fontWeight={700} fill="#fff" textAnchor="middle"><text x={97} y={63}>1</text><text x={127} y={59}>2</text><text x={157} y={64}>3</text><text x={192} y={61}>4</text></g>
          </svg>
          <div>
            <div className="miftah-teeth"><span>1 اِقْرَأْ</span><span>2 اِجْمَعْ</span><span>3 اِرْبِطْ</span><span>4 اِخْتِمْ</span></div>
            <div style={{color:'var(--mute)', marginTop:6}}>سنّ ناقصة = مفتاح لا يفتح. <span className="miftah-path">3</span> تُستعمل فقط إن سمح الفعل.</div>
          </div>
        </div>
        <h3><span className="num">أ</span> الأسنان الأربع — ماذا أفعل بالضبط</h3>
        <table>
          <thead><tr><th style={{width:36}}>#</th><th style={{width:90}}>السنّ</th><th>ماذا أفعل</th><th className="corr" style={{width:'38%'}}>📝 المصحح</th></tr></thead>
          <tbody>
            <tr><td className="c">1</td><td className="c">اِقْرَأْ</td><td>أطوّق <b>الفعل</b> · أسطّر <b>الكلمات المفتاحية</b> · أرقّم إجابتي <b>برقم السؤال</b> (1-أ، 1-ب…) لا غير.</td><td className="corr">إجابة بلا رقم أو تحت رقم خاطئ = <b>0</b> ولو كانت صحيحة. الفعل الخاطئ (وصفتَ بدل أن تفسّر) = تفقد نقطة الفعل كاملة.</td></tr>
            <tr><td className="c">2</td><td className="c">اِجْمَعْ</td><td>أستخرج من الوثيقة <b>أرقاما + وحدات + اتجاه التغيّر</b> («يرتفع من 2 إلى 8 <span className="latin">mg/L</span> بين 0 و 10 <span className="latin">min</span>»).</td><td className="corr">نقطة الاستخراج تُمنح <b>للرقم مع وحدته</b>. «يرتفع» وحدها = نصف نقطة. رقم بلا وحدة = خطأ محسوب.</td></tr>
            <tr><td className="c">3</td><td className="c">اِرْبِطْ<br/><small>إن سمح الفعل</small></td><td>أربط المعطى بالسبب/الآلية من الدرس: «لأنّ… / بسبب… / ممّا يدلّ على…».</td><td className="corr">هنا نقاط الفهم (غالبا الأثقل). ربط بلا معطى = «حفظ» → نصف النقطة. معطى بلا ربط والفعل يطلبه = نصف النقطة.</td></tr>
            <tr><td className="c">4</td><td className="c">اِخْتِمْ</td><td>جملة واحدة تجيب <b>حرفيا</b> على الكلمات التي سطّرتُها في السنّ 1.</td><td className="corr">خاتمة غائبة = نقطة الاستنتاج ضائعة. خاتمة لا تحوي كلمات السؤال = <b>لا تُقرأ</b> كإجابة.</td></tr>
          </tbody>
        </table>
        <h3><span className="num">ب</span> البوابتان — أقرّر قبل أن أكتب، لا أثناء</h3>
        <div className="miftah-gate"><div className="q">🚪 البوابة 1 — ورقة أم رأس؟</div><div>هل سطّرتُ في السنّ 1 كلمة: <b>وثيقة / شكل / جدول / منحنى / رسم</b>؟</div><div className="opt a"><b>لا → 🧠 رأس</b> : وضع الحفظ (ج) — مسار <span className="miftah-path">1 → 4</span></div><div className="opt b"><b>نعم → 📄 ورقة</b> : أمرّ إلى البوابة 2.</div><div className="opt" style={{background:'#fff', border:'1px dashed var(--line)'}}>«بالاعتماد على <b>معلوماتك</b> و<b>الوثيقة</b>» → 📄 ورقة، والسنّ 2 بعمودين في المسودة: <b>[من الوثيقة | من الدرس]</b>.</div></div>
        <div className="miftah-gate"><div className="q">🚪 البوابة 2 — صورة أم فيلم؟</div><div className="opt a"><b>📷 صورة</b> : حلّل، صِف، استخرج، قارن، حدّد — مسار <span className="miftah-path">1 → 2 → 4</span></div><div className="opt b"><b>🎬 فيلم</b> : فسّر، اشرح، علّل، بيّن كيف، استنتج — مسار <span className="miftah-path">1 → 2 → 3 → 4</span></div></div>
        <div className="miftah-corr-note"><b>📝 المصحح:</b> في «صورة»، كل جملة تفسيرية = وقت ضائع لا يُنقَّط. في «فيلم»، وصف بلا سبب = نصف النقاط على أحسن تقدير.</div>
        <h3><span className="num">ج</span> وضع الحفظ — 🧠 رأس</h3>
        <table><thead><tr><th style={{width:120}}>الفعل</th><th>القالب</th><th className="corr" style={{width:'38%'}}>📝 المصحح</th></tr></thead><tbody><tr><td className="c">عرّف</td><td><b>[العنصر]</b> = الانتماء (ما هو؟) + الخاصية المميزة + الدور إن وُجد · كلمة علمية واحدة على الأقل.</td><td className="corr">الانتماء وحده = 0,25 · مع الخاصية = 0,5 · التعريف الكامل = النقطة.</td></tr><tr><td className="c">اذكر / عدّد / سمّ</td><td><b>قائمة مرقّمة</b>، عنصر في كل سطر، <b>بلا جُمَل</b>. العدد المطلوب في السؤال = فحصي الأخير («اذكر ثلاث…» = 3 أسطر لا أكثر).</td><td className="corr">كل عنصر صحيح = جزء النقطة. عنصر زائد خاطئ <b>قد يُخصم</b>. الفقرة بدل القائمة = يبحث المصحح عن العناصر… وقد لا يجدها.</td></tr></tbody></table>
        <div className="miftah-box miftah-gold"><b>مثال:</b> الإنزيم هو <b>بروتين حفّاز حيوي</b> (الانتماء)، <b>يسرّع تفاعلا نوعيا دون أن يُستهلك</b> (الخاصية)، <b>بفضل موقع فعّال</b> يمنحه تخصصا تجاه مادة التفاعل (الدور). — لا خاتمة هنا.</div>
        <h3><span className="num">د</span> الجمل الثلاث الجاهزة</h3>
        <div className="miftah-sent"><b>للاستخراج:</b> «نلاحظ من الوثيقة … أنّ [العنصر] [يرتفع / ينخفض / يبقى ثابتا] من … إلى … [الوحدة] عند / بين …»</div>
        <div className="miftah-sent"><b>للربط:</b> «ويُفسَّر ذلك بأنّ … [الآلية من الدرس] … ممّا يدلّ على …»</div>
        <div className="miftah-sent"><b>للخاتمة:</b> «ومنه نستنتج أنّ [كلمات السؤال المسطّرة] …»</div>
        <h3><span className="num">هـ</span> الفحص الرباعي المعكوس — 10 ثوانٍ قبل السؤال التالي</h3>
        <div className="miftah-check"><div><b>4</b> ← هل تحوي خاتمتي كلمات السؤال؟</div><div><b>3</b> ← هل كل «لأنّ» مسبوقة بمعطى؟</div><div><b>2</b> ← هل كل رقم معه وحدته؟</div><div><b>1</b> ← هل الفعل الذي طوّقتُه هو الذي نفّذتُه؟</div></div>
        <footer>كنز العلوم · MIFTAH v{MIFTAH_VERSION} · الوجه الأول — المفتاح (10 عناصر) · يكفي وحده للأغلبية</footer>
      </div>
      {/* VERSO */}
      <div className="miftah-page miftah-break">
        <div className="miftah-brand"><div><h1>🔑 المِفْتَاح<span style={{color:'var(--gold)'}}>+</span> · <span className="latin">MIFTAH+</span></h1><div className="miftah-tag">نفس المفتاح، أسنان إضافية — لمن أتقن الوجه الأول</div></div><div className="app latin" style={{textAlign:'right'}}><b>كنز العلوم</b> · Kunz El Ouloum<br/>v{MIFTAH_VERSION} · verso</div></div>
        <span className="miftah-card-label plus">البطاقة الثانية · عند الحاجة فقط</span>
        <h2>🧫🧱 المفتاح+ — الأسنان الإضافية</h2>
        <h3><span className="num">و</span> السنّ 0 — اِفهم (مرة واحدة لكل تمرين)</h3>
        <div className="miftah-box miftah-teal">بعد قراءة <b>سياق التمرين</b> مباشرة، أكتب في أعلى المسودة: <b>«الهدف العام: ……»</b> (≤ 5 كلمات).<br/>مثال: «بغرض معرفة آلية عمل الأنسولين…» ← «<b>الهدف العام: آلية عمل الأنسولين</b>».</div>
        <div className="miftah-corr-note"><b>📝 المصحح:</b> التركيب النهائي (أثقل نقطة في التمرين 3) يُنقَّط على <b>إجابته لهذا السطر بالذات</b>، لا على كمّ ما كُتب.</div>
        <h3><span className="num">ز</span> البنية المتسلسلة + قالب التركيب</h3>
        <div className="miftah-chain"><div className="node z">اِفهم 0</div><span className="ar">←</span><div className="node">جزء I · 1 2 3 4</div><span className="ar">←</span><div className="node">جزء II · 1 2 3 4</div><span className="ar">←</span><div className="node">جزء III · 1 2 3 4</div><span className="ar">←</span><div className="node s">التركيب = يُجيب «اِفهم»</div></div>
        <div className="miftah-sent"><b>قالب التركيب (جملة واحدة مركّبة):</b> «من الجزء I نعلم أنّ … ، ومن الجزء II أنّ … ، ومن الجزء III أنّ … ؛ <b>ومنه</b> [الإجابة على سطر «الهدف العام»].»</div>
        <div className="miftah-corr-note"><b>📝 المصحح:</b> تركيب يعيد النتائج بلا «ومنه» = نصف النقطة. تركيب يُدخل معلومة من الدرس لم تظهر في الأجزاء = لا يُحتسب.</div>
        <h3><span className="num">ح</span> صيغتان خاصتان</h3>
        <table><thead><tr><th style={{width:120}}>الصيغة</th><th>الأسنان</th><th className="corr" style={{width:'36%'}}>📝 المصحح</th></tr></thead><tbody><tr><td className="c">الحساب<br/><small>احسب…</small></td><td><b>2</b> = القانون بالحروف (<span className="latin">Chargaff : %A = %T</span>…) · <b>3</b> = التعويض خطوة خطوة · <b>4</b> = النتيجة <b>بوحدتها</b>.</td><td className="corr">القانون بالحروف = نقطة مستقلة <b>حتى لو أخطأتَ في الحساب</b>. نتيجة صحيحة بلا خطوات = نصف النقطة. بلا وحدة = خصم.</td></tr><tr><td className="c">شجرة النسب<br/><small>حدّد نمط الوراثة</small></td><td><b>2</b> = <b>حدثان حاسمان</b>: ① أبوان سليمان ← طفل مصاب (يحسم <b>السيادة</b>) ② بنت مصابة من أب سليم / ابن سليم من أم مصابة (يحسم <b>الموقع</b>) · <b>3</b> = لماذا كل حدث يستبعد الفرضية المقابلة · <b>4</b> = <b>الحكمان</b> (متنحٍّ/سائد + جسمي/مرتبط بـ <span className="latin">X</span>) <b>ثم</b> الأنماط الوراثية بالترميز.</td><td className="corr">نمط بلا الحكم الثاني = <b>نصف النقطة دائما</b>. إن لم يوجد حدث حاسم للموقع: «على الأرجح جسمي لأنّ …» + مبرر = النقطة كاملة. أنماط وراثية بلا حكم مبرَّر = لا تُنقَّط.</td></tr></tbody></table>
        <h3><span className="num">ط</span> فحص الخاتمة — عامّ أم خاصّ؟</h3>
        <div className="miftah-box miftah-gold"><b>السؤال الوحيد:</b> هل جملتي صحيحة لو غيّرنا اسم الجزيئة / الكائن؟<br/>نعم → <b>عام</b> («الإنزيم نوعي تجاه مادة التفاعل») · لا → <b>خاص</b> («الغليكوكيناز نوعي تجاه الغلوكوز»).<br/><b>القاعدة:</b> إن طُلب الهدف العام → العام أولا، الخاص بين قوسين. إن طُلبت الوثيقة بعينها → العكس.</div>
        <div className="miftah-corr-note"><b>📝 المصحح:</b> خاص مكان عام = «لم يعمّم» = نصف النقطة. عام مكان خاص = «لم يستعمل الوثيقة» = نصف النقطة.</div>
        <h3><span className="num">ي</span> جملة النجاة</h3>
        <ul><li>بدأتُ <b>أصف</b> والفعل يطلب <b>التفسير</b> → أُكمل فورا بـ <b>«وتفسير ذلك أنّ ……»</b> ثم الآلية. لا شطب.</li><li>بدأتُ <b>أفسّر</b> والفعل يطلب <b>الوصف فقط</b> → لا حيلة سوى الشطب. لهذا تُفحص البوابة <b>قبل</b> الكتابة.</li></ul>
        <div className="miftah-corr-note"><b>📝 المصحح:</b> الزيادة الصحيحة لا تُخصم في الغالب، لكنها تسرق الوقت من سؤال آخر مُنقَّط.</div>
        <h3><span className="num">ك</span> شحذ المفتاح — تدريب 60 ثانية</h3>
        <div className="miftah-box miftah-teal">تمرّ أمامي <b>12 تعليمة قصيرة كاملة</b> (لا أفعال معزولة)، لكل واحدة ثانيتان: <b>ورقة / رأس</b> ثم <b>صورة / فيلم</b>.<br/>أمثلة: «اذكر من الوثيقة 2 العناصر…» (ورقة/صورة) · «اذكر مراحل…» (رأس) · «فسّر بالاعتماد على معلوماتك والشكل 3…» (ورقة بعمودين/فيلم) · «عرّف…» (رأس).<br/><b>الهدف: 12/12 ثلاث مرات متتالية</b> قبل أي تحرير كامل. في التطبيق: يُفتح المفتاح+ تلقائيا بعد هذا الشرط.</div>
        <h3><span className="num">📊</span> ما أحمله حسب مستواي</h3>
        <table className="lvl"><thead><tr><th>الملف</th><th>البطاقة</th><th style={{width:110}}>العناصر</th></tr></thead><tbody><tr><td>متعثّر</td><td>المفتاح كاملا (أ → هـ)</td><td className="c">10</td></tr><tr><td>متوسط</td><td>المفتاح + و، ز، ط</td><td className="c">≈ 13</td></tr><tr><td>يستهدف الامتياز</td><td>المفتاح+ كاملا — لكن لا شيء يُستدعى في آن واحد</td><td className="c">≈ 17</td></tr></tbody></table>
        <h3><span className="num">📝</span> خمسة أخطاء تكلّف أكثر من الجهل — خلاصة مصحح</h3>
        <div className="miftah-box miftah-red"><ol style={{margin:0, paddingRight:22}}><li><b>إجابة بلا رقم سؤال</b> — أكثر النقاط ضياعا عبثا.</li><li><b>رقم بلا وحدة</b> — يُعدّ خطأ لا نسيانا.</li><li><b>خاتمة غائبة</b> — الاستنتاج له نقطته المستقلة في كل سؤال «فيلم».</li><li><b>شجرة نسب بحكم واحد</b> — نصف النقطة مضمون الضياع.</li><li><b>تركيب يعيد الأجزاء دون «ومنه»</b> — الجملة الأغلى في الورقة، تُكتب في 30 ثانية.</li></ol></div>
        <footer>كنز العلوم · MIFTAH+ v{MIFTAH_VERSION} · الوجه الثاني — لا يحتاجه أحد في اليوم الأول · <span className="latin">4 dents · 2 portes · une réponse qui ouvre le point</span></footer>
      </div>
    </div>
  );
}
