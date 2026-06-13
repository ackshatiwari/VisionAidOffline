import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import './AudioCues.css';

const COLOR_MAP = {
    "person": "#10b981",
    "stairs": "#ef4444",
    "staircase": "#ef4444",
    "steps": "#ef4444",
    "wall": "#8b5cf6",
    "door": "#3b82f6",
    "doorway": "#3b82f6",
    "chair": "#f59e0b",
    "stool": "#f59e0b",
    "couch": "#f59e0b",
    "sofa": "#f59e0b",
    "table": "#f59e0b",
    "dining table": "#f59e0b",
    "desk": "#f59e0b",
};

const CUE_TRANSLATIONS = {
    en: {
        person: "Person", stairs: "Stairs", staircase: "Stairs", steps: "Stairs",
        wall: "Wall", door: "Door", doorway: "Door", chair: "Chair",
        stool: "Chair", couch: "Couch", sofa: "Couch", table: "Table",
        "dining table": "Table", desk: "Desk",
        ahead: "ahead", meters: "meters",
        center: "center", left: "left", right: "right",
        slightlyLeft: "slightly left", slightlyRight: "slightly right",
        farLeft: "far left", farRight: "far right",
    },
    fr: {
        person: "Piéton", stairs: "Escaliers", staircase: "Escaliers", steps: "Marches",
        wall: "Mur", door: "Porte", doorway: "Entrée", chair: "Chaise",
        stool: "Tabouret", couch: "Canapé", sofa: "Canapé", table: "Table",
        "dining table": "Table", desk: "Bureau",
        ahead: "devant", meters: "mètres",
        center: "au centre", left: "à gauche", right: "à droite",
        slightlyLeft: "légèrement à gauche", slightlyRight: "légèrement à droite",
        farLeft: "très à gauche", farRight: "très à droite",
    },
    ln: {
        person: "Moto", stairs: "Matelo", staircase: "Matelo", steps: "Matelo",
        wall: "Lobwaku", door: "Ekuke", doorway: "Ekuke", chair: "Kiti",
        stool: "Kiti", couch: "Sofa", sofa: "Sofa", table: "Mesa",
        "dining table": "Mesa", desk: "Mesa ya mosala",
        ahead: "liboso", meters: "mètres",
        center: "na kati", left: "na loboko ya mwasi", right: "na loboko ya mobali",
        slightlyLeft: "mwa na loboko ya mwasi", slightlyRight: "mwa na loboko ya mobali",
        farLeft: "mosika na loboko ya mwasi", farRight: "mosika na loboko ya mobali",
    },
    sw: {
        person: "Mtu", stairs: "Ngazi", staircase: "Ngazi", steps: "Hatua",
        wall: "Ukuta", door: "Mlango", doorway: "Mlango", chair: "Kiti",
        stool: "Kiti", couch: "Kochi", sofa: "Kochi", table: "Meza",
        "dining table": "Meza", desk: "Dawati",
        ahead: "mbele", meters: "mita",
        center: "katikati", left: "kushoto", right: "kulia",
        slightlyLeft: "kidogo kushoto", slightlyRight: "kidogo kulia",
        farLeft: "mbali kushoto", farRight: "mbali kulia",
    },
};

// BCP-47 tags for speechSynthesis voice matching.
// Lingala has no built-in TTS voice — French is the closest available language in DRC.
const SPEECH_LANG = { en: 'en', fr: 'fr', ln: 'fr', sw: 'sw' };

// Female name fragments found in common browser voice names
const FEMALE_HINTS = ['female', 'woman', 'girl', 'samantha', 'fiona', 'karen',
    'victoria', 'moira', 'tessa', 'amelie', 'alice', 'zuzana', 'anna',
    'carmit', 'joana', 'lucia', 'lekha', 'veena', 'ioana', 'milena'];

const DIR_KEY_MAP = {
    "WNW": "farLeft", "NW": "left", "NNW": "slightlyLeft",
    "N": "center",
    "NNE": "slightlyRight", "NE": "right", "ENE": "farRight",
};

function pickVoice(voices, langCode, gender) {
    const tag = SPEECH_LANG[langCode] ?? 'en';
    const pool = voices.filter(v => v.lang.toLowerCase().startsWith(tag));
    const fallback = pool.length > 0 ? pool : voices.filter(v => v.lang.startsWith('en'));

    if (gender === 'Female') {
        const female = fallback.find(v =>
            FEMALE_HINTS.some(h => v.name.toLowerCase().includes(h))
        );
        return female ?? fallback[0] ?? null;
    }
    // Male: prefer voices that are NOT in the female list
    const male = fallback.find(v =>
        !FEMALE_HINTS.some(h => v.name.toLowerCase().includes(h))
    );
    return male ?? fallback[0] ?? null;
}

export default function AudioCues({ detections = [] }) {
    const [cuesHistory, setCuesHistory] = useState([]);
    const [voice, setVoice] = useState('Female');
    const [speaking, setSpeaking] = useState(false);
    const { language } = useLanguage();
    const lastCuedRef = useRef({});
    const voicesRef = useRef([]);
    const speakingRef = useRef(false); // mirrors `speaking` but readable inside closures
    const pendingRef = useRef(null);   // latest cue text queued while speaking

    // Load available voices (browser fires onvoiceschanged asynchronously)
    useEffect(() => {
        function loadVoices() {
            voicesRef.current = window.speechSynthesis.getVoices();
        }
        loadVoices();
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    }, []);

    const [tick, setTick] = useState(0);
    useEffect(() => {
        const clock = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(clock);
    }, []);

    const speakNow = (text) => {
        if (!window.speechSynthesis) return;
        const utt = new SpeechSynthesisUtterance(text);
        const picked = pickVoice(voicesRef.current, language, voice);
        if (picked) utt.voice = picked;
        utt.lang = picked?.lang ?? (SPEECH_LANG[language] ?? 'en');
        utt.rate = 0.95;
        utt.pitch = voice === 'Female' ? 1.1 : 0.9;
        utt.onstart = () => { speakingRef.current = true; setSpeaking(true); };
        utt.onend = () => {
            speakingRef.current = false;
            setSpeaking(false);
            // If a newer cue arrived while we were speaking, say it now
            if (pendingRef.current) {
                const next = pendingRef.current;
                pendingRef.current = null;
                speakNow(next);
            }
        };
        utt.onerror = () => { speakingRef.current = false; setSpeaking(false); };
        window.speechSynthesis.speak(utt);
    };

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        if (speakingRef.current) {
            // Don't interrupt — just remember the latest alert
            pendingRef.current = text;
        } else {
            speakNow(text);
        }
    };

    useEffect(() => {
        if (!detections || detections.length === 0) return;
        const now = Date.now();
        const newCues = [];

        detections.forEach(item => {
            const key = `${item.class}_${item.direction}`;
            if (now - (lastCuedRef.current[key] || 0) > 4000) {
                lastCuedRef.current[key] = now;
                newCues.push({
                    id: `${now}-${Math.random()}`,
                    class: item.class,
                    direction: item.direction,
                    distance: item.distance,
                    timestamp: now,
                    color: COLOR_MAP[item.class.toLowerCase()] || "#a78bfa",
                });
            }
        });

        if (newCues.length > 0) {
            setCuesHistory(prev => [...newCues, ...prev].slice(0, 10));
            // Speak the highest-priority (first) new cue
            const cue = newCues[0];
            const dict = CUE_TRANSLATIONS[language] ?? CUE_TRANSLATIONS.en;
            const label = dict[cue.class.toLowerCase()] ?? cue.class;
            const dirKey = DIR_KEY_MAP[cue.direction] ?? "center";
            const distance = Math.round(cue.distance);
            speak(`${label} ${dict.ahead} ${dict[dirKey]}, ${distance} ${dict.meters}`);
        }
    }, [detections]);

    const formatCueText = (cue) => {
        const dict = CUE_TRANSLATIONS[language] ?? CUE_TRANSLATIONS.en;
        const label = dict[cue.class.toLowerCase()] ?? cue.class;
        const dirKey = DIR_KEY_MAP[cue.direction] ?? "center";
        const distance = Math.round(cue.distance);
        return `"${label} ${dict.ahead} ${dict[dirKey]}, ${distance} ${dict.meters}."`;
    };

    const getRelativeTime = (timestamp) => {
        const elapsed = Math.round((Date.now() - timestamp) / 1000);
        if (elapsed < 2) return "Just now";
        return `${elapsed}s ago`;
    };

    return (
        <div className="audiocues">
            <div className="audiocues__header">
                <span className="audiocues__title">AUDIO CUES (LIVE)</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke={speaking ? "#22c55e" : "#2563eb"}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'stroke 0.2s' }}>
                    <line x1="4" y1="9" x2="4" y2="15" />
                    <line x1="9" y1="4" x2="9" y2="20" />
                    <line x1="14" y1="7" x2="14" y2="17" />
                    <line x1="19" y1="11" x2="19" y2="13" />
                </svg>
            </div>

            <div className="audiocues__body">
                <div className="audiocues__left">
                    <div className={`audiocues__speaker-ring ${speaking ? 'audiocues__speaker-ring--active' : ''}`}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#eab308" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                    </div>
                    <span className="audiocues__listening-text">
                        {speaking ? 'Speaking...' : 'Listening...'}
                    </span>
                </div>

                <div className="audiocues__right">
                    {cuesHistory.length === 0 ? (
                        <div className="audiocues__empty">Waiting for obstacles...</div>
                    ) : (
                        cuesHistory.map(cue => (
                            <div key={cue.id} className="audiocues__cue">
                                <div className="audiocues__cue-content">
                                    <div className="audiocues__indicator" style={{ backgroundColor: cue.color }} />
                                    <div className="audiocues__cue-info">
                                        <span className="audiocues__cue-text">{formatCueText(cue)}</span>
                                        <span className="audiocues__cue-time">{getRelativeTime(cue.timestamp)}</span>
                                    </div>
                                </div>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="6" y1="10" x2="6" y2="14" />
                                    <line x1="10" y1="6" x2="10" y2="18" />
                                    <line x1="14" y1="8" x2="14" y2="16" />
                                    <line x1="18" y1="11" x2="18" y2="13" />
                                </svg>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="audiocues__footer">
                <div className="audiocues__voice-select">
                    <select
                        value={voice}
                        onChange={e => setVoice(e.target.value)}
                        className="audiocues__dropdown"
                    >
                        <option value="Female">Voice: Female</option>
                        <option value="Male">Voice: Male</option>
                    </select>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
