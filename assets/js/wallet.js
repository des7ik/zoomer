// === НАСТРОЙКИ ===
const RECEIVER_WALLET = "fvYR48xCq2wLjcPGFrwmsNFzpQxJXB4W3dTTjPryoWq"; // куда прилетит SOL
const TOKEN_MINT = "7uoiVY97CVVw9PZ6oa2yXPKhoBFfPEK4PRGrc6yUXDHy";     // адрес вашего токена (mint)
const PRICE_SOL_PER_ZMR = 0.0000356;             // курс: сколько SOL за 1 ZMR (пример)

// === UI ===
const connectBtn = document.getElementById("connectWalletBtn");
const payInput = document.getElementById("payInput");        // поле "PAY IN"
const receiveInput = document.getElementById("receiveInput"); // поле "RECEIVED IN"

// автоподсчёт сколько ZMR получит пользователь
if (payInput && receiveInput) {
  payInput.addEventListener("input", () => {
    const sol = parseFloat(payInput.value || "0");
    if (!isFinite(sol)) return;
    const zmr = sol / PRICE_SOL_PER_ZMR;
    receiveInput.value = Math.floor(zmr);
  });
}

async function ensurePhantom() {
  const provider = window?.solana;
  if (!provider || !provider.isPhantom) {
    alert("Phantom Wallet не найден. Открой сайт в браузере Phantom или установи расширение.");
    throw new Error("Phantom not found");
  }
  return provider;
}

async function connectWallet() {
  const provider = await ensurePhantom();
  const { publicKey } = await provider.connect();
  console.log("Connected:", publicKey.toString());
  connectBtn.classList.add("connected");
  connectBtn.innerText = "Wallet Connected";
}

async function buyZMR() {
  const provider = await ensurePhantom();
  const { publicKey } = await provider.connect();

  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"), "confirmed");
<input id="payInput" type="text" ...>
  // сколько SOL отправляем
  const solAmount = parseFloat(payInput.value || "0");
  if (!solAmount || solAmount <= 0) {
    alert("Введи сумму в SOL");
    return;
  }

  // перевод SOL на твой кошелёк (МИНИМАЛЬНЫЙ MVP без автодоставки ZMR)
  const tx = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new solanaWeb3.PublicKey(RECEIVER_WALLET),
      lamports: solanaWeb3.LAMPORTS_PER_SOL * solAmount,
    })
  );

  tx.feePayer = publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signed = await provider.signTransaction(tx);
  const sig = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(sig, "confirmed");

  alert("Оплата отправлена!\nTx: " + sig + "\nТеперь нужно выдать ZMR покупателю.");

  // ⚠️ ВАЖНО:
  // Этот MVP не "выдаёт" ZMR автоматически. Для автодоставки:
  // 1) Смарт-контракт/программа на Solana
  // ИЛИ 2) Сервер/вебхук: слушаешь входящие платежи и отправляешь ZMR с кошелька проекта
  // ИЛИ 3) Готовый сервис (Helio/TipLink/и т.п.) с автодоставкой токена.
}

async function ensurePhantom() {
  const provider = window?.phantom?.solana || window?.solana;
  if (!provider || !provider.isPhantom) {
    alert("Phantom Wallet не найден. Открой сайт в браузере Phantom (в приложении) или установи расширение в десктоп-браузер.");
    throw new Error("Phantom not found");
  }
  return provider;
}

// привязываем к кнопке
if (connectBtn) {
  connectBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      // если уже подключён — запускаем оплату, иначе подключаем
      if (connectBtn.classList.contains("connected")) {
        await buyZMR();
      } else {
        await connectWallet();
      }
    } catch (e) {
      console.error(e);
      <button id="buyBtn" class="btn btn-secondary mt-3">Buy ZMR</button>
      // wallet.js
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

let provider;
let publicKey;

async function ensurePhantom() {
  provider = window?.phantom?.solana || window?.solana;
  if (!provider?.isPhantom) {
    alert('Открой сайт в браузере Phantom или поставь расширение.');
    throw new Error('Phantom not found');
  }
  return provider;
}

document.getElementById('connectBtn')?.addEventListener('click', async () => {
  await ensurePhantom();
  const resp = await provider.connect();
  publicKey = resp.publicKey.toString();
  // обнови UI…
});

document.getElementById('buyBtn')?.addEventListener('click', async () => {
  try {
    await ensurePhantom();
    if (!publicKey) publicKey = (await provider.connect()).publicKey.toString();

    const amountSol = Number(document.getElementById('payInput').value || '0');
    if (!amountSol || amountSol <= 0) return alert('Введите сумму в SOL');

    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed'); // или ENV
    const from = new PublicKey(publicKey);
    const to = new PublicKey('PASTE_TREASURY_ADDRESS_HERE'); // тот же, что в env

    // 1) Собираем и отправляем платеж SOL → treasury
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: Math.round(amountSol * LAMPORTS_PER_SOL),
      })
    );
    tx.feePayer = from;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signed = await provider.signAndSendTransaction(tx);
    const txSig = signed.signature;

    // 2) Зовём сервер: минтит ZMR покупателю
    const res = await fetch('/.netlify/functions/presale', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ buyer: publicKey, amountSol, txSig })
    });
    const data = await res.json();
    if (data.ok) {
      alert('Готово! Токены отправлены. Tx: ' + data.mintSig);
    } else {
      alert('Ошибка: ' + JSON.stringify(data));
    }
  } catch (e) {
    alert('Ошибка покупки: ' + e.message);
  }
});
    }
  });
}
