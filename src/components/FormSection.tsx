"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nomeCognome: z.string().min(2, "Il nome e cognome devono contenere almeno 2 caratteri"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  telefono: z.string().min(10, "Il numero di telefono deve contenere almeno 10 cifre"),
  citta: z.string().min(1, "Inserisci la città in cui operi"),
  provincia: z.string().min(1, "Inserisci la provincia"),
  agenteImmobiliare: z.string().min(1, "Seleziona se sei un agente immobiliare"),
  domande: z.string().optional(),
});


export function FormSection() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCognome: "",
      email: "",
      telefono: "",
      citta: "",
      provincia: "",
      agenteImmobiliare: "",
      domande: "",
    },
  });

  const onNext = async () => {
    const isValid = await form.trigger(['nomeCognome', 'email', 'telefono']);
    if (isValid) {
      setCurrentStep(2);
      setSubmitError(null);
    }
  };

  const onBack = () => {
    setCurrentStep(1);
    setSubmitError(null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const payload = {
        nomeCognome: values.nomeCognome,
        email: values.email,
        telefono: values.telefono,
        citta: values.citta,
        provincia: values.provincia,
        agenteImmobiliare: values.agenteImmobiliare,
        domande: values.domande || "",
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/forms/immobiliare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Errore sconosciuto' }));
        throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
      
      setIsLoading(false);
      router.push("/grazie");
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Si è verificato un errore durante l\'invio del form. Riprova più tardi.';
      setSubmitError(errorMessage);
    }
  };


  return (
    <div className="relative" id="form-section">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-10"></div>
      <Card className="relative bg-white shadow-2xl border-0 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500"></div>
        
        <CardHeader className="space-y-3 pb-6">
          <div className="text-center">
            <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
              Richiedi informazioni
            </CardTitle>
            <p className="text-sm lg:text-base text-slate-600">
              Compila il form per essere ricontattato in 24h
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-6">
          {/* Error Message */}
          {submitError && !isLoading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Errore nell'invio</p>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
                <button
                  onClick={() => setSubmitError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                  aria-label="Chiudi errore"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <Form {...form}>
            <div className="relative overflow-hidden">
              {/* Step 1 */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  currentStep === 1
                    ? 'opacity-100 translate-x-0 relative'
                    : 'opacity-0 -translate-x-full absolute inset-0 pointer-events-none'
                }`}
              >
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nomeCognome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome e cognome</FormLabel>
                        <FormControl>
                          <Input placeholder="Inserisci nome e cognome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Inserisci la tua email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numero di telefono</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Inserisci il tuo telefono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    onClick={onNext}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg"
                  >
                    Continua →
                  </Button>
                </form>
              </div>

              {/* Step 2 */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  currentStep === 2
                    ? 'opacity-100 translate-x-0 relative'
                    : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'
                }`}
              >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="citta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Città in cui operi</FormLabel>
                        <FormControl>
                          <Input placeholder="Inserisci la città" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provincia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provincia</FormLabel>
                        <FormControl>
                          <Input placeholder="Inserisci la provincia" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agenteImmobiliare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sei un agente immobiliare?</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            disabled={isLoading}
                            className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Seleziona</option>
                            <option value="si">Si</option>
                            <option value="no">No</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="domande"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scrivi se hai domande o se vuoi indicarci qualcosa sulla tua attività</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={4}
                            disabled={isLoading}
                            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Scrivi qui le tue domande o informazioni sulla tua attività..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={onBack}
                      variant="outline"
                      disabled={isLoading}
                      className="flex-1 h-12 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Indietro
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading && (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {isLoading ? "Invio in corso..." : "INVIA"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
