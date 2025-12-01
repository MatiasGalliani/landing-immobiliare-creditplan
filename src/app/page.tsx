'use client';

import { useState, memo, useCallback, useMemo, lazy, Suspense, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import { StructuredData } from "@/components/StructuredData";

// Lazy load heavy sections below the fold for faster initial load
const FormSection = dynamic(() => import('@/components/FormSection').then(mod => ({ default: mod.FormSection })), {
  loading: () => <div className="h-[600px] animate-pulse bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl" />
});

// Extract static data outside component to prevent recreation
const FAQ_ITEMS = [
  {
    question: "Chi può candidarsi per collaborare con Creditplan?",
    answer: "Cerchiamo in primo luogo agenti immobiliari e professionisti che lavorano già a contatto con chi compra o vende casa (titolari d'agenzia, collaboratori, procacciatori, consulenti). Valutiamo anche profili affini del mondo finanziario/assicurativo, purché ci sia mentalità commerciale, organizzazione e serietà professionale."
  },
  {
    question: "Devo lasciare la mia agenzia o il mio lavoro attuale?",
    answer: "No. La collaborazione con Creditplan è pensata come linea di business aggiuntiva, perfettamente compatibile con la tua attività di agente immobiliare. Continui a fare il tuo lavoro, ma in più puoi offrire mutui, finanziamenti, cessioni del quinto e altri prodotti di credito ai clienti che già segui."
  },
  {
    question: "Il cliente resta \"mio\" o passa a voi?",
    answer: "Il cliente resta sempre tuo. Tu sei il riferimento principale per chi compra o vende l'immobile. Noi mettiamo a disposizione backoffice, convenzioni bancarie e competenze sul credito, ma non entriamo in concorrenza sull'aspetto immobiliare. L'obiettivo è farti fare più servizio e più provvigioni, non toglierti clienti."
  },
  {
    question: "Serve avere la Partita IVA?",
    answer: "Sì, la collaborazione è pensata per professionisti con Partita IVA (tipicamente agenti immobiliari o consulenti già strutturati). Se non ce l'hai ancora ma intendi aprirla, lo valuteremo insieme in fase di call per capire tempistiche e fattibilità reale."
  },
  {
    question: "Che tipo di formazione è prevista? Quanto dura?",
    answer: "È necessario seguire un percorso formativo riconosciuto (circa 12 ore di video-lezioni) erogato da una società esterna. Puoi scegliere l'ente formatore o seguire uno dei percorsi da noi consigliati. Al termine riceverai l'attestato necessario per accedere alla prova OAM."
  },
  {
    question: "In cosa consiste la prova valutativa OAM?",
    answer: "La prova OAM si svolge online e consiste in 20 domande a risposta multipla. Devi rispondere correttamente ad almeno 12 domande su 20 per superarla. Superato l'esame, sarai accreditato con Creditplan e potrai iniziare a collaborare con il nostro supporto."
  },
  {
    question: "Quanto posso guadagnare con questa collaborazione?",
    answer: "Provvigioni variabili legate alle operazioni concluse (mutui, finanziamenti, prestiti, cessioni del quinto). Più clienti porti e più operazioni vanno a buon fine, più cresce il tuo reddito aggiuntivo. Durante la call ti spiegheremo la struttura provvigionale e faremo simulazioni concrete."
  },
  {
    question: "Ci sono costi di ingresso, fee o pagamenti nascosti?",
    answer: "Non applichiamo fee di ingresso o canoni di affiliazione per la collaborazione con Creditplan. Gli unici costi da considerare sono quelli legati al percorso formativo esterno e alla prova OAM, gestiti dagli enti preposti. Ci aspettiamo però serietà, continuità minima e rispetto delle procedure."
  },
  {
    question: "In quanto tempo posso essere operativo dopo la candidatura?",
    answer: "Il percorso prevede: candidatura, call conoscitiva, corso di formazione (12h), prova OAM e accredito. I tempi dipendono dalla velocità con cui completi corso e prova, ma in genere in poche settimane puoi essere operativo."
  }
] as const;

const STAR_RATINGS = [1, 2, 3, 4, 5] as const;

const GOOGLE_REVIEWS = [
  {
    author: "Fede",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Dei professionisti nel settore. Mi sono affidato a loro per l'acquisto di due case, affidabili, seri e professionali. Anche nel caso di pratiche un po complicate sono sempre stati in grado di trovare soluzioni adeguate….spero non ci sarà il bisogno di una terza, ma nel caso tornerò sicuramente. Consigliatissimi."
  },
  {
    author: "Luca Stucchi",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Ottima professionalità!"
  },
  {
    author: "Stefania Salmoiraghi",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Cordiali e attenti alle esigenze del cliente. Molto disponibili e preparati."
  },
  {
    author: "Federico Mantovani",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Servizio impeccabile, affrontano ogni situazione con serenità. Senza il loro intervento non sarei mai riuscito ad arrivare al rogito del nuovo appartamento."
  },
  {
    author: "Fabiana Pinardi",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Dopo diverse porte in faccia e svariate ricerche su internet, ci siamo imbattuti in Creditplan.... E come si suol dire, mai scelta fu più azzeccata!!! Avevamo bisogno di una rinegoziazione mutuo più consolidamento debiti, e dove tutti ci avevano detto che era praticamente impossibile, lo staff di Creditplan ha risolto tutti i nostri problemi. NICHOLAS, ci ha seguito in modo impeccabile!!!! Cordiale, disponibile, preparato, sempre attento ad ascoltare ogni nostra esigenza e... anche quando si è presentato qualche piccolo ostacolo, la sua bravura e professionalità ci hanno portato a raggiungere il traguardo prestabilito. Consigliatissimo a chiunque abbia bisogno di un supporto nell'apertura di un mutuo, di una surroga o quant'altro. Grazie di cuore a Nicholas e a Creditplan per il prezioso aiuto!"
  },
  {
    author: "Filippo Malusardi",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Azienda ottima e professionale, specificatamente nella persona Andrea Daví , molto cortese e sempre disponibile , con conseguente raggiungimento dell'obbiettivo preposto . Grazie di tutto"
  },
  {
    author: "Anna Gatti",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Andrea Davì ci ha seguito per l'acquisto della nostra prima casa: senza di lui probabilmente non ce l'avremmo fatta. Disponibile, gentile, preparato, preciso e simpatico: è stata una delle scelte migliori che abbiamo fatto! Grazie ancora"
  },
  {
    author: "Maria Grazia Piva",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Andrea Davì ci ha seguite in un'operazione di richiesta mutuo per l'acquisto della nostra prima casa, con pazienza precisione ed estrema affidabilità. Mi era stato consigliato da amici e raccomanderei vivamente il suo supporto perché è una persona tanto competente quanto meritevole di fiducia."
  },
  {
    author: "Silvia M.",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Professionali e molto disponibili mi hanno aiutato a gestire le pratiche relative all'acquisto della prima casa e del mutuo dissipando ogni mio eventuale dubbio. Marco Albertin in particolare mi ha seguito con molta cura e disponibilità, non solo dal punto di vista professionale ma anche umano. Non esiterei a consigliare la loro consulenza!"
  }
] as const;

const BENEFITS_DATA = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "blue",
    title: "Erogazione rapida",
    description: "In soli 48 ore operative",
    detailedContent: "Con Creditplan, ricevi il tuo finanziamento in soli 48 ore operative dopo l'approvazione. Il nostro processo ottimizzato e le convenzioni con i principali istituti bancari garantiscono tempi di erogazione tra i più rapidi del mercato."
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "green",
    title: "100% sicuro",
    description: "Certificato e garantito",
    detailedContent: "I prodotti finanziari che offrirai sono completamente sicuri e garantiti. Le convenzioni bancarie e il supporto del nostro backoffice garantiscono massima sicurezza sia per te che per i tuoi clienti. Siamo iscritti al registro OAM M30 e operiamo in totale trasparenza."
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "indigo",
    title: "Tasso fisso",
    description: "Rata fissa e importo costante",
    detailedContent: "I prodotti finanziari che potrai offrire includono mutui e finanziamenti con tassi competitivi. Il nostro backoffice ti supporta nella scelta del prodotto migliore per ogni cliente, garantendo trasparenza e chiarezza in ogni fase del processo."
  }
] as const;

const WHY_CHOOSE_BENEFITS_DATA = [
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "blue",
    title: "Più provvigioni dagli stessi clienti",
    description: "Aggiungi mutui e finanziamenti alle trattative che fai già.",
    detailedContent: "Da agente immobiliare oggi porti a casa la provvigione sulla compravendita.\n\nCon Creditplan puoi affiancare mutui e finanziamenti ai clienti che già segui, senza cambiare lavoro e senza stravolgere la tua agenda.",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-500/5",
    textColor: "text-blue-600"
  },
  {
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    color: "green",
    title: "Servizio completo: casa + mutuo",
    description: "Diventi il punto unico di riferimento per il cliente.",
    detailedContent: "Dal 2022 la compatibilità è totale: agente immobiliare + consulente del credito = pacchetto completo.\n\nAcquirente e venditore non vogliono rimbalzare tra agenzia, banca, call center e preventivatori online.\n\nCon Creditplan affianchi alla tua attività la consulenza sul credito.",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
    borderColor: "border-emerald-200",
    bgColor: "bg-emerald-500/5",
    textColor: "text-emerald-600"
  },
  {
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "indigo",
    title: "Partnership testata, crescita concreta",
    description: "Collaborazioni attive con agenti dal 2022.",
    detailedContent: "Non stiamo \"sperimentando\" adesso: collaboriamo con agenti immobiliari da anni e sappiamo cosa funziona sul campo.\n\nAbbiamo costruito un modello semplice: formazione operativa, affiancamento sulle prime pratiche, regole chiare sulle provvigioni e supporto continuo.",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-indigo-600",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-500/5",
    textColor: "text-indigo-600"
  },
  {
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    color: "amber",
    title: "Backoffice e convenzioni al tuo servizio",
    description: "Tu segui il cliente, noi ti supportiamo su mutui e finanziamenti.",
    detailedContent: "Il cliente resta sempre tuo: sei tu il suo punto di riferimento.\n\nCon Creditplan hai alle spalle un backoffice dedicato e tutte le principali convenzioni per:\n\n• mutui casa\n• finanziamenti aziendali\n• prestiti personali e cessioni del quinto\n• coperture assicurative collegate",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-500/5",
    textColor: "text-amber-600"
  }
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "1. Compila il form",
    description: "Inserisci i tuoi dati e poche informazioni sulla tua attività.",
    detailedContent: "Inserisci i tuoi dati e poche informazioni sulla tua attività. Nessun impegno: è solo una richiesta di contatto."
  },
  {
    step: 2,
    title: "2. Fai una call conoscitiva",
    description: "Un nostro responsabile ti contatterà per capire come lavori e spiegarti il modello.",
    detailedContent: "Un nostro responsabile ti contatterà per una video call o telefonata, per capire come lavori e spiegarti modello, prodotti e provvigioni."
  },
  {
    step: 3,
    title: "3. Formazione e accredito",
    description: "Completi la formazione e la prova OAM, poi inizi a collaborare.",
    detailedContent: "Partecipi a un percorso di formazione di 12 ore, superi una prova finale di 20 domande (minimo 12 risposte corrette) e, una volta accreditato con Creditplan, puoi iniziare a seguire le prime pratiche di credito con il nostro supporto."
  }
] as const;

// Memoized Benefit Card Component
const BenefitCard = memo(({ icon, color, title, description, onClick }: {
  icon: string;
  color: string;
  title: string;
  description: string;
  onClick: () => void;
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-200",
    green: "bg-green-100 text-green-600 border-green-200 hover:border-green-200",
    indigo: "bg-indigo-100 text-indigo-600 border-indigo-200 hover:border-indigo-200",
    amber: "bg-amber-100 text-amber-600 border-amber-200 hover:border-amber-200"
  };

  const bgClass = color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'indigo' ? 'bg-indigo-100' : 'bg-amber-100';
  const textClass = color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'indigo' ? 'text-indigo-600' : 'text-amber-600';

  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md cursor-pointer text-left w-full"
    >
      <div className={`flex-shrink-0 w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center`}>
        <svg className={`w-5 h-5 ${textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </button>
  );
});

BenefitCard.displayName = 'BenefitCard';

// Memoized FAQ Item Component
const FAQItem = memo(({ 
  faq, 
  index, 
  isOpen, 
  onToggle 
}: { 
  faq: typeof FAQ_ITEMS[number]; 
  index: number; 
  isOpen: boolean; 
  onToggle: () => void;
}) => (
  <div className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
    isOpen 
      ? 'border-blue-200 shadow-lg shadow-blue-100/50' 
      : 'border-slate-200 shadow-sm hover:border-blue-100 hover:shadow-md'
  }`} itemScope itemType="https://schema.org/Question">
    {/* Gradient accent line - only visible when open */}
    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}></div>
    
    <button
      onClick={onToggle}
      className="w-full px-6 lg:px-8 py-6 text-left flex items-start justify-between gap-4 group"
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Question number badge */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' 
            : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
        }`}>
          {index + 1}
        </div>
        
        <h3 className={`text-base lg:text-lg font-bold transition-colors duration-300 ${
          isOpen 
            ? 'text-blue-600' 
            : 'text-slate-900 group-hover:text-blue-600'
        }`} itemProp="name">
          {faq.question}
        </h3>
      </div>
      
      {/* Arrow icon */}
      <div className="flex-shrink-0 mt-1">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-blue-50 rotate-180' 
            : 'bg-slate-50 group-hover:bg-blue-50'
        }`}>
          <svg
            className={`w-5 h-5 transition-colors duration-300 ${
              isOpen ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </button>
    
    {/* Answer section */}
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="px-6 lg:px-8 pb-6">
        <div className="pl-12 pr-4">
          <div className="pt-2 border-t border-slate-100" itemScope itemType="https://schema.org/Answer">
            <p className="text-slate-600 leading-relaxed pt-4 text-[15px] lg:text-base" itemProp="text">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

FAQItem.displayName = 'FAQItem';

// Benefit Modal Component
const BenefitModal = memo(({ 
  isOpen, 
  onClose, 
  benefit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  benefit: typeof BENEFITS_DATA[number] | null;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !benefit) return null;

  const bgClass = benefit.color === 'blue' ? 'bg-blue-100' : benefit.color === 'green' ? 'bg-green-100' : benefit.color === 'indigo' ? 'bg-indigo-100' : 'bg-amber-100';
  const textClass = benefit.color === 'blue' ? 'text-blue-600' : benefit.color === 'green' ? 'text-green-600' : benefit.color === 'indigo' ? 'text-indigo-600' : 'text-amber-600';
  const borderClass = benefit.color === 'blue' ? 'border-blue-200' : benefit.color === 'green' ? 'border-green-200' : benefit.color === 'indigo' ? 'border-indigo-200' : 'border-amber-200';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-4 sm:p-6 lg:p-8 border-2 ${borderClass}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${bgClass} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
            <svg className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">{benefit.title}</h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">{benefit.detailedContent}</p>
        </div>
      </div>
    </div>
  );
});

BenefitModal.displayName = 'BenefitModal';

// Why Choose Benefit Modal Component
const WhyChooseModal = memo(({ 
  isOpen, 
  onClose, 
  benefit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  benefit: typeof WHY_CHOOSE_BENEFITS_DATA[number] | null;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !benefit) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-4 sm:p-6 lg:p-8 border-2 ${benefit.borderColor}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${benefit.gradientFrom} ${benefit.gradientTo} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}>
            <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">{benefit.title}</h2>
          <div className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed text-left w-full whitespace-pre-line">
            {benefit.detailedContent}
          </div>
        </div>
      </div>
    </div>
  );
});

WhyChooseModal.displayName = 'WhyChooseModal';

// Google Reviews Modal Component
const ReviewsModal = memo(({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 lg:p-8 border-2 border-blue-200 my-4 sm:my-8"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors z-10"
          aria-label="Chiudi"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" viewBox="0 0 48 48" fill="none">
              <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
            <div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900">ECCELLENTE</h2>
              <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {STAR_RATINGS.map((i) => (
                    <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">4.9/5</span>
                <span className="text-xs sm:text-sm text-slate-600">• 98 recensioni su Google</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
          {GOOGLE_REVIEWS.map((review, index) => (
            <div key={index} className="bg-slate-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-0.5 sm:mb-1">{review.author}</h3>
                  <p className="text-xs text-slate-500">{review.timeAgo}</p>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ReviewsModal.displayName = 'ReviewsModal';

// How It Works Step Modal Component
const HowItWorksModal = memo(({ 
  isOpen, 
  onClose, 
  step 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  step: typeof HOW_IT_WORKS_STEPS[number] | null;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !step) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-4 sm:p-6 lg:p-8 border-2 border-blue-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
            <span className="text-2xl sm:text-3xl font-bold text-white">{step.step}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">{step.title}</h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed whitespace-pre-line">{step.detailedContent}</p>
        </div>
      </div>
    </div>
  );
});

HowItWorksModal.displayName = 'HowItWorksModal';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [openBenefitIndex, setOpenBenefitIndex] = useState<number | null>(null);
  const [openWhyChooseIndex, setOpenWhyChooseIndex] = useState<number | null>(null);
  const [openReviewsModal, setOpenReviewsModal] = useState(false);
  const [openHowItWorksIndex, setOpenHowItWorksIndex] = useState<number | null>(null);

  // Memoize scroll handler
  const scrollToForm = useCallback(() => {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback: try to find the form
      const formElement = document.querySelector('form');
      formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Memoize FAQ toggle handlers
  const handleFaqToggle = useCallback((index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  }, []);

  // Memoize benefit modal handlers
  const handleBenefitClick = useCallback((index: number) => {
    setOpenBenefitIndex(index);
  }, []);

  const handleCloseBenefitModal = useCallback(() => {
    setOpenBenefitIndex(null);
  }, []);

  // Memoize Why Choose modal handlers
  const handleWhyChooseClick = useCallback((index: number) => {
    setOpenWhyChooseIndex(index);
  }, []);

  const handleCloseWhyChooseModal = useCallback(() => {
    setOpenWhyChooseIndex(null);
  }, []);

  // Memoize reviews modal handlers
  const handleOpenReviewsModal = useCallback(() => {
    setOpenReviewsModal(true);
  }, []);

  const handleCloseReviewsModal = useCallback(() => {
    setOpenReviewsModal(false);
  }, []);

  // Memoize How It Works modal handlers
  const handleHowItWorksClick = useCallback((index: number) => {
    setOpenHowItWorksIndex(index);
  }, []);

  const handleCloseHowItWorksModal = useCallback(() => {
    setOpenHowItWorksIndex(null);
  }, []);

  const selectedBenefit = openBenefitIndex !== null ? BENEFITS_DATA[openBenefitIndex] : null;
  const selectedWhyChooseBenefit = openWhyChooseIndex !== null ? WHY_CHOOSE_BENEFITS_DATA[openWhyChooseIndex] : null;
  const selectedStep = openHowItWorksIndex !== null ? HOW_IT_WORKS_STEPS[openHowItWorksIndex] : null;

  return (
    <main className="min-h-screen relative overflow-x-hidden" itemScope itemType="https://schema.org/WebPage">
      <StructuredData />

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-4 lg:py-6" role="banner">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col md:block">
              <Image
                src="https://creditplan.it/wp-content/uploads/2023/02/LOGO-CREDITPLAN.png"
                alt="Creditplan - Logo aziendale servizi di mediazione creditizia per agenti immobiliari"
                width={280}
                height={96}
                quality={60}
                priority
                sizes="(max-width: 768px) 200px, 280px"
                className="w-auto h-8 lg:h-10 mt-4 lg:mt-0"
                itemProp="logo"
              />
            </div>
          
            <div className="flex items-center gap-4">
            {/* OAM Badge */}
            <a 
              href="https://www.organismo-am.it/b/0/06197620963/F311BEF5-24B7-4A32-AB79-567598386DBC/g.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex flex-col gap-1 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 leading-tight">Iscritti al registro</span>
                  <span className="text-sm font-bold text-slate-900 leading-tight">OAM M30</span>
                </div>
                <Image
                  src="https://www.organismo-am.it/b/0/c3f18c274847902265f07537ce366a8eJO5NMdSW1LRcd_pl_8_eq_/1.png"
                  alt="Creditplan iscritto al registro OAM M30 - Organismo Agenti e Mediatori - Verifica autorizzazione"
                  width={44}
                  height={44}
                  quality={60}
                  loading="lazy"
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-blue-600 font-medium">
                <span>Verifica in tempo reale</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-8 lg:pt-12 pb-20" itemScope itemType="https://schema.org/FinancialProduct">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left: Content */}
            <article className="space-y-8">
              
              {/* Main Headline */}
              <header className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-semibold lg:font-bold leading-[1.05] tracking-tight" itemProp="name">
                  <span className="block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                    Sei un agente immobiliare?{' '}
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent font-extrabold">
                        Diventa consulente del credito
                      </span>
                      <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-600/20 blur-xl -z-10 rounded-lg"></span>
                    </span>
                  </span>
                  <span className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                    con Creditplan
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 font-light max-w-xl leading-relaxed" itemProp="description">
                  Aggiungi mutui e finanziamenti ai tuoi servizi. Ti affidi al nostro backoffice, segui il cliente e incassi provvigioni aggiuntive.
                </p>
              </header>
            </article>

            {/* Right: Form Card + Social Proof */}
            <div className="space-y-6">
              {/* Text before form */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm">
                <p className="text-sm font-semibold text-slate-900 mb-4">Compila il form se:</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Sei un agente immobiliare o lavori nel real estate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Vuoi aggiungere una linea di business legata a mutui e finanziamenti</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Vuoi un confronto senza impegno su provvigioni, modalità di collaborazione e supporto operativo</span>
                  </li>
                </ul>
              </div>
              
              <FormSection />
              
              {/* WhatsApp Contact */}
              <a 
                href="https://wa.me/393806913625?text=Ciao%20Rosemary,%20sono%20interessato%20a%20diventare%20consulente%20del%20credito%20con%20Creditplan.%20Vorrei%20ricevere%20maggiori%20informazioni%20sulla%20collaborazione."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366"/>
                    </svg>
                  </div>
                  <p className="text-sm text-slate-700 flex-1">
                    <span className="font-semibold text-slate-900">Preferisci un contatto veloce?</span> Scrivi subito su WhatsApp a Rosemary: <span className="text-blue-600 font-semibold">380 691 3625</span>
                  </p>
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </a>
              
              {/* Reassurance Text */}
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                <p className="text-sm text-slate-700 text-center">
                  <span className="font-semibold text-slate-900">Nessun vincolo e nessun costo:</span> ti contatteremo solo per spiegarti come funziona la collaborazione e valutare se può fare al caso tuo
                </p>
              </div>
              
              {/* Google Reviews Social Proof - Debajo del formulario */}
              <button
                onClick={handleOpenReviewsModal}
                className="inline-flex items-center gap-4 bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer text-left w-full"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                  </svg>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {STAR_RATINGS.map((i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-tight">
                      <span className="font-bold text-slate-900">4.9/5</span> su Google
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Oltre 2.000 recensioni verificate
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Creditplan Section */}
      <section className="relative z-10 px-6 lg:px-12 py-10 lg:py-20" aria-labelledby="why-creditplan-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-10 lg:mb-16">
            <h2 id="why-creditplan-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Perché collaborare con Creditplan?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Siamo al fianco degli agenti immobiliari dal 2022. Ora è il momento di offrire TUTTI i servizi ai tuoi clienti.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {WHY_CHOOSE_BENEFITS_DATA.map((benefit, idx) => (
              <button
                key={idx}
                onClick={() => handleWhyChooseClick(idx)}
                className={`group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 ${
                  benefit.color === 'blue' ? 'hover:border-blue-200' : 
                  benefit.color === 'green' ? 'hover:border-emerald-200' : 
                  'hover:border-amber-200'
                } text-left w-full cursor-pointer`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradientFrom} ${benefit.gradientTo} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {benefit.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-white/50" aria-labelledby="how-it-works-heading" itemScope itemType="https://schema.org/HowTo">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="how-it-works-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4" itemProp="name">
              Come funziona la collaborazione
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" itemProp="description">
              Un percorso semplice: in 3 passaggi puoi affiancare il credito alla tua attività di agente immobiliare.
            </p>
          </header>

          {/* Trust Image */}
          <div className="max-w-md mx-auto">
            <Image
              src="https://creditplan.it/wp-content/uploads/2023/02/foto-home-Chi-siamo.png"
              alt="Come funziona la collaborazione con Creditplan - Processo in 3 semplici passaggi per agenti immobiliari"
              width={600}
              height={300}
              quality={60}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 448px"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleHowItWorksClick(idx)}
                className="relative group text-left w-full" 
                itemScope
                itemType="https://schema.org/HowToStep" 
                itemProp="step"
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white" itemProp="position">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3" itemProp="name">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed" itemProp="text">
                    {step.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12 py-12 sm:py-20 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left: Image */}
            <div className="relative lg:order-1 w-full">
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full">
                <Image
                  src="https://creditplan.it/wp-content/uploads/2023/02/01_Mutui.jpg"
                  alt="Famiglia soddisfatta con Creditplan - Servizi integrati immobiliare e credito"
                  width={800}
                  height={600}
                  quality={60}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-auto object-cover select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
                />
              </div>
            </div>

            {/* Right: CTA Content */}
            <div className="lg:order-2 w-full">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl relative overflow-hidden w-full">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="relative w-full">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                    Pronto a fare il salto di qualità?
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
                    Unisciti alla rete di agenti immobiliari che affiancano mutui e finanziamenti. Nessun costo di ingresso, modello chiaro, supporto continuo.
                  </p>
                  <Button 
                    onClick={scrollToForm}
                    className="bg-white text-blue-600 hover:bg-blue-50 h-12 sm:h-14 px-4 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto whitespace-normal sm:whitespace-nowrap"
                  >
                    Richiedi una call di presentazione →
                  </Button>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-white">12h</div>
                      <div className="text-xs sm:text-sm text-blue-100">Formazione iniziale dedicata</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-white">20</div>
                      <div className="text-xs sm:text-sm text-blue-100">Domande del test di abilitazione</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Partnerships Section */}
      {false && (
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30" aria-labelledby="bank-partnerships-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h2 id="bank-partnerships-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Le nostre convenzioni bancarie
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Collaboriamo con i primari partner sul mercato per garantirti tassi competitivi e tempi rapidi
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Banca Sistema */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/79/Banca_Sistema_logo.svg"
                alt="Banca Sistema - Partner bancario Creditplan per mutui e finanziamenti"
                width={200}
                height={80}
                className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Capital Fin */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://www.bancaifis.it/app/uploads/2025/03/CAPITALFIN_Logo_Footer_Blu.svg"
                alt="Capital Fin - Partner bancario Creditplan per prestiti e finanziamenti"
                width={260}
                height={104}
                className="w-full h-auto max-h-[5.5rem] object-contain grayscale group-hover:grayscale-0 transition-all duration-300 mt-4 ml-2"
                loading="lazy"
              />
            </div>

            {/* Fincontinuo */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://www.fincontinuo.com/hubfs/fincontinuo-logo.svg"
                alt="Fincontinuo - Partner finanziario Creditplan per mutui e finanziamenti"
                width={200}
                height={80}
                className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Bank Logo 4 */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ68VRQtS9RBsKX4NXmQNzByi5hqhEGf7vc1w&s"
                alt="Partner bancario convenzionato Creditplan per prestiti e finanziamenti"
                width={200}
                height={80}
                className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Last 3 logos - centered */}
            <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-wrap justify-center gap-6 lg:gap-8">
              {/* Bank Logo 5 */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2_zu4rkVrkobpR88917ZnpI4RPD3zz3tXRw&s"
                  alt="Partner bancario convenzionato Creditplan per mutui e finanziamenti"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* IBL Banca */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                <Image
                  src="https://thebanks.eu/img/logos/IBL_Banca.png"
                  alt="IBL Banca - Partner bancario Creditplan per mutui, finanziamenti e prestiti"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* Bank Logo 7 */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3zTLQW74Q-2PPo5vC0p0tkJ_xOYRUJUbDiA&s"
                  alt="Partner bancario convenzionato Creditplan per finanziamenti e prestiti"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Partner convenzionati INPS</span> - Garantiamo sicurezza e affidabilità
            </p>
          </div>
        </div>
      </section>
      )}

      {/* FAQ Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 overflow-hidden" aria-labelledby="faq-heading" itemScope itemType="https://schema.org/FAQPage">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <h2 id="faq-heading" className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Domande Frequenti
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tutto quello che devi sapere sulla collaborazione come Consulente del Credito con Creditplan.
            </p>
          </header>

          {/* FAQ Grid */}
          <div className="grid gap-4 lg:gap-5">
            {FAQ_ITEMS.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openFaqIndex === index}
                onToggle={() => handleFaqToggle(index)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center px-4 sm:px-0">
            <div className="flex flex-col items-center gap-3 lg:gap-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg p-10 sm:p-8 lg:p-10 w-full max-w-lg mx-auto">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                  Hai ancora domande sulla collaborazione?
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  Un nostro responsabile è a tua disposizione per chiarire percorso formativo, prova OAM, modalità operative e provvigioni. Nessun impegno.
                </p>
                <Button 
                  onClick={scrollToForm}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Richiedi una call di presentazione →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-6">
              <Image
                src="https://creditplan.it/wp-content/uploads/2023/02/LOGO-CREDITPLAN.png"
                alt="Creditplan - Logo aziendale servizi di mediazione creditizia"
                width={280}
                height={96}
                quality={60}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-auto h-8 select-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
              />
              <p className="text-sm text-slate-600 text-center md:text-left" itemProp="copyrightHolder">
                © 2025 Creditplan Italia Network di Mediazione Credizia. Tutti i diritti riservati.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a 
                href="https://creditplan.it/wp-content/uploads/2023/04/Informativa-privacy.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="https://creditplan.it/trasparenza/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Trasparenza
              </a>
            </div>
          </div>
          
          {/* Designer Credit */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              Designed and developed by Matias Galliani
            </p>
          </div>
        </div>
      </footer>

      {/* Benefit Modal */}
      <BenefitModal
        isOpen={openBenefitIndex !== null}
        onClose={handleCloseBenefitModal}
        benefit={selectedBenefit}
      />

      {/* Why Choose Modal */}
      <WhyChooseModal
        isOpen={openWhyChooseIndex !== null}
        onClose={handleCloseWhyChooseModal}
        benefit={selectedWhyChooseBenefit}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={openReviewsModal}
        onClose={handleCloseReviewsModal}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={openHowItWorksIndex !== null}
        onClose={handleCloseHowItWorksModal}
        step={selectedStep}
      />

    </main>
  );
}
