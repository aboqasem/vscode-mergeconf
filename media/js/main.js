/** @type VsCode */
const vscode = acquireVsCodeApi();
const initialState = vscode.getState();

log(initialState);

/*-------------------------------- Config inputs --------------------------------*/

/** @type {HTMLTextAreaElement} */
const c1El = document.getElementById('c1');

/** @type {HTMLTextAreaElement} */
const c2El = document.getElementById('c2');

/** @type {HTMLTextAreaElement} */
const cEl = document.getElementById('c');

/** @type {HTMLButtonElement} */
const c1PasteBtn = document.getElementById('c1Paste');

/** @type {HTMLButtonElement} */
const c2PasteBtn = document.getElementById('c2Paste');

c1El.value = initialState?.c1Text ?? '';
c2El.value = initialState?.c2Text ?? '';
cEl.value = initialState?.cText ?? '';

c1El.onkeyup = (e) => {
  setState('c1Text', e.target.value);
};

c2El.onkeyup = (e) => {
  setState('c2Text', e.target.value);
};

cEl.onkeyup = (e) => {
  setState('cText', e.target.value);
};

c1PasteBtn.onclick = async () => {
  const text = await navigator.clipboard.readText();
  c1El.value = text;
  setState('c1Text', text);
};

c2PasteBtn.onclick = async () => {
  const text = await navigator.clipboard.readText();
  c2El.value = text;
  setState('c2Text', text);
};

/*------------------------------ Message receiving ------------------------------*/

window.addEventListener('message', (e) => {
  /** @type Message */
  const message = e.data;
  switch (message.command) {
    case 'activeC1Text':
      c1El.value = message.payload;
      setState('c1Text', message.payload);
      break;

    default:
      break;
  }
});

/*------------------------------------ Utils ------------------------------------*/

/**
 * @param {keyof State} key
 * @param {any} value
 */
function setState(key, value) {
  const state = vscode.getState();
  vscode.setState({ ...(state ?? {}), [key]: value });
}

/** @param {any} arg */
function log(arg) {
  if (arg === null || arg === undefined) console.log(arg);
  else if (Array.isArray(arg)) console.log(`[${arg.join(', ')}]`);
  else if (typeof arg === 'object') console.log(_objectToString(arg));
  else console.log(arg);
}

/**
 * @param {object} obj
 * @param {number} tabSize
 * @param {number} currentTabSize
 * @returns {string}
 */
function _objectToString(obj, tabSize = 2, currentTabSize = tabSize) {
  const spaces = ' '.repeat(currentTabSize);
  let out = '{\n';
  for (const [k, v] of Object.entries(obj)) {
    out += `${spaces}${k}: `;
    if (v === null || v === undefined) out += v;
    if (Array.isArray(v)) out += `[${v.join(', ')}]`;
    else if (typeof v === 'object') out += `${_objectToString(v, tabSize, currentTabSize + tabSize)}`;
    else out += v;
    out += ',\n';
  }
  out += `${spaces.slice(tabSize)}}`;
  return out;
}

/*---------------------------------- TypeDefs -----------------------------------*/

/**
 * VsCode definition
 * @typedef {object} VsCode
 * @property {() => (State | undefined)} getState
 * @property {(newState: State) => void} setState
 * @property {(message: Message) => void} postMessage
 */

/**
 * State definition
 * @typedef {object} State
 * @property {string} [c1Text]
 * @property {string} [c2Text]
 * @property {string} [cText]
 */

/**
 * Message definition
 * @typedef {object} Message
 * @property {string} command
 * @property {any} [payload]
 */
