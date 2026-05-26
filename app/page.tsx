"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Timer, Flame, Moon, Sun, Eye, EyeOff, Trophy, AlertTriangle, Calculator, FlaskConical, Shuffle, User, Brain, BarChart3, Lock, BookOpen } from "lucide-react";

const BRAND = {
  burgundy: "#8C0026",
  orange: "#F28C00",
  teal: "#08AFC5",
  purple: "#4B1373",
  pink: "#D5105A"
};

// Questions are automatically shuffled so answers appear in different positions (A/B/C/D)
const questions = [
  {
    topic: "Atomic structure",
    q: "An atom has mass number 35 and atomic number 17. Which statement is correct?",
    options: ["It has 17 neutrons and 18 protons.", "It has 17 protons and 18 neutrons.", "It has 35 protons and 17 electrons.", "It has 18 electrons and 17 neutrons."],
    answer: 1,
    model: "Atomic number is the number of protons. Mass number is protons plus neutrons, so neutrons = 35 - 17 = 18. A neutral atom has 17 electrons.",
    mark: "1 mark for identifying 17 protons; 1 mark for calculating 18 neutrons; 1 mark for linking electrons to atomic number in a neutral atom."
  },
  {
    topic: "Atomic structure",
    q: "Why did the alpha scattering experiment show that most of the atom is empty space?",
    options: ["Most alpha particles were absorbed.", "Most alpha particles passed straight through the gold foil.", "Most alpha particles bounced backwards.", "The gold foil became radioactive."],
    answer: 1,
    model: "Most alpha particles passed through undeflected, showing that the atom is mainly empty space. A few deflected because the nucleus is small, dense and positively charged.",
    mark: "Credit: most passed through; therefore mostly empty space; small number deflected by small positive nucleus."
  },
  {
    topic: "Periodic table",
    q: "Why does reactivity increase down Group 1?",
    options: ["The outer electron is closer to the nucleus.", "The atom gains electrons more easily.", "The outer electron is further from the nucleus and more shielded.", "The atoms have fewer electron shells."],
    answer: 2,
    model: "Down Group 1, atoms have more shells. The outer electron is further from the nucleus and shielded more strongly, so it is lost more easily.",
    mark: "Credit: more shells; more shielding; weaker attraction; electron lost more easily."
  },
  {
    topic: "Periodic table",
    q: "Which explanation best describes why noble gases are unreactive?",
    options: ["They have no electrons.", "They have full outer electron shells.", "They have low boiling points.", "They form positive ions easily."],
    answer: 1,
    model: "Noble gases have full outer electron shells, so they are stable and do not easily gain, lose or share electrons.",
    mark: "Credit: full outer shell; stable arrangement; little tendency to react."
  },
  {
    topic: "Bonding",
    q: "Magnesium chloride has the formula MgCl2. Why are two chloride ions needed?",
    options: ["Magnesium loses one electron and chlorine gains two.", "Magnesium gains two electrons and chlorine loses one.", "Magnesium loses two electrons and each chlorine gains one.", "All atoms share two pairs of electrons."],
    answer: 2,
    model: "Magnesium forms Mg2+ by losing two electrons. Each chlorine atom gains one electron to form Cl-. Two chloride ions balance one Mg2+ ion.",
    mark: "Credit: Mg loses 2 electrons; each Cl gains 1; charges balance in MgCl2."
  },
  {
    topic: "Bonding",
    q: "Which substance has a giant covalent structure and conducts electricity?",
    options: ["Diamond", "Graphite", "Sodium chloride solid", "Simple molecular iodine"],
    answer: 1,
    model: "Graphite has layers of carbon atoms. Each carbon bonds to three others, leaving one delocalised electron per carbon that can carry charge.",
    mark: "Credit: graphite; delocalised electrons; movement of electrons conducts electricity."
  },
  {
    topic: "Structure and properties",
    q: "Why does sodium chloride conduct electricity when molten but not when solid?",
    options: ["Electrons are free only when molten.", "Ions are free to move only when molten.", "Atoms are free to move only when solid.", "Covalent bonds break when solid."],
    answer: 1,
    model: "In solid sodium chloride, ions are fixed in a lattice. When molten, ions can move and carry charge.",
    mark: "Credit: ions; fixed in solid lattice; mobile when molten; mobile charged particles conduct."
  },
  {
    topic: "Nanoparticles",
    q: "Why can nanoparticles be more reactive than larger particles of the same material?",
    options: ["They have a smaller surface area to volume ratio.", "They have a larger surface area to volume ratio.", "They contain different elements.", "They always dissolve in water."],
    answer: 1,
    model: "Nanoparticles have a very high surface area to volume ratio, so a greater proportion of atoms are available at the surface for reactions.",
    mark: "Credit: high surface area to volume ratio; more exposed surface atoms; increased rate/reactivity."
  },
  {
    topic: "Quantitative chemistry",
    q: "Calculate the relative formula mass of Al2(SO4)3. Ar: Al=27, S=32, O=16.",
    options: ["123", "150", "342", "369"],
    answer: 2,
    model: "Mr = 2(27) + 3[32 + 4(16)] = 54 + 3(96) = 342.",
    mark: "1 mark for 2 x 27; 1 mark for 3 x (32 + 4 x 16); 1 mark for 342."
  },
  {
    topic: "Quantitative chemistry",
    q: "How many moles are in 4.4 g of carbon dioxide? Mr CO2 = 44.",
    options: ["0.01 mol", "0.10 mol", "1.0 mol", "10 mol"],
    answer: 1,
    model: "Moles = mass / Mr = 4.4 / 44 = 0.10 mol.",
    mark: "Credit correct equation and correct substitution; answer 0.10 mol."
  },
  {
    topic: "Quantitative chemistry",
    q: "A reaction produces 5.0 g of product. The theoretical yield is 6.25 g. What is the percentage yield?",
    options: ["20%", "75%", "80%", "125%"],
    answer: 2,
    model: "Percentage yield = actual yield / theoretical yield x 100 = 5.0 / 6.25 x 100 = 80%.",
    mark: "Credit formula; substitution; final answer 80%."
  },
  {
    topic: "Quantitative chemistry",
    q: "Which change increases atom economy for a desired product?",
    options: ["Producing more waste by-products.", "Using a reaction where more reactant atoms form the desired product.", "Using a lower temperature only.", "Using a catalyst only."],
    answer: 1,
    model: "Atom economy increases when a larger proportion of the atoms in the reactants end up in the desired product rather than waste products.",
    mark: "Credit: atoms from reactants; desired product; fewer waste products."
  },
  {
    topic: "Chemical changes",
    q: "Which salt forms when copper oxide reacts with sulfuric acid?",
    options: ["Copper chloride", "Copper nitrate", "Copper sulfate", "Sodium sulfate"],
    answer: 2,
    model: "Metal oxide plus acid forms a salt and water. Sulfuric acid forms sulfate salts, so copper oxide forms copper sulfate.",
    mark: "Credit: acid + metal oxide -> salt + water; sulfuric acid gives sulfate; copper sulfate."
  },
  {
    topic: "Chemical changes",
    q: "Why is electrolysis of molten aluminium oxide expensive?",
    options: ["Aluminium oxide has a low melting point.", "Large amounts of electrical energy are needed.", "The cathode does not react.", "Oxygen is not produced."],
    answer: 1,
    model: "Aluminium oxide has a very high melting point, and electrolysis requires large amounts of electrical energy to keep it molten and decompose it.",
    mark: "Credit: high melting point; molten electrolyte required; large electrical energy demand."
  },
  {
    topic: "Chemical changes",
    q: "At the cathode during electrolysis of molten lead bromide, what happens?",
    options: ["Bromide ions gain electrons to form bromine.", "Lead ions gain electrons to form lead.", "Lead atoms lose electrons to form ions.", "Oxygen forms."],
    answer: 1,
    model: "Positive Pb2+ ions move to the negative cathode and gain electrons: Pb2+ + 2e- -> Pb.",
    mark: "Credit: Pb2+ attracted to cathode; gains electrons; reduction; forms lead."
  },
  {
    topic: "Chemical changes",
    q: "What is the ionic equation for neutralisation?",
    options: ["H+ + OH- -> H2O", "Na+ + Cl- -> NaCl", "O2 + 4e- -> 2O2-", "2H2 + O2 -> 2H2O"],
    answer: 0,
    model: "Neutralisation is the reaction of hydrogen ions with hydroxide ions to form water: H+ + OH- -> H2O.",
    mark: "Credit correct ions and product water."
  },
  {
    topic: "Chemical changes",
    q: "Why does zinc react with copper sulfate solution?",
    options: ["Copper is more reactive than zinc.", "Zinc is more reactive and displaces copper.", "Zinc is below copper in the reactivity series.", "Copper sulfate is an acid."],
    answer: 1,
    model: "Zinc is more reactive than copper, so zinc displaces copper from copper sulfate solution, forming zinc sulfate and copper.",
    mark: "Credit: zinc more reactive; displacement; copper produced; zinc sulfate formed."
  },
  {
    topic: "Energy changes",
    q: "In an exothermic reaction, what is true about bond energies overall?",
    options: ["More energy is taken in breaking bonds than released forming bonds.", "Less energy is released forming bonds than taken in breaking bonds.", "More energy is released forming bonds than taken in breaking bonds.", "No bonds are broken."],
    answer: 2,
    model: "Bond breaking requires energy. Bond forming releases energy. Exothermic reactions release more energy in forming bonds than is taken in to break bonds.",
    mark: "Credit: breaking bonds endothermic; forming bonds exothermic; overall energy released is greater."
  },
  {
    topic: "Energy changes",
    q: "A reaction profile has products lower in energy than reactants. What type of reaction is it?",
    options: ["Endothermic", "Exothermic", "Reversible only", "Electrolytic only"],
    answer: 1,
    model: "If products are at a lower energy than reactants, energy has been transferred to the surroundings, so the reaction is exothermic.",
    mark: "Credit: products lower; energy released/transferred to surroundings; exothermic."
  },
  {
    topic: "Energy changes",
    q: "What is the main purpose of a catalyst in a reaction profile?",
    options: ["It increases activation energy.", "It lowers activation energy.", "It changes the energy of products only.", "It makes all reactions endothermic."],
    answer: 1,
    model: "A catalyst provides an alternative reaction pathway with a lower activation energy.",
    mark: "Credit: alternative pathway; lower activation energy; catalyst unchanged."
  },
  {
    topic: "Quantitative chemistry",
    q: "What volume of 0.200 mol/dm3 acid contains 0.00500 mol?",
    options: ["0.00100 dm3", "0.0250 dm3", "0.0400 dm3", "25.0 dm3"],
    answer: 1,
    model: "Volume = moles / concentration = 0.00500 / 0.200 = 0.0250 dm3, which is 25.0 cm3.",
    mark: "Credit equation n = cv rearranged; substitution; 0.0250 dm3 or 25.0 cm3."
  },
  {
    topic: "Bonding",
    q: "Why does diamond have a very high melting point?",
    options: ["It has weak intermolecular forces.", "It contains ions that move freely.", "It has many strong covalent bonds in a giant structure.", "It has delocalised electrons between layers."],
    answer: 2,
    model: "Diamond is a giant covalent structure. Many strong covalent bonds must be broken, requiring a large amount of energy.",
    mark: "Credit: giant covalent; many strong covalent bonds; lots of energy needed."
  },
  {
    topic: "Periodic table",
    q: "Why do Group 7 elements become less reactive down the group?",
    options: ["It becomes harder to gain an electron because the outer shell is further from the nucleus.", "They lose electrons more easily down the group.", "They have fewer electron shells down the group.", "Their atoms become smaller."],
    answer: 0,
    model: "Halogens react by gaining an electron. Down the group, the outer shell is further from the nucleus and more shielded, so attraction for an incoming electron is weaker.",
    mark: "Credit: gain electron; more shells/shielding; weaker attraction; less reactive."
  },
  {
    topic: "Chemical changes",
    q: "Which pair of products forms when hydrochloric acid reacts with sodium hydroxide?",
    options: ["Sodium chloride and water", "Sodium sulfate and water", "Hydrogen and sodium chloride", "Chlorine and water"],
    answer: 0,
    model: "Acid plus alkali forms a salt and water. Hydrochloric acid forms chloride salts, so sodium hydroxide forms sodium chloride and water.",
    mark: "Credit: neutralisation; salt and water; sodium chloride identified."
  },
  {
    topic: "Quantitative chemistry",
    q: "What mass of MgO forms from 0.20 mol of MgO? Mr MgO = 40.",
    options: ["2.0 g", "8.0 g", "20 g", "80 g"],
    answer: 1,
    model: "Mass = moles x Mr = 0.20 x 40 = 8.0 g.",
    mark: "Credit formula; correct substitution; 8.0 g."
  },
  {
    topic: "Energy changes",
    q: "Which process is endothermic?",
    options: ["Combustion of methane", "Neutralisation", "Thermal decomposition", "Freezing water"],
    answer: 2,
    model: "Thermal decomposition requires energy to break down a compound, so it is endothermic.",
    mark: "Credit thermal decomposition; energy taken in; bonds broken/compound decomposes."
  },
  {
    topic: "Atomic structure",
    q: "Why are isotopes of the same element chemically similar?",
    options: ["They have the same number of neutrons.", "They have the same electron arrangement.", "They have different numbers of protons.", "They have the same mass number."],
    answer: 1,
    model: "Isotopes of an element have the same number of protons and electrons, so they have the same electron arrangement and similar chemical properties.",
    mark: "Credit: same protons/electrons; same electron arrangement; chemistry depends on outer electrons."
  },
  {
    topic: "Chemical changes",
    q: "In aqueous electrolysis of sodium chloride, why is hydrogen produced at the cathode rather than sodium?",
    options: ["Sodium is less reactive than hydrogen.", "Hydrogen is less reactive than sodium, so hydrogen ions are discharged.", "Chloride ions move to the cathode.", "Water cannot be electrolysed."],
    answer: 1,
    model: "In aqueous solution, hydrogen is produced if the metal is more reactive than hydrogen. Sodium is more reactive than hydrogen, so hydrogen ions are discharged at the cathode.",
    mark: "Credit: aqueous solution; sodium more reactive than hydrogen; hydrogen ions gain electrons; hydrogen gas forms."
  },
  {
    topic: "Quantitative chemistry",
    q: "A sample contains 24 g of magnesium and 16 g of oxygen. What is the empirical formula? Ar Mg=24, O=16.",
    options: ["MgO", "Mg2O", "MgO2", "Mg2O3"],
    answer: 0,
    model: "Moles Mg = 24/24 = 1. Moles O = 16/16 = 1. Ratio 1:1, so empirical formula is MgO.",
    mark: "Credit moles of each element; ratio 1:1; formula MgO."
  },
  {
    topic: "Bonding",
    q: "Why do simple molecular substances usually have low boiling points?",
    options: ["Strong covalent bonds break easily.", "Weak intermolecular forces require little energy to overcome.", "Ions are free to move.", "They have giant lattices."],
    answer: 1,
    model: "The covalent bonds within molecules are strong, but boiling only overcomes weak intermolecular forces between molecules, requiring little energy.",
    mark: "Credit: weak intermolecular forces; between molecules; little energy needed."
  },
  {
    topic: "Energy changes",
    q: "Using bond energies, a reaction has 945 kJ/mol used to break bonds and 1120 kJ/mol released forming bonds. What is the overall energy change?",
    options: ["+175 kJ/mol", "-175 kJ/mol", "+2065 kJ/mol", "-2065 kJ/mol"],
    answer: 1,
    model: "Energy change = energy in - energy out = 945 - 1120 = -175 kJ/mol. The negative sign shows the reaction is exothermic.",
    mark: "Credit correct equation; subtraction; -175 kJ/mol; exothermic conclusion."
  }
];

const practicals = [
  { title: "Making soluble salts", detail: "React an insoluble metal oxide/carbonate with acid. Warm gently, add excess solid, filter, then crystallise. Key control: use excess solid so all acid reacts." },
  { title: "Titration", detail: "Use a pipette for alkali, burette for acid and an indicator. Repeat until concordant results are obtained. Higher tier: calculate unknown concentration." },
  { title: "Electrolysis", detail: "Use inert electrodes and identify products at each electrode. Link cathode products to the reactivity series and anode products to halide ions." },
  { title: "Temperature changes", detail: "Use an insulated cup, fixed volumes and fixed concentrations. Record maximum or minimum temperature and calculate temperature change." }
];

const calculations = [
  { name: "Moles", formula: "moles = mass / Mr", example: "4.4 g CO2: 4.4 / 44 = 0.10 mol" },
  { name: "Concentration", formula: "concentration = moles / volume", example: "Use dm3, not cm3. 25 cm3 = 0.025 dm3." },
  { name: "Percentage yield", formula: "actual yield / theoretical yield x 100", example: "5.0 / 6.25 x 100 = 80%" },
  { name: "Atom economy", formula: "Mr desired product / total Mr reactants x 100", example: "A higher atom economy means less waste." },
  { name: "Energy change", formula: "bonds broken - bonds formed", example: "945 - 1120 = -175 kJ/mol" },
  { name: "Empirical formula", formula: "divide mass by Ar, then simplify ratio", example: "24g Mg and 16g O gives MgO" }
];

const topics = ["All", ...Array.from(new Set(questions.map(q => q.topic)))];

export default function App() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("quiz");
  const [topic, setTopic] = useState("All");
  const [order, setOrder] = useState(questions.map((_, i) => i));
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showExplain, setShowExplain] = useState(true);
  const [time, setTime] = useState(30);
  const [studentName, setStudentName] = useState("Guest student");
  const [savedBest, setSavedBest] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState("Atomic Beginner");
  const [dailyChallengeScore, setDailyChallengeScore] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [panicMode, setPanicMode] = useState(false);
  const [gradePrediction, setGradePrediction] = useState("Working towards Grade 5");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiTutorInput, setAiTutorInput] = useState("");
  const [aiTutorReply, setAiTutorReply] = useState("Ask me about electrolysis, bonding, moles, titration, energy changes or any AQA Paper 1 topic.");
  const [flashcards, setFlashcards] = useState([]);
  const [examMode, setExamMode] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { name: "Aisha", score: 29, streak: 11 },
    { name: "Noah", score: 27, streak: 8 },
    { name: "Amara", score: 26, streak: 7 },
    { name: "You", score: 0, streak: 0 }
  ]);
  const [focusMode, setFocusMode] = useState(false);
  const [rewardTheme, setRewardTheme] = useState("Classic Edspire");
  const [mounted, setMounted] = useState(false);

  const filteredOrder = useMemo(() => order.filter(i => topic === "All" || questions[i].topic === topic), [order, topic]);
  const qIndex = filteredOrder[position] ?? filteredOrder[0] ?? 0;
  const current = useMemo(() => {
    const q = questions[qIndex];
    const options = q.options.map((option, index) => ({ option, index }));

    // Deterministic shuffle avoids Next.js hydration errors.
    const shifted = options.map((_, i) => options[(i + qIndex) % options.length]);

    return {
      ...q,
      shuffledOptions: shifted,
      shuffledAnswer: shifted.findIndex(item => item.index === q.answer)
    };
  }, [qIndex]);
const answered = answers[qIndex as keyof typeof answers];
  const score = Object.values(answers).filter(a => a.correct).length;
  const attempted = Object.keys(answers).length;
  const pressure = Math.max(0, Math.round((time / 30) * 100));

  useEffect(() => {
    setMounted(true);
    const best = Number(localStorage.getItem("edspire-chem-best") || 0);
    const name = localStorage.getItem("edspire-student-name") || "Guest student";
    setSavedBest(best);
    setStudentName(name);
  }, []);

  useEffect(() => {
    localStorage.setItem("edspire-student-name", studentName);
    if (score > savedBest) {
      localStorage.setItem("edspire-chem-best", String(score));
      setSavedBest(score);
    }
  }, [score, savedBest, studentName]);

  useEffect(() => {
    if (tab !== "quiz" || answered) return;
    if (time <= 0) {
      setAnswers(prev => ({ ...prev, [qIndex]: { selected: null, correct: false, timedOut: true, topic: current.topic } }));
      setFlashcards(prev => prev.some(card => card.q === current.q) ? prev : [...prev, current]);
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, tab, answered, qIndex, current.topic]);

  useEffect(() => { setTime(30); setSelected(null); setShowExplain(true); }, [position, topic]);

  const mistakes = useMemo(() => Object.entries(answers).filter(([, a]) => !a.correct), [answers]);

  const weakTopics = useMemo(() => {
    const map = {};
    Object.entries(answers).forEach(([idx, ans]) => {
      const t = questions[idx].topic;
      if (!map[t]) map[t] = { total: 0, wrong: 0 };
      map[t].total++;
      if (!ans.correct) map[t].wrong++;
    });
    return Object.entries(map).sort((a, b) => b[1].wrong - a[1].wrong);
  }, [answers]);

  useEffect(() => {
    if (xp >= 1000) setLevel("Grade 9 Legend");
    else if (xp >= 700) setLevel("AQA Master");
    else if (xp >= 400) setLevel("Atomic Expert");
    else if (xp >= 150) setLevel("Chemical Apprentice");

    const percentage = Math.round((score / 30) * 100);
    if (percentage >= 85) setGradePrediction("Likely Grade 9");
    else if (percentage >= 75) setGradePrediction("Likely Grade 8");
    else if (percentage >= 65) setGradePrediction("Likely Grade 7");
    else if (percentage >= 55) setGradePrediction("Likely Grade 6");
    else setGradePrediction("Working towards Grade 5");
  }, [xp, score]);

  function unlockAchievement(name) {
    setAchievements(prev => prev.includes(name) ? prev : [...prev, name]);
  }

  function choose(i) {
    if (answered) return;
    setSelected(i);
    const correct = i === current.shuffledAnswer;
    if (correct) {
      setXp(prev => prev + 25);
      setStreak(prev => prev + 1);
      if (streak >= 4) unlockAchievement("5 Question Streak 🔥");
      if (score + 1 >= 25) unlockAchievement("Grade 9 Scientist 🧪");
      if (streak >= 9) unlockAchievement("Duolingo-style Streak Master 🔥");
      if (xp + 25 >= 500) unlockAchievement("Revision Beast 🧠");
    } else {
      setStreak(0);
      setFlashcards(prev => prev.some(card => card.q === current.q) ? prev : [...prev, current]);
    }

    setAnswers(prev => ({ ...prev, [qIndex]: { selected: i, correct, timedOut: false, topic: current.topic } }));
  }

  function resetQuiz() {
    setAnswers({});
    setPosition(0);
    setTime(30);
    setSelected(null);
    setTab("quiz");
  }

  function shuffleQuestions() {
    const shuffled = [...questions.map((_, i) => i)].sort(() => Math.random() - 0.5);
    setOrder(shuffled);
    resetQuiz();
  }

  function changeTopic(t) {
    setTopic(t);
    setPosition(0);
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className={dark ? "dark" : ""}>
      <main className="min-h-screen bg-[#fff8f2] text-slate-900 transition dark:bg-slate-950 dark:text-slate-100">
        <header className="sticky top-0 z-10 border-b border-[#f4d6c4] bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Edspire Tuition logo" className="h-14 w-14 rounded-2xl object-contain shadow-sm" />
              <div>
                <h1 className="text-xl font-black tracking-wide" style={{ color: BRAND.burgundy }}>Edspire Tuition</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">AQA GCSE Chemistry Higher Paper 1</p>
              </div>
            </div>
            <button onClick={() => setDark(!dark)} className="rounded-2xl border px-4 py-2 shadow-sm dark:border-slate-700">
              {dark ? <Sun className="inline h-4 w-4" /> : <Moon className="inline h-4 w-4" />} {dark ? "Day" : "Night"}
            </button>
          </div>
        </header>

        <section className="mx-auto max-w-6xl p-4">
          <div className="mb-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-4 shadow-lg dark:bg-slate-900">
              <p className="text-sm font-bold text-slate-500">XP</p>
              <p className="text-3xl font-black" style={{ color: BRAND.orange }}>{xp}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-lg dark:bg-slate-900">
              <p className="text-sm font-bold text-slate-500">Level</p>
              <p className="text-xl font-black" style={{ color: BRAND.purple }}>{level}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-lg dark:bg-slate-900">
              <p className="text-sm font-bold text-slate-500">Streak</p>
              <p className="text-3xl font-black" style={{ color: BRAND.pink }}>{streak} 🔥</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-lg dark:bg-slate-900">
              <p className="text-sm font-bold text-slate-500">Grade Predictor</p>
              <p className="text-lg font-black" style={{ color: BRAND.teal }}>{gradePrediction}</p>
            </div>
          </div>

          <div className="mb-5 rounded-3xl bg-gradient-to-br from-[#8C0026] via-[#D5105A] to-[#F28C00] p-6 text-white shadow-xl">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-bold"><Lock className="h-4 w-4" /> Local student profile</p>
                <h2 className="text-3xl font-black">Grade 8-9 Chemistry Challenge</h2>
                <p className="mt-2 max-w-2xl text-white/90">Timed AQA Paper 1 practice with no second attempts, model answers, mark-scheme style feedback, practicals, calculations and weak-topic tracking.</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4">
                <label className="text-xs font-bold uppercase">Student name</label>
                <input value={studentName} onChange={e => setStudentName(e.target.value)} className="mt-1 w-full rounded-xl border-0 px-3 py-2 text-slate-900" />
                <p className="mt-2 text-sm"><Trophy className="inline h-4 w-4" /> Best saved score: {savedBest}/30</p>
              </div>
            </div>
          </div>

          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["quiz", "Quiz"], ["results", "Results"], ["mistakes", "Mistakes"], ["practicals", "Practicals"], ["calculations", "Calculations"], ["analytics", "Weak topics"], ["tutor", "AI Tutor"], ["exam", "Exam Mode"], ["flashcards", "Flashcards"], ["leaderboard", "Leaderboard"], ["tools", "Tools"]
            ].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={`rounded-2xl px-4 py-3 font-semibold shadow-sm ${tab === id ? "bg-[#8C0026] text-white" : "bg-white dark:bg-slate-900"}`}>{label}</button>
            ))}
          </div>

          {tab === "quiz" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white p-5 shadow-xl dark:bg-slate-900">
              <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <select value={topic} onChange={e => changeTopic(e.target.value)} className="rounded-2xl border bg-white px-4 py-3 font-bold dark:border-slate-700 dark:bg-slate-800">
                  {topics.map(t => <option key={t}>{t}</option>)}
                </select>
                <button onClick={() => setPanicMode(!panicMode)} className={`rounded-2xl px-4 py-3 font-bold text-white ${panicMode ? 'bg-red-700 animate-pulse' : 'bg-[#D5105A]'}`}>
                  Panic Mode
                </button>
                <button onClick={() => setExamMode(!examMode)} className={`rounded-2xl px-4 py-3 font-bold text-white ${examMode ? 'bg-[#4B1373]' : 'bg-[#F28C00]'}`}>
                  {examMode ? 'Exam On' : 'Exam Off'}
                </button>
                <button onClick={shuffleQuestions} className="rounded-2xl bg-[#08AFC5] px-4 py-3 font-bold text-white"><Shuffle className="inline h-4 w-4" /> Randomise</button>
                <span className="rounded-2xl bg-[#F28C00]/15 px-4 py-3 font-bold text-[#8C0026] dark:text-orange-200">{position + 1}/{filteredOrder.length}</span>
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#08AFC5]/15 px-3 py-1 text-sm font-bold text-[#087b89] dark:text-cyan-200">Question {qIndex + 1}</span>
                <span className="rounded-full bg-[#4B1373]/10 px-3 py-1 text-sm font-bold text-[#4B1373] dark:text-purple-200">{current.topic}</span>
                <span className="flex items-center gap-2 font-bold"><Timer className="h-4 w-4" /> {time}s</span>
              </div>

              <div className="mb-5">
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold"><Flame className={`h-4 w-4 ${panicMode && time < 10 ? 'animate-bounce text-red-600' : ''}`} /> Pressure meter {panicMode && '(Exam Panic Mode Active)'}</div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full transition-all" style={{ width: `${pressure}%`, background: pressure > 60 ? BRAND.teal : pressure > 30 ? BRAND.orange : BRAND.pink }} />
                </div>
              </div>

              <h2 className="mb-5 text-2xl font-bold leading-snug">{current.q}</h2>

              <div className="grid gap-3">
                {current.shuffledOptions.map(({ option: op }, i) => {
                  const isCorrect = i === current.shuffledAnswer;
                  const isChosen = answered?.selected === i;
                  let optionStyle = "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800";

                  if (answered && isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-100 text-emerald-950";
                  }

                  if (answered && isChosen && !isCorrect) {
                    optionStyle = "border-red-500 bg-red-100 text-red-950";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      className={`rounded-2xl border-2 p-4 text-left font-medium transition ${optionStyle}`}
                    >
                      <span className="mr-2 font-black">{String.fromCharCode(65 + i)}.</span>
                      {op}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-5 rounded-2xl border p-4 dark:border-slate-700">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-bold">{answered.correct ? <><CheckCircle2 className="inline h-5 w-5 text-emerald-600" /> Correct</> : <><XCircle className="inline h-5 w-5 text-red-600" /> Incorrect / no second attempt</>}</p>
                    <button onClick={() => setShowExplain(!showExplain)} className="rounded-xl border px-3 py-2 text-sm dark:border-slate-700">{showExplain ? <EyeOff className="inline h-4 w-4" /> : <Eye className="inline h-4 w-4" />} {showExplain ? "Hide" : "Show"}</button>
                  </div>
                  {showExplain && <div className="space-y-2 text-sm"><p><b>Correct answer:</b> {current.shuffledOptions[current.shuffledAnswer].option}</p><p><b>Model answer:</b> {current.model}</p><p><b>Mark scheme:</b> {current.mark}</p><p><b>AI-style explanation:</b> The key exam skill is recognising the command idea, selecting the AQA-specific rule, and linking it to precise scientific vocabulary.</p></div>}
                </div>
              )}

              <div className="mt-5 flex justify-between gap-3">
                <button disabled={position === 0} onClick={() => setPosition(position - 1)} className="rounded-2xl bg-slate-200 px-5 py-3 font-bold disabled:opacity-40 dark:bg-slate-800">Back</button>
                <button onClick={() => position < filteredOrder.length - 1 ? setPosition(position + 1) : setTab("results")} className="rounded-2xl bg-[#8C0026] px-5 py-3 font-bold text-white">{position < filteredOrder.length - 1 ? "Next" : "Finish"}</button>
              </div>
            </motion.div>
          )}

          {tab === "results" && <Panel title="Results" icon={<Trophy />}><p className="text-4xl font-black">{score}/30</p><p className="mt-2">Percentage: {Math.round((score / 30) * 100)}%</p><p className="mt-2">Questions attempted: {attempted}/30</p><p className="mt-2">Best saved score on this device: {savedBest}/30</p><button onClick={resetQuiz} className="mt-4 rounded-2xl bg-[#8C0026] px-5 py-3 font-bold text-white">Restart quiz</button></Panel>}

          {tab === "mistakes" && <Panel title="Mistakes and corrections" icon={<AlertTriangle />}>
            {mistakes.length === 0 ? <p>No mistakes yet.</p> : mistakes.map(([num, a]) => { const q = questions[num]; return <div key={num} className="mb-4 rounded-2xl border p-4 dark:border-slate-700"><p className="font-bold">Q{Number(num)+1}: {q.q}</p><p className="text-red-600">Your answer: {a.timedOut || a.selected === null ? "Timed out" : q.options[a.selected]}</p><p className="text-emerald-600">Correct answer: {q.options[q.answer]}</p><p className="mt-2 text-sm">{q.model}</p></div> })}
          </Panel>}

          {tab === "practicals" && <Panel title="AQA Paper 1 practicals" icon={<FlaskConical />}>
            <div className="grid gap-4 md:grid-cols-2">{practicals.map(p => <InfoCard key={p.title} title={p.title} body={p.detail} />)}</div>
          </Panel>}

          {tab === "calculations" && <Panel title="Higher tier calculation practice" icon={<Calculator />}>
            <div className="grid gap-4 md:grid-cols-2">{calculations.map(c => <InfoCard key={c.name} title={c.name} body={`${c.formula}. Example: ${c.example}`} />)}</div>
          </Panel>}

          {tab === "analytics" && <Panel title="Weak topic tracking and achievements" icon={<BarChart3 />}>
            {weakTopics.length === 0 ? <p>Answer some questions first. Your weakest topics will appear here.</p> : weakTopics.map(([name, data]) => <div key={name} className="mb-4 rounded-2xl border p-4 dark:border-slate-700"><div className="flex justify-between font-bold"><span>{name}</span><span>{data.wrong}/{data.total} wrong</span></div><div className="mt-2 h-3 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-3 rounded-full bg-[#D5105A]" style={{ width: `${(data.wrong / data.total) * 100}%` }} /></div></div>)}
            <div className="mt-5 rounded-2xl border border-[#f4d6c4] p-4">
              <p className="mb-3 font-bold">Achievements</p>
              <div className="flex flex-wrap gap-2">
                {achievements.length === 0 ? <span className="text-sm">No achievements unlocked yet.</span> : achievements.map(a => <span key={a} className="rounded-full bg-[#8C0026] px-3 py-1 text-sm font-bold text-white">{a}</span>)}
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-[#08AFC5]/10 p-4"><p className="font-bold"><Brain className="inline h-5 w-5" /> Revision advice</p><p className="mt-1 text-sm">Prioritise the topics with the highest wrong-answer ratio, then retest using the topic filter.</p></div>
          </Panel>}

          {tab === "tutor" && <Panel title="AI Tutor" icon={<Brain />}>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">Front-end demo tutor. To make this a real AI tutor on Vercel, connect this box to an OpenAI API route.</p>
            <textarea value={aiTutorInput} onChange={e => setAiTutorInput(e.target.value)} placeholder="Ask: Explain electrolysis at the cathode..." className="min-h-28 w-full rounded-2xl border p-4 dark:border-slate-700 dark:bg-slate-800" />
            <button onClick={() => setAiTutorReply(`AQA-style explanation: ${aiTutorInput || "Choose a Paper 1 topic"}. Start with the key definition, link it to particles or energy, then finish with precise exam wording. For full AI responses, connect this to OpenAI in a Vercel API route.`)} className="mt-3 rounded-2xl bg-[#8C0026] px-5 py-3 font-bold text-white">Ask Tutor</button>
            <div className="mt-4 rounded-2xl bg-[#08AFC5]/10 p-4"><p className="font-bold">Tutor response</p><p className="mt-2 text-sm">{aiTutorReply}</p></div>
          </Panel>}

          {tab === "exam" && <Panel title="Real Exam Simulator" icon={<Timer />}>
            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard title="Paper 1 Mock" body="Use the quiz in Exam Mode with no pauses, timed pressure and final score review." />
              <InfoCard title="Grade Predictor" body={`Current prediction: ${gradePrediction}. This improves as more questions are answered.`} />
              <InfoCard title="Rules" body="One attempt only, no hints before answering, review mistakes after completion." />
            </div>
            <button onClick={() => { setExamMode(true); resetQuiz(); setTab('quiz'); }} className="mt-5 rounded-2xl bg-[#D5105A] px-5 py-3 font-bold text-white">Start Exam Simulation</button>
          </Panel>}

          {tab === "flashcards" && <Panel title="Flashcards and spaced repetition" icon={<BookOpen />}>
            {flashcards.length === 0 ? <p>Incorrect or timed-out questions will automatically appear here as flashcards.</p> : flashcards.map((card, i) => <div key={i} className="mb-4 rounded-2xl border p-4 dark:border-slate-700"><p className="font-bold">{card.q}</p><details className="mt-2"><summary className="cursor-pointer font-semibold text-[#8C0026]">Show answer</summary><p className="mt-2 text-sm">{card.model}</p></details></div>)}
          </Panel>}

          {tab === "leaderboard" && <Panel title="Leaderboard and rewards" icon={<Trophy />}>
            <div className="space-y-3">{leaderboard.map((row, i) => <div key={row.name} className="flex items-center justify-between rounded-2xl border p-4 dark:border-slate-700"><span className="font-bold">#{i + 1} {row.name}</span><span>{row.score}/30 • {row.streak} streak</span></div>)}</div>
            <div className="mt-5 rounded-2xl bg-[#F28C00]/10 p-4"><p className="font-bold">Rewards Shop</p><p className="text-sm">Current theme: {rewardTheme}</p><button onClick={() => setRewardTheme("Grade 9 Gold Theme")} className="mt-3 rounded-xl bg-[#F28C00] px-4 py-2 font-bold text-white">Unlock Gold Theme</button></div>
          </Panel>}

          {tab === "tools" && <Panel title="Chemistry calculator tools and focus mode" icon={<Calculator />}>
            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard title="Moles Calculator" body="Formula: moles = mass / Mr. Add live input boxes next when you want full calculator functionality." />
              <InfoCard title="Concentration Calculator" body="Formula: concentration = moles / volume in dm3." />
              <InfoCard title="Atom Economy Calculator" body="Formula: Mr desired product / total Mr reactants x 100." />
              <InfoCard title="Empirical Formula Tool" body="Divide each mass by Ar, then simplify the mole ratio." />
            </div>
            <button onClick={() => setFocusMode(!focusMode)} className="mt-5 rounded-2xl bg-[#4B1373] px-5 py-3 font-bold text-white">{focusMode ? 'Focus Mode On' : 'Turn On Focus Mode'}</button>
            {focusMode && <p className="mt-3 rounded-2xl bg-[#4B1373]/10 p-4 text-sm">Focus mode active: revise for 25 minutes, then take a 5 minute break.</p>}
          </Panel>}
        </section>
      </main>
    </div>
  );
}

function Panel({ title, icon, children }) {
  return <div className="rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900"><h2 className="mb-4 flex items-center gap-2 text-2xl font-bold" style={{ color: BRAND.burgundy }}>{icon}{title}</h2>{children}</div>;
}

function InfoCard({ title, body }) {
  return <div className="rounded-2xl border border-[#f4d6c4] p-4 dark:border-slate-700"><h3 className="flex items-center gap-2 font-bold text-[#8C0026]"><BookOpen className="h-4 w-4" />{title}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p></div>;
}