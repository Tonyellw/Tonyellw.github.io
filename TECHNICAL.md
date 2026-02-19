// SISTEMA - Technical Documentation

/**
 * STATE STRUCTURE
 */
const STATE_SCHEMA = {
    // Daily fixed missions (4 total)
    dailyMissions: {
        movimento: null | true | false,  // Physical movement (20+ min)
        mental: null | true | false,     // Mental evolution (10+ min)
        digital: null | true | false,    // Digital self-control
        alimentar: null | true | false   // Food tracking
    },

    // Rotating cycle system (changes every 3 days)
    rotatingCycle: 'A' | 'B' | 'C',
    cycleStartDate: 'ISO-8601 string',
    
    // Current rotating missions (based on cycle)
    rotatingMissions: {
        // Cycle A
        dormir: null | true | false,    // Configurable sleep minimum
        agua: null | true | false,      // 2L water
        
        // Cycle B
        acucar: null | true | false,    // Zero industrial sugar
        pendencia: null | true | false, // Solve 1 pending task
        
        // Cycle C
        desconforto: null | true | false,  // Do something uncomfortable
        organizar: null | true | false      // Organize environment
    },

    // Character attributes (0-100 scale)
    attributes: {
        forca: number,         // Strength - increases with strength training 3x/week
        stamina: number,       // Stamina - increases with cardio 2x/week
        disciplina: number,    // Discipline - based on weekly completion rate
        autocontrole: number   // Self-control - increases after 7 days without digital failure
    },

    // Weekly tracking data
    weeklyData: {
        totalMissions: number,       // Total missions attempted this week
        completedMissions: number,   // Successfully completed missions
        currentStreak: number,       // Current consecutive days with completion
        lastCompletionDate: string   // Last date with mission completion
    },

    // Historical data and tracking
    history: [
        {
            date: 'YYYY-MM-DD',
            missions: { ...dailyMissions, ...rotatingMissions },
            attributes: { ...attributes }
        }
    ],

    // Penalty system
    frozenUntil: null | 'ISO-8601 string',  // System freeze timestamp (48h after 2 consecutive failures)
    
    // Reset tracking
    lastResetDate: 'YYYY-MM-DD',

    // Strength training tracking
    strengthTraining: {
        lastWorkout: null | 'ISO-8601 string',
        weeklyCount: number  // Resets every week
    },

    // Cardio training tracking
    cardioTraining: {
        lastWorkout: null | 'ISO-8601 string',
        weeklyCount: number  // Resets every week
    },

    // Digital control tracking
    digitalControlStreak: number,  // Consecutive days without digital failure
    lastDigitalFail: null | 'ISO-8601 string'
};

/**
 * PROGRESSION LOGIC
 */

// FORÇA (Strength)
// - Increases by 2% per strength training session
// - Requires minimum 3 sessions per week for sustained growth
// - No increase if less than 3 sessions in a week

// STAMINA
// - Increases by 2% per cardio session
// - Requires minimum 2 sessions per week
// - Cannot have 2 consecutive days without stimulus

// DISCIPLINA (Discipline)
// - Weekly rate >= 90%: +3% (bonus)
// - Weekly rate >= 80%: +1% (good)
// - Weekly rate >= 60%: no change
// - Weekly rate < 60%: -2% (regression)
// - Also gets +1% per completed mental evolution mission
// - Also gets +1% per food tracking mission

// AUTOCONTROLE (Self-control)
// - Tracks consecutive days without digital failure
// - At 7 consecutive days: +5% boost
// - Resets to 0 on any digital control failure

/**
 * PENALTY SYSTEM
 */

// FREEZE CONDITION
// - Triggers when user fails 2+ missions on 2 consecutive days
// - Duration: 48 hours from detection
// - Effect: All mission cards become unclickable (frozen state)
// - Visual feedback: Frozen overlay message with hours remaining

/**
 * CYCLE ROTATION
 */

// CYCLE A (Days 1-3)
// - Dormir mínimo configurável
// - 2L água

// CYCLE B (Days 4-6)
// - Zero açúcar industrial
// - Resolver 1 pendência

// CYCLE C (Days 7-9)
// - Fazer algo desconfortável
// - Organizar ambiente

// Automatically rotates every 3 days at midnight reset

/**
 * DAILY RESET LOGIC
 */

// Triggers at midnight (00:00) each day:
// 1. Check for consecutive failures (freeze check)
// 2. Update rotating cycle if 3 days have passed
// 3. Reset all mission states to null
// 4. Save previous day to history
// 5. Check if new week started (reset weekly counters)
// 6. Calculate and update weekly discipline attribute

/**
 * FEEDBACK MESSAGES
 */

const FEEDBACK_TYPES = {
    success: [
        'Missão concluída.',
        'Barra de [Atributo] aumentou.',
        'Sequência mantida.'
    ],
    fail: [
        'Falha registrada.',
        'Sequência quebrada.',
        'Sistema congelado por [X]h devido a falhas consecutivas.'
    ],
    info: [
        'Sistema aguardando registro.',
        'Ciclo [A/B/C] ativo.',
        'Consistência insuficiente.'
    ]
};

/**
 * STORAGE
 */

// Uses localStorage with key: 'sistemaState'
// JSON serialization of entire state object
// Automatic save after every state mutation
// Load on app initialization with reset check

/**
 * UI COMPONENTS
 */

// MISSION CARD
// - Shows mission name and description
// - Two action buttons: ✔ (complete) and ✘ (fail)
// - Visual states: neutral, completed (green), failed (red), frozen (disabled)

// ATTRIBUTE BAR
// - Name label and percentage value
// - Animated progress bar (0-100%)
// - Smooth transitions on value changes
// - Shimmer effect animation

// WEEKLY STATS
// - Completion rate percentage
// - Current streak count (days)
// - System status message

/**
 * NOTIFICATIONS (Future Implementation)
 */

// Planned notification types:
// - "Missões disponíveis." (daily at configured time)
// - "Execução pendente." (reminder if no missions completed)
// - "Sistema aguardando registro." (end of day reminder)

/**
 * CONFIGURATION OPTIONS (Future Implementation)
 */

// User configurable settings:
// - Minimum sleep hours for "dormir" mission
// - Notification times
// - Week start day (Monday/Sunday)
// - Strength vs Cardio classification for "movimento" mission

/**
 * EXPORT/IMPORT (Future Implementation)
 */

// Allow users to:
// - Export state to JSON file
// - Import previous state
// - Backup to cloud storage
// - Generate progress reports

/**
 * ANALYTICS (Future Implementation)
 */

// Track and visualize:
// - Monthly completion trends
// - Attribute progression charts
// - Streak history
// - Most/least completed missions
// - Time-based patterns
