// SISTEMA - Personal Evolution App
// Data Structure and State Management

class SistemaApp {
    constructor() {
        this.state = this.loadState();
        this.init();
    }

    // Initialize default state
    getDefaultState() {
        return {
            dailyMissions: {
                movimento: null,
                mental: null,
                digital: null,
                alimentar: null
            },
            rotatingCycle: 'A', // A, B, C
            cycleStartDate: new Date().toISOString(),
            rotatingMissions: {
                dormir: null,
                agua: null
            },
            attributes: {
                forca: 0,
                stamina: 0,
                disciplina: 0,
                autocontrole: 0
            },
            weeklyData: {
                totalMissions: 0,
                completedMissions: 0,
                currentStreak: 0,
                lastCompletionDate: null
            },
            history: [],
            frozenUntil: null,
            lastResetDate: new Date().toISOString().split('T')[0],
            strengthTraining: {
                lastWorkout: null,
                weeklyCount: 0
            },
            cardioTraining: {
                lastWorkout: null,
                weeklyCount: 0
            },
            digitalControlStreak: 0,
            lastDigitalFail: null
        };
    }

    // Load state from localStorage
    loadState() {
        const saved = localStorage.getItem('sistemaState');
        if (saved) {
            const state = JSON.parse(saved);
            // Check if we need to reset daily missions
            const today = new Date().toISOString().split('T')[0];
            if (state.lastResetDate !== today) {
                return this.resetDailyMissions(state);
            }
            return state;
        }
        return this.getDefaultState();
    }

    // Save state to localStorage
    saveState() {
        localStorage.setItem('sistemaState', JSON.stringify(this.state));
    }

    // Reset daily missions at midnight
    resetDailyMissions(state) {
        const today = new Date().toISOString().split('T')[0];
        
        // Check for consecutive failures
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const todayHistory = state.history.find(h => h.date === state.lastResetDate);
        const yesterdayHistory = state.history.find(h => h.date === yesterdayStr);
        
        if (todayHistory && yesterdayHistory) {
            const todayFailed = Object.values(todayHistory.missions).filter(m => m === false).length >= 2;
            const yesterdayFailed = Object.values(yesterdayHistory.missions).filter(m => m === false).length >= 2;
            
            if (todayFailed && yesterdayFailed) {
                // Freeze for 48 hours
                const freezeUntil = new Date();
                freezeUntil.setHours(freezeUntil.getHours() + 48);
                state.frozenUntil = freezeUntil.toISOString();
            }
        }

        // Update cycle every 3 days
        const cycleStart = new Date(state.cycleStartDate);
        const daysSinceCycleStart = Math.floor((new Date() - cycleStart) / (1000 * 60 * 60 * 24));
        
        if (daysSinceCycleStart >= 3) {
            const cycles = ['A', 'B', 'C'];
            const currentIndex = cycles.indexOf(state.rotatingCycle);
            state.rotatingCycle = cycles[(currentIndex + 1) % 3];
            state.cycleStartDate = new Date().toISOString();
        }

        // Reset weekly counters if new week
        const currentWeek = this.getWeekNumber(new Date());
        const lastWeek = this.getWeekNumber(new Date(state.lastResetDate));
        
        if (currentWeek !== lastWeek) {
            state.strengthTraining.weeklyCount = 0;
            state.cardioTraining.weeklyCount = 0;
        }

        return {
            ...state,
            dailyMissions: {
                movimento: null,
                mental: null,
                digital: null,
                alimentar: null
            },
            rotatingMissions: this.getRotatingMissionsForCycle(state.rotatingCycle),
            lastResetDate: today
        };
    }

    getRotatingMissionsForCycle(cycle) {
        const missions = {
            A: { dormir: null, agua: null },
            B: { acucar: null, pendencia: null },
            C: { desconforto: null, organizar: null }
        };
        return missions[cycle] || missions.A;
    }

    getWeekNumber(date) {
        const onejan = new Date(date.getFullYear(), 0, 1);
        const millisecsInDay = 86400000;
        return Math.ceil((((date - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
    }

    // Initialize app
    init() {
        this.updateUI();
        this.attachEventListeners();
        this.checkFrozenState();
        this.updateCycle();
    }

    // Update all UI elements
    updateUI() {
        this.updateDate();
        this.updateRotatingMissions();
        this.updateAttributes();
        this.updateWeeklyStats();
        this.updateMissionStates();
    }

    updateDate() {
        const date = new Date();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        document.getElementById('currentDate').textContent = date.toLocaleDateString('pt-BR', options);
    }

    updateRotatingMissions() {
        const container = document.getElementById('rotatingMissions');
        const cycleIndicator = document.getElementById('cycleIndicator');
        cycleIndicator.textContent = `CICLO ${this.state.rotatingCycle}`;

        const missions = {
            A: [
                { key: 'dormir', name: 'Dormir mínimo configurável', desc: 'definir nas configurações' },
                { key: 'agua', name: '2L água', desc: 'hidratação diária' }
            ],
            B: [
                { key: 'acucar', name: 'Zero açúcar industrial', desc: 'dia limpo' },
                { key: 'pendencia', name: 'Resolver 1 pendência', desc: 'ação concreta' }
            ],
            C: [
                { key: 'desconforto', name: 'Fazer algo desconfortável', desc: 'expansão de zona' },
                { key: 'organizar', name: 'Organizar ambiente', desc: 'espaço físico' }
            ]
        };

        const currentMissions = missions[this.state.rotatingCycle];
        
        container.innerHTML = currentMissions.map(mission => `
            <div class="mission-card" data-mission="${mission.key}">
                <div class="mission-info">
                    <span class="mission-name">${mission.name}</span>
                    <span class="mission-desc">${mission.desc}</span>
                </div>
                <div class="mission-controls">
                    <button class="btn-check" data-status="complete">✔</button>
                    <button class="btn-check" data-status="fail">✘</button>
                </div>
            </div>
        `).join('');

        // Reattach listeners for rotating missions
        this.attachMissionListeners();
    }

    updateAttributes() {
        const attrs = this.state.attributes;
        
        ['forca', 'stamina', 'disciplina', 'autocontrole'].forEach(attr => {
            const value = Math.min(Math.max(attrs[attr], 0), 100);
            document.getElementById(`${attr}Value`).textContent = `${value}%`;
            document.getElementById(`${attr}Bar`).style.width = `${value}%`;
        });
    }

    updateWeeklyStats() {
        const { weeklyData } = this.state;
        const rate = weeklyData.totalMissions > 0 
            ? Math.round((weeklyData.completedMissions / weeklyData.totalMissions) * 100)
            : 0;

        document.getElementById('weeklyRate').textContent = `${rate}%`;
        document.getElementById('currentStreak').textContent = `${weeklyData.currentStreak} dias`;

        let status = 'AGUARDANDO EXECUÇÃO';
        if (rate >= 90) status = 'EXCELENTE';
        else if (rate >= 80) status = 'BOM';
        else if (rate >= 60) status = 'REGULAR';
        else if (rate > 0) status = 'INSUFICIENTE';

        document.getElementById('systemStatus').textContent = status;
    }

    updateMissionStates() {
        // Update daily missions
        Object.keys(this.state.dailyMissions).forEach(key => {
            const card = document.querySelector(`.mission-card[data-mission="${key}"]`);
            if (card) {
                card.classList.remove('completed', 'failed');
                const status = this.state.dailyMissions[key];
                if (status === true) card.classList.add('completed');
                if (status === false) card.classList.add('failed');
            }
        });

        // Update rotating missions
        Object.keys(this.state.rotatingMissions).forEach(key => {
            const card = document.querySelector(`.mission-card[data-mission="${key}"]`);
            if (card) {
                card.classList.remove('completed', 'failed');
                const status = this.state.rotatingMissions[key];
                if (status === true) card.classList.add('completed');
                if (status === false) card.classList.add('failed');
            }
        });
    }

    // Event listeners
    attachEventListeners() {
        this.attachMissionListeners();
    }

    attachMissionListeners() {
        document.querySelectorAll('.mission-card').forEach(card => {
            const missionKey = card.dataset.mission;
            const buttons = card.querySelectorAll('.btn-check');

            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const status = btn.dataset.status === 'complete';
                    this.completeMission(missionKey, status);
                });
            });
        });
    }

    // Complete mission
    completeMission(missionKey, isComplete) {
        if (this.isFrozen()) {
            this.showFeedback('Sistema congelado. Aguarde liberação.', 'fail');
            return;
        }

        // Determine if daily or rotating mission
        const isDailyMission = missionKey in this.state.dailyMissions;
        
        if (isDailyMission) {
            this.state.dailyMissions[missionKey] = isComplete;
        } else {
            this.state.rotatingMissions[missionKey] = isComplete;
        }

        // Update weekly data
        this.state.weeklyData.totalMissions++;
        if (isComplete) {
            this.state.weeklyData.completedMissions++;
            this.updateStreak();
        } else {
            this.state.weeklyData.currentStreak = 0;
            
            // Track digital control failures
            if (missionKey === 'digital') {
                this.state.digitalControlStreak = 0;
                this.state.lastDigitalFail = new Date().toISOString();
            }
        }

        // Update attributes based on mission
        this.updateAttributesBasedOnMission(missionKey, isComplete);

        // Save and update
        this.saveState();
        this.updateUI();

        // Show feedback
        const message = isComplete ? 'Missão concluída.' : 'Falha registrada.';
        this.showFeedback(message, isComplete ? 'success' : 'fail');
    }

    updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = this.state.weeklyData.lastCompletionDate;

        if (!lastDate) {
            this.state.weeklyData.currentStreak = 1;
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastDate === yesterdayStr) {
                this.state.weeklyData.currentStreak++;
            } else if (lastDate !== today) {
                this.state.weeklyData.currentStreak = 1;
            }
        }

        this.state.weeklyData.lastCompletionDate = today;
    }

    updateAttributesBasedOnMission(missionKey, isComplete) {
        if (!isComplete) return;

        const increment = 2;

        switch(missionKey) {
            case 'movimento':
                // Assume it's strength training if not specified
                this.state.attributes.forca = Math.min(this.state.attributes.forca + increment, 100);
                this.state.strengthTraining.lastWorkout = new Date().toISOString();
                this.state.strengthTraining.weeklyCount++;
                break;

            case 'mental':
                this.state.attributes.disciplina = Math.min(this.state.attributes.disciplina + increment, 100);
                break;

            case 'digital':
                this.state.digitalControlStreak++;
                if (this.state.digitalControlStreak >= 7) {
                    this.state.attributes.autocontrole = Math.min(this.state.attributes.autocontrole + 5, 100);
                    this.showFeedback('Barra de Autocontrole aumentou.', 'success');
                }
                break;

            case 'alimentar':
                this.state.attributes.disciplina = Math.min(this.state.attributes.disciplina + 1, 100);
                break;
        }

        // Weekly discipline calculation
        const rate = this.state.weeklyData.totalMissions > 0 
            ? (this.state.weeklyData.completedMissions / this.state.weeklyData.totalMissions) * 100
            : 0;

        if (rate >= 90) {
            this.state.attributes.disciplina = Math.min(this.state.attributes.disciplina + 3, 100);
        } else if (rate >= 80) {
            this.state.attributes.disciplina = Math.min(this.state.attributes.disciplina + 1, 100);
        } else if (rate < 60) {
            this.state.attributes.disciplina = Math.max(this.state.attributes.disciplina - 2, 0);
        }
    }

    // Feedback system
    showFeedback(message, type = 'info') {
        const container = document.getElementById('feedbackContainer');
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.textContent = message;
        
        container.appendChild(feedback);

        setTimeout(() => {
            feedback.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }

    // Frozen state management
    isFrozen() {
        if (!this.state.frozenUntil) return false;
        return new Date() < new Date(this.state.frozenUntil);
    }

    checkFrozenState() {
        if (this.isFrozen()) {
            const frozenUntil = new Date(this.state.frozenUntil);
            const hoursLeft = Math.ceil((frozenUntil - new Date()) / (1000 * 60 * 60));
            
            this.showFeedback(`Sistema congelado por ${hoursLeft}h devido a falhas consecutivas.`, 'fail');
            
            // Add frozen class to all mission cards
            document.querySelectorAll('.mission-card').forEach(card => {
                card.classList.add('frozen');
            });
        }
    }

    updateCycle() {
        // Check if cycle needs to update
        const cycleStart = new Date(this.state.cycleStartDate);
        const daysSinceCycleStart = Math.floor((new Date() - cycleStart) / (1000 * 60 * 60 * 24));
        
        if (daysSinceCycleStart >= 3) {
            const cycles = ['A', 'B', 'C'];
            const currentIndex = cycles.indexOf(this.state.rotatingCycle);
            this.state.rotatingCycle = cycles[(currentIndex + 1) % 3];
            this.state.cycleStartDate = new Date().toISOString();
            this.state.rotatingMissions = this.getRotatingMissionsForCycle(this.state.rotatingCycle);
            this.saveState();
            this.updateRotatingMissions();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaApp = new SistemaApp();
});
