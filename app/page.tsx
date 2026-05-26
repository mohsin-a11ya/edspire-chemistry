"use client";

import { useEffect, useMemo, useState } from "react";

const QUESTIONS = [
  { topic: "Atomic structure", q: "An atom has mass number 35 and atomic number 17. Which statement is correct?", options: ["17 neutrons and 18 protons", "17 protons and 18 neutrons", "35 protons and 17 electrons", "18 electrons and 17 neutrons"], answer: 1, model: "Atomic number = protons. Neutrons = mass number - atomic number = 35 - 17 = 18.", mark: "Protons = 17; neutrons = 18; neutral atom has 17 electrons." },
  { topic: "Atomic structure", q: "Why did the alpha scattering experiment show that most of the atom is empty space?", options: ["Most particles bounced back", "Most particles were absorbed", "Most particles passed straight through", "Gold atoms disappeared"], answer: 2, model: "Most alpha particles passed through the foil without deflection, showing atoms are mainly empty space.", mark: "Most passed through; atom mostly empty space; few deflected by small positive nucleus." },
  { topic: "Atomic structure", q: "Why are isotopes of the same element chemically similar?", options: ["Same number of neutrons", "Same electron arrangement", "Same mass number", "Different proton number"], answer: 1, model: "Isotopes have the same proton number and electron arrangement, so their chemical properties are similar.", mark: "Same electrons; same outer shell; chemistry depends on electron arrangement." },
  { topic: "Periodic table", q: "Why does Group 1 reactivity increase down the group?", options: ["Outer electron is closer", "Atoms gain electrons more easily", "Outer electron is further away and more shielded", "Atoms have fewer shells"], answer: 2, model: "More shells and more shielding mean the outer electron is less strongly attracted and is lost more easily.", mark: "More shells; more shielding; weaker attraction; electron lost more easily." },
  { topic: "Periodic table", q: "Why do Group 7 elements become less reactive down the group?", options: ["Harder to gain an electron", "Easier to lose electrons", "They become metals", "They have fewer shells"], answer: 0, model: "Halogens react by gaining an electron. Down the group, shielding increases and attraction for an incoming electron decreases.", mark: "Gain electron; more shells; more shielding; weaker attraction." },
  { topic: "Periodic table", q: "Why are noble gases unreactive?", options: ["They have no electrons", "They have full outer shells", "They are all solids", "They form ions easily"], answer: 1, model: "Noble gases have full outer electron shells, making them stable.", mark: "Full outer shell; stable; little tendency to gain, lose or share electrons." },
  { topic: "Bonding", q: "Why are two chloride ions needed in MgCl2?", options: ["Mg loses 1 electron", "Cl loses 2 electrons", "Mg loses 2 electrons and each Cl gains 1", "All atoms share electrons"], answer: 2, model: "Magnesium forms Mg2+ by losing two electrons. Each chlorine gains one electron to form Cl-. Two chloride ions balance Mg2+.", mark: "Mg loses 2; each Cl gains 1; charges balance." },
  { topic: "Bonding", q: "Which substance has a giant covalent structure and conducts electricity?", options: ["Diamond", "Graphite", "Sodium chloride", "Iodine"], answer: 1, model: "Graphite has delocalised electrons between layers, so it conducts electricity.", mark: "Graphite; delocalised electrons; electrons carry charge." },
  { topic: "Bonding", q: "Why does diamond have a very high melting point?", options: ["Weak intermolecular forces", "Free ions", "Many strong covalent bonds", "Delocalised electrons"], answer: 2, model: "Diamond is a giant covalent structure with many strong covalent bonds that require lots of energy to break.", mark: "Giant covalent; many strong bonds; lots of energy required." },
  { topic: "Bonding", q: "Why do simple molecular substances usually have low boiling points?", options: ["Weak intermolecular forces", "Strong ionic bonds", "Free electrons", "Giant lattice"], answer: 0, model: "Only weak intermolecular forces are overcome during boiling, so little energy is needed.", mark: "Weak forces between molecules; little energy needed." },
  { topic: "Structure", q: "Why does molten sodium chloride conduct electricity but solid sodium chloride does not?", options: ["Electrons move in molten NaCl", "Ions can move when molten", "Atoms move in the solid", "Covalent bonds break"], answer: 1, model: "In the solid, ions are fixed. When molten, ions are free to move and carry charge.", mark: "Mobile ions when molten; fixed ions when solid; charged particles carry current." },
  { topic: "Structure", q: "Why can nanoparticles be more reactive than larger particles?", options: ["Lower surface area to volume ratio", "Higher surface area to volume ratio", "They contain different atoms", "They are always soluble"], answer: 1, model: "Nanoparticles have a high surface area to volume ratio, so more particles are exposed for reaction.", mark: "High surface area to volume ratio; more exposed surface; faster reaction." },
  { topic: "Quantitative chemistry", q: "Calculate Mr of Al2(SO4)3. Ar: Al=27, S=32, O=16.", options: ["123", "150", "342", "369"], answer: 2, model: "Mr = 2(27) + 3[32 + 4(16)] = 54 + 288 = 342.", mark: "Correct substitution and final answer 342." },
  { topic: "Quantitative chemistry", q: "How many moles are in 4.4 g of CO2? Mr CO2 = 44.", options: ["0.01 mol", "0.10 mol", "1.0 mol", "10 mol"], answer: 1, model: "Moles = mass / Mr = 4.4 / 44 = 0.10 mol.", mark: "Correct equation; substitution; 0.10 mol." },
  { topic: "Quantitative chemistry", q: "A reaction produces 5.0 g. The theoretical yield is 6.25 g. What is the percentage yield?", options: ["20%", "75%", "80%", "125%"], answer: 2, model: "Percentage yield = actual / theoretical x 100 = 5.0 / 6.25 x 100 = 80%.", mark: "Correct formula and answer 80%." },
  { topic: "Quantitative chemistry", q: "What volume of 0.200 mol/dm3 acid contains 0.00500 mol?", options: ["0.00100 dm3", "0.0250 dm3", "0.0400 dm3", "25.0 dm3"], answer: 1, model: "Volume = moles / concentration = 0.00500 / 0.200 = 0.0250 dm3.", mark: "Correct rearrangement and answer 0.0250 dm3 or 25.0 cm3." },
  { topic: "Quantitative chemistry", q: "A sample contains 24 g Mg and 16 g O. What is the empirical formula? Ar Mg=24, O=16.", options: ["MgO", "Mg2O", "MgO2", "Mg2O3"], answer: 0, model: "Moles Mg = 24/24 = 1. Moles O = 16/16 = 1. Ratio 1:1, so MgO.", mark: "Calculate moles; simplify ratio; MgO." },
  { topic: "Quantitative chemistry", q: "Which change increases atom economy?", options: ["More waste products", "More reactant atoms become desired product", "Lower temperature only", "Higher pressure only"], answer: 1, model: "Atom economy is higher when more atoms from reactants end up in the desired product.", mark: "Desired product contains greater proportion of reactant atoms; less waste." },
  { topic: "Chemical changes", q: "Which salt forms when copper oxide reacts with sulfuric acid?", options: ["Copper chloride", "Copper nitrate", "Copper sulfate", "Sodium sulfate"], answer: 2, model: "Sulfuric acid forms sulfate salts, so copper oxide forms copper sulfate and water.", mark: "Metal oxide + acid = salt + water; sulfate salt; copper sulfate." },
  { topic: "Chemical changes", q: "Why does zinc react with copper sulfate solution?", options: ["Copper is more reactive", "Zinc is more reactive and displaces copper", "Zinc is below copper", "Copper sulfate is an acid"], answer: 1, model: "Zinc is more reactive than copper, so it displaces copper from copper sulfate.", mark: "Zinc more reactive; displacement; copper produced." },
  { topic: "Chemical changes", q: "What is the ionic equation for neutralisation?", options: ["H+ + OH- → H2O", "Na+ + Cl- → NaCl", "O2 + 4e- → 2O2-", "2H2 + O2 → 2H2O"], answer: 0, model: "Neutralisation is hydrogen ions reacting with hydroxide ions to form water.", mark: "H+ + OH- → H2O." },
  { topic: "Chemical changes", q: "Why is electrolysis of molten aluminium oxide expensive?", options: ["Low melting point", "Large amounts of electrical energy needed", "Cathode reacts", "No oxygen forms"], answer: 1, model: "Aluminium oxide has a high melting point and electrolysis uses lots of electrical energy.", mark: "High melting point; molten electrolyte; high energy demand." },
  { topic: "Chemical changes", q: "At the cathode during electrolysis of molten lead bromide, what happens?", options: ["Bromide ions gain electrons", "Lead ions gain electrons", "Lead atoms lose electrons", "Oxygen forms"], answer: 1, model: "Pb2+ ions move to the cathode and gain electrons to form lead.", mark: "Pb2+ attracted to cathode; gains electrons; reduction." },
  { topic: "Chemical changes", q: "In aqueous sodium chloride electrolysis, why is hydrogen produced at the cathode rather than sodium?", options: ["Sodium is less reactive than hydrogen", "Sodium is more reactive so hydrogen ions are discharged", "Chloride ions move to cathode", "Water cannot be electrolysed"], answer: 1, model: "Sodium is more reactive than hydrogen, so hydrogen ions gain electrons and form hydrogen gas.", mark: "Aqueous solution; sodium more reactive; hydrogen produced at cathode." },
  { topic: "Energy changes", q: "In an exothermic reaction, what is true overall?", options: ["More energy taken in than released", "No bonds break", "More energy released forming bonds than taken in breaking bonds", "Products are always gases"], answer: 2, model: "Bond forming releases more energy than bond breaking takes in.", mark: "Breaking bonds requires energy; forming bonds releases energy; overall energy released." },
  { topic: "Energy changes", q: "A reaction profile has products lower in energy than reactants. What type of reaction is it?", options: ["Endothermic", "Exothermic", "Reversible only", "Electrolytic only"], answer: 1, model: "Products are lower in energy, so energy has been transferred to the surroundings: exothermic.", mark: "Products lower; energy released; exothermic." },
  { topic: "Energy changes", q: "What is the purpose of a catalyst?", options: ["Increase activation energy", "Lower activation energy", "Change product energy only", "Make all reactions endothermic"], answer: 1, model: "A catalyst provides an alternative pathway with lower activation energy.", mark: "Alternative pathway; lower activation energy; catalyst unchanged." },
  { topic: "Energy changes", q: "Which process is endothermic?", options: ["Combustion", "Neutralisation", "Thermal decomposition", "Freezing water"], answer: 2, model: "Thermal decomposition requires energy to break down a compound.", mark: "Thermal decomposition; energy taken in." },
  { topic: "Energy changes", q: "Bonds broken = 945 kJ/mol and bonds formed = 1120 kJ/mol. What is ΔH?", options: ["+175 kJ/mol", "-175 kJ/mol", "+2065 kJ/mol", "-2065 kJ/mol"], answer: 1, model: "Energy change = bonds broken - bonds formed = 945 - 1120 = -175 kJ/mol.", mark: "Correct calculation; negative value; exothermic." },
  { topic: "Required practicals", q: "In the making salts practical, why is excess copper oxide added to acid?", options: ["To make the solution acidic", "To ensure all acid reacts", "To evaporate water", "To act as an indicator"], answer: 1, model: "Excess insoluble base is added so all the acid is neutralised. The excess solid can then be filtered off.", mark: "Excess base; all acid reacts; filter excess solid." }
];

const PRACTICALS = [
  "Making salts: warm acid, add excess insoluble base, filter, crystallise.",
  "Titration: use pipette, burette, indicator and repeat for concordant titres.",
  "Electrolysis: identify products at electrodes and link to ions present.",
  "Temperature changes: use fixed volumes/concentrations and calculate temperature change."
];

const CALCS = [
  "Moles = mass ÷ Mr",
  "Concentration = moles ÷ volume in dm³",
  "Percentage yield = actual ÷ theoretical × 100",
  "Atom economy = Mr desired product ÷ total Mr reactants × 100",
  "Energy change = bonds broken - bonds formed",
  "Empirical formula: divide mass by Ar, then simplify ratio"
];

function shuffleOptions(question, index) {
  const options = question.options.map((text, originalIndex) => ({ text, originalIndex }));
  const shift = index % options.length;
  const mixed = options.slice(shift).concat(options.slice(0, shift));
  return {
    ...question,
    mixedOptions: mixed,
    mixedAnswer: mixed.findIndex((item) => item.originalIndex === question.answer)
  };
}

export default function Page() {
  const [tab, setTab] = useState("quiz");
  const [dark, setDark] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(30);
  const [showHelp, setShowHelp] = useState(true);

  const question = useMemo(() => shuffleOptions(QUESTIONS[currentIndex], currentIndex), [currentIndex]);
  const currentAnswer = answers[currentIndex];
  const score = Object.values(answers).filter((item) => item.correct).length;
  const attempted = Object.keys(answers).length;
  const mistakes = Object.entries(answers).filter((entry) => !entry[1].correct);

  useEffect(() => {
    if (tab !== "quiz" || currentAnswer) return;
    if (time === 0) {
      setAnswers((old) => ({ ...old, [currentIndex]: { selected: null, correct: false, timedOut: true } }));
      return;
    }
    const timer = setTimeout(() => setTime((old) => old - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, tab, currentAnswer, currentIndex]);

  function chooseAnswer(optionIndex) {
    if (currentAnswer) return;
    setAnswers((old) => ({
      ...old,
      [currentIndex]: {
        selected: optionIndex,
        correct: optionIndex === question.mixedAnswer,
        timedOut: false
      }
    }));
  }

  function nextQuestion() {
    setCurrentIndex((old) => Math.min(old + 1, QUESTIONS.length - 1));
    setTime(30);
    setShowHelp(true);
  }

  function previousQuestion() {
    setCurrentIndex((old) => Math.max(old - 1, 0));
    setTime(30);
    setShowHelp(true);
  }

  function restart() {
    setAnswers({});
    setCurrentIndex(0);
    setTime(30);
    setShowHelp(true);
    setTab("quiz");
  }

  const bg = dark ? "bg-slate-950 text-white" : "bg-orange-50 text-slate-900";
  const card = dark ? "bg-slate-900 border-slate-700" : "bg-white border-orange-100";
  const pressureWidth = `${Math.round((time / 30) * 100)}%`;

  return (
    <main className={`min-h-screen ${bg}`}>
      <header className={`sticky top-0 z-10 border-b ${card}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Edspire Tuition logo" className="h-16 w-16 rounded-2xl object-contain shadow" />
            <div>
              <h1 className="text-2xl font-black text-[#8C0026]">Edspire Tuition</h1>
              <p className="text-sm text-slate-500">AQA GCSE Chemistry Higher Paper 1</p>
            </div>
          </div>
          <button onClick={() => setDark(!dark)} className="rounded-2xl border px-4 py-2 font-bold shadow">
            {dark ? "☀️ Day" : "🌙 Night"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl p-4">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <Stat title="Score" value={`${score}/${QUESTIONS.length}`} />
          <Stat title="Attempted" value={`${attempted}/${QUESTIONS.length}`} />
          <Stat title="Timer" value={`${time}s`} />
          <Stat title="Level" value={score >= 25 ? "Grade 9" : score >= 20 ? "Grade 8" : "Practice"} />
        </div>

        <nav className="mb-4 grid gap-2 md:grid-cols-5">
          {["quiz", "results", "mistakes", "practicals", "calculations"].map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`rounded-2xl px-4 py-3 font-bold capitalize shadow ${tab === item ? "bg-[#8C0026] text-white" : card}`}>
              {item}
            </button>
          ))}
        </nav>

        {tab === "quiz" && (
          <section className={`rounded-3xl border p-5 shadow-xl ${card}`}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-[#08AFC5]/20 px-3 py-1 font-bold text-[#087b89]">Question {currentIndex + 1} of {QUESTIONS.length}</span>
              <span className="rounded-full bg-[#F28C00]/20 px-3 py-1 font-bold text-[#8C0026]">{question.topic}</span>
            </div>

            <div className="mb-5">
              <div className="mb-1 font-bold">Pressure meter</div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-[#D5105A] transition-all" style={{ width: pressureWidth }} />
              </div>
            </div>

            <h2 className="mb-5 text-2xl font-black">{question.q}</h2>

            <div className="grid gap-3">
              {question.mixedOptions.map((option, index) => {
                const correct = index === question.mixedAnswer;
                const chosen = currentAnswer?.selected === index;
                let style = dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50";
                if (currentAnswer && correct) style = "border-emerald-500 bg-emerald-100 text-emerald-950";
                if (currentAnswer && chosen && !correct) style = "border-red-500 bg-red-100 text-red-950";
                return (
                  <button key={option.text} onClick={() => chooseAnswer(index)} className={`rounded-2xl border-2 p-4 text-left font-semibold ${style}`}>
                    <span className="mr-2 font-black">{String.fromCharCode(65 + index)}.</span>{option.text}
                  </button>
                );
              })}
            </div>

            {currentAnswer && (
              <div className={`mt-5 rounded-2xl border p-4 ${card}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black">{currentAnswer.correct ? "✅ Correct" : "❌ Incorrect — no second attempt"}</p>
                  <button onClick={() => setShowHelp(!showHelp)} className="rounded-xl border px-3 py-2 font-bold">{showHelp ? "Hide" : "Show"}</button>
                </div>
                {showHelp && (
                  <div className="mt-3 space-y-2 text-sm">
                    <p><b>Correct answer:</b> {question.mixedOptions[question.mixedAnswer].text}</p>
                    <p><b>Model answer:</b> {question.model}</p>
                    <p><b>Mark scheme:</b> {question.mark}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 flex justify-between gap-3">
              <button onClick={previousQuestion} disabled={currentIndex === 0} className="rounded-2xl bg-slate-200 px-5 py-3 font-bold text-slate-900 disabled:opacity-40">Back</button>
              {currentIndex === QUESTIONS.length - 1 ? (
                <button onClick={() => setTab("results")} className="rounded-2xl bg-[#8C0026] px-5 py-3 font-bold text-white">Finish</button>
              ) : (
                <button onClick={nextQuestion} className="rounded-2xl bg-[#8C0026] px-5 py-3 font-bold text-white">Next</button>
              )}
            </div>
          </section>
        )}

        {tab === "results" && (
          <Panel title="Results" card={card}>
            <p className="text-5xl font-black text-[#8C0026]">{score}/{QUESTIONS.length}</p>
            <p className="mt-2">Percentage: {Math.round((score / QUESTIONS.length) * 100)}%</p>
            <p>Grade estimate: {score >= 25 ? "Grade 9 standard" : score >= 20 ? "Grade 8 standard" : score >= 15 ? "Grade 7 practice range" : "Keep revising"}</p>
            <button onClick={restart} className="mt-4 rounded-2xl bg-[#F28C00] px-5 py-3 font-bold text-white">Restart</button>
          </Panel>
        )}

        {tab === "mistakes" && (
          <Panel title="Mistakes and corrections" card={card}>
            {mistakes.length === 0 ? <p>No mistakes yet.</p> : mistakes.map(([index, answer]) => {
              const q = QUESTIONS[Number(index)];
              return (
                <div key={index} className="mb-4 rounded-2xl border p-4">
                  <p className="font-black">Q{Number(index) + 1}: {q.q}</p>
                  <p className="text-red-600">Your answer: {answer.timedOut ? "Timed out" : shuffleOptions(q, Number(index)).mixedOptions[answer.selected]?.text}</p>
                  <p className="text-emerald-600">Correct answer: {q.options[q.answer]}</p>
                  <p className="mt-2 text-sm">{q.model}</p>
                </div>
              );
            })}
          </Panel>
        )}

        {tab === "practicals" && (
          <Panel title="Required practicals" card={card}>
            <div className="grid gap-3 md:grid-cols-2">{PRACTICALS.map((item) => <Info key={item} text={item} />)}</div>
          </Panel>
        )}

        {tab === "calculations" && (
          <Panel title="Higher tier calculations" card={card}>
            <div className="grid gap-3 md:grid-cols-2">{CALCS.map((item) => <Info key={item} text={item} />)}</div>
          </Panel>
        )}
      </section>
    </main>
  );
}

function Stat({ title, value }) {
  return <div className="rounded-3xl bg-white p-4 shadow"><p className="text-sm font-bold text-slate-500">{title}</p><p className="text-2xl font-black text-[#8C0026]">{value}</p></div>;
}

function Panel({ title, card, children }) {
  return <section className={`rounded-3xl border p-6 shadow-xl ${card}`}><h2 className="mb-4 text-2xl font-black text-[#8C0026]">{title}</h2>{children}</section>;
}

function Info({ text }) {
  return <div className="rounded-2xl border border-orange-100 bg-white p-4 font-semibold text-slate-800">{text}</div>;
}
