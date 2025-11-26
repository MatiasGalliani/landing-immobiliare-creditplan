"use client";

import { useEffect } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creditplan.it';

export function StructuredData() {
  useEffect(() => {
    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "Creditplan Italia Network di Mediazione Credizia",
      "alternateName": "Creditplan",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
      "description": "Formazione e supporto per agenti immobiliari che vogliono diventare consulenti del credito. Collaborazione attiva dal 2022 con formazione dedicata, backoffice e convenzioni bancarie.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IT",
        "addressLocality": "Italia"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "availableLanguage": ["Italian"]
      },
      "sameAs": [
        "https://creditplan.it"
      ],
      "areaServed": {
        "@type": "Country",
        "name": "Italy"
      },
      "serviceType": "Formazione e Consulenza Creditizia",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "2000",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    // Product/Service Schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOccupationalCredential",
      "name": "Consulente del Credito - Formazione e Accreditamento",
      "description": "Programma di formazione per agenti immobiliari che vogliono diventare consulenti del credito. Formazione di 12 ore, prova OAM, supporto continuo e convenzioni bancarie.",
      "provider": {
        "@type": "FinancialService",
        "name": "Creditplan"
      },
      "credentialCategory": "Professional Certification",
      "competencyRequired": "Agente Immobiliare",
      "educationalLevel": "Professional Training",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "price": "0",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "EUR",
          "price": "0",
          "priceType": "https://schema.org/ConsultationFee"
        },
        "availability": "https://schema.org/InStock",
        "url": siteUrl,
        "validFrom": "2022-01-01"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "2000"
      },
      "featureList": [
        "Formazione di 12 ore",
        "Prova OAM inclusa",
        "Supporto continuo",
        "Backoffice dedicato",
        "Convenzioni bancarie",
        "Provvigioni competitive"
      ]
    };

    // FAQPage Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Chi può candidarsi per collaborare con Creditplan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cerchiamo in primo luogo agenti immobiliari e professionisti che lavorano già a contatto con chi compra o vende casa (titolari d'agenzia, collaboratori, procacciatori, consulenti). Valutiamo anche profili affini del mondo finanziario/assicurativo, purché ci sia mentalità commerciale, organizzazione e serietà professionale."
          }
        },
        {
          "@type": "Question",
          "name": "Devo lasciare la mia agenzia o il mio lavoro attuale?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. La collaborazione con Creditplan è pensata come linea di business aggiuntiva, perfettamente compatibile con la tua attività di agente immobiliare. Continui a fare il tuo lavoro, ma in più puoi offrire mutui, finanziamenti, cessioni del quinto e altri prodotti di credito ai clienti che già segui."
          }
        },
        {
          "@type": "Question",
          "name": "Il cliente resta \"mio\" o passa a voi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Il cliente resta sempre tuo. Tu sei il riferimento principale per chi compra o vende l'immobile. Noi mettiamo a disposizione backoffice, convenzioni bancarie e competenze sul credito, ma non entriamo in concorrenza sull'aspetto immobiliare. L'obiettivo è farti fare più servizio e più provvigioni, non toglierti clienti."
          }
        },
        {
          "@type": "Question",
          "name": "Che tipo di formazione è prevista? Quanto dura?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "È necessario seguire un percorso formativo riconosciuto (circa 12 ore di video-lezioni) erogato da una società esterna. Puoi scegliere l'ente formatore o seguire uno dei percorsi da noi consigliati. Al termine riceverai l'attestato necessario per accedere alla prova OAM."
          }
        },
        {
          "@type": "Question",
          "name": "In cosa consiste la prova valutativa OAM?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La prova OAM si svolge online e consiste in 20 domande a risposta multipla. Devi rispondere correttamente ad almeno 12 domande su 20 per superarla. Superato l'esame, sarai accreditato con Creditplan e potrai iniziare a collaborare con il nostro supporto."
          }
        },
        {
          "@type": "Question",
          "name": "Quanto posso guadagnare con questa collaborazione?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Provvigioni variabili legate alle operazioni concluse (mutui, finanziamenti, prestiti, cessioni del quinto). Più clienti porti e più operazioni vanno a buon fine, più cresce il tuo reddito aggiuntivo. Durante la call ti spiegheremo la struttura provvigionale e faremo simulazioni concrete."
          }
        },
        {
          "@type": "Question",
          "name": "Ci sono costi di ingresso, fee o vincoli di esclusiva?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Non applichiamo fee di ingresso o canoni di affiliazione per la collaborazione con Creditplan. Gli unici costi da considerare sono quelli legati al percorso formativo esterno e alla prova OAM, gestiti dagli enti preposti. Ci aspettiamo però serietà, continuità minima e rispetto delle procedure."
          }
        },
        {
          "@type": "Question",
          "name": "In quanto tempo posso essere operativo dopo la candidatura?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Il percorso prevede: candidatura, call conoscitiva, corso di formazione (12h), prova OAM e accredito. I tempi dipendono dalla velocità con cui completi corso e prova, ma in genere in poche settimane puoi essere operativo."
          }
        }
      ]
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Diventa Consulente del Credito",
          "item": `${siteUrl}/diventa-consulente-del-credito`
        }
      ]
    };

    // WebPage Schema
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Diventa Consulente del Credito | Collabora con Creditplan | Agenti Immobiliari",
      "description": "Sei un agente immobiliare? Diventa consulente del credito con Creditplan. Aggiungi mutui e finanziamenti ai tuoi servizi. Formazione dedicata, supporto continuo, provvigioni competitive.",
      "url": siteUrl,
      "inLanguage": "it-IT",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Creditplan",
        "url": siteUrl
      },
      "about": {
        "@type": "EducationalOccupationalCredential",
        "name": "Consulente del Credito"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": `${siteUrl}/og-image.jpg`
      },
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split('T')[0]
    };

    // Service Schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Formazione Consulenti del Credito per Agenti Immobiliari",
      "provider": {
        "@type": "FinancialService",
        "name": "Creditplan"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Italy"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servizi di Prestito",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Formazione Consulente del Credito",
              "description": "Corso di formazione di 12 ore per diventare consulente del credito"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Supporto e Backoffice",
              "description": "Backoffice dedicato e convenzioni bancarie per agenti immobiliari"
            }
          }
        ]
      }
    };

    // HowTo Schema
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Come diventare Consulente del Credito con Creditplan",
      "description": "Guida passo-passo per agenti immobiliari che vogliono diventare consulenti del credito",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Compila il form",
          "text": "Inserisci i tuoi dati e poche informazioni sulla tua attività. Nessun impegno: è solo una richiesta di contatto.",
          "image": `${siteUrl}/step1.jpg`
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Fai una call conoscitiva",
          "text": "Un nostro responsabile ti contatterà per capire come lavori e spiegarti il modello, prodotti e provvigioni.",
          "image": `${siteUrl}/step2.jpg`
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Formazione e accredito",
          "text": "Completi la formazione di 12 ore, superi la prova OAM e inizi a collaborare con il nostro supporto.",
          "image": `${siteUrl}/step3.jpg`
        }
      ],
      "totalTime": "P2W"
    };

    // Add all schemas to the page
    const schemas = [
      organizationSchema,
      productSchema,
      faqSchema,
      breadcrumbSchema,
      webPageSchema,
      serviceSchema,
      howToSchema
    ];

    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `structured-data-${index}`;
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup function
    return () => {
      schemas.forEach((_, index) => {
        const script = document.getElementById(`structured-data-${index}`);
        if (script) {
          script.remove();
        }
      });
    };
  }, []);

  return null;
}

