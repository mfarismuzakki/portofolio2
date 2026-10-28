/**
 * Tanya Jawab Islam — AI Chat Module for IslamHub
 * =================================================
 * Client-side RAG chatbot using Groq API with curated knowledge base.
 * Follows IslamHub module pattern (like FiqhApp, HaditsApp).
 */
import {
    SYSTEM_PROMPT,
    EXAMPLE_QUESTIONS,
    MODEL_OPTIONS,
    DEFAULT_CONFIG,
    searchKnowledgeBase
} from '../../data/tanyajawab/tanyajawab-data.js';
import { t, locale, getLang } from '../../i18n/index.js';

const STORAGE_KEY = 'islamhub_tanyajawab_v1';
const CONFIG_KEY = 'islamhub_tanyajawab_config';

export default class TanyaJawabApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;

        // Try to find existing container, or create one if it doesn't exist (e.g. service worker cached old HTML)
        this.container = document.getElementById('tanyajawab-app');
        if (!this.container) {
            console.warn('[TanyaJawab] Container #tanyajawab-app not found in DOM, creating dynamically...');
            this.container = document.createElement('div');
            this.container.id = 'tanyajawab-app';
            this.container.className = 'app-component active';
            this.container.dataset.app = 'tanyajawab';
            // Insert into the app-content area (or body as fallback)
            const appContent = document.querySelector('.app-content') || document.querySelector('main') || document.body;
            appContent.appendChild(this.container);
        }

        // Chat state
        this.sessions = [];
        this.currentSessionId = null;
        this.isLoading = false;
        this.abortController = null;

        // Config
        this.config = { ...DEFAULT_CONFIG };
    }

    async init() {
        this.loadConfig();
        this.loadSessions();

        // Ensure at least one session exists
        if (this.sessions.length === 0) {
            this.createSession(false);
        }

        this.render();
    }

    // ── Persistence ──────────────────────────────────────────────────

    loadSessions() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                this.sessions = data.sessions || [];
                this.currentSessionId = data.currentId || null;
            }
        } catch (e) {
            console.warn('[TanyaJawab] Failed to load sessions:', e);
        }
    }

    saveSessions() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                sessions: this.sessions,
                currentId: this.currentSessionId
            }));
        } catch (e) {
            console.warn('[TanyaJawab] Failed to save sessions:', e);
        }
    }

    loadConfig() {
        try {
            const saved = localStorage.getItem(CONFIG_KEY);
            if (saved) {
                this.config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('[TanyaJawab] Failed to load config:', e);
        }
    }

    saveConfig() {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
        } catch (e) {
            console.warn('[TanyaJawab] Failed to save config:', e);
        }
    }

    // ── Session Management ───────────────────────────────────────────

    currentSession() {
        return this.sessions.find(s => s.id === this.currentSessionId) || null;
    }

    createSession(render = true) {
        const session = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            title: t('tanyajawab.newChat'),
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.sessions.unshift(session);
        this.currentSessionId = session.id;
        this.saveSessions();
        if (render) this.renderAll();
        return session;
    }

    switchSession(id) {
        if (this.isLoading) return;
        this.currentSessionId = id;
        this.saveSessions();
        this.renderAll();
        this.closeSidebar();
    }

    deleteSession(id) {
        this.sessions = this.sessions.filter(s => s.id !== id);
        if (this.currentSessionId === id) {
            this.currentSessionId = this.sessions.length > 0 ? this.sessions[0].id : null;
            if (!this.currentSessionId) this.createSession(false);
        }
        this.saveSessions();
        this.renderAll();
    }

    // ── Render: Full UI ──────────────────────────────────────────────

    render() {
        this.container.innerHTML = `
        <div class="tanyajawab-container">
            <!-- Sidebar Overlay (mobile) -->
            <div class="tj-sidebar-overlay" id="tjSidebarOverlay"></div>

            <!-- Sidebar -->
            <aside class="tj-sidebar" id="tjSidebar">
                <div class="tj-sidebar-header">
                    <h3><i class="fas fa-comments"></i> ${t('tanyajawab.chatHistory')}</h3>
                    <button class="tj-header-btn" id="tjNewChatSidebar" title="${t('tanyajawab.newChat')}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="tj-session-list" id="tjSessionList">
                    <!-- Sessions rendered dynamically -->
                </div>
            </aside>

            <!-- Chat Area -->
            <div class="tj-chat-area">
                <!-- Header -->
                <div class="tj-header">
                    <div class="tj-header-left">
                        <button class="tj-header-btn" id="tjToggleSidebar" title="${t('tanyajawab.chatHistory')}">
                            <i class="fas fa-bars"></i>
                        </button>
                        <span class="tj-header-title" id="tjHeaderTitle">${t('tanyajawab.title')}</span>
                    </div>
                    <div class="tj-header-right">
                        <div class="tj-status" id="tjStatus">
                            <span class="tj-status-dot" id="tjStatusDot"></span>
                            <span class="tj-status-text" id="tjStatusText">${t('tanyajawab.offline')}</span>
                        </div>
                        <button class="tj-header-btn" id="tjNewChat" title="${t('tanyajawab.newChat')}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="tj-header-btn" id="tjDeleteChat" title="${t('tanyajawab.deleteChat')}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button class="tj-header-btn" id="tjSettingsBtn" title="${t('tanyajawab.settingsTitle')}">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>

                <!-- Messages -->
                <div class="tj-messages" id="tjMessages">
                    <!-- Messages or Welcome screen rendered here -->
                </div>

                <!-- Input Area -->
                <div class="tj-input-area">
                    <div class="tj-input-wrap">
                        <textarea class="tj-textarea" id="tjInput" rows="1"
                            placeholder="${t('tanyajawab.inputPlaceholder')}"
                            maxlength="2000"></textarea>
                        <button class="tj-send-btn" id="tjSendBtn" disabled title="${t('tanyajawab.send')}">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="tj-input-hint">
                        <i class="fas fa-shield-halved"></i>
                        ${t('tanyajawab.inputHint')}
                    </div>
                </div>
            </div>

            <!-- Settings Panel -->
            <div class="tj-settings-overlay" id="tjSettingsOverlay">
                <div class="tj-settings-panel">
                    <div class="tj-settings-header">
                        <h3><i class="fas fa-cog"></i> ${t('tanyajawab.settingsTitle')}</h3>
                        <button class="tj-header-btn" id="tjSettingsClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="tj-settings-body">
                        <!-- Provider Selection -->
                        <div class="tj-settings-group">
                            <label><i class="fas fa-server"></i> ${t('tanyajawab.provider')}</label>
                            <select class="tj-settings-select" id="tjProvider">
                                <option value="groq">${t('tanyajawab.providerGroq')}</option>
                                <option value="local">${t('tanyajawab.providerLocal')}</option>
                            </select>
                        </div>

                        <!-- Groq Settings -->
                        <div class="tj-provider-section" id="tjGroqSection">
                            <div class="tj-settings-group">
                                <label><i class="fas fa-key"></i> Groq API Key</label>
                                <input type="password" class="tj-settings-input" id="tjGroqKey"
                                    placeholder="gsk_xxxxxxxxxxxx">
                                <small class="tj-settings-hint">
                                    ${t('tanyajawab.groqKeyHint')} <a href="https://console.groq.com/keys" target="_blank" rel="noopener">console.groq.com</a>
                                </small>
                            </div>
                            <div class="tj-settings-group">
                                <label><i class="fas fa-brain"></i> ${t('tanyajawab.model')}</label>
                                <select class="tj-settings-select" id="tjGroqModel">
                                    ${MODEL_OPTIONS.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <!-- Local Settings -->
                        <div class="tj-provider-section" id="tjLocalSection" style="display:none">
                            <div class="tj-settings-group">
                                <label><i class="fas fa-link"></i> ${t('tanyajawab.serverUrl')}</label>
                                <input type="text" class="tj-settings-input" id="tjLocalUrl"
                                    placeholder="http://localhost:11434">
                            </div>
                            <div class="tj-settings-group">
                                <label><i class="fas fa-brain"></i> ${t('tanyajawab.modelName')}</label>
                                <input type="text" class="tj-settings-input" id="tjLocalModel"
                                    placeholder="qwen2.5:7b-instruct">
                            </div>
                        </div>

                        <!-- Test & Save -->
                        <div class="tj-settings-actions">
                            <button class="tj-settings-btn tj-btn-test" id="tjTestConnection">
                                <i class="fas fa-plug"></i> ${t('tanyajawab.testConnection')}
                            </button>
                            <button class="tj-settings-btn tj-btn-save" id="tjSaveSettings">
                                <i class="fas fa-save"></i> ${t('tanyajawab.save')}
                            </button>
                        </div>
                        <div class="tj-settings-test-result" id="tjTestResult"></div>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="tj-modal-overlay" id="tjDeleteModal">
                <div class="tj-modal">
                    <h4><i class="fas fa-exclamation-triangle"></i> ${t('tanyajawab.deleteModalTitle')}</h4>
                    <p id="tjDeleteMsg">${t('tanyajawab.deleteModalDesc')}</p>
                    <div class="tj-modal-actions">
                        <button class="tj-modal-btn tj-btn-cancel" id="tjDeleteCancel">${t('tanyajawab.cancel')}</button>
                        <button class="tj-modal-btn tj-btn-danger" id="tjDeleteConfirm">${t('tanyajawab.delete')}</button>
                    </div>
                </div>
            </div>

            <!-- Toast -->
            <div class="tj-toast" id="tjToast"></div>
        </div>`;
        this.setupEvents();
        this.renderAll();
    }

    // ── Render: Messages ─────────────────────────────────────────────

    renderAll() {
        this.renderSessions();
        this.renderMessages();
        this.updateHeader();
        this.updateStatus();
    }

    renderSessions() {
        const list = document.getElementById('tjSessionList');
        if (!list) return;

        if (this.sessions.length === 0) {
            list.innerHTML = `<div class="tj-empty-state"><i class="fas fa-comments"></i><p>${t('tanyajawab.noChats')}</p></div>`;
            return;
        }

        list.innerHTML = this.sessions.map(s => {
            const isActive = s.id === this.currentSessionId;
            const msgCount = s.messages.filter(m => m.role === 'user').length;
            const dateStr = this.formatDate(s.updatedAt || s.createdAt);
            return `
            <div class="tj-session-item${isActive ? ' active' : ''}" data-id="${s.id}">
                <div class="tj-session-info">
                    <div class="tj-session-title">${this.esc(s.title)}</div>
                    <div class="tj-session-meta">
                        <span>${dateStr}</span>
                        <span>·</span>
                        <span>${t('tanyajawab.questionCount', { n: msgCount })}</span>
                    </div>
                </div>
                <button class="tj-session-delete" data-delete="${s.id}" title="${t('tanyajawab.delete')}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>`;
        }).join('');
    }

    renderMessages() {
        const el = document.getElementById('tjMessages');
        if (!el) return;

        const sess = this.currentSession();
        if (!sess || sess.messages.length === 0) {
            el.innerHTML = this.renderWelcome();
            return;
        }

        let html = '';
        let refCounter = 0;

        for (const msg of sess.messages) {
            if (msg.role === 'user') {
                html += `
                <div class="tj-msg user" style="animation: tjFadeIn 0.3s ease">
                    <div class="tj-msg-body">
                        <div class="tj-msg-bubble">${this.esc(msg.content)}</div>
                        <div class="tj-msg-time">${this.formatTime(msg.time)}</div>
                    </div>
                    <div class="tj-msg-avatar"><i class="fas fa-user"></i></div>
                </div>`;
            } else {
                const refs = msg.references || [];
                const refId = `tjRef${refCounter++}`;
                const refsHtml = refs.length > 0 ? `
                    <div class="tj-refs">
                        <button class="tj-refs-toggle" data-ref="${refId}">
                            <i class="fas fa-book-open"></i>
                            <span>${t('tanyajawab.refsCount', { n: refs.length })}</span>
                            <i class="fas fa-chevron-down tj-refs-chevron"></i>
                        </button>
                        <div class="tj-refs-panel" id="${refId}">
                            ${refs.map(r => `
                            <div class="tj-ref-item">
                                <div class="tj-ref-source">${this.esc(r.source || t('tanyajawab.sourceDefault'))}</div>
                                <div class="tj-ref-title">${this.esc(r.question || r.title || '')}</div>
                                <div class="tj-ref-text">${this.esc((r.summary || r.text || '').slice(0, 200))}${(r.summary || r.text || '').length > 200 ? '...' : ''}</div>
                            </div>`).join('')}
                        </div>
                    </div>` : '';

                html += `
                <div class="tj-msg assistant" style="animation: tjFadeIn 0.3s ease">
                    <div class="tj-msg-avatar"><img src="assets/icons/icon-72x72.png" alt="AI" onerror="this.outerHTML='<i class=\\'fas fa-robot\\'></i>'"></div>
                    <div class="tj-msg-body">
                        <div class="tj-msg-bubble">${this.formatMarkdown(msg.content)}</div>
                        ${refsHtml}
                        <div class="tj-msg-actions">
                            <button class="tj-copy-btn" data-copy="${this.esc(msg.content.replace(/"/g, '&quot;'))}" title="${t('tanyajawab.copy')}">
                                <i class="fas fa-copy"></i>
                            </button>
                            <span class="tj-msg-time">${this.formatTime(msg.time)}</span>
                        </div>
                    </div>
                </div>`;
            }
        }

        el.innerHTML = html;
        el.scrollTop = el.scrollHeight;
    }

    renderWelcome() {
        return `
        <div class="tj-welcome">
            <div class="tj-welcome-icon">
                <i class="fas fa-comments"></i>
            </div>
            <h2 class="tj-welcome-title">${t('tanyajawab.welcomeTitle')}</h2>
            <p class="tj-welcome-desc">
                ${t('tanyajawab.welcomeDesc')}
            </p>
            <div class="tj-manhaj-badge">
                <i class="fas fa-shield-halved"></i>
                <span><strong>${t('tanyajawab.manhajSalaf')}</strong> — ${t('tanyajawab.manhajScholars')}</span>
            </div>
            <div class="tj-example-chips">
                ${EXAMPLE_QUESTIONS.map(q => `
                <button class="tj-example-chip" data-question="${this.esc(q.text)}">
                    <i class="fas ${q.icon}"></i>
                    <span>${this.esc(q.text)}</span>
                </button>`).join('')}
            </div>
            ${!this.config.groqApiKey && this.config.provider === 'groq' ? `
            <div class="tj-setup-notice">
                <i class="fas fa-key"></i>
                <p>${t('tanyajawab.setupNotice')} <button class="tj-link-btn" id="tjOpenSettingsLink">${t('tanyajawab.settingsLink')}</button></p>
            </div>` : ''}
        </div>`;
    }

    updateHeader() {
        const titleEl = document.getElementById('tjHeaderTitle');
        if (!titleEl) return;
        const sess = this.currentSession();
        titleEl.textContent = sess && sess.messages.length > 0 ? sess.title : t('tanyajawab.title');
    }

    // ── Send Message & AI Response ───────────────────────────────────

    async sendMessage() {
        if (this.isLoading) return;

        const input = document.getElementById('tjInput');
        const question = input.value.trim();
        if (!question) return;

        // Validate config
        if (this.config.provider === 'groq' && !this.config.groqApiKey) {
            this.showToast(t('tanyajawab.errEnterGroqKey'));
            this.openSettings();
            return;
        }

        // Ensure we have a session
        if (!this.currentSessionId) this.createSession(false);
        const sess = this.currentSession();

        // Add user message
        const userMsg = { role: 'user', content: question, time: new Date().toISOString() };
        sess.messages.push(userMsg);

        // Update session title from first question
        if (sess.messages.filter(m => m.role === 'user').length === 1) {
            sess.title = question.length > 40 ? question.slice(0, 40) + '…' : question;
        }
        sess.updatedAt = new Date().toISOString();

        this.saveSessions();
        input.value = '';
        this.autoResize(input);
        this.renderMessages();
        this.renderSessions();
        this.updateSendButton();

        // Show loading state
        this.isLoading = true;
        document.getElementById('tjSendBtn').disabled = true;

        // Insert streaming bubble
        const messagesEl = document.getElementById('tjMessages');
        const liveDiv = document.createElement('div');
        liveDiv.className = 'tj-msg assistant';
        liveDiv.id = 'tj-live-msg';
        liveDiv.innerHTML = `
            <div class="tj-msg-avatar"><img src="assets/icons/icon-72x72.png" alt="AI" onerror="this.outerHTML='<i class=\\'fas fa-robot\\'></i>'"></div>
            <div class="tj-msg-body">
                <div class="tj-msg-bubble" id="tj-live-bubble">
                    <div class="tj-typing">
                        <div class="tj-typing-dot"></div>
                        <div class="tj-typing-dot"></div>
                        <div class="tj-typing-dot"></div>
                    </div>
                </div>
            </div>`;
        messagesEl.appendChild(liveDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        // Search knowledge base for references
        const references = searchKnowledgeBase(question, 5);

        let fullText = '';
        let started = false;

        try {
            if (this.config.provider === 'groq') {
                fullText = await this._streamGroq(question, references, sess, (chunk) => {
                    if (!started) {
                        const bubble = document.getElementById('tj-live-bubble');
                        if (bubble) bubble.innerHTML = '';
                        started = true;
                    }
                    fullText += chunk;
                    const bubble = document.getElementById('tj-live-bubble');
                    if (bubble) bubble.innerHTML = this.formatMarkdown(fullText);
                    messagesEl.scrollTop = messagesEl.scrollHeight;
                });
            } else {
                fullText = await this._streamLocal(question, references, sess, (chunk) => {
                    if (!started) {
                        const bubble = document.getElementById('tj-live-bubble');
                        if (bubble) bubble.innerHTML = '';
                        started = true;
                    }
                    fullText += chunk;
                    const bubble = document.getElementById('tj-live-bubble');
                    if (bubble) bubble.innerHTML = this.formatMarkdown(fullText);
                    messagesEl.scrollTop = messagesEl.scrollHeight;
                });
            }
        } catch (e) {
            console.error('[TanyaJawab] Error:', e);
            if (!fullText) {
                fullText = `⚠️ ${e.message || t('tanyajawab.errConnectAI')}`;
            }
        } finally {
            // Remove live bubble and add final message
            document.getElementById('tj-live-msg')?.remove();
            sess.messages.push({
                role: 'assistant',
                content: fullText || t('tanyajawab.errNoResponse'),
                references: references,
                time: new Date().toISOString()
            });
            sess.updatedAt = new Date().toISOString();
            this.saveSessions();
            this.isLoading = false;
            document.getElementById('tjSendBtn').disabled = false;
            this.renderMessages();
            this.renderSessions();
        }
    }

    // ── Groq API Streaming ───────────────────────────────────────────

    async _streamGroq(question, references, session, onChunk) {
        const messages = this._buildMessages(question, references, session);

        this.abortController = new AbortController();

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.groqApiKey}`
            },
            body: JSON.stringify({
                model: this.config.groqModel,
                messages: messages,
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens,
                stream: true
            }),
            signal: this.abortController.signal
        });

        if (!response.ok) {
            const errText = await response.text();
            if (response.status === 401) {
                throw new Error(t('tanyajawab.errInvalidKey'));
            } else if (response.status === 429) {
                throw new Error(t('tanyajawab.errRateLimit'));
            } else if (response.status === 413) {
                throw new Error(t('tanyajawab.errTooLong'));
            }
            throw new Error(`Error ${response.status}: ${errText.slice(0, 200)}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let result = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                        result += content;
                        onChunk(content);
                    }
                } catch {}
            }
        }

        this.abortController = null;
        return result;
    }

    // ── Local LLM (Ollama) Streaming ─────────────────────────────────

    async _streamLocal(question, references, session, onChunk) {
        const messages = this._buildMessages(question, references, session);
        const url = this.config.localUrl.replace(/\/$/, '');

        this.abortController = new AbortController();

        // Try Ollama /api/chat first
        let response;
        try {
            response = await fetch(`${url}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.config.localModel,
                    messages: messages,
                    stream: true,
                    options: {
                        temperature: this.config.temperature,
                        num_predict: this.config.maxTokens
                    }
                }),
                signal: this.abortController.signal
            });
        } catch (e) {
            // Try OpenAI-compatible endpoint
            response = await fetch(`${url}/v1/chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.config.localModel,
                    messages: messages,
                    temperature: this.config.temperature,
                    max_tokens: this.config.maxTokens,
                    stream: true
                }),
                signal: this.abortController.signal
            });
        }

        if (!response.ok) {
            throw new Error(t('tanyajawab.errLocalServer', { status: response.status }));
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let result = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                try {
                    const parsed = JSON.parse(trimmed);

                    // Ollama /api/chat format
                    if (parsed.message?.content) {
                        result += parsed.message.content;
                        onChunk(parsed.message.content);
                    }
                    // OpenAI format
                    else if (trimmed.startsWith('data: ')) {
                        const data = trimmed.slice(6);
                        if (data === '[DONE]') continue;
                        const obj = JSON.parse(data);
                        const content = obj.choices?.[0]?.delta?.content;
                        if (content) {
                            result += content;
                            onChunk(content);
                        }
                    }
                } catch {}
            }
        }

        this.abortController = null;
        return result;
    }

    // ── Build Messages for LLM ───────────────────────────────────────

    _buildMessages(question, references, session) {
        const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

        // Add context from knowledge base references
        if (references.length > 0) {
            const refContext = references.slice(0, 4).map(r =>
                `[${r.source}]\n${r.summary}`
            ).join('\n\n---\n\n');

            messages.push({
                role: 'system',
                content: `Berikut adalah referensi yang relevan dengan pertanyaan user. Gunakan informasi ini untuk menjawab:\n\n${refContext}`
            });
        }

        // Add conversation history (last N messages, truncated)
        const history = session.messages.slice(-this.config.maxHistory);
        for (const msg of history) {
            const content = msg.content.length > this.config.maxHistoryChars
                ? msg.content.slice(0, this.config.maxHistoryChars) + '...'
                : msg.content;
            messages.push({ role: msg.role, content });
        }

        // Add current question (if not already last in history)
        const lastMsg = messages[messages.length - 1];
        if (!lastMsg || lastMsg.content !== question) {
            messages.push({ role: 'user', content: question });
        }

        return messages;
    }

    // ── Event Setup ──────────────────────────────────────────────────

    setupEvents() {
        const container = this.container;

        // Send message
        document.getElementById('tjSendBtn')?.addEventListener('click', () => this.sendMessage());

        // Input handling
        const input = document.getElementById('tjInput');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            input.addEventListener('input', () => {
                this.autoResize(input);
                this.updateSendButton();
            });
        }

        // Sidebar toggle
        document.getElementById('tjToggleSidebar')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('tjSidebarOverlay')?.addEventListener('click', () => this.closeSidebar());

        // New chat
        document.getElementById('tjNewChat')?.addEventListener('click', () => {
            this.createSession(true);
            this.closeSidebar();
        });
        document.getElementById('tjNewChatSidebar')?.addEventListener('click', () => {
            this.createSession(true);
            this.closeSidebar();
        });

        // Settings
        document.getElementById('tjSettingsBtn')?.addEventListener('click', () => this.openSettings());
        document.getElementById('tjSettingsClose')?.addEventListener('click', () => this.closeSettings());
        document.getElementById('tjSettingsOverlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'tjSettingsOverlay') this.closeSettings();
        });
        document.getElementById('tjSaveSettings')?.addEventListener('click', () => this.saveSettingsFromForm());
        document.getElementById('tjTestConnection')?.addEventListener('click', () => this.testConnection());
        document.getElementById('tjProvider')?.addEventListener('change', (e) => this.toggleProviderSections(e.target.value));

        // Delete chat
        document.getElementById('tjDeleteChat')?.addEventListener('click', () => this.showDeleteModal());
        document.getElementById('tjDeleteCancel')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('tjDeleteConfirm')?.addEventListener('click', () => {
            if (this.currentSessionId) {
                this.deleteSession(this.currentSessionId);
            }
            this.closeDeleteModal();
        });
        document.getElementById('tjDeleteModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'tjDeleteModal') this.closeDeleteModal();
        });

        // Session list (delegated)
        document.getElementById('tjSessionList')?.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('[data-delete]');
            if (deleteBtn) {
                e.stopPropagation();
                this.pendingDeleteId = deleteBtn.dataset.delete;
                this.showDeleteModal(deleteBtn.dataset.delete);
                return;
            }
            const item = e.target.closest('.tj-session-item');
            if (item) this.switchSession(item.dataset.id);
        });

        // Messages area (delegated)
        document.getElementById('tjMessages')?.addEventListener('click', (e) => {
            // Example question chips
            const chip = e.target.closest('.tj-example-chip');
            if (chip) {
                const q = chip.dataset.question;
                if (q) {
                    const inp = document.getElementById('tjInput');
                    if (inp) { inp.value = q; this.autoResize(inp); this.updateSendButton(); inp.focus(); }
                }
                return;
            }

            // Reference toggle
            const refToggle = e.target.closest('.tj-refs-toggle');
            if (refToggle) {
                const refId = refToggle.dataset.ref;
                const panel = document.getElementById(refId);
                if (panel) {
                    panel.classList.toggle('open');
                    refToggle.classList.toggle('open');
                }
                return;
            }

            // Copy button
            const copyBtn = e.target.closest('.tj-copy-btn');
            if (copyBtn) {
                const text = copyBtn.dataset.copy;
                if (text) {
                    navigator.clipboard.writeText(text.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
                        .then(() => this.showToast(t('tanyajawab.copiedToast')))
                        .catch(() => this.showToast(t('tanyajawab.copyFailedToast')));
                }
                return;
            }

            // Open settings link
            const settingsLink = e.target.closest('#tjOpenSettingsLink');
            if (settingsLink) {
                this.openSettings();
                return;
            }
        });
    }

    // ── UI Helpers ────────────────────────────────────────────────────

    toggleSidebar() {
        document.getElementById('tjSidebar')?.classList.toggle('open');
        document.getElementById('tjSidebarOverlay')?.classList.toggle('show');
    }

    closeSidebar() {
        document.getElementById('tjSidebar')?.classList.remove('open');
        document.getElementById('tjSidebarOverlay')?.classList.remove('show');
    }

    openSettings() {
        const overlay = document.getElementById('tjSettingsOverlay');
        if (overlay) overlay.classList.add('show');

        // Populate form
        const provider = document.getElementById('tjProvider');
        const groqKey = document.getElementById('tjGroqKey');
        const groqModel = document.getElementById('tjGroqModel');
        const localUrl = document.getElementById('tjLocalUrl');
        const localModel = document.getElementById('tjLocalModel');

        if (provider) provider.value = this.config.provider;
        if (groqKey) groqKey.value = this.config.groqApiKey;
        if (groqModel) groqModel.value = this.config.groqModel;
        if (localUrl) localUrl.value = this.config.localUrl;
        if (localModel) localModel.value = this.config.localModel;

        this.toggleProviderSections(this.config.provider);
    }

    closeSettings() {
        document.getElementById('tjSettingsOverlay')?.classList.remove('show');
    }

    toggleProviderSections(provider) {
        const groqSection = document.getElementById('tjGroqSection');
        const localSection = document.getElementById('tjLocalSection');
        if (groqSection) groqSection.style.display = provider === 'groq' ? 'block' : 'none';
        if (localSection) localSection.style.display = provider === 'local' ? 'block' : 'none';
    }

    saveSettingsFromForm() {
        this.config.provider = document.getElementById('tjProvider')?.value || 'groq';
        this.config.groqApiKey = document.getElementById('tjGroqKey')?.value?.trim() || '';
        this.config.groqModel = document.getElementById('tjGroqModel')?.value || 'llama-3.3-70b-versatile';
        this.config.localUrl = document.getElementById('tjLocalUrl')?.value?.trim() || 'http://localhost:11434';
        this.config.localModel = document.getElementById('tjLocalModel')?.value?.trim() || 'qwen2.5:7b-instruct';

        this.saveConfig();
        this.closeSettings();
        this.showToast(t('tanyajawab.settingsSaved'));
        this.updateStatus();
        this.renderMessages(); // Re-render to remove setup notice if key was added
    }

    async testConnection() {
        const resultEl = document.getElementById('tjTestResult');
        if (!resultEl) return;
        resultEl.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('tanyajawab.testingConn')}`;
        resultEl.className = 'tj-settings-test-result testing';

        const provider = document.getElementById('tjProvider')?.value || 'groq';

        try {
            if (provider === 'groq') {
                const key = document.getElementById('tjGroqKey')?.value?.trim();
                if (!key) { resultEl.innerHTML = t('tanyajawab.emptyKey'); resultEl.className = 'tj-settings-test-result error'; return; }

                const res = await fetch('https://api.groq.com/openai/v1/models', {
                    headers: { 'Authorization': `Bearer ${key}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    const models = data.data?.map(m => m.id) || [];
                    resultEl.innerHTML = t('tanyajawab.connSuccessModels', { count: models.length });
                    resultEl.className = 'tj-settings-test-result success';
                } else {
                    resultEl.innerHTML = t('tanyajawab.connErrInvalidKey', { status: res.status });
                    resultEl.className = 'tj-settings-test-result error';
                }
            } else {
                const url = (document.getElementById('tjLocalUrl')?.value?.trim() || 'http://localhost:11434').replace(/\/$/, '');
                const res = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(5000) });

                if (res.ok) {
                    const data = await res.json();
                    const models = data.models?.map(m => m.name) || [];
                    resultEl.innerHTML = t('tanyajawab.connSuccessLocal', { models: models.join(', ') || t('tanyajawab.noModels') });
                    resultEl.className = 'tj-settings-test-result success';
                } else {
                    resultEl.innerHTML = t('tanyajawab.connErrServer', { status: res.status });
                    resultEl.className = 'tj-settings-test-result error';
                }
            }
        } catch (e) {
            resultEl.innerHTML = t('tanyajawab.connErrFailed', { error: e.message });
            resultEl.className = 'tj-settings-test-result error';
        }
    }

    updateStatus() {
        const dot = document.getElementById('tjStatusDot');
        const text = document.getElementById('tjStatusText');
        if (!dot || !text) return;

        if (this.config.provider === 'groq' && this.config.groqApiKey) {
            dot.className = 'tj-status-dot online';
            text.textContent = this.config.groqModel.split('-').slice(0, 2).join(' ');
        } else if (this.config.provider === 'local') {
            dot.className = 'tj-status-dot online';
            text.textContent = this.config.localModel;
        } else {
            dot.className = 'tj-status-dot';
            text.textContent = t('tanyajawab.notConfigured');
        }
    }

    updateSendButton() {
        const input = document.getElementById('tjInput');
        const btn = document.getElementById('tjSendBtn');
        if (input && btn) {
            btn.disabled = !input.value.trim() || this.isLoading;
        }
    }

    autoResize(el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 150) + 'px';
    }

    showDeleteModal(id) {
        this.pendingDeleteId = id || this.currentSessionId;
        const sess = this.sessions.find(s => s.id === this.pendingDeleteId);
        const msgEl = document.getElementById('tjDeleteMsg');
        if (msgEl) msgEl.textContent = t('tanyajawab.deleteConfirmMsg', { title: sess?.title || t('tanyajawab.deleteThisChat') });
        document.getElementById('tjDeleteModal')?.classList.add('show');
    }

    closeDeleteModal() {
        document.getElementById('tjDeleteModal')?.classList.remove('show');
        this.pendingDeleteId = null;
    }

    showToast(msg) {
        const el = document.getElementById('tjToast');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 2500);
    }

    // ── Formatting ───────────────────────────────────────────────────

    esc(s) {
        return String(s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    formatMarkdown(text) {
        return this.esc(text)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^---$/gm, '<hr />')
            .replace(/^&gt;\s?(.+)$/gm, '<blockquote>$1</blockquote>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br />');
    }

    formatTime(iso) {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
    }

    formatDate(iso) {
        if (!iso) return '';
        try {
            const d = new Date(iso);
            const now = new Date();
            if (d.toDateString() === now.toDateString()) return t('tanyajawab.today');
            const diff = Math.floor((now - d) / 86400000);
            if (diff === 1) return t('tanyajawab.yesterday');
            if (diff < 7) return d.toLocaleDateString(locale(), { weekday: 'long' });
            return d.toLocaleDateString(locale(), { day: 'numeric', month: 'short' });
        } catch { return ''; }
    }
}
